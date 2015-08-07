var bj_carousel_plugin = {
	expand_box : {
		varname : "varvalue",
		active : "",
		getstyle : function(el, prop)
		{
			var el = document.getElementById(el);
			if (el.currentStyle)
			{
				return el.currentStyle[prop];
			}
			else if (document.defaultView && document.defaultView.getComputedStyle) 
			{
				return document.defaultView.getComputedStyle(el, "")[prop];
			}
			else
			{
				return el.style[prop];
			}
		},

		generate_options : function(parameters)
		{
			var obj = this;
			var content = "";
			$.each(parameters.options, function(key){
				var selected = "";
				if(parameters.selected_value == "" && key == 0){ selected=" selected"; }
				if(parameters.selected_value == this.value){ selected=" selected";}
				if(!parameters.blank_option && key == 0){ return true; }
				content += "<div class='normal_row expand_drop_selector "+parameters.class_name+"_selector"+selected+"' id='"+parameters.class_name+"_"+this.value+"' data-type='"+parameters.class_name+"' data-value='"+this.value+"'>";
				if($("#"+parameters.class_name).data("multiple") && this.value != '')
				{
					var checked = "";
					if($.isArray(parameters.selected_value) && ($.inArray(this.value, parameters.selected_value) >= 0 || $.inArray(this.text, parameters.selected_value) >= 0))
					{
						checked = " checked='checked'";
					}
					content += "<input type='checkbox' id='"+parameters.class_name+"_"+this.value+"_check' name='"+parameters.class_name+"' data-value='"+this.text+"' value='"+this.value+"'" + checked + "/>";
				}
				content += "<span>"+this.text+"</span>";
				content += "</div>";
			});
			$("#"+parameters.class_name+"_content").html(content);
			var onready = (parameters.hasOwnProperty("onready") && parameters.onready == true)?true:false;
			if($.isArray(parameters.selected_value))
			{
				obj.selected_text({drop_down:$("#"+parameters.class_name+"_content"), value:parameters.selected_value[0], onready:onready});
			}
			else
			{
				obj.selected_text({drop_down:$("#"+parameters.class_name+"_content"), value:parameters.selected_value, onready:onready});
			}
		},
		select_option : function(parameters)
		{
			var obj = this, text = "",
			value = new Array(),
			element = parameters.drop_down.find("[data-value='"+parameters.value+"']");
			$("."+element.data("type")+"_selector").removeClass("selected");
			if($("#"+element.data("type")).data("multiple"))
			{
				if(!element.find("input[type='checkbox']").prop("checked"))
				{
					element.find("input[type='checkbox']").prop("checked", true);
				}
				else
				{
					element.find("input[type='checkbox']").prop("checked", false);
				}
			}
			obj.selected_text(parameters);
		},
		selected_text : function(parameters)
		{
			var obj = this, text = "",
			value = new Array();
			element = parameters.drop_down.find("[data-value='"+parameters.value+"']");
			if($("#"+element.data("type")).data("multiple"))
			{
				count = 0;
				$("."+element.data("type")+"_selector").find("input:checked").each(function(){
					text+=text?", "+$(this).data("value"):$(this).data("value");
					value.push($(this).val());
					count++;
				});
				var name = ($("#"+$("#"+element.data("type")).data("select")).data("name") != undefined)?$("#"+$("#"+element.data("type")).data("select")).data("name"):$("#"+$("#"+element.data("type")).data("select")).attr("name");
				$("#"+element.data("type")).attr("title", text);
				text = text?
							(count > 1)?
								count+" "+name+" selected"
							:text
						:$("#"+$("#"+element.data("type")).data("select")).data("heading");
				$("#"+$("#"+element.data("type")).data("select")).val(value);
				if(!parameters.onready){ $("#"+$("#"+element.data("type")).data("select")).trigger("change"); }
			}
			else
			{
				text = element.find("span").html();
				$("#"+$("#"+element.data("type")).data("select")).val(element.data("value"));
				if(!parameters.onready){ $("#"+$("#"+element.data("type")).data("select")).trigger("change"); }
				element.addClass("selected");
			}
			if($("#"+element.data("type")).attr("type") == "text")
			{
				$("#"+element.data("type")).data("value", element.data("value")).data("over", element.data("value")).val(text);
			}
			else
			{
				$("#"+element.data("type")).data("value", element.data("value")).data("over", element.data("value")).html(text);
			}
		},
		expand : function(parameters)
		{
			var obj = this;
			var speed = 100;
			$(parameters.element).each(function(){
			$(".expand_box_content").not($(this).parents(".expand_box_content")).not("#"+$(this).attr("id")+"_content").not(".content_box").slideUp(speed);
			$(".expand_box_headings").not(":parent.expand_box_content").not("#"+$(this).attr("id")).not(".content_heading").removeClass("active");
			if(!$(this).hasClass("disabled") && (obj.getstyle($(this).attr("id")+"_content", "display") == "none" || (parameters.hasOwnProperty("show") && parameters.show)))
			{
				$(this).addClass("active");
				var box = $(this);
				$("#"+box.attr("id")+"_content").slideDown(speed, function(){
					var bottom = $(window).height() - ($("#"+box.attr("id")+"_content").outerHeight() + $("#"+box.attr("id")+"_content").offset().top - $(window).scrollTop());
					if(bottom <= 20)
					{
						if(!box.data("parent"))
						{
							var top = box.offset().top - $("#topbar").outerHeight();
							$('html, body').animate({scrollTop:top - 20}, 300);
						}
						else
						{
							var top = box.offset().top - $("#"+box.data("parent")).offset().top + $("#"+box.data("parent")).scrollTop();
							$("#"+box.data("parent")).animate({scrollTop:top - 20}, 300);
						}
					}
				});
				if($(this).hasClass("drop_down"))
				{
					var option_count = $("#"+$(this).attr("id")+"_content").find(".expand_drop_selector").length,
					option_height = $("#"+$(this).attr("id")+"_content").find(".expand_drop_selector").outerHeight(),
					drop_height = (option_count <= 8)?(option_height*option_count):(option_height*8);
					drop_height += 12;
					$("#"+$(this).attr("id")+"_content").css({height:drop_height, maxHeight:drop_height});
					obj.active = $(this).attr("id");
				}
			}
			else
			{
				obj.close($(this));
			}
			});
		},
		close : function(element)
		{
			var obj = this;
			$(element).each(function(){
			if(obj.getstyle($(this).attr("id")+"_content", "display") == "block")
			{
				$("#"+$(this).attr("id")+"_content").slideUp(100);
				$(this).removeClass("active");
				if($(this).hasClass("drop_down"))
				{
					$("."+$(this).attr("id")+"_selector").removeClass("selected");
					$("#"+$(this).attr("id")+"_"+$(this).data("value")).addClass("selected");
					$("#"+$(this).data("select")).trigger("focusout");
					if($("#"+$(this).data("select")).hasClass("alert_field"))
					{
						$(this).addClass("alert_field");
					}
					else
					{
						$(this).removeClass("alert_field");
					}
					obj.active = "";
				}
			}
			});
		},
		create : function(category)
		{
			var obj = this;
			var multiple = $("#"+category).attr("multiple")?" data-multiple='"+$("#"+category).attr("multiple")+"'":"";
			if(!$("#expand_drop_"+category).length)
			{
				var value = $("#"+category).val(), attrs = "",
				display_value = $("#"+category).data("heading")?$("#"+category).data("heading"):$("#"+category+" > option:first-child").html();
				attrs += $("#"+category).data("parent")?" data-parent='"+$("#"+category).data("parent")+"' ":attrs;
				content = "<a href='javascript:void(0)'>";
				if($("#"+category).data("text"))
				{
					var blank_option = false;
					content += "<input type='text' name='"+category+"_text' class='expand_box_headings drop_down custom_drop_down' "+multiple+" placeholder='"+display_value+"' data-select='"+category+"' id='expand_drop_"+category+"' data-over='"+value+"' data-value='"+value+"' autocomplete='off'" + attrs + "/>";
					content += "<img src='http://gharsearch.com/ajax-loader-small.gif' class='custom_drop_down_loading' />";
				}
				else
				{
					var blank_option = true;
					content += "<div class='expand_box_headings drop_down' data-select='"+category+"' id='expand_drop_"+category+"' "+multiple+" data-over='"+value+"' data-value='"+value+"'" + attrs + ">"+display_value+"</div>";
					if(multiple)
					{
						content += "<input type='hidden' name='"+category+"_text' id='expand_drop_"+category+"_text' />";
					}
				}
				content += "<div class='drop_down_row'><div class='hidden scrollbox basic_drop_down expand_box_content expand_drop_content normal_row' data-type='expand_drop_"+category+"' id='expand_drop_"+category+"_content'>";
				content +="</div></div></a>";
				$("#"+category).parent().prepend(content);
				obj.generate_options({class_name:"expand_drop_"+category, options:$("#"+category+" > option"), selected_value:value, blank_option:blank_option, onready:true});
				$("#"+category).hide();
			}
		},
		onready : function()
		{
			var obj = this;
			$("select").each(function(key){
				var category = $(this).attr("id");
				obj.create(category);
			});
			$(".expand_box_headings").unbind("click").click(function(){
				obj.expand({element:$(this)});
			});
			$(".expand_drop_selector").unbind("click").click(function(){
				obj.select_option({drop_down:$("#"+$(this).data("type")+"_content"), value:$(this).data("value")});
				if(!$("#"+$(this).data("type")).data("multiple"))
				{
					obj.expand({element:$("#"+$(this).data("type"))});
				}
			});
			$(".expand_drop_selector").mouseover(function(){
				$(".expand_drop_selector").removeClass("selected");
				$(this).addClass("selected");
				if($("#"+$(this).data("type")).data("multiple"))
				{
					$("#"+$(this).data("type")).data("over", $(this).data("value"));
				}
				else
				{
					$("#"+$(this).data("type")).data("over", $(this).data("value"));
				}
			});
			$(".custom_drop_down").unbind("keyup").keyup(function(evt){
			var category = $(this).data("select"),
			value = $(this).val();
			evt = (evt) ? evt : document.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if(charCode != 13)
			{
				if (stoppedTyping){ clearTimeout(stoppedTyping); }
				/* set a new timer to execute 1 second from last keypress */
				if (value.length > 1 && (charCode > 40 ||charCode < 37))
				{
					$(this).parent().find(".custom_drop_down_loading").show();
					stoppedTyping = setTimeout(function(){
						actions = {city:"get_matching_cities"};
						plugins.new_request.ajax_request({
							url:'<?php echo dir; ?>ajax.php',
							parameters:{request:"ajax", action:actions[category], match_city:value, fetch_name:category},
							beforeSend:"",
							error:"",
							success:""
						}, function(response,status,xhr){
							populate_options({option_list:response.data[category],  blank_option:false, drop_down:category});
							obj.expand({element:$("#expand_drop_"+category), show:true});
							$("#expand_drop_"+category).parent().find(".custom_drop_down_loading").hide();
						});
					}, 500);
				}
			}
			});
			$("form").submit(function(){
					if($("#"+$(this).data("select")).hasClass("alert_field"))
					{
						$(this).addClass("alert_field");
					}
					else
					{
						$(this).removeClass("alert_field");
					}
			});
		},
		onkeydown : function(evt)
		{
			var obj = this;
			evt = (evt) ? evt : document.event;
			var charcode = (evt.which) ? evt.which : evt.keyCode;
			if(obj.active)
			{
				if(charcode == 40)
				{
					var next = $("#"+obj.active+"_"+$("#"+obj.active).data("over")).next();
					if(next.length)
					{
						obj.select_option({drop_down:$("#"+next.data("type")+"_content"), value:next.data("value")});
						if(next.position().top >= $("#"+obj.active+"_content").outerHeight() - 22)
						{
							$("#"+obj.active+"_content").scrollTop($("#"+obj.active+"_content").scrollTop() + next.outerHeight());
						}
					}
					evt.preventDefault();
				}
				if(charcode == 38)
				{
					var previous = $("#"+obj.active+"_"+$("#"+obj.active).data("over")).prev();
					if(previous.length)
					{
						obj.select_option({drop_down:$("#"+previous.data("type")+"_content"), value:previous.data("value")});
						if(previous.position().top < 0)
						{
							$("#"+obj.active+"_content").scrollTop($("#"+obj.active+"_content").scrollTop() - previous.outerHeight());
						}
					}
					evt.preventDefault();
				}
				if(charcode == 13 || charcode == 9)
				{
					var current = $("#"+obj.active+"_"+$("#"+obj.active).data("over"));
					obj.select_option({drop_down:$("#"+current.data("type")+"_content"), value:current.data("value")});
					obj.expand({element:$("#"+obj.active)});
					if(charcode == 13)
					{
						evt.preventDefault();
					}
				}
			}
		},
		onclick : function(e)
		{
			var obj = this;
			if($(".expand_box_headings").length && !$(".expand_box_headings").is(e.target) && $(".expand_box_headings").has(e.target).length === 0 &&  !$(".expand_box_content").is(e.target) && $(".expand_box_content").has(e.target).length === 0)
			{
				obj.close($(".expand_box_headings").not(".content_heading"));
			}
		}
	}
};

$(document).ready(function(){
	$.each(bj_carousel_plugin, function(key, func){
		if($.isFunction(func.onready))
		{
			func.onready();
		}
	});
	$(document).unbind("keydown").keydown(function(evt){
		$.each(bj_carousel_plugin, function(key, func){
			if($.isFunction(func.onkeydown))
			{
				func.onkeydown(evt);
			}
		});
	});
	$(document).click(function(e){
		$.each(bj_carousel_plugin, function(key, func){
			if($.isFunction(func.onclick))
			{
				func.onclick(e);
			}
		});
	});
});

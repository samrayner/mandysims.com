/*
Title:				Navigation Scroll Behaviour
Author:				Sam Rayner - http://samrayner.com
Created:			2011-06-07
*/

var Nav = {
	menu: null,
	sections: [],
	current: "#",
	docked: false,

	stealClass: function(theClass, elm) {
		$("."+theClass).removeClass(theClass);
		elm.addClass(theClass);
	},
	
	update: function(current) {
		var currentClass = "current";
	
		var anchor = Nav.menu.find('a[href='+current+']');
		Nav.stealClass(currentClass, anchor.parent());
		Nav.current = current;
	},

	dock: function() {
		var scroll = $(window).scrollTop();
		
		var startPos = $('#main').offset();
		startPos = startPos.top;
		
		var dockClass = "docked";
	
		if(!Nav.docked && scroll > startPos) {
			Nav.docked = true;
			Nav.menu.addClass(dockClass);
		}
		else if(Nav.docked && scroll < startPos) {
			Nav.docked = false;
			Nav.menu.removeClass(dockClass);
		}
	},
	
	watchScroll: function() {
		var scroll = $(window).scrollTop();
		var current = Nav.current;
		
		$.each(Nav.sections, function(i, section) {
			var offset = section.offset();
			offset = offset.top;
			
			var hash = section.selector;
			
			if(hash.indexOf("#") !== 0) {
				hash = "#";
			}
				
			//amount we have to scroll up into the above element
			var buffer = section.height()*0.75;

			if(scroll >= offset && scroll <= offset+buffer) {
				current = hash;
			}
		});
		
		if(Nav.current !== current) {
			Nav.update(current);
		}
	},

	init: function() {
		Nav.menu = $("nav.fixed");
		
		Nav.menu.find('a[href^=#]').each(function(i) {
			var target = $(this).attr('href');
			
			if(target.replace("#","") === "") {
				target = "body";
			}
			
			Nav.sections[i] = $(target);
		});
		
		$(window)
			.scroll(Nav.dock)
			.scroll(Nav.watchScroll);
			
		var firstSection = Nav.menu.find('a[href^=#]').first().attr("href");
		
		if(window.location.hash) {
			$.smoothScroll({
				speed: 0,
				scrollTarget: window.location.hash,
				afterScroll: function() {
					Nav.update(window.location.hash);
				}
			});
		}
		else {
			Nav.update(firstSection);
		}
		
		$('a[href^=#]').click(function(){
			$(window).unbind('scroll', Nav.watchScroll);
		});
		
		//if small viewport (e.g. iPhone), don't enable smooth scrolling
		if(Nav.menu.css("position") === "static") {
			return false;
		}
		
		$('a:not([href='+firstSection+'])').smoothScroll({
			afterScroll: function() {
				var current = $(this).attr('href');
				Nav.update(current);
				window.location.hash = current.replace("#","");
				$(window).scroll(Nav.watchScroll);
			}
		});
		
		/* scroll to very top for first section link */
		var offset = $(firstSection).offset();
		offset = offset.top;
		
		$('a[href='+firstSection+']').smoothScroll({
			afterScroll: function() {
				Nav.update(firstSection);
				window.location.hash = "";
				$(window).scroll(Nav.watchScroll);
			},
			offset: -offset
		});
	}
};

$(Nav.init);
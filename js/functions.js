;(function($, window, document, undefined) {
  var $win = $(window);
  var $doc = $(document);
  var winH = $win.height();
  
  $.fn.getIndex = function(){
  	  var $p=$(this).parent().children();
      return $p.index(this);
  }
  
  var createCookie = function (name,value,days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          var expires = "; expires=" + date.toUTCString();
      }
      else var expires = "";
      document.cookie = name + "=" + value + expires + "; path=/";
  }

  var readCookie = function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

  var eraseCookie = function (name) {
      createCookie(name,"",-1);
  }
  
  function check_visited_links() {
      var visited_links = JSON.parse(localStorage.getItem('visited_links')) || [];
      var links = document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
          var that = links[i];
          that.onclick = function() {
              var clicked_url = this.href;
              if (visited_links.indexOf(clicked_url) == -1) {
                  visited_links.push(clicked_url);
                  localStorage.setItem('visited_links', JSON.stringify(visited_links));
              }
          }
          if (visited_links.indexOf(that.href) !== -1) {
              that.className += ' visited';
          }
      }
  }
  

  $doc.ready(function() {
    
    // mobile menu submenu toggle
    $("body").on("click", "#primary-menu .menu-item-has-children > a, #special-menu .menu-item-has-children > a", function (e) {
      var pWidth = $(e.target).innerWidth(); //use .outerWidth() if you want borders
      var pOffset = $(e.target).offset(); 
      var x = e.pageX - pOffset.left;
      if (pWidth*.85 < x && $("body").hasClass("mobile-or-library")) {
        e.preventDefault();
        e.stopPropagation();
        $($(e.target).parent()).toggleClass("open");
      }
    });
    
    
    // load video if window is big enough
    if ($('.video-bg video').length && $(window).width() >= 768 && !(/Mobi/.test(navigator.userAgent))) {
      $('.video-bg video').get(0).play();
    }
    
    // ensure ada compliance border outline only appears on keyboard focus not mouse focus
    $("body").on("mousedown", "*", function(e) {
        if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
            $(this).css("outline", "none").on("blur", function() {
                $(this).off("blur").css("outline", "");
            });
        }
    });
    
    //check_visited_links();
    
    
    var is_iPad = (navigator != null && navigator.userAgent != null && navigator.userAgent.match(/iPad|iPhone|iPod/i) != null);
    
    $("#menu-item-9764").replaceWith('<li id="menu-item-9764" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-9764"><a id="interested-in-applying" href="https://www.elms.edu/interested-in-applying/" style="">Apply</a><a id="link-give" href="https://www.elms.edu/alumni/support-elms/make-a-gift/" style="">Give</a></li>');
    
    // show more sidebar events 
    $("body").on("click", ".field-related-events .show-more, .field-related-events .show-less", function(e) {
      $(".field-related-events").toggleClass("toggled");
      e.preventDefault();
    });
    
    $(window).resize(function(){
      $('img.js-focal-point-image').responsify();
    })

/*    
    var verticallyCenterStoryContent = function () {
      if (Modernizr.mq("only screen and (min-width: 64em)")) {
        $(".stories .story-feature .story-full .text-content").each ( function () {
          $(this).css("bottom", (($($(this).parent()).height() - $(this).height())*.325)+"px" );
        });
        $(".stories .field-excerpt, .stories .field-permalink").show();
      }
      else {
        $(".stories .story-feature .story-full .text-content").css("bottom", "" );
        $(".stories.manual .story-feature .story-full").show();
      }
    }
    verticallyCenterStoryContent();
    $(window).resize(verticallyCenterStoryContent);
    $(".story-tab").click( function () {
      setTimeout(verticallyCenterStoryContent, 10);
    });
*/
    
      
    // library menu item copying into main nav
    var libraryItems = [];
    var specialtyAreas = ["library", "nursing"];
    for (var i in specialtyAreas) {
      $("#" + specialtyAreas[i] + "-menu > li").each( function (index, element) {
        console.log($(this));
        var clone = $(this).clone();
        clone = $(clone); 
        clone.addClass(specialtyAreas[i] + "-mobile-menu-item");
        clone.removeAttr("id");
        $(clone.find("li")).removeAttr("id");
        libraryItems.push(clone);
      });
    }
    var count;
    for(count = libraryItems.length; count >= 0; count--){
      $("#special-menu").prepend(libraryItems[count]);
    }
    
    // handle keyboard focus in main menu
    $("#primary-menu > .menu-item > a, #library-menu  > .menu-item > a, #nursing-menu  > .menu-item > a").focus(function (e) {
      console.log(whatInput.ask());
      if (whatInput.ask() === 'keyboard') {
        $("#primary-menu > .menu-item, #library-menu > .menu-item, #nursing-menu > .menu-item").removeClass("open");
        $(this).parent().addClass("open");
      }
    });
    $("#primary-menu > .menu-item > a, #library-menu > .menu-item > a, #nursing-menu > .menu-item > a").blur(function (e) {
      if (whatInput.ask() === 'keyboard') {
        var children = $(this).parent().find(".sub-menu a");
        if (children.length) {
          $(children.get(0)).focus();
        }
        else {
          $(this).parent().removeClass("open");
        }
      }
    });
    
    // hamburger trigger
    $('.nav-trigger').on('click touchstart', function (event) {
        event.preventDefault();
        
        $(this).toggleClass('active');  
        $('header#masthead, html').toggleClass('active');  

        if( $win.width() < 720 ) {
          $('body, .link-donate').toggleClass('active');
        }
    });
    var resetMenuIfDesktopWidth = function () {
      if (Modernizr.mq("only screen and (min-width: 64em)") && !$("body").hasClass("page-template-library-landing-page") && !$("body").hasClass("page-template-library-interior-page")) {
        $("body, header#masthead, html, .nav-trigger, .link-donate").removeClass("active");
        $(".main-navigation li").removeClass("open");
      }
    }
    //resetMenuIfDesktopWidth();
    $(window).resize( function (e) {
      resetMenuIfDesktopWidth();
    });
    
    $(".home-page-setter").on("click touchstart", function () {
      var homepageCookie = readCookie("homepage");
      console.log(homepageCookie);
      if (homepageCookie != "current-students") {
        createCookie('homepage','current-students',9999);
      }
      else {
        eraseCookie('homepage');
      }
      window.location.href = "/";
    });
    
    // split menu words for styling
    $("#primary-menu > li > a").each( function (index, element) {
      $(element).addClass("words-"+$(element).text().split(" ").length)
    });
    
    
    // inter ior landing page and interior generic mobile dropdowns.
		if( $('ul.opening-menu').length ) {
			$('<select class="opening-select"></select>').insertAfter( $('ul.opening-menu') );

			$('ul.opening-menu li').each(function(index) {
				var value = $(this).find('a').text();

				$('<option value="' + ( index + 1 ) + '">' + value + '</option>').appendTo( $('select.opening-select') );
			});
		}
    var sidebarMenu = $('ul.parent-sidebar-menu');
    var finalSidebarMenu = false;
    var sidebarMenuAlreadyExists = !!(sidebarMenu.length);
    if( !sidebarMenuAlreadyExists && !!$(".field-sidebar-menu-items li").length) {
      finalSidebarMenu = $("<ul class='parent-sidebar-menu'></ul>");
      $(".page-sidebar").prepend(finalSidebarMenu);
    }
    else {
      finalSidebarMenu = sidebarMenu;
    }
    console.log("ifnalsidebarmenu");
    console.log(finalSidebarMenu);
		if( finalSidebarMenu && finalSidebarMenu.length ) {
      
      $(".field-sidebar-menu-items li").each ( function (index, element) {
        var link = $(this).find("a");
        console.log(link);
        if (link.length > 0 && (link.attr("href")) && $(finalSidebarMenu.find('li a[href="' + $(this).find("a").attr("href") + '"]')).length == 0) {
          finalSidebarMenu.append( $(this) );
        }
      });
      
			$('<select class="opening-select"></select>').insertBefore( $('.site-main') );

			$('ul.parent-sidebar-menu li').each(function(index) {
				var value = $($(this).find('a').get(0)).text();

				$('<option value="' + ( index + 1 ) + '">' + value + '</option>').appendTo( $('select.opening-select') );
			});
		}
    
		if( $('.opening-select').length ) {
			$('.opening-select').dropdown({ customClass: "opening-menu"});

			$('body').on('click mousedown', '.fs-dropdown-selected', function() {
        if (!is_iPad) {
          $(".fs-dropdown").toggleClass("fs-dropdown-open");
        }
        
			});
      
      var realMenuSelector = ".opening-menu li";
      if ($(".parent-sidebar-menu").length) {
        realMenuSelector = ".parent-sidebar-menu li";
      }
      $("body").on("blur change", "select.fs-dropdown-element", function(e) {
           var selectedOption = $(this).val();
           console.log($($(realMenuSelector).get(selectedOption - 1)));
           if (window.location.href != $($(realMenuSelector).get(selectedOption - 1)).find("a").attr("href")) {
             window.location.href = $($(realMenuSelector).get(selectedOption - 1)).find("a").attr("href");
           }
           else {
             e.preventDefault();
             e.stopPropagation();
           }
      });
      $("body").on("click", ".fs-dropdown-item", function() {
        if (!is_iPad) {
          var selectedOption = $(this).attr("data-value");
          window.location.href = $($(realMenuSelector).get(selectedOption - 1)).find("a").attr("href");
        }
        else {
          e.preventDefault();
        }
      });
      $("body").on("click touchstart mousedown", ".fs-dropdown-open *", function(e) {
        
        if (is_iPad) {
          e.preventDefault();
        }
           
      });
      
      
      $("body").on("click", "*:not(.fs-dropdown):not(button.fs-dropdown-item):not(.fs-dropdown-options), .fs-dropdown-open", function() {
        $(".fs-dropdown").removeClass("fs-dropdown-open");
      });
		}
    
    // mobile background fix
    if (/Mobi/.test(navigator.userAgent) && $(".bg-wrapper video").length > 0) {
        //$(".bg-wrapper").backstretch($(".bg-wrapper video").attr("poster"));
    }
    
    
    //interior landing page story expander.
    $(".page-template-landing-page .show-more a").on( "click touchstart", function (e) {
      e.preventDefault();
      $(this).parent().parent().find(".field-excerpt, .field-permalink").slideToggle();
      if (!$(this).hasClass("open")) {
        $(this).text("Show Less");
      }
      else {
        $(this).text("Show More");
      }
      $(this).toggleClass("open");
    });
    
    //replace search menu text with icon and add dropdown.
    $('#masthead a[href*="/search/"]').each(function() {
      $($(this).parent()).addClass("search-item");
      $(this).on("click touchstart", function (e) {
        if (Modernizr.mq("only screen and (min-width: 64em)")) {
          e.preventDefault();
          $($(this).parent()).toggleClass("open");
        }
        
      });
      $(this).html("<span class='search-realtext'>"+$(this).text()+"</span><span class='search-icon'></span>");
      $(this).after("<ul class='sub-menu for-search'><li id='menu-item-search' class='menu-item menu-item-type-post_type menu-item-object-page menu-item-search'></li></ul>");
      $("#menu-item-search").append($("#menu-search-dropdown"));
      $("#menu-search-dropdown").show();
      //$("#menu-search-dropdown .search-submit").val("ï€‚");
    });
    
    // double fake mobile/library menu 
    var updateMenu = function () {
      if (Modernizr.mq("only screen and (max-width: 64em)") || 
      $("body").hasClass("page-template-library-landing-page") || 
      $("body").hasClass("page-template-library-interior-page") ||
      (document.location.pathname.indexOf("/school-of-nursing/") == 0) ) {
        $("body").addClass("mobile-or-library");
      }
      else {
        $("body").removeClass("mobile-or-library");
      }
    };
    updateMenu();
    $(window).resize( function (e) {
      updateMenu();
    });
    
    //preload all carousel images
    var preloadCarousel = function (){
      $(".story-carousel .story-image img").each( function () {
        (new Image()).src = $(this).src;
      });
    }
    preloadCarousel();
    //make landingpage student carousel work.
    $(".story-carousel .story-tab:first-child").addClass("active");
    $(".story-carousel .story-tab").on( "click focus", function () {
      var index = $(this).getIndex() + 1;
      console.log(index);
      $(".story-feature .story-full").not(":nth-child("+index+")").css("z-index", "0").delay(400).fadeOut(1);
      $(".story-feature .story-full:nth-child("+index+")").css("z-index", "1").fadeIn(400);
      
      $(".story-carousel .story-tab").removeClass("active");
      $(this).addClass("active");
    });
    $(".story-feature-nav.nav-prev").click( function (e) {
      var height = $(this).parent().prev().height();
      $(this).parent().css({"z-index": 0}).delay(400).fadeOut(1);
      $(this).parent().prev().css({"z-index": 1, height: height, position:"absolute"}).fadeIn(400, function() { $(this).css({height:"", position:""}); });//.css({height:"", position:""});
      e.preventDefault();
      $(".story-tab").removeClass("active");
      var shouldBeUnnecessary = $(this).parent().prev().index();
      $(".story-tab:nth-child("+$(shouldBeUnnecessary+1)+")").addClass("active");
    });
    $(".story-feature-nav.nav-next").click( function (e) {
      var height = $(this).parent().next().height();
      $(this).parent().css({"z-index": 0}).delay(400).fadeOut(1);
      $(this).parent().next().css({"z-index": 1, height: height, position:"absolute"}).fadeIn(400, function() { $(this).css({height:"", position:""}); });//.css({height:"", position:""});
      e.preventDefault();
      $(".story-tab").removeClass("active");
      var shouldBeUnnecessary = $(this).parent().next().index();
      $(".story-tab:nth-child("+(shouldBeUnnecessary+1)+")").addClass("active");
    });
	window.setInterval(function(){
		var visibleStory = $(".story-feature .story-full:visible");
		var nextVisibleStory = visibleStory.next();
		var activeTab = $(".story-tab.active");
		var nextActiveTab = activeTab.next();
		if(nextVisibleStory.length){
			visibleStory.hide();
			nextVisibleStory.show();
			activeTab.removeClass("active");
			nextActiveTab.addClass("active");
		} else {
			$(".story-feature .story-full:last").hide();
			$(".story-feature .story-full:first").show();
			$(".story-tab:last").removeClass("active");
			$(".story-tab:first").addClass("active");
		}
	}, 5000);

    //resize library homepage area on window resize.
    var resizeLibraryHome = function () {
      
      var width = $win.width();
      var height = $win.height();
      var columns = $(".page-template-library-landing-page .section-heading-as-content");
      var existingPadding = $('.site-main').offset().top + $(".calls-to-action-feature").height();
      
      console.log(existingPadding);
      if (Modernizr.mq("only screen and (min-width: 64em)")) {
        columns.css("min-height", (parseInt(height) - parseInt(existingPadding)) + "px");
      }
      else {
        columns.css({"min-height": ""});
      }
    }
    resizeLibraryHome();
    $(window).resize(resizeLibraryHome);
    
    //resize home page hero columns on window resize.
    var resizeHeroColumns = function () {
      var width = $win.width();
      var height = $win.height();
      var columns = $(".section-hero_columns, .field-hero_columns");
      var existingPadding = $('.site-main').offset().top;
      
      console.log(existingPadding);
      if (Modernizr.mq("only screen and (min-width: 64em)")) {
        columns.css("height", (parseInt(height) - parseInt(existingPadding)) + "px");
      }
      else {
        columns.css({"height": "auto"});
        $(".hero-column").css({"width": "", "left": ""});
        $(".hero-column").removeClass("open").removeClass("quiet").removeClass("final");
      }
    }
    resizeHeroColumns();
    $(window).resize(resizeHeroColumns);
    setInterval(resizeHeroColumns, 500);
    
    var big = 30.00;
    var smol = 23.42;
    var duration = 300;
    var err = .2;
    
    var timer;
    //$(".hero-column .bg-wrapper").hide();
    //$(".hero-column .bg-wrapper").css({visibility: "hidden"});
    objectFitVideos();
    $(".bg-wrapper video").each( function () {
      this.pause();
    });
    //setInterval(objectFitVideos, 300);
    $(".hero-column").hoverIntent({
      interval: 300,
        over: function (e) {
          if (Modernizr.mq("only screen and (max-width: 64em)")) {
            return;
          }
          var videobg = $(this).find(".bg-wrapper");
          $(".hero-column").not(this).removeClass("open").removeClass("final").addClass("quiet");
          $(this).addClass("open final").removeClass("quiet");
          if (videobg.length) {
            //$(videobg).fadeIn();
            //$(videobg).css({visibility: "visible"});
            $(videobg).find("video").get(0).play();
          }
          
          if ($(this).index() == 0) {
            var that = this;
            timer = setTimeout(function(){
              $(".hero-column:nth-child(1)").velocity({width: big+"%"}, {easing: "easeInOutCirc", duration: duration, complete: function () {  if (false) { $(".hero-column:nth-child(1)").addClass("final"); }} });
              $(".hero-column:nth-child(2)").velocity({width: smol+"%", left: (big-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(3)").velocity({width: smol+"%", left: (big+smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(4)").velocity({width: smol+"%", left: (big+smol+smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
            }, 0);
          }
          else if ($(this).index() == 1) {
            var that = this;
            timer = setTimeout(function(){
              $(".hero-column:nth-child(1)").velocity({width: smol+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(2)").velocity({width: (big+.5)+"%", left: (smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration, complete: function () {  if (false) { $(".hero-column:nth-child(2)").addClass("final"); }} });
              $(".hero-column:nth-child(3)").velocity({width: smol+"%", left: (smol+big-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(4)").velocity({width: smol+"%", left: (smol+big+smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
            }, 0);
          }
          else if ($(this).index() == 2) {
            var that = this;
            timer = setTimeout(function(){
              $(".hero-column:nth-child(1)").velocity({width: smol+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(2)").velocity({width: smol+"%", left: (smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(3)").velocity({width: big+"%", left: (smol+smol-err)+"%"}, {easing: "easeInOutCirc", duration: duration, complete: function () {  if (false) { $(".hero-column:nth-child(3)").addClass("final"); }} });
              $(".hero-column:nth-child(4)").velocity({width: smol+"%", left: (smol+smol+big-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
            }, 0);
          }
          else if ($(this).index() == 3) {
            var that = this;
            timer = setTimeout(function(){
              $(".hero-column:nth-child(1)").velocity({width: smol+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(2)").velocity({width: smol+"%", left: (smol)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(3)").velocity({width: smol+"%", left: (smol+smol)+"%"}, {easing: "easeInOutCirc", duration: duration});
              $(".hero-column:nth-child(4)").velocity({width: big+"%", left: (smol+smol+smol)+"%"}, {easing: "easeInOutCirc", duration: duration, complete: function () {  if (false) { $(".hero-column:nth-child(4)").addClass("final"); }} });
            }, 0);
          }
          
          e.preventDefault();
        },
        out: function(e) {
          $(this).removeClass("open").removeClass("final");
          var videobg = $(this).find(".bg-wrapper");
          if (videobg.length) {
            //$(videobg).fadeOut();
            //$(videobg).css("visibility", "hidden");
            $(videobg).find("video").get(0).pause();
          }
          if (!$(e.toElement || e.relatedTarget).hasClass(".hero-column")) {
            $(".hero-column").removeClass("quiet");
          }
          
          clearTimeout(timer);
        }
    });
    
    $(".field-hero_columns").mouseleave( function (e) {
      if (Modernizr.mq("only screen and (max-width: 64em)")) {
        //return true;
        return;
      }
      clearTimeout(timer);
      //$(".hero-column").css({"width": "", "left": ""});
      $(".hero-column:nth-child(1)").velocity({width: 25+"%"}, {easing: "easeInOutCirc", duration: duration});
      $(".hero-column:nth-child(2)").velocity({width: 25+"%", left: (25-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
      $(".hero-column:nth-child(3)").velocity({width: 25+"%", left: (25+25-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
      $(".hero-column:nth-child(4)").velocity({width: (25+err)+"%", left: (25+25+25-err)+"%"}, {easing: "easeInOutCirc", duration: duration});
    });

	  //slick slider initialization
	jQuery(".slider-for").slick({
	  	slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.slider-nav',
		lazyLoad: 'ondemand',
	});
	jQuery(".slider-nav").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		asNavFor: '.slider-for',
		dots: true,
		centerMode: true,
		focusOnSelect: true,
		arrows: true,
		autoplay: false
	});
  });
  
	$('a[href*="#program-track-anchor"]').click(function(e){
		e.preventDefault();
		$('html, body').animate({
		scrollTop: $("#program-track-anchor").offset().top
	}, 1000);});
})(jQuery, window, document);
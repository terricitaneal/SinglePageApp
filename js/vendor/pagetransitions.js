/*! Navigation file */
/* jshint jquery: true */

(function(window, undefined) {
  'use strict';

  var body = $('body'),
      html = $('html'),
      header = $('.header'),
      $window = $(window),

      // Down transitions
      animateToTopFade = 'slide-moveToTopFade',
      animateFromBottomFade = 'slide-moveFromBottomFade',

      // Up transitions
      animateToBottomFade = 'slide-moveToBottomFade',
      animateFromTopFade = 'slide-moveFromTopFade',

      currentSlideClass = "slide-current",

      //introClass = $('.intro'),

      menuId = '#js-mobile-menu',
      menuContent = '#js-menu-content',
      openedClass = 'opened',

      $contentSections = $('.slide'),
      $navigationItems = $('.nav a'),
      $main = $('#cg-content'),
      $pages = $('.slide-content'),
      current = 0,
      pagesCount = $pages.length,

      isAnimating = false,
      endCurrPage = false,
      endNextPage = false,
      animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
      },
      // animation end event name
      animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
      // support css animations
      support = Modernizr.cssanimations,


  nav = {


    getWindowWidth: function() {
      var width = $window.width();

      return width;
    },

    // Add a class 'mobile' to the body if viewport is smaller than a certain width
    isMobile: function() {
      if (this.getWindowWidth() < 1024) {
        body.addClass('mobile');
        return true;
      } else {
        body.removeClass('mobile');
        return false;
      }
    },

     /*
    * Function to hide/show menu content
    */
    mobileMenuBtn: function() {

      var $mobileMenuId = $(menuId),
          $mobileMenuContent = $(menuContent);

      $mobileMenuId.on('click', function() {

      if (!($mobileMenuContent.hasClass(openedClass)))  {
        $mobileMenuContent.addClass('opened').fadeIn();
        html.addClass('no-show');
      } else {
          $mobileMenuContent.removeClass('opened').fadeOut();
          html.removeClass('no-show');
        }
      }.bind(this));
    },

    mobileMenuClose: function() {
      //@CLEANUP: Make the ID's and classes variables
      //not hardcoded here

        var $mobileMenuContent = $('.mobile ' + menuContent);

        $('#js-mobile-menu .tcon').removeClass('tcon-transform');
        html.removeClass('no-show');
        $(menuContent).removeClass('opened');
    },

     // Don't show the left nav menu only intro page
    /*introMenu: function() {
      if ($('.intro').hasClass('active') && !(body.hasClass('mobile'))) {
        header.hide();
      } else {
        header.show();
      }
    },*/

    /*
    * This function updates the classe of the current section when
    * a navigation item is clicked
    * Takes the id of the item clicked
    */

    updateSection: function(id) {

      var el = $('.' + id),
          nextSlide = $(el).attr('href'),
          prevSlide = $('a.active').attr('href'),
          prevIndex =  $(prevSlide).index(),
          nextIndex =  $(nextSlide).index(),
          outClass = '',
          inClass = '';

        if (nextIndex >= prevIndex) {
          // you're going down, so use down transitions
          outClass = animateToTopFade;
          inClass = animateFromBottomFade;
        } else {
          // else, you're going up so use the up transitions
          outClass = animateToBottomFade;
          inClass = animateFromTopFade;

        }

        $(nextSlide).addClass(currentSlideClass);

        // if the selected slide
        $(prevSlide).addClass( outClass ).on( animEndEventName, function() {
        $(prevSlide).off( animEndEventName );
        endCurrPage = true;
        if( endNextPage ) {
          // onEndAnimation
          endCurrPage = false;
          endNextPage = false;
          // reset the page
          $(prevSlide).attr( 'class', $(prevSlide).data( 'originalClassList' ) );
          $(nextSlide).attr( 'class', $(nextSlide).data( 'originalClassList' ) + ' slide-current' );
          isAnimating = false;
        }
      });

      $(nextSlide).addClass( inClass ).on( animEndEventName, function() {
        $(nextSlide).off( animEndEventName );
        endNextPage = true;
        if( endCurrPage ) {
        // onEndAnimation
        endCurrPage = false;
        endNextPage = false;
        // reset the page
        $(prevSlide).attr( 'class', $(prevSlide).data( 'originalClassList' ) );
        $(nextSlide).attr( 'class', $(nextSlide).data( 'originalClassList' ) + ' slide-current' );
        isAnimating = false;
        }
      });

      if( !support ) {
        // onEndAnimation
        endCurrPage = false;
        endNextPage = false;
        // reset the page
        $(prevSlide).attr( 'class', $(prevSlide).data( 'originalClassList' ) );
        $(nextSlide).attr( 'class', $(nextSlide).data( 'originalClassList' ) + ' slide-current' );
        isAnimating = false;
      }
    },

    /* Update this function to asses where we are on the page/menu and update accordingly
    *
    */

    updateNavigation: function(id) {
        var $el = $('.' + id);
            
        //clear all active items
        if ($navigationItems.hasClass('active')) {
          $navigationItems.removeClass('active');
         }

        // add active class to selected element
        $el.addClass('active');
    },


    init: function() {
      //this.loopMute();

      // initialize the original classes for each of the slides
      // as these will change when a new slide is selected
      $pages.each( function() {
        var $page = $(this);
        $page.data('originalClassList', $page.attr( 'class' ));
      });

      // Use appropriate menu based on viewport size
      this.isMobile();

      // Initialize mobile button click functionality
      this.mobileMenuBtn();

      //this.introMenu();

      // When any menu item is closed close and reset values
      $navigationItems.on('click', function(event) {
        this.mobileMenuClose();
        //this.introMenu();
      }.bind(this));

      // Needed for the initial hero element
      $pages.eq(current).addClass(currentSlideClass);

      // Resize events
      $window.on('resize', function() {
        this.isMobile();
        //this.introMenu();
      }.bind(this));

      // Return an slides object.
          return this;
      }

  // initialize functions
  }.init();


  window.nav = nav;

}(this));

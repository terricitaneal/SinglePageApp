/*! Main JavaScript file */
/* jshint jquery: true */

(function(window, undefined) {
  'use strict';

var
  // Some global aliases
  // These should be treated as constants, not global vars.

  body = $('body'),

  menuId = '#js-mobile-menu',
  menuContent = '#js-menu-content',
  openedClass = 'opened',

  socialIconId = 'js-social-icons',
  socialShareHideID = 'js-desktop-social-share',

  fbShareId = 'js-fb-share',
  twShareId = 'js-tw-share',
  pinShareId = 'js-pin-share',


  $window = $(window),
  document = window.document,

mainApp = {

  //@TODO: tweak function to make it work with multiple elements
  fadeInFadeOut: function() {
    var $element = $('.fade');
    setInterval(function () {
      $element.fadeIn(1800, function () {
        $element.fadeOut(1800, function () {
          $element.fadeIn(1800)
        });
      });
    }, 1800);
  },

  /*
  * Timeout the loader
  */
  loader: function() {
    // hide page overflow onload

    body.addClass('no-show');
    setTimeout(function(){
      body.addClass('loaded');
      body.removeClass('no-show');
    }, 4000);
  },

  getWindowHeight: function(viewport) {
    if (viewport === 'document') {
      return $(document).height();
    } else {
        return $window.height();
      }
  },

  getWindowWidth: function() {
    var width = $window.width();

    return width;
  },

  /*
  * Initialize the transformicon menu button
  */
  navHamburger: function(){
    transformicons.add('.tcon');
  },



  socialShareHide: function() {
    var $desktopShareId = $('#' + socialShareHideID),
        $socialIconId = $('#' + socialIconId);

    $desktopShareId.on('click', function() {

       if (!($socialIconId.hasClass(openedClass))) {

        $socialIconId.addClass(openedClass).fadeIn();
      } else {
        $socialIconId.removeClass(openedClass).fadeOut();
      }
    });
  },

  /*
  * Social Sharing functionality
  */

  socialShare: function socialShare(shareType) {
    var loc = document.location,
        url = loc.protocol + '//' + loc.host + loc.pathname,
        ww = this.getWindowWidth() / 2,  // window width / 2
        wh = this.getWindowHeight() / 2, // window height / 2
        wtop = wh - ww, // Set popup vertical position
        wleft = ww - wh, // Set popup horizontal position
        opts = 'height=' + wh + ',width=' + ww + ',resizable=1,left=' +
              wleft + ',top=' + wtop;
        if (shareType === 'tweet') {
          window.open('//twitter.com/intent/tweet?text=Send this tweet with some good information' +
              url, 'tweet', opts);
        } else if (shareType === 'facebook') {
          window.open('//www.facebook.com/sharer/sharer.php?u=' + url,
            'null', opts);
        } else {
          // this is pinterest
        }
      },

  /**
  * Bind social sharing function to social sharing links.
  */
  setUpSharing: function setUpSharing(sharingIds) {
    var i = sharingIds.length - 1;
        for (i; i >= 0; i--) {
          $('#' + sharingIds[i].id).on('click', (function(type) {
            return function() {
              this.socialShare(type);
            };
          } (sharingIds[i].type)).bind(this));
        }
      },

  navHeightAdjust: function() {

    // if the height of the browser window on desktop is < 600px
    // Adjust the height of the nav up
    var wHeight = this.getWindowHeight(),
        wWidth = this.getWindowWidth();

    if (wHeight < 720&& wWidth >= 1024) {
      body.addClass('adjustHeight');
    } else {
      body.removeClass('adjustHeight');
    }
  },


  /*
  * Initialize the functions...
  */
  init: function() {
    // Preloader
    this.loader();

  
    // Initiate menu button
    this.navHamburger();

    this.socialShareHide();

    $window.on('resize', function() {
      this.navHeightAdjust();
    }.bind(this));

    // Social Sharing
    this.setUpSharing([
      {
        id: twShareId,
        type: 'tweet'
      },
      {
        id: fbShareId,
          type: 'facebook'
        }
      ]);

     // Adjust the height of the nav when windo height gets small
    this.navHeightAdjust();

  }

}.init();

 window.mainApp = mainApp;

}(this));

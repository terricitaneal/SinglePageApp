/* jshint jquery: true */
/* global Backbone */
(function(global, undefined) {
  'use strict';

  var

      // Utility properties
      $global = $(global),
      document = window.document,
      $window = $(window),

      wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' :
          document.onmousewheel !== undefined ? 'mousewheel' :
          'DOMMouseScroll',

      transitionEnd = (function() {
        // Default to 'transitionend' for FF because it seems as if I can't
        // detect transitionend within any objects
        var ret = 'transitionend',
            // Iterated backwards; start with the most common cases
            alts = [
              'transitionend',
              'oTransitionEnd',
              'otransitionend',
              'webkitTransitionEnd'
            ],
            i = alts.length - 1;
        for (i; i > -1; i--) {
          // Hmm... current version of Safari will only find
          // webkitTransitionEnd in window if it's lowercase.
          // However, will only use it if its camelcased.
          if ('on' + alts[i].toLowerCase() in global) {
            ret = alts[i];
            break;
          }
        }
        return ret;
      }()),

      currentSlideClass = "slide-current",
      animateFromBottom = 'slide-moveFromBottom',
      animateToTop = 'slide-moveToTopEasing',
      animateToBottom = 'slide-moveToBottomEasing',
      isAnimating = false,
      endCurrPage = true,
      endNextPage = false,


      // Utility function

      getViewportHeight = function() {
        return $(window).height() - $('header').outerHeight();
      },

      // Slide model

      Slide = Backbone.Model.extend({

        // Set the height of a slide based on the current viewport and header
        setHeight: function() {
          this.$el.outerHeight(getViewportHeight());
        },

        // Show the current slide and, optionally,
        // prep the prev and next slides.
        show: function(prevSlide, nextSlide) {
          var $currSlide = this.$el,
              height = $currSlide.css('z-index', 0).show().outerHeight();
          if (prevSlide) {
            prevSlide.$el.css('top', (-1 * height) + 'px').show();
          }
          if (nextSlide) {
            nextSlide.$el.css('top', height + 'px').show();
          }
        },

        initialize: function() {
          // Shortcut to jQuery selector for model
          this.$el = this.get('$el');
          // Set slide height
          //this.setHeight();

        }

      }),

      // Slides collection

      Slides = Backbone.Collection.extend({

        model: Slide,

        // Hide all the slides and reset the z-index and top
        hide: function() {
          this.each(function(slide) {
            slide.$el.hide().css({
              top: 0,
              zIndex: 1
            });
          });
        },

        // Return the next slide model given a slide model
        next: function(currSlide) {
          var index = this.indexOf(currSlide) + 1;
          if (index < this.length) {
            return this.at(index);
          } else {
            return false;
          }
        },

        // Return the previous slide model given a slide model
        prev: function(currSlide) {
          var index = this.indexOf(currSlide) - 1;
          if (index > -1) {
            return this.at(index);
          } else {
            return false;
          }
        },

        // Show a specfic slide given a numeric ID
        // @TODO: This could probably all get refactored into the slide
        // show method
        showSlide: function(id) {
          var currSlide = this.get('slide-' + id),
              prevSlide = this.prev(currSlide),
              nextSlide = this.next(currSlide);
          // Hide all slides
          this.hide();
          // Show the current slide
          currSlide.show(prevSlide, nextSlide);
          // Remember the currentSlide
          this.currSlide = id;

        },

        // Set the height of all slides and then "re-show" the current
        // slide (since changing the height also changes the offsets).
        // Also store an offset.
        // @TODO: This seems somewhat ugly.
        setHeight: function() {
          this.each(function(slide) {
            //slide.setHeight();
          });
          if (this.currSlide) {
            this.showSlide(this.currSlide);
          }
        },

        // @TODO: Need to refactor; cyclomatic complexity hits 14 here
        // Without this function, it's only 3.
        // After refactor 1, it's from 14 to 12
        // After refactor 2, it's at 10, which is as good as I'm going to get it
        animateSlide: function(e) {
          e.preventDefault();
          alert('slide animated!');
          /*var oEvt = e.originalEvent,
              currDir = (oEvt.wheelDelta > 0 || oEvt.detail < 0) ? 'prev' :
                  'next',
              currSign = (currDir === 'prev') ? 1 : -1,
              slide = this.scrollSlide || false,
              currSlide = this.currSlide,
              top,
              max;
          // Are we currently scrolling or starting a new one?
          if (slide) {
            // Get the current sliding slide top
            top = slide.$el.position().top;
            if (this.currDir === currDir) {
              max = 0;
              currSlide = Math.abs((currSlide * currSign) - 1);
            } else {
              max = getViewportHeight() * currSign;
            }
            if ((currDir === 'prev' && top >= max) ||
                  (currDir === 'next' && top <= max)) {
              // Prep the next slides and update the URL
              this.showSlide(currSlide);
              router.navigate('/slide/' + currSlide);
              // Clear the flags
              this.scrollSlide = false;
              this.currSlide = currSlide;
            } else {
              slide.$el.css('top', top + (15 * currSign) + 'px');
            }
          // If we're starting a new one, do we even have any more slides?
          } else {
            slide = this[currDir](this.get('slide-' + currSlide));
            if (slide) {
              this.scrollSlide = slide;
              this.currDir = currDir;
            }
          }*/
        },
      }),

      slides = new Slides(),

      // App router

      Router = Backbone.Router.extend({

        // Define the route and function maps for this router
        routes: {

          // Uses a :param variable: http://localhost/#slide/2
          ':id': 'showView'
        },

        home: function() {
          this.navigate('/slide/1', {
            trigger: true
          });
        },

        showView: function(id) {
          // These functions can be found
          // in pagetransitions.js

          nav.updateSection(id);
          nav.updateNavigation(id);
          //nav.introMenu();
        }

      }),
      router = new Router();



  // Create slide models and add to the slides collection
  $('.slide').each(function() {
    slides.add(new Slide({
      id: this.getAttribute('id'),
      $el: $(this)
    }));
  });

  // @TODO: Implement name updater
  slides.on('add', function(slide) {
  });

  // @TODO: The next few lines are still just hanging out; not Backbonish;
  // should probably be part of a view. The root element and something else.
  /*$('.slides-container').outerHeight(getViewportHeight);
  $(window).on('resize', function() {
    $('.slides-container').outerHeight(getViewportHeight);
    //slides.setHeight();
  }).on(wheelEvent, slides.handleScroll.bind(slides));
*/

  // @TODO: Again, seems not very Backbonish;
  // Override links for fancy URLs
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('href').substring(1);
    router.navigate('/' + id, {
      trigger: true
    });

    // Needed especially for mobile
    // positions page back to the top
    $window.scrollTop(0);

  });

  // Have Backbone monitor hashchange events (for our router)
  //  Backbone.history.start();
  Backbone.history.start({
    pushState: true,
  });

}(this));

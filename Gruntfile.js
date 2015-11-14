/* jshint node:true */
module.exports = function(grunt) {
  'use strict';

  var checkMode = function(mode) {
    var ret = false;
    switch (mode) {
      case 'dev':
      case 'prod':
        ret = true;
        break;
    }
    return ret;
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    build: {

      // Build error messages
      err: {
        wrongMode: 'Please specify either "prod", "stage", "qa" or "dev".'
      },

      // File names
      fileNames: {
        css: 'screen.css',
        jsFoot: 'spa-foot-<%= pkg.version %>.min.js',
        jsHead: 'spa-<%= pkg.version %>.min.js',

      },

      // Build paths
      base: {
        src: '.',
        dest: './prod'
      },
      tmp: {
        src: './.tmp'
      },
      css: {
        src: '<%= build.base.src %>/sass',
        dest: '<%= build.base.dest %>/css'
      },
      img: {
        src: '<%= build.base.src %>/images',
        dest: '<%= build.base.dest %>/images'
      },
      js: {
        src: '<%= build.base.src %>/js',
        dest: '<%= build.base.dest %>/js'
      }
    },

    clean: {
      css: '<%= build.css.dest %>/',
      img: '<%= build.img.dest %>/',
      js: '<%= build.js.dest %>/',
      tmp: '<%= build.tmp.src %>/'
    },

    // Start concat task
    concat: {
      options: {
        separator: ';\n',
        stripBanners: true
      },
      jsFoot: {
        src: [
          '<%= build.js.src %>/main.js',
          '<%= build.js.src %>/vendor/pagetransitions.js',
          '<%= build.js.src %>/countdown.js'
        ],
        dest: '<%= build.js.dest %>/<%= build.fileNames.jsFoot %>'
      },
      jsHead: {
        src: [
           '<%= build.js.src %>/vendor/modernizr-min.js',
           '<%= build.js.src %>/vendor/transformicons.js'
        ],
        dest: '<%= build.js.dest %>/<%= build.fileNames.jsHead %>'
      }
    },
    // End concat task

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: [
        'watch: css',
        'watch:img',
        'watch:js'
      ]
    },

    // Start copy task
    copy: {
      img: {
        files: [
          {
            expand: true,
            cwd: '<%= build.img.src %>',
            src: '**/*',
            dest: '<%= build.img.dest %>/'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: '<%= build.js.src %>/',
            src: [
              'vendor/jquery-1.11.3.min.js',
              'vendor/underscore-min.js',
              'vendor/backbone-min.js',
              'vendor/pagetransitions.js',
              'slides.js',
              'postApp.js'

            ],
            dest: '<%= build.js.dest %>/'
          }
        ]
      }
    },
    // End copy task

    // Start imagemin task
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 5
        },
        files: [
          {
            expand: true,
            cwd: '<%= build.img.src %>/',
            src: '**/*.{png,jpg,jpeg,gif}',
            dest: '<%= build.img.dest %>/'
          }
        ]
      }
    },
    // End imagemin task

    sass: {
      dev: {
        options: {
          style: 'expanded',
          sourcemap: true
        },
        files: {
          '<%= build.css.dest %>/<%= build.fileNames.css %>':
          '<%= build.css.src %>/screen.scss'
        }
      },
      prod: {
        options: {
          style: 'compressed',
          sourcemap: 'auto'
        },
        files: {
          '<%= build.css.dest %>/<%= build.fileNames.css %>':
          '<%= build.css.src %>/screen.scss'
        }
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true
        },
        mangle: true,
        preserveComments: 'some',
        sourceMap: false
      },
      js: {
        files: [
          {
            expand: true,
            cwd: '<%= build.js.src %>/',
            src: [
              'main.js',
              'nav.js'
            ],
            dest: '<%= build.tmp.src %>/'
          }
        ]
      }
    },

    watch: {
      css: {
        options: { livereload: false },
        files: '<%= build.css.src %>/*.{sass,scss}',
        tasks: 'buildCSS'
      },
      js: {
        options: { livereload: false },
        files: '<%= build.js.src %>/*.js',
        tasks: 'buildJS'
      }
    }

  });

  // Load Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Define custom Grunt tasks

  /**
   * Task to install the server-side (PHP) dependencies.
   */
  grunt.registerTask('install', 'Install the server-side dependencies.',
      function() {
    // Install PHP dependencies.
    grunt.task.run('composer:install');
  });

  /**
   * Task to build the CSS files.
   */
  grunt.registerTask('buildCSS', 'Build the CSS files.', function(mode) {
    // No mode passed? Default to dev.
    mode = (mode) ? mode : 'dev';
    // Ensure we have a whitelisted mode.
    if (!checkMode(mode)) {
      grunt.log.error(grunt.config.get('build.err.wrongMode'));
    } else {
      // Remove previous output CSS files.
      grunt.task.run('clean:css');
      // Create CSS from Sass files.
      if (mode === 'dev') {
        grunt.task.run('sass:dev');
      } else {
        grunt.task.run('sass:prod');
      }
    }
  });

  /**
   * Task to copy or optimize the image files.
   */
  grunt.registerTask('buildImg', 'Build the image files', function(mode) {
    // No mode passed? Default to dev.
    mode = (mode) ? mode : 'dev';
    // Ensure we have a whitelisted mode.
    if (!checkMode(mode)) {
      grunt.log.error(grunt.config.get('build.err.wrongMode'));
    } else {
      // Remove previous output image files.
      grunt.task.run('clean:img');
      if (mode === 'dev') {
        // For dev and copy, copy the images as they are.
        grunt.task.run('copy:img');
      } else {
        // For staging and prod, optimize the images.
        grunt.task.run('imagemin:prod');
      }
    }
  });

  /**
   * Task to build the JS files.
   */
  grunt.registerTask('buildJS', 'Build the JS files.', function(mode) {
    // No mode passed? Default to dev.
    mode = (mode) ? mode : 'dev';
    // Ensure we have a whitelisted mode.
    if (!checkMode(mode)) {
      grunt.log.error(grunt.config.get('build.err.wrongMode'));
    } else {
      // Remove previous output JS files.
      grunt.task.run('clean:js');
      // Copy certain JS vendor files as is.
      grunt.task.run('copy:js');
        // Minify our JS files.
        grunt.task.run('uglify:js');
        // Concatenate the JS that goes in the head.
        grunt.task.run('concat:jsHead');
        // Concatenate the JS that goes in the foot.
        grunt.task.run('concat:jsFoot');
        // Clean up the temp directory (where the JS is minified).
        grunt.task.run('clean:tmp');
    }
  });

  /**
   * Master build task that calls all the other custom build tasks.
   */
  grunt.registerTask('build', 'Build all the things.', function(mode) {
    // No mode passed? Default to dev.
    mode = (mode) ? mode : 'dev';
    // Ensure we have a whitelisted mode.
    if (!checkMode(mode)) {
      grunt.log.error(grunt.config.get('build.err.wrongMode'));
    } else {
      // Build image files.
      grunt.task.run('buildImg:' + mode);
      // Build CSS files.
      grunt.task.run('buildCSS:' + mode);
      // Build JS files.
      grunt.task.run('buildJS:' + mode);
    }
  });

};

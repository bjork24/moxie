module.exports = function (grunt) {

  'use strict';
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 2424,
          base: '.',
          livereload: true,
          keepalive: true
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        reload: true,
        forever: true
      },
      css: {
        files: 'src/scss/*/*/*.scss',
        tasks: ['libsass'],
      },
      html: {
        files: '*/*/*/*.html',
        tasks: ['bytesize'],
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['jshint', 'uglify', 'bytesize'],
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/app.css': 'src/scss/app.scss'
        }
      }
    },

    libsass: {
      options: {
        sourcemap: true
      },
      dist: {
        src: 'src/scss/app.scss',
        dest: 'build/app.css'
      }
    },

    concurrent: {
      target: {
        tasks: ['libsass', 'connect', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: {
        src: ['src/js/*.js', 'Gruntfile.js']
      },
      options: {
        jshintrc: true,
        force: true,
        ignores: ['public/js/vendor/*.js']
      }
    },

    bytesize: {
      all: {
        src: ['build/*']
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: 'build/app.map'
      },
      target: {
        files: {
          'build/app.min.js': ['src/js/vendor/*.js', 'src/js/app.js']
        }
      }
    }

  });

grunt.registerTask('server', ['concurrent:target']);
grunt.registerTask('build', ['jshint', 'uglify', 'libsass']);

};
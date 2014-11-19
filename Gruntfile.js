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
      },
      css: {
        files: 'src/scss/*.scss',
        tasks: ['compass'],
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['jshint', 'uglify', 'bytesize'],
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'build',
          trace: true,
          force: true,
          outputStyle: 'expanded'
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['connect', 'compass', 'watch'],
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
grunt.registerTask('build', ['jshint', 'uglify']);

};
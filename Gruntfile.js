module.exports = function (grunt) {

  "use strict";
  
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
    }

  });

  grunt.registerTask('server', ['connect']);

};
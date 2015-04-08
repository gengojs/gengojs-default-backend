module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['lib/*.js', 'tests/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          './index.js': 'lib/index.js'
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint',
    'babel'
  ]);
};
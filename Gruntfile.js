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
    },
    watch: {
      babel: {
        tasks: ['babel'],
        files: 'lib/*.js'
      }
    },
    simplemocha: {
      all: {
        src: 'test/*.js',
        options: {
          globals: ['should', 'it'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'nyan'
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint',
    'babel',
    'simplemocha'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'babel',
    'watch'
  ]);
};

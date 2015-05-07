/*global describe, it*/
var chai = require('chai');
var assert = chai.assert;
var Core = require('gengojs-core');
var memory = require('../');

describe('Memory', function() {
  'use strict';
  describe('load plugin', function() {
    it('should exist Gengo', function() {
      var gengo = new Core({
        backend: {
          directory: process.cwd() + '/fixtures/locales/'
        }
      }, memory());
      assert.isDefined(gengo.backend);
    });
  });

  describe('read files', function() {
    it('should read json', function() {
      var gengo = new Core({
        backend: {
          directory: process.cwd() + '/fixtures/locales/'
        }
      }, memory());
      assert.isDefined(gengo.backend.data);
      gengo.backend.read(function(data) {
        assert.deepEqual(data, {
          en: {
            Hello: 'World'
          }
        });
      });
    });
    it('should read yaml', function() {
      var gengo = new Core({
        backend: {
          directory: process.cwd() + '/fixtures/locales/',
          extension: 'yaml'
        }
      }, memory());
      gengo.backend.read(function(data) {
        assert.deepEqual(data, {
          en: {
            Hello: 'World'
          }
        });
      });

    });
    it('should read javascript', function() {
      var gengo = new Core({
        backend: {
          directory: process.cwd() + '/fixtures/locales/',
          extension: 'js'
        }
      }, memory());
      gengo.backend.read(function(data) {
        assert.deepEqual(data, {
          en: {
            Hello: 'World'
          }
        });
      });

    });
  });
});

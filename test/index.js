var assert = require('chai').assert;
var core = require('gengojs-core');
var memory = require('../');

describe('Memory', function() {
  describe('load plugin', function() {
    it('should load into Gengo', function() {
      var gengo = core.create({
        backend: {
          directory: process.cwd() + '/fixtures/locales/'
        }
      }, memory());
      assert.isDefined(gengo.backend);
    });
  });

  describe('read files', function() {
    it('should read json', function() {
      var gengo = core.create({
        backend: {
          directory: process.cwd() + '/fixtures/locales/'
        }
      }, memory());
      assert.isDefined(gengo.backend.data);
      gengo.backend.getDataAsync(function(data) {
        assert.deepEqual(data, {
          en: {
            Hello: 'World'
          }
        });
      })
    });
    it('should read yaml', function() {
      var gengo = core.create({
        backend: {
          directory: process.cwd() + '/fixtures/locales/',
          extension: 'yaml'
        }
      }, memory());
      gengo.backend.getDataAsync(function(data) {
        assert.deepEqual(data, {
          en: {
            Hello: 'World'
          }
        });
      })

    });
  });
});
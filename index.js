/*Imports*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _globwatcher = require('globwatcher');

var _globwatcher2 = _interopRequireDefault(_globwatcher);

var _readJson = require('read-json');

var _readJson2 = _interopRequireDefault(_readJson);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = (0, _debug2['default'])('default-backend');

/* Memory Class */

var Memory = (function () {
  function Memory(options) {
    var _this2 = this;

    _classCallCheck(this, Memory);

    // Set directory
    this.directory = _path2['default'].normalize(options.directory);
    // Set extension
    this.extension = options.extension;
    // Set prefix
    this.prefix = options.prefix;
    // Set cache
    this.cache = options.cache;
    // Check that the extension has a '.'
    if (!/\./.test(this.extension)) this.extension = '.' + this.extension.replace('.yml', '.yaml');
    // Set path
    this.path = this.directory + '*' + this.extension;
    debug('directory:', this.directory);
    this.data = {};
    // Check cache and read all files
    if (this.cache) this.read();else {
      var watcher = _globwatcher2['default'].globwatcher(this.path);
      watcher.on('changed', function () {
        return _this2.read();
      });
      watcher.on('added', function () {
        return _this2.read();
      });
      watcher.on('deleted', function () {
        return _this2.read();
      });
      watcher.ready.then(function () {
        return debug('Memory is actively watching ' + _this2.directory);
      });
    }
  }

  // Export

  /* Read */

  _createClass(Memory, [{
    key: 'read',
    value: function read(callback) {
      var dictionary = {};
      // Pass the context as '_this' and
      // read all the files with respect
      // to its extension.
      (0, _glob2['default'])(this.path, (function (_this) {
        return function (error, files) {
          debug('files:', files, 'errors:', error);
          // Read if this is a JSON file.
          if (/.json/.test(_this.extension)) files.forEach(function (file) {
            return (0, _readJson2['default'])(file, function (error, data) {
              try {
                if (error || !data) throw new Error('Woops! Is your JSON file in proper format?');else {
                  dictionary[_this.normalize(file.split('/').pop())] = data;
                  _this.data = dictionary;
                  if (_lodash2['default'].isFunction(callback)) callback(dictionary);
                }
              } catch (error) {
                debug(error.stack || String(error));
              }
            });
          });
          // Read if this is a YAML file.
          if (/.yaml/.test(_this.extension)) files.forEach(function (file) {
            return _fs2['default'].readFile(file, function (error, data) {
              try {
                if (error || !data) throw new Error('Woops! Is your YAML file in proper format?');else {
                  dictionary[_this.normalize(file.split('/').pop())] = _jsYaml2['default'].safeLoad(data);
                  _this.data = dictionary;
                  if (_lodash2['default'].isFunction(callback)) callback(dictionary);
                }
              } catch (error) {
                debug(error.stack || String(error));
              }
            });
          });
          // Read if this is a Javascript file.
          if (!/.json/.test(_this.extension) && /.js/.test(_this.extension)) files.forEach(function (file) {
            dictionary[_this.normalize(file.split('/').pop())] = require(file);
            if (_lodash2['default'].isFunction(callback)) callback(dictionary);
          });
        };
      })(this));
    }

    /* Catalog */
  }, {
    key: 'catalog',
    value: function catalog(locale) {
      return locale ? this.find(locale) : this.data;
    }

    /* Find */
  }, {
    key: 'find',
    value: function find(locale) {
      return this.data[locale] || this.data[locale.toLowerCase()];
    }

    /* Normalize */
  }, {
    key: 'normalize',
    value: function normalize(file) {
      file = file.toLowerCase().replace(this.extension, '').replace('_', '-');
      if (file.indexOf(this.prefix) > -1) file = file.replace(this.prefix, '');
      return file;
    }
  }]);

  return Memory;
})();

exports['default'] = function () {
  'use strict';
  return {
    main: function main() {
      this.backend = new Memory(this.options.backend);
    },
    'package': _lodash2['default'].merge({
      type: 'backend'
    }, require('./package')),
    defaults: require('./defaults')
  };
};

module.exports = exports['default'];

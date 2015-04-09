'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*Imports*/

var _yaml = require('js-yaml');

var _yaml2 = _interopRequireWildcard(_yaml);

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _glob = require('glob');

var _glob2 = _interopRequireWildcard(_glob);

var _json = require('read-json');

var _json2 = _interopRequireWildcard(_json);

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var debug = _d2['default']('default-backend');

/* Memory Class */

var Memory = (function () {
  function Memory(options) {
    _classCallCheck(this, Memory);

    // Set directory
    this.directory = _path2['default'].normalize(options.directory);
    // Set extension
    this.extension = options.extension;
    // Set prefix
    this.prefix = options.prefix;
    // Check that the extension has a '.'
    if (!/\./.test(this.extension)) this.extension = '.' + this.extension.replace('.yml', '.yaml');
    //Set path
    this.path = this.directory + '*' + this.extension;
    debug('directory:', this.directory);
    this.data = {};
    // Read all files
    this.read();
  }

  _createClass(Memory, [{
    key: 'read',

    /* Read */
    value: function read(callback) {
      var dictionary = {};
      // Pass the context as '_this' and
      // read all the files with respect
      // to its extension.
      _glob2['default'](this.path, (function (_this) {
        return function (error, files) {
          debug('files:', files, 'errors:', error);
          // Read if this is a JSON file.
          if (/.json/.test(_this.extension)) files.forEach(function (file) {
            return _json2['default'](file, function (error, data) {
              dictionary[_this.normalize(file.split('/').pop())] = data;
              _this.data = dictionary;
              if (_import2['default'].isFunction(callback)) callback(dictionary);
            });
          });
          // Read if this is a YAML file.
          if (/.yaml/.test(_this.extension)) files.forEach(function (file) {
            return _fs2['default'].readFile(file, function (error, data) {
              dictionary[_this.normalize(file.split('/').pop())] = _yaml2['default'].safeLoad(data);
              _this.data = dictionary;
              if (_import2['default'].isFunction(callback)) callback(dictionary);
            });
          });
        };
      })(this));
    }
  }, {
    key: 'find',

    /* Find */
    value: function find(locale) {
      return this.data[locale] || this.data[locale.toLowerCase()];
    }
  }, {
    key: 'normalize',

    /* Normalize */
    value: function normalize(file) {
      file = file.toLowerCase().replace(this.extension, '').replace('_', '-');
      if (file.indexOf(this.prefix) > -1) file = file.replace(this.prefix, '');
      return file;
    }
  }]);

  return Memory;
})();

// Export

exports['default'] = function () {
  'use strict';
  return {
    main: function main() {
      this.backend = new Memory(this.options.backend);
    },
    'package': _import2['default'].merge({
      type: 'backend'
    }, require('./package')),
    defaults: require('./defaults')
  };
};

module.exports = exports['default'];
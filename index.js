/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * Memory
 * This module loads all files into memory at once.
 */

/* Dependencies */

var yaml = require('js-yaml');
var path = require('path');
var glob = require('glob');
var json = require('read-json');
var fs = require('fs');
var pkg = require('./package');

function Memory(options, utils) {
  'use strict';
  /* Utils */
  var _ = utils._;
  var debug = utils.debug('memory');

  /* Initialize store */
  this.data = {};

  /* Set path */

  // Set defaults
  options = _.defaults(options || {}, require('./defaults'));
  // Set directory
  this.directory = path.normalize(options.directory);
  // Set extension
  this.extension = options.extension;
  // Set prefix
  this.prefix = options.prefix;

  // Check that the extension has a '.'
  if (!/\./.test(this.extension))
    this.extension = '.' + this.extension.replace('.yml', '.yaml');

  debug('directory:', this.directory, 'extension:', this.extension);

  // Setup which includes reading
  this.set = function(callback) {
    debug('fn:', 'set');
    var _this = this;
    var temp = {};
    var path = this.directory + '*' + this.extension;
    // Find all files and get the paths for each file
    glob(path, function(error, files) {
      debug('files:', files, 'errors:', error);
      // Read if this is a JSON file.
      if (/.json/.test(_this.extension)) {
        // Iterate the files
        _.forEach(files, function(file) {
          debug('reading JSON file:', file);
          // Read
          json(file, function(error, data) {
            // Normalize the file and store the data into temp
            temp[_this.normalize(file.split('/').pop())] = data;
            // Callback the data to set it to 'this.data'
            callback(temp);
          });
        });
      } else if (/.yaml/.test(_this.extension)) {
        // Iterate the files
        _.forEach(files, function(file) {
          debug('reading YML file:', file);
          // Read
          fs.readFile(file, function(error, data) {
            temp[_this.normalize(file.split('/').pop())] = yaml.safeLoad(data);
            callback(temp);
          });
        });
      }
    });
  };

  this.normalize = function(file) {
    file = file.toLowerCase().replace(this.extension, '').replace('_', '-');
    if (file.indexOf(this.prefix) > -1) file = file.replace(this.prefix, '');
    return file;
  };

  var _this = this;
  // Set the data
  this.set(function(data) {
    debug('data:', data);
    _this.data = data;
  });

}

// Mainly for Mocha tests
Memory.prototype.getDataAsync = function(callback) {
  'use strict';
  this.set(function(data) {
    callback(data);
  });
};

// Find
Memory.prototype.find = function(locale) {
  'use strict';
  return this.data[locale];
};

// Ship
function memory() {
  'use strict';
  /*jshint validthis:true*/
  this.backend = new Memory(this.plugins._backend.options,
    this.utils);
}

// Export
module.exports = function() {
  'use strict';
  pkg.type = 'backend';
  return {
    main: memory,
    package: pkg
  };
};
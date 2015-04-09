/*Imports*/
import yaml from 'js-yaml';
import path from 'path';
import glob from 'glob';
import json from 'read-json';
import fs from 'fs';
import _ from 'lodash';
import d from 'debug';
var debug = d('default-backend');

/* Memory Class */
class Memory {
  constructor(options) {
    // Set directory
    this.directory = path.normalize(options.directory);
    // Set extension
    this.extension = options.extension;
    // Set prefix
    this.prefix = options.prefix;
    // Check that the extension has a '.'
    if (!/\./.test(this.extension))
      this.extension = '.' + this.extension.replace('.yml', '.yaml');
    //Set path
    this.path = this.directory + '*' + this.extension;
    this.data = {};
    // Read all files
    this.read();
  }
  /* Read */
  read(callback) {
    var dictionary = {};
    // Pass the context as '_this' and 
    // read all the files with respect
    // to its extension.
    glob(this.path, ((_this) => {
      return (error, files) => {
        debug('files:', files, 'errors:', error);
        // Read if this is a JSON file.
        if (/.json/.test(_this.extension))
          files.forEach(file => json(file, (error, data) => {
            dictionary[_this.normalize(file.split('/').pop())] = data;
            _this.data = dictionary;
            callback(dictionary);
          }));
        // Read if this is a YAML file.
        if (/.yaml/.test(_this.extension))
          files.forEach(file => fs.readFile(file, (error, data) => {
            dictionary[
              _this.normalize(file.split('/').pop())
            ] = yaml.safeLoad(data);
            _this.data = dictionary;
            callback(dictionary);
          }));
      };
    })(this));
  }
  /* Find */
  find(locale) {
    return this.data[locale];
  }
}

// Export
export
default () => {
  'use strict';
  return {
    main: function() {
      this.backend = new Memory(this.options.backend);
    },
    package: _.merge({
      type: 'backend'
    }, require('./package')),
    defaults: require('./defaults')
  };
};
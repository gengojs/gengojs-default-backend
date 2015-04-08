/*Imports*/
import yaml from 'js-yaml';
import path from 'path';
import glob from 'glob';
import json from 'read-json';
import fs from 'fs';
import _ from 'lodash';
import d from 'debug';
import _defaults from './defaults';
var debug = d('default-backend');

/* Memory Class */
class Memory {
  constructor(options) {
    // Set options
    this.options = options =
      _.defaults(options, _defaults);
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
    // Pass the context as 'me' and 
    // read all the files with respect
    // to its extension.
    glob(this.path, ((me) => {
      return (error, files) => {
        debug('files:', files, 'errors:', error);
        // Read if this is a JSON file.
        if (/.json/.test(me.extension))
          files.forEach(file => json(file, (error, data) => {
            dictionary[me.normalize(file.split('/').pop())] = data;
            me.data = dictionary;
            callback(dictionary);
          }));
        // Read if this is a YAML file.
        if (/.yaml/.test(me.extension))
          files.forEach(file => fs.readFile(file, (error, data) => {
            dictionary[
              me.normalize(file.split('/').pop())
            ] = yaml.safeLoad(data);
            me.data = dictionary;
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
  var pkg = require('./package.json');
  pkg.type = 'backend';
  return {
    main: function() {
      this.backend = new Memory(this._backend.options);
    },
    package: pkg
  };
};
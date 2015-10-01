# gengojs-default-memory

The default memory backend plugin for gengo.js.

[![Build Status](https://travis-ci.org/gengojs/plugin-backend.svg)](https://travis-ci.org/gengojs/plugin-backend)

This module will be used for [gengo.js](https://github.com/gengojs/gengojs).

An example usage with options is:

```js

var gengo = require('gengojs');
var backend = require('gengojs-default-memory');

/* In whatever framework you are using: */

// I'll use express for an example
// but it shouldn't matter

var app = require('express')();
app.use(gengo({
   // Specify the type
   // of option to modify
	backend:{
		/* options */
	}
},/*backend()*/));
```
The default backend is already included in gengojs so you should not have to require it.


## Options

```json
{
  "directory": "./locales",
  "extension": "json",
  "prefix": "",
  "cache": true
}
```

## Supported Extensions

The supported file types are:

* `.json`
* `.yaml`
* `.js`


## Internal API

* `find(locale:String)` returns the data by locale.
* `catalog(locale:String)` returns the catalog by locale or the entire catalog.

**Example**:

```js
// Plugin ship
function ship(){
	// Context
	this.backend.find('en');
	this.backend.catalog('ja');
}
```

## Dependencies

None

## Debug

Unix:

```bash
DEBUG=default-backend
```
Windows:

```bash
SET DEBUG=gengo.backend
```
## Contribute

Feel free to contribute or even fork the project. This plugin has been
written in ES6 and can be seen under `lib/index.js`.

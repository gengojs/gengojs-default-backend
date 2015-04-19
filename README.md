# gengojs-default-memory

The default memory backend plugin for gengojs.

This module will be used for the upcoming [gengo.js](https://github.com/iwatakeshi/gengojs) **1.0.0**.

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
## Internal API

`find(locale:String)` returns the data by locale.

**Example**:

```js
// Context
this.backend.find();
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
SET DEBUG=default-backend
```
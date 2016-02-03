#!/usr/bin/env node
'use strict';

// check to see which shell is currently running
// ps -o comm= -p $$

var co = require('co');
var fs = require('co-fs-extra');

module.exports = co.wrap(function(options) {
  console.log(process.cwd());
  try {
    // require()
  } catch(e) {}

  // console.log(fs.readFile('.dev-setup.sh'));
  // yield fs.readFile
  console.log('whatup');
});
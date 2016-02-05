#!/usr/bin/env node
'use strict';

// check to see which shell is currently running
// ps -o comm= -p $$

const co = require('co');
const fs = require('co-fs-extra');
const path = require('path');
const root = process.env.HOME;

const brew = require('./brew.js');

module.exports = co.wrap(function *devsetup(options) {
  let settings = require(path.join(__dirname, '.devsetup.js'));
  try {
    // console.log(path.join(root, '.devsetup', '.devsetup.js'));
    let user_settings = require(path.join(root, '.devsetup', '.devsetup.js'))

    Object.assign(settings, user_settings);
  } catch(e) { }


  yield brew(settings.brew)

  console.log('install ended yo');
});
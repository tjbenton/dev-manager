#!/usr/bin/env node
'use strict';

// check to see which shell is currently running
// ps -o comm= -p $$

const co = require('co');
// const fs = require('co-fs-extra');
const path = require('path');
const root = process.env.HOME;

const brew = require('./brew.js');
const npm = require('./npm.js');

module.exports = co.wrap(function *devsetup() {
  var settings = require(path.join(__dirname, '.devsetup.js'));
  try {
    const user_settings = require(path.join(root, '.devsetup', '.devsetup.js'));

    settings = Object.assign(settings, user_settings);
  } catch (err) {
    // do nothing because the user settings don't exist
  };

  yield [
    brew(settings.brew),
    npm(settings.brew)
  ];

  console.log('install ended yo');
});

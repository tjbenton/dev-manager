#!/usr/bin/env node
'use strict';

// check to see which shell is currently running
// ps -o comm= -p $$

const co = require('co');
const path = require('path');
const root = process.env.HOME;

const utils = require('./utils.js');
const chalk = require('chalk');

module.exports = co.wrap(function *devsetup(options) {
  options = options || {};
  options.path = options.path;
  // let settings = require(path.join(__dirname, '.devsetup.js'));

  options = {};
  options.plugins = [
    'apps',
    'hybrid'
  ];

  try {
    const plugins = loadPlugins(options.plugins || []);
    yield runPlugins(plugins);
  } catch (err) {
    console.log(chalk.red('Error:'), err.stack);
  } finally {
    console.log('');
    console.log('');
    console.log('');
    console.log('Install is complete');
    console.log('');
    console.log('');
    console.log('');
  }

  // try {
  //   const user_settings = require(path.join(root, '.devsetup', '.devsetup.js'));
  //
  //   settings = Object.assign(settings, user_settings);
  // } catch (err) {
  //   // do nothing because the user settings don't exist
  // };
});

const toString = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();

/* eslint complexity: 0 */
function loadPlugins(plugins) {
  let result = [];

  // loop through the plugins list and create a single array of commands
  for (let i = 0; i < plugins.length; i++) {
    let plugin = plugins[i];
    const type = toString(plugin);
    let plugin_path;

    if (type === 'string') {
      try {
        if (plugin[0] === '.') {
          plugin = require(path.join(__dirname, plugin));
        } else {
          try {
            // try to load the plugin from node package
            plugin_path = plugin;
            plugin = require(plugin);
          } catch (err) {
            plugin_path = path.join(__dirname, 'plugins', plugin);
            plugin = require(plugin_path);
          }
        }
      } catch (err) {
        console.log(chalk.red('Error loading plugin:'));
        console.error(err.stack);
      }
    } else if (type === 'object') {
      plugin = [ plugin ];
    } else if (type !== 'array') {
      console.log(chalk.red('Error:'), 'each plugin must be an array of objects or a single object');
    }

    // loop over each command in plugin and
    for (let z = 0; z < plugin.length; z++) {
      plugin[z].path = plugin_path;
      plugin[z].index = z;
    }

    // update the result with the plugins
    result = [].concat(result, plugin);
  }

  return result;
}


function *runPlugin(plugin) {
  try {
    // Try to run the `pre` defined in the plugin
    if (plugin.pre && plugin.list) {
      plugin.list = yield plugin.pre(plugin.list);
    }
  } catch (err) {
    console.log(
      chalk.red('Error:'), '\n',
      `running 'pre' function for ${chalk.yellow.bold(plugin.command)} in`, '\n',
      `index: ${plugin.index}`, '\n',
      `file: ${plugin.path}`, '\n',
      err.stack
    );

    // check to see if they want to continue with the install
    const question = yield utils.inquire.choose(
      `Would you like to continue with the full list in for ${plugin.command}`,
      [ 'yes', 'no' ],
      {
        timeout: 10000,
        timeout_message: 'Continued on because there was no answer after 10s',
        default: 'yes'
      }
    );

    if (question === 'yes') {
      return `${plugin.command} pre function was skipped because of an issue with it`;
    }

    process.exit();
  }

  try {
    if (plugin.list) {
      yield utils.runArray(
        plugin.command,
        plugin.list,
        'inherit',
        true
      );
    } else {
      yield utils.run(plugin.command, 'inherit', true);
    }
  } catch (err) {
    console.log(chalk.red('Error:\n'), err);
  }

  try {
    if (plugin.post) {
      yield plugin.post();
    }
  } catch (err) {
    console.log(
      chalk.red('Error:\n'),
      `There was an issue running the post function for ${plugin.command}`,
      err
    );
  }
}


// this is used to run all of the plugins
function *runPlugins(plugins) {
  const running = [];

  for (let i = 0; i < plugins.length; i++) {
    running.push(runPlugin(plugins[i]));
  }

  return yield running;
}



// do app specific cleaning before exiting
process.on('exit', () => {
  console.log('Exiting ...');
});

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('Ctrl-C...');
  process.exit(2);
});
// catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', (err) => {
  console.log(chalk.red('Error:'), 'Uncaught Exception...\n', err.stack);
  process.exit(99);
});

'use strict'

////
/// @name Run Plugins
/// @author Tyler Benton
/// @description
/// These functions are used to run each of the plugins
/// that are passed
////

import chalk from 'chalk'
import { inquire, runArray, run } from './utils.js'

/// @name runPlugins
/// @description
/// this is used to run all of the plugins
/// @async
/// @arg {array} - Accepts an array of objects
///
/// @returns {array/promises}
async function runPlugins(plugins) {
  const running = []

  for (let i = 0; i < plugins.length; i++) {
    running.push(runPlugin(plugins[i]))
  }

  return await Promise.all(running)
}

export default runPlugins


/// @name runPlugin
/// @description
/// A helper function to run a single plugin
/// @async
/// @arg {object} - Accepts the following object
/// ```js
/// {
///   plugins: [ {...} ], // plugins to run before the command
///   command: '', // the base command
///   list: [], // list of sub commands
///   async pre() {}, // runs before the command
///   async post() {}, // runs after the command is complete
///   path: '', // path to the plugin location
///   index: 0 // index of the command in the plugin
/// }
/// ```
async function runPlugin(plugin) {
  if (plugin.plugins) {
    await runPlugins(plugin.plugins)
  }

  if (plugin.pre && plugin.list) {
    try {
      // Try to run the `pre` defined in the plugin
      plugin.list = await plugin.pre(plugin.list)
    } catch (err) {
      console.log(
        chalk.red('Error:'), '\n',
        `running 'pre' function for ${chalk.yellow.bold(plugin.command)} in`, '\n',
        `index: ${plugin.index}`, '\n',
        `file: ${plugin.path}`, '\n',
        err.stack
      )

      // check to see if they want to continue with the install
      const question = await inquire.choose(
        `Would you like to continue with the full list in for ${plugin.command}`,
        [ 'yes', 'no' ],
        {
          timeout: 10000,
          timeout_message: 'Continued on because there was no answer after 10s',
          default: 'yes'
        }
      )

      if (question === 'yes') {
        return `${plugin.command} pre function was skipped because of an issue with it`
      }

      process.exit()
    }
  }

  try {
    if (plugin.list) {
      await runArray(
        plugin.command,
        plugin.list,
        'inherit',
        true
      )
    } else {
      await run(plugin.command, 'inherit', true)
    }
  } catch (err) {
    console.log(chalk.red('Error:\n'), err)
  }

  try {
    if (plugin.post) {
      await plugin.post(plugin.command, plugin.list)
    }
  } catch (err) {
    console.log(
      chalk.red('Error:\n'),
      `There was an issue running the post function for ${plugin.command}`,
      err
    )
  }
}

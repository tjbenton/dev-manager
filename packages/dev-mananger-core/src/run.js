'use strict'

////
/// @name Run Plugins
/// @author Tyler Benton
/// @description
/// These functions are used to run each of the plugins
/// that are passed
////

import chalk from 'chalk'
import utils from './utils'
const { inquire, execArray, exec } = utils
import { forEach } from 'async-array-methods'
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
export default async function run(plugin) {
  if (plugin.presets) {
    await forEach(plugin.presets, run)
  }

  if (plugin.plugins) {
    await forEach(plugin.plugins, run)
  }

  if (plugin.pre && plugin.list) {
    try {
      // Try to run the `pre` defined in the plugin
      plugin.list = await plugin.pre.call(utils, plugin.list)
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

      process.exit(1)
    }
  }

  try {
    if (plugin.list) {
      await execArray(
        plugin.command,
        plugin.list,
        'inherit',
        true
      )
    } else {
      await exec(plugin.command, 'inherit', true)
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

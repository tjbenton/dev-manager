'use strict'
/* eslint complexity: 0 */

import path from 'path'
import chalk from 'chalk'

const toString = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()

export default function loadPlugins(plugins) {
  let result = []

  // loop through the plugins list and create a single array of commands
  for (let i = 0; i < plugins.length; i++) {
    let plugin = plugins[i]
    const type = toString(plugin)
    let plugin_path

    if (type === 'string') {
      try {
        if (plugin[0] === '.') {
          plugin = require(path.join(__dirname, plugin))
        } else {
          try {
            // try to load the plugin from node package
            plugin_path = plugin
            plugin = require(`devsetup-${plugin}`)
          } catch (err) {
            // try to load the package from this repo
            plugin_path = path.join(__dirname, 'plugins', plugin)
            console.log(plugin_path)
            plugin = require(plugin_path)
          }
        }
      } catch (err) {
        console.log(chalk.red('Error loading plugin:'))
        console.error(err.stack)
      } finally {
        // this handles plugins that where written in es6
        // and compiled down to es5 with babel
        if (plugin.default) {
          plugin = plugin.default
        }
      }
    } else if (type === 'object') {
      plugin = [ plugin ]
    } else if (type !== 'array') {
      console.log(chalk.red('Error:'), 'each plugin must be an array of objects or a single object')
    }

    // loop over each command in plugin and
    for (let z = 0; z < plugin.length; z++) {
      plugin[z].path = plugin_path
      plugin[z].index = z
    }

    // update the result with the plugins
    result = [].concat(result, plugin)
  }

  return result
}

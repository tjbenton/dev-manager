'use strict'
/* eslint complexity: 0 */

import path from 'path'
import chalk from 'chalk'

const toString = (arg) => Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()

/// @name loadPlugins
/// @author Tyler Benton
/// @description
/// This is used to load the plugins to run
///
/// @arg {string, object, array} plugins - The plugins that you want to load
///
/// @returns {array} Returns a flat array of plugins
export default function load(objs, type) {
  if (
    toString(objs) === 'string' ||
    toString(objs) === 'object'
  ) {
    objs = [ objs ]
  }

  let result = []

  // loop through the plugins list and create a single array of commands
  for (let i = 0; i < objs.length; i++) {
    let obj = objs[i]
    const obj_type = toString(obj)
    let obj_path

    if (obj_type === 'string') {
      try {
        if (obj[0] === '.') {
          obj = require(path.join(__dirname, obj))
        } else {
          try {
            // try to load the obj from node package
            obj_path = obj
            obj = require(`devsetup-${type}-${obj}`)
          } catch (err) {
            // try to load the package from this repo
            obj_path = path.join(__dirname, type, obj)
            // console.log(obj_path)
            obj = require(obj_path)
          }
        }
      } catch (err) {
        console.log(chalk.red(`Error loading ${type}:`))
        console.error(err.stack)
      } finally {
        // this handles plugins that where written in es6
        // and compiled down to es5 with babel
        if (obj.default) {
          obj = obj.default
        }
      }
    } else if (obj_type === 'object') {
      obj = [ obj ]
    } else if (obj_type !== 'array') {
      console.log(chalk.red('Error:'), 'each plugin must be an array of objects or a single object')
    }

    // loop over each command in plugin and add their path
    // and their index in the plugin
    for (let z = 0; z < obj.length; z++) {
      const item = obj[z]
      obj[z].path = obj_path
      obj[z].index = z

      if (item.plugins) {
        obj[z].plugins = load(item.plugins)
      }

      if (item.presets) {
        obj[z].presets = load(item.presets)
      }
    }

    console.log(`Queued ${chalk.yellow(path.basename(obj_path))}`)

    // update the result with the plugins
    result = [].concat(result, obj)
  }

  return result
}

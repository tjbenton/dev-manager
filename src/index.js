'use strict'

// check to see which shell is currently running
// ps -o comm= -p $$
import loadPlugins from './load-plugins.js'
import runPlugins from './run-plugins.js'
import chalk from 'chalk'
import utils from './utils.js'
export { utils } // allows all the utils to be used

export default async function devsetup(options) {
  options = options || {}
  options.path = options.path
  // let settings = require(path.join(__dirname, '.devsetup.js'))

  options = {}
  options.plugins = [
    'apps'
    // 'hybrid-development'
  ]

  try {
    const plugins = loadPlugins(options.plugins || [])
    await runPlugins(plugins)
  } catch (err) {
    console.log(chalk.red('Error:'), err.stack)
  } finally {
    console.log('')
    console.log('')
    console.log('Install is complete')
    console.log('')
    console.log('')
  }

  // try {
  //   const user_settings = require(path.join(root, '.devsetup', '.devsetup.js'));
  //
  //   settings = Object.assign(settings, user_settings);
  // } catch (err) {
  //   // do nothing because the user settings don't exist
  // }
}


// do app specific cleaning before exiting
process.on('exit', () => {
  console.log('Exiting ...')
})

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('Ctrl-C...')
  process.exit(2)
})
// catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', (err) => {
  console.log(chalk.red('Error:'), 'Uncaught Exception...\n', err.stack)
  process.exit(99)
})

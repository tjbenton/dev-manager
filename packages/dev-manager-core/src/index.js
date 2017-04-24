'use strict'

// check to see which shell is currently running
// ps -o comm= -p $$
import load from './load.js'
import chalk from 'chalk'
import run from './run.js'
import { forEach } from 'async-array-methods'

export default async function devManager(options = { config: '', presets: [], plugins: [] }) {
  // let settings = require(path.join(__dirname, '.dev-manager.js'))

  try {
    const presets = load(options.presets, 'preset')
    const plugins = load(options.plugins, 'plugin')
    await forEach(presets, run)
    await forEach(plugins, run)
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
  //   const user_settings = require(path.join(root, '.dev-mananger', '.dev-mananger.js'));
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

'use strict'

import program from 'commander'
import devsetup from './index.js'
import pkg from '../package.json'

export default function cli() {
  function toList(plugins) {
    return plugins.split(',').map((plugin) => plugin.trim())
  }

  program
    .version(pkg.version)
    .option('-c, --config [path]', 'Path to your `.devsetup.js`', '')
    .option(`-p, --plugins '<names>'`, 'Comma seperated list of plugins', toList, [])
    .parse(process.argv)

  const {
    config,
    plugins
  } = program

  devsetup({
    config,
    plugins
  })
}

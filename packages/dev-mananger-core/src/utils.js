'use strict'
import child_process from 'child_process'
import chalk from 'chalk'
import inquire from 'inquirer-promise'

export function delay(time) {
  return new Promise((fullfill) => setTimeout(fullfill, time))
}

inquire.choose = function choose(message, choices, options) {
  return new Promise((resolve, reject) => {
    const question = inquire.list(message, choices, options)
    if (options.timeout && options.default) {
      const timeout = delay(options.timeout)
        .then(() => {
          process.stdin.resume()
          const timeout_message = options.timeout_message || options.timeoutMessage || options.timeoutmessage || ''
          process.stdout.write(timeout_message + '\n')
          return options.default
        })

      Promise
        .race([ timeout, question ])
        .then(resolve)
        .catch(reject)
    } else {
      question
        .then(resolve)
        .catch(reject)
    }
  })
}

export { inquire }

import fs from 'fs-extra-promisify'

export async function execArray(command, array, stdio, log) {
  try {
    const commands = []
    if (array.length) {
      for (let i = 0; i < array.length; i++) {
        commands.push(exec(command.trim() + ' ' + array[i], stdio, log))
      }

      return await Promise.all(commands)
    }

    return commands
  } catch (err) {
    console.error(err)
  }
}

/// @name run
/// @description
/// Helper function to command line commands from node in an async way
/// @arg {string} command - The command you're wanting to run
/// @arg {string, array, boolean} stdio ['inherit'] -
///  - 'inherit' will let the command that you run to have control over what's output
///  - 'pipe' will take over the `process.stdout`. This can cause issues if the commands you're running have questions or action items.
/// @arg {boolean} log [false] - Determins if you want output the stdout or not. Only applies if `stdio` is set to 'pipe'
export function exec(command, stdio, log) {
  // enviroment to use where the commands that are run
  // will output in full color
  const env = process.env
  env.NPM_CONFIG_COLOR = 'always'

  // this lets the command that was run to determin
  // how the information is output
  // http://derpturkey.com/retain-tty-when-using-child_proces-spawn/
  if (stdio === false) {
    stdio = 'pipe'
  } else if (stdio === true) {
    stdio = 'inherit'
  }
  stdio = stdio || 'inherit'

  log && console.log('Started:', chalk.yellow.bold(command))
  process.stdin.setRawMode(true)
  process.stdin.setEncoding('utf8')

  command = command.split(' ')
  const args = command.slice(1)
  command = command[0]


  return new Promise((resolve, reject) => {
    const child = child_process.spawn(command, args, { env, stdio })

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        data = (data + '').split('\n').filter(Boolean).join('\n')
        log && process.stdout.write(data)
        resolve(data)
      })
    }

    if (child.stderr) {
      child.stderr.on('data', (err) => {
        err = (err + '').split('\n').filter(Boolean).join('\n')
        console.error(chalk.red('[Error]:'), err)
        reject(err)
      })
    }

    child.on('close', (code) => {
      let full_command = `${command} ${args.join(' ')}`
      if (code === 0) {
        resolve()
        full_command = chalk.green.bold(full_command)
      } else {
        reject(code)
        full_command = chalk.red.bold(full_command)
      }

      log && console.log('Finished:', full_command)
    })
  })
}

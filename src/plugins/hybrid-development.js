'use strict'
import { run } from '../utils.js'

export default [
  {
    command: 'npm install -g --depth=0 --progress=false',
    list: [
      'appium',
      'cordova',
      'ember-cli',
      'imageoptim-cli',
      'ionic',
      'nativescript',
      'plugman', // used by cordova
    ],
    async pre(list) {
      var installed = await run('npm ls -g --depth=0', false)

      installed = installed
        .split('\n')
        .map((obj) => {
          obj = obj.split(' ')[1]
          return obj ? obj.split('@') : false
        })
        .filter(Boolean)

      // filter out any packages that are already installed
      // because they will be updated
      return list.filter((obj) => installed.indexOf(obj) < 0)
    },
    async post() {
      console.log('Updating existing npm packages')
      await run('npm update -g')
      console.log('Hybrid npm packages have finished installing')
    }
  }
]

'use strict'
import utils from '../utils.js'

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
    *pre(list) {
      var installed = yield utils.run('npm ls -g --depth=0', false)

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
    *post() {
      console.log('Updating existing npm packages')
      yield utils.run('npm update -g')
      console.log('Hybrid npm packages have finished installing')
    }
  }
]

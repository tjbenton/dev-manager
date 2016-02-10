'use strict'

import { run } from '../utils.js'

export default [
  {
    command: 'brew cask install',
    pre: async function pre(list) {
      var installed = await run('brew cask list', false)
      return list.map((obj) => {
        if (typeof obj === 'string') {
          return installed.indexOf(obj.split(' ')[0]) < 0 ? obj : false
        }

        // is an object
        return installed.indexOf(obj[0]) < 0 ? obj[1] : false
      })
      .filter(Boolean)
    },
    list: [
      'ios-console', // @remove
      'alfred',
      'atom',
      'betterzipql',
      'brackets',
      'breach',
      'caffeine',
      'cheatsheet',
      'couchbase-server-enterprise',
      'cyberduck',
      'dash',
      'dockertoolbox',
      'dropbox',
      'evernote',
      'filezilla',
      'firefox',
      'font-inconsolata',
      'font-source-code-pro',
      'font-source-sans-pro',
      'font-source-serif-pro',
      'fontprep',
      'gas-mask',
      'ghostlab',
      'gifrocket',
      'github-desktop',
      'gitter',
      'google-chrome',
      'google-chrome-canary',
      'google-drive',
      'handbrake',
      'imagealpha',
      'imageoptim',
      'iterm2',
      'java',
      'kaleidoscope',
      'keycastr',
      'livereload',
      'miro-video-converter',
      'modmove',
      'nsregextester',
      'opera',
      // 'opera-developer',
      'qlmarkdown',
      'qlprettypatch',
      'quicklook-csv',
      'quicklook-json',
      'recordit',
      'reggy',
      'screenhero',
      'sketch',
      'sketch-toolbox',
      'skype',
      'slack',
      'smcfancontrol',
      'spectacle',
      'spotify',
      'sublime-text',
      'the-unarchiver',
      'totalterminal',
      'tower',
      'uninstallpkg',
      'vagrant',
      'vagrant-manager',
      'virtualbox',
      'vlc',
    ]
  }
]

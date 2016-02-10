'use strict'
import { run } from '../utils.js'

export default [
  {
    command: 'apm install',
    async pre(list) {
      // filter out already installed packages
    },
    list: [
      'Atom-Syntax-highlighting-for-Sass',
      'Stylus',
      'Sublime-Style-Column-Selection',
      'angularjs',
      'atom-beautify',
      'atom-css-comb',
      'atom-flat-ui',
      'atom-jade',
      'atom-material-syntax',
      'atom-material-ui',
      'atom-pair',
      'auto-update-packages',
      'change-case',
      'define-jump',
      'docblockr',
      'emmet',
      'es6-javascript',
      'file-icons',
      'fold-comments',
      'fold-functions',
      'git-diff-details',
      'git-plus',
      'highlight-selected',
      'hyperclick',
      'incremental-search',
      'language-SCSS',
      'language-babel',
      'language-cfml',
      'linter',
      'linter-eslint',
      'linter-scss-lint',
      'linter-stylint',
      'merge-conflicts',
      'multi-cursor-plus',
      'node-debugger',
      'npm-install',
      'oceanic-next',
      'open-git-modified-files',
      'pigments',
      'polychrome-ui',
      'preview-plus',
      'remember-session',
      'seti-syntax',
      'seti-ui',
      'sort-lines',
      'terminal-status',
      'toggle-quotes',
      'trendy-dark-syntax',
      'trendy-light-ui',
      'unsaved-changes',
      'white-cursor'
    ]
  }
]

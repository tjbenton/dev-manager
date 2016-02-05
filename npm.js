const co = require('co')
const utils = require('./utils.js')


module.exports = co.wrap(function *npm(packages) {
  // const installed = yield utils.run('npm ls -g --depth=0')

  // console.log(installed);
  // // tap anything that doesn't exsist
  // yield utils.runArray('npm tap', filter(installed.taps, packages.taps), true);
  //
  // // install any casks or formulas that aren't installed already
  // yield [
  //   utils.runArray('brew install', filter(installed.formulas, packages.formulas), true),
  //   utils.runArray('brew cask install', filter(installed.casks, packages.casks), true)
  // ];
});


function *updateNpm() {

}

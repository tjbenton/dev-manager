const co = require('co');
const utils = require('./utils.js');

var global = {
  attempts: 0
};

module.exports = co.wrap(function *brew(packages) {
  try {
    var installed = yield {
      taps: utils.toArray('brew tap'),
      formulas: utils.toArray('brew list'),
      casks: utils.toArray('brew cask list')
    };


    var bad_packages = {
      formulas: checkForBadPackages(installed.formulas, packages.formulas),
      casks: checkForBadPackages(installed.casks, packages.casks)
    };

    var bad_question = 'you have some oudated casks installed would you like to uninstall them? (y/N)';
    var bad_question_options = {
      pattern: /^(?:y|n).+$/i,
      timeout: 10000,
      before: (input) => input[0].toLowerCase() === 'y',
      default: 'no'
    };

    if (bad_packages.formulas.length) {
      var bad_formulas_question = yield utils.prompt(bad_question, bad_question_options);

      if (bad_formulas_question) {
        yield utils.runArray('brew uninstall', bad_packages.formulas);
      }
    }

    if (bad_packages.casks.length) {
      var bad_casks_question = yield utils.prompt(bad_question, bad_question_options);

      if (bad_casks_question) {
        yield utils.runArray('brew cask uninstall', bad_packages.casks);
      }
    }

    // tap anything that doesn't exsist
    yield utils.runArray('brew tap', filter(installed.taps, packages.taps), true);

    // install any casks or formulas that aren't installed already
    yield [
      utils.runArray('brew install', filter(installed.formulas, packages.formulas), true),
      utils.runArray('brew cask install', filter(installed.casks, packages.casks), true)
    ];

    // update all things brew
    yield updateBrew();

    console.log('brew ended yo');
  } catch (err) {
    console.log(err);
    console.log('something went wrong with brew install. attempting to fix the problem');
    try {
      // remove outdated taps are no longer supported for casks
      yield utils.runArray('brew untap', [
        'caskroom/versions',
        'phinze/cask',
        'caskroom/cask'
      ], true);

      // brew-cask is oudated and come
      yield utils.run('brew uninstall --force brew-cask;', true);

      yield updateBrew();

      // rerun the brew install
      if (global.attempts++ < 2) {
        brew(packages);
      }
    } catch (error) {
      console.log(
        'Attempted to fix any problems with the brew install but was unsuccessful.',
        'Please see the error message below and try to fix.'
      );
      console.error(error);
    }
  }
});

function checkForBadPackages(installed, packages) {
  installed = getBadPackages(installed);
  var result = [];

  if (!installed.length) {
    return result;
  }

  for (var i = 0; i < installed.length; i++) {
    if (packages.indexOf(installed[i]) > -1) {
      result.push(installed[i]);
    }
  }

  return result;
}
function getBadPackages(packages) {
  return packages
    .filter((item) => item.indexOf('(!)') > -1)
    .map((item) => item.split(' ')[0]);
}


// this updates all things brew
function *updateBrew() {
  try {
    yield utils.run('brew update', true);
    yield utils.run('brew upgrade --all', true);
    yield utils.runArray('brew', [
      'cleanup',
      'cask cleanup'
    ], true);
    console.log('brew was successfully updated');
  } catch (err) {
    console.error(err);
  }
}


function filter(installed, to_install) {
  return to_install.map((obj) => {
    if (typeof obj === 'string') {
      return installed.indexOf(obj.split(' ')[0]) < 0 ? obj : false;
    }

    // is an object
    return installed.indexOf(obj[0]) < 0 ? obj[1] : false;
  })
  .filter(Boolean);
}

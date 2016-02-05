const shell = require('child_process');


const inquire = require('inquirer-promise');

function delay(time) {
  return new Promise((fullfill) => setTimeout(fullfill, time));
}

inquire.choose = function choose(message, choices, options) {
  return new Promise((resolve, reject) => {
    const question = inquire.list(message, choices, options);
    if (options.timeout && options.default) {
      const timeout = delay(options.timeout)
        .then(() => {
          process.stdin.pause();
          var timeout_message = options.timeout_message || options.timeoutMessage || options.timeoutmessage || '';
          process.stdout.write(timeout_message + '\n');
          return options.default;
        });

      Promise
        .race([ timeout, question ])
        .then(resolve)
        .catch(reject);
    } else {
      question
        .then(resolve)
        .catch(reject);
    }
  });
};


function *toArray(command) {
  return (yield run(command)).split('\n').filter(Boolean);
}


function *runArray(command, array, log) {
  try {
    var commands = [];
    if (array.length) {
      for (var i = 0; i < array.length; i++) {
        commands.push(run(command.trim() + ' ' + array[i], log));
      }

      return yield commands;
    }

    return commands;
  } catch (err) {
    console.error(err);
  }
}


function run(command, log) {
  log && console.log('started:', command);

  return new Promise((resolve, reject) => {
    shell.exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(stderr);
        return;
      }

      resolve(stdout);
      log && console.log(stdout.split('\n').filter(Boolean).join('\n'));
      log && console.log('finished:', command, '\n');
    });
  });


  // command = command.split(' ');
  // var args = command.slice(1);
  // command = command[0];
  //
  //
  // return new Promise((resolve, reject) => {
  //   var current = shell.spawn(command, args);
  //   current.stdout.on('data', (data) => {
  //     data += '';
  //     data = data.split('\n').filter(Boolean).join('\n');
  //     log && console.log(data);
  //     resolve(data);
  //   });
  //
  //   current.stderr.on('data', (err) => {
  //     err += '';
  //     err = err.split('\n').filter(Boolean).join('\n');
  //     console.error(err);
  //     reject(err);
  //   });
  //
  //   current.on('close', (code) => {
  //     if (code === 0) {
  //       log && console.log('finished:', command, args.join(' '), '\n');
  //       resolve();
  //     } else {
  //       reject(code);
  //     }
  //   });
  // });
};


/* eslint
   object-shorthand: 0
*/
module.exports = {
  toArray: toArray,
  runArray: runArray,
  run: run,
  inquire: inquire,
  delay: delay
};

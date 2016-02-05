const shell = require('child_process');


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


  command = command.split(' ');
  var args = command.slice(1);
  command = command[0];


  return new Promise((resolve, reject) => {
    var current = shell.spawn(command, args);
    current.stdout.on('data', (data) => {
      data += '';
      data = data.split('\n').filter(Boolean).join('\n');
      log && console.log(data);
      resolve(data);
    });

    current.stderr.on('data', (err) => {
      err += '';
      err = err.split('\n').filter(Boolean).join('\n');
      console.error(err);
      reject(err);
    });

    current.on('close', (code) => {
      if (code === 0) {
        log && console.log('finished:', command, args.join(' '), '\n');
        resolve();
      } else {
        reject(code);
      }
    });
  });
};


var stdin = stdin;
var stdout = stdout;

function prompt(question, options) {
  stdin.setRawMode(true);
  options = Object.assign({
    pattern: /^(?:y|n).*$/,
    error: (input) => input + 'is incorrect, You must enter a value that matches `' + options.pattern.toString() + '`',
    default: undefined,
    timeout: undefined,
    silent: false,
    before: (input) => input
  }, options || {});

  var timeout;

  return new Promise((resolve, reject) => {
    stdout.write(question);
    stdin.setEncoding('utf8');

    if (
      options.timeout !== undefined &&
      options.default !== undefined
    ) {
      timeout = setTimeout(() => {
        stdout
          .write('\n' + options.default + ': because there wasn\'t an answer after ' + options.timeout + 'ms');

        stdin.pause();
        resolve(options.default);
      }, options.timeout);
    }

    stdin
      .once('data', (answer) => {
        clearTimeout(timeout);

        if (
          (answer.length - 1) === 0 &&
          options.default !== undefined
        ) {
          answer = options.default;
        }

        if (options.pattern && !options.pattern.test(answer)) {
          stdout.write(options.error(answer));
          prompt(question, options);
        } else {
          if (!options.silent) {
            stdout.write(answer);
          }

          resolve(options.before(answer));
          stdin.pause();
        }
      })
      .resume();
  });
};


module.exports = {
  toArray: toArray,
  runArray: runArray,
  run: run,
  prompt: prompt
}

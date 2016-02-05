var stdin = stdin;
var stdout = stdout;

exports = module.exports = function prompt(question, options) {
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

const chalk = require('chalk')
const handleError = require('./util/handleError');

exports.command = 'dddd';
exports.describe = 'Build landscape of dependencies\' scores from npms.io ';
exports.builder = (yargs) =>
  yargs
    .strict()
    .demand()
    .options({
      go : {
        alias: 'g',
        describe: 'Another hting'
      },
      recommend : {
        alias: 'h',
        describe: 'recommend shit that dont'
      }

    });

    exports.handler = (args) => {
      console.log('ffffff')
      console.log('this one doesnt do shit right?')
    }

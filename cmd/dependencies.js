const chalk = require('chalk')
const handleError = require('./util/handleError');

exports.command = 'score';
exports.describe = 'here is a description';
exports.builder = (yargs) =>
  yargs
    .strict()
    .demand()
    .options({
      go : {
        alias: 'g',
        describe: 'Another hting'
      }
    });

    exports.handler = (args) => {
      console.log('ffffff')
    }

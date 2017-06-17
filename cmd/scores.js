const chalk = require('chalk')
const server = require('../server/server')

exports.command = '-pkgs';
exports.describe = 'Add NPM packages to be evaluated' ;
exports.builder = (yargs) =>
  yargs
    .strict()
    //.demand()
    .options({
      work : {
        alias: 'p',
        describe: 'Another thing'
      },
      recommend : {
        alias: 'r',
        describe: 'dddd'
      }
    });

    exports.handler = (argv) => {
      server.run(argv)

      //return if logged stuff
    }

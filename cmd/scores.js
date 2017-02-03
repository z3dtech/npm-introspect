const chalk = require('chalk')
const handleError = require('./util/handleError');
const requestData = require('../server/requestData')

exports.command = 'score';
exports.describe = 'Build landscape of dependencies\' scores from npms.io' ;
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
      requestData.go()
      //return
    }

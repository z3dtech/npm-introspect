#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const server = require('./server/server')

updateNotifier({pkg}).notify();

const args =   yargs
  .usage('Usage: launch [options]')
  .command('launch', 'Launches visualization of package.json',
      (argv) => {
        console.log('///////////////////////////////////////////')
        console.log(argv.argv)
          server.run(argv)
        })
  .example('launch -n react -p 5000', 'add additional packages to the visualization')
  .option('n', {
    alias: 'names',
    describe: 'Names of additional packages to visualize',
    nargs: 1,
    default: '',
  })
  .option('p', {
    alias: 'port',
    describe: 'Specify port to use',
    nargs: 1,
    default: 8080,
  })
  .help('h')
  .alias('h', 'help')
  .argv;

  // exports.handler = (argv) => {
  //   server.run(argv)
  // }

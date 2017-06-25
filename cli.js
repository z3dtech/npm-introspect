#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const server = require('./server/server')

updateNotifier({pkg}).notify();

const args =  yargs
  .usage("futureName [additional packages] [port]")
  .example("react redux mocha -p 5000")
  .option('l', {
    alias: 'less',
    describe: 'Skip visualization and output data',
    default: false
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

  server.run(args)

#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const server = require('./server/server')

updateNotifier({pkg}).notify();

const args =  yargs
  .usage("Usage: additional packages to visualize -p 8080") //make proper usage string 
  .example("react redux mocha -p 5000")
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

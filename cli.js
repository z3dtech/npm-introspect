#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const check = require('check-node-version');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const server = require('./server/server')

const wanted = {node: "6.4.0"};

updateNotifier({pkg}).notify();

const args =  yargs
  .usage("introspect [additional packages] [port]")
  .example("introspect react redux mocha -p 5000")
  .example("introspect -less")
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

check( wanted, function(error, result){
  if(error){
    throw 'While checking for correct node version there has been an error'
  }
  if (result.node.version.major < 6 ){
    console.log('This package requires node -v ≥ 6.4.0, please update to run')
    process.exit(1)
  }
  else{
    server.run(args)
  }
});

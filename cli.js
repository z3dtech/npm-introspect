#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const requestData = require('./cmd/requestData');

updateNotifier({pkg}).notify();

yargs
  .strict()
  .wrap(Math.min(80, yargs.terminalWidth()))
  .alias('help', 'h')
  .help('help')
  //.demand()
  //.option()

  .command(require('./cmd/requestData'))

  .argv;

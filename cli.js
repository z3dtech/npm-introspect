#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');


updateNotifier({pkg}).notify();

yargs
  .strict()
  .wrap(Math.min(80, yargs.terminalWidth()))
  .alias('version', 'v')
  .version(pkg.version)
  .alias('help', 'h')
  .help('help')
  .demand(1, 'Please supply a valid command')

  .option('color', {
      describe: 'Allows disabling or enabling colored output',
      type: 'boolean',
      default: true,
      global: true,
  })


  .command(require('./cmd/scores'))
  .command(require('./cmd/dependencies'))

  .argv;

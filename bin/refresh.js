#! /usr/bin/env node
// @flow
/* global require */
/* eslint-disable import/no-commonjs */

const yargs = require('yargs');
const r = require('ramda');
const sherlook = require('../dist/sherlook');

yargs
  .boolean('verbose')
  .string('config')
  .string('key');

const options = r.pipe(
  r.unless(
    r.always(r.isNil(yargs.argv.verbose)),
    r.assoc('verbose', yargs.argv.verbose),
  ),
  r.unless(
    r.always(r.isNil(yargs.argv.config)),
    r.assoc('config', yargs.argv.config),
  ),
  r.unless(
    r.always(r.isNil(yargs.argv.key)),
    r.assoc('key', yargs.argv.key),
  ),
)({});

sherlook(options).refresh();

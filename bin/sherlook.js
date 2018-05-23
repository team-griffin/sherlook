#! /usr/bin/evn node
/* global require __dirname */
/* eslint-disable import/no-commonjs */
const yargs = require('yargs');
const { spawn } = require('child_process');
const path = require('path');
const r = require('ramda');

yargs
  .boolean('verbose')
  .alias('v', 'verbose')
  .string('config')
  .alias('c', 'config')
  .boolean('debug');

const type = yargs.argv._[0];
const key = yargs.argv._[1];
const verbose = yargs.argv.verbose;
const config = yargs.argv.config;
const isTest = r.always(type === 'test');

if (!type) {
  throw new Error('You must provide a command');
}

if ([ 'refresh', 'test' ].includes(type) === false) {
  throw new Error(`Invalid command ${type}`);
}

const entry = r.pipe(
  (type) => `./${type}.js`,
  r.append(r.__, []),
  r.prepend(__dirname),
  r.apply(path.join),
)(type);

const cmd = r.ifElse(
  isTest,
  r.always('npx'),
  r.always('node'),
)(null);

const addFlag = (key, value) => r.unless(
  r.always(r.isNil(value)),
  r.append(`--${key}=${value}`),
);

const args = r.pipe(
  r.when(
    isTest,
    r.append('mocha'),
  ),
  r.append(entry),
  r.when(
    r.always(yargs.argv.debug),
    r.append('--inspect-brk'),
  ),
  addFlag('verbose', verbose),
  addFlag('key', key),
  addFlag('config', config),
)([]);

spawn(cmd, args, {
  stdio: 'inherit',
});

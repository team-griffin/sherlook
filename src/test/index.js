// @flow
import type {
  Logger,
  Config,
  CaptureTests,
} from '../common';
import typeof {
  it as It,
  describe as Describe,
  before as Before,
  after as After,
} from 'mocha';
import typeof Fs from 'fs';
import typeof PixelDiffType from 'pixel-diff';
import typeof Mkdirp from 'mkdirp';
import typeof Rimraf from 'rimraf';

import _capture, {
  type Capture,
} from './capture';
import _generateTests, {
  type GenerateTests,
} from './generateTests';
import _runTest, {
  type RunTest,
} from './runTest';
import _setup, {
  type Setup,
} from './setup';
import _teardown, {
  type Teardown,
} from './teardown';
import _test, {
  type Test,
} from './test';
import _verify, {
  type Verify,
} from './verify';

export type {
  Capture,
  GenerateTests,
  RunTest,
  Setup,
  Teardown,
  Test,
  Verify,
};

const composite = (
  logger: Logger,
  config: Config,
  captureTests: CaptureTests,
  it: It,
  describe: Describe,
  before: Before,
  after: After,
  fs: Fs,
  PixelDiff: PixelDiffType,
  mkdirp: Mkdirp,
  rimraf: Rimraf,
) => {
  const capture = _capture(logger, captureTests, config);
  const runTest = _runTest(logger, config, PixelDiff);
  const generateTests = _generateTests(logger, config, it, runTest);
  const setup = _setup(logger, mkdirp, config);
  const teardown = _teardown(logger, config, rimraf);
  const verify = _verify(logger, fs, config);
  const test = _test(
    logger,
    config,
    describe,
    before,
    after,
    setup,
    verify,
    capture,
    generateTests,
    teardown,
  );

  return test;
};

export default composite;

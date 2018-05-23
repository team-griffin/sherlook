// @flow
import type {
  Tests,
  Config,
  Logger,
} from '../common';
import {
  typeof it as It,
} from 'mocha';
import type { RunTest } from './';

import path from 'path';
import * as r from 'ramda';

export type GenerateTests = (tests: Tests) => void;

const generateTests = (
  logger: Logger,
  config: Config,
  it: It,
  runTest: RunTest,
): GenerateTests => (tests) => {
  logger.debug('[generateTests]');

  const dir = path.resolve(config.outputDirectory);

  r.forEach((test) => {
    it(test.key, runTest(test, dir));
  }, tests);
};

export default generateTests;

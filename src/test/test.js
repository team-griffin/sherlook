// @flow
import type {
  Logger,
  Config,
} from '../common';
import type {
  Setup,
  Verify,
  Capture,
  GenerateTests,
  Teardown,
} from './';
import {
  typeof describe as Describe,
  typeof before as Before,
  typeof after as After,
} from 'mocha';

import * as r from 'ramda';

export type Test = () => void;

const TIMEOUT = 1000 * 60 * 60;

const test = (
  logger: Logger,
  config: Config,
  describe: Describe,
  before: Before,
  after: After,
  setup: Setup,
  verify: Verify,
  capture: Capture,
  generateTests: GenerateTests,
  teardown: Teardown,
): Test => () => {
  logger.debug('[test]');

  describe('sherlook', function() {
    before(function() {
      // eslint-disable-next-line no-invalid-this
      this.timeout(TIMEOUT);

      // $FlowFixMe
      const f: Fluture<*, *> = r.pipe(
        setup,
        r.map(r.always(config.tests)),
        r.chain(verify),
        r.chain(capture),
      )(null);

      return f.promise();
    });

    generateTests(config.tests);

    after(function() {
      return teardown().promise();
    });
  });
};

export default test;

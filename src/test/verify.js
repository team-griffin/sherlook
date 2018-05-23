// @flow
import type {
  Logger,
  Config,
  Tests,
} from '../common';
import typeof Fs from 'fs';

import path from 'path';
import Future from 'fluture';
import * as r from 'ramda';

export type Verify = (tests: Tests) => Fluture<*, Tests>;

const verify = (
  logger: Logger,
  fs: Fs,
  config: Config,
): Verify => (tests) => {
  logger.debug('[verify]');

  return Future.try(() => {
    const dir = path.resolve(config.outputDirectory);

    r.forEach((test) => {
      const filename = `${test.key}.png`;
      const target = path.join(dir, filename);

      try {
        fs.statSync(target);
      } catch (e) {
        if (e.code === 'ENOENT') {
          throw new Error(`There is no existing snapshot for test "${test.key}"
Please use sherlook refresh "${test.key}" to generate an initial snapshot`);
        } else {
          throw e;
        }
      }
    }, tests);

    return tests;
  });
};

export default verify;

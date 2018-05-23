// @flow
import type {
  CaptureTests,
  Config,
  Logger,
  Tests,
} from '../common';

import path from 'path';
import * as r from 'ramda';

export type Capture = (tests: Tests) => Fluture<*, Tests>;

const capture = (
  logger: Logger,
  captureTests: CaptureTests,
  config: Config,
): Capture => (
  tests,
) => {
  logger.debug('[capture]');

  if (config.key) {
    logger.info(`only capturing ${config.key}`);
  }

  const dir = r.pipe(
    r.prop('outputDirectory'),
    path.resolve,
    r.curryN(2, path.join)(r.__, 'tmp'),
  )(config);

  return captureTests(tests, dir).map(r.always(tests));
};

export default capture;

// @flow
import typeof Rimraf from 'rimraf';
import type {
  Config,
  Logger,
} from '../common';

import path from 'path';
import Future from 'fluture';

export type Teardown = () => Fluture<*, void>;

const teardown = (
  logger: Logger,
  config: Config,
  rimraf: Rimraf,
): Teardown => () => {
  logger.debug('[teardown]');
  const rimrafF = Future.encaseN(rimraf);
  const dir = path.resolve(config.outputDirectory);
  const tmp = path.join(dir, 'tmp');

  logger.info(`Deleting ${tmp}`);

  return rimrafF(tmp);
};

export default teardown;

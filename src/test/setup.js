// @flow
import typeof Mkdirp from 'mkdirp';
import type {
  Config,
  Logger,
} from '../common';

import path from 'path';
import Future from 'fluture';
import * as r from 'ramda';

export type Setup = () => Fluture<*, void>;

const setup = (
  logger: Logger,
  mkdirp: Mkdirp,
  config: Config,
): Setup => () => {
  logger.debug('[setup]');

  const mkdirF = Future.encaseN(mkdirp);
  const dir = path.resolve(config.outputDirectory);
  const tmp = path.join(dir, 'tmp');
  const diff = path.join(dir, 'diff');

  logger.info(`creating ${tmp}`);
  logger.info(`creating ${diff}`);

  const makeTmp = mkdirF(tmp);
  const makeDiff = mkdirF(diff);

  return r.pipe(
    r.chain(r.always(makeDiff)),
  )(makeTmp);
};

export default setup;

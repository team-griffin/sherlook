// @flow
import typeof Mkdirp from 'mkdirp';
import type {
  CaptureTests,
  Config,
  Logger,
} from '../common';

import path from 'path';
import Future from 'fluture';
import * as r from 'ramda';

export type Refresh = () => Promise<void>;

const fold = r.curryN(3, (
  left: Function,
  right: Function,
  future: Fluture<*, *>,
) => {
  return future.fold(left, right);
});

const refresh = (
  logger: Logger,
  captureTests: CaptureTests,
  config: Config,
  mkdirp: Mkdirp,
  process: Object,
// $FlowFixMe - dodgy chain definition + invoker = blurgh
): Refresh => () => {
  logger.debug('[refresh]');

  logger.log('Refresh snapshots');
  const mkdirf = Future.encaseN(mkdirp);

  if (config.key != null) {
    logger.log(`only refreshing ${config.key}`);
  }

  const dir = path.resolve(config.outputDirectory);
  const tests = config.tests;

  const makeDirectoryF = mkdirf(dir);
  const captureTestsF = captureTests(
    tests,
    dir,
  );

  return r.pipe(
    r.chain(r.always(captureTestsF)),
    fold((err) => {
      logger.error(err);
      process.exit(1);
    }, r.identity),
    r.invoker(0, 'promise'),
  )(makeDirectoryF);
};

export default refresh;

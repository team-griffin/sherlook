// @flow
import typeof Mkdirp from 'mkdirp';
import type {
  Logger,
  CaptureTests,
  Config,
} from '../common';
import _refresh, {
  type Refresh,
} from './refresh';

export type { Refresh };

const composite = (
  mkdirp: Mkdirp,
  logger: Logger,
  captureTests: CaptureTests,
  config: Config,
  process: Object,
) => {
  const refresh = _refresh(
    logger,
    captureTests,
    config,
    mkdirp,
    process,
  );

  return refresh;
};

export default composite;

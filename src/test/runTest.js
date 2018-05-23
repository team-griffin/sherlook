// @flow
import type {
  Test,
  Logger,
  Config,
} from '../common';
import typeof PixelDiffType from 'pixel-diff';

import path from 'path';
import * as r from 'ramda';

export type RunTest = (
  test: Test,
  outputDirectory: string,
) => () => Promise<void>;

const runTest = (
  logger: Logger,
  config: Config,
  PixelDiff: PixelDiffType,
): RunTest => (
  test,
  dir,
) => async function() {
  logger.debug('[runTest]');
  // eslint-disable-next-line no-invalid-this
  this.timeout(10000);

  const filename = `${test.key}.png`;
  const original = path.join(dir, filename);
  const tmp = path.join(dir, 'tmp', filename);
  const output = path.join(dir, 'diff', filename);

  logger.info(`Testing "${test.key}"`);

  const threshold = r.pipe(
    r.prop('threshold'),
    r.defaultTo(config.threshold),
    r.defaultTo(80),
    r.flip(r.divide)(100),
    r.subtract(1),
  )(test);

  logger.info(`threshold: ${threshold}`);
  logger.info(`comparing ${original} against ${tmp}`);

  const diff = new PixelDiff({
    imageAPath: original,
    imageBPath: tmp,
    thresholdType: PixelDiff.THRESHOLD_PERCENT,
    threshold,
    imageOutputLimit: PixelDiff.OUTPUT_DIFFERENT,
    imageOutputPath: output,
  });

  const result = await diff.runWithPromise();

  const passed = diff.hasPassed(result.code);

  if (!passed) {
    logger.debug('result:');
    logger.debug(result);
    logger.info(`writing diff to ${output}`);

    throw new Error(`${test.key} has ${result.differences} differences.
See generated diff at ${output} for details`);
  }
};

export default runTest;

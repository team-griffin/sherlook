// @flow
import typeof Puppeteer from 'puppeteer';
import typeof Rc from 'rc';

import _captureTests, { type CaptureTests } from './captureTests';
import _logger, { type Logger } from './logger';
import _getConfig, { type GetConfig } from './getConfig';
import type {
  CliFlags,
  Config,
  Test,
  Tests,
} from './types';

export type {
  CaptureTests,
  Logger,
  CliFlags,
  Config,
  Test,
  Tests,
  GetConfig,
};

type Console = typeof console;

const composite = (
  flags: CliFlags,
  puppeteer: Puppeteer,
  console: Console,
  rc: Rc,
) => {
  const getConfig = _getConfig(rc);
  const config = getConfig(flags);
  const logger = _logger(config, console);
  const captureTests = _captureTests(
    logger,
    puppeteer,
    config.baseUrl
  );

  return {
    getConfig,
    config,
    logger,
    captureTests,
  };
};

export default composite;

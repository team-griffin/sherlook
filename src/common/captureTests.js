// @flow
import typeof Puppeteer from 'puppeteer';
// eslint-disable-next-line no-duplicate-imports
import type { Page } from 'puppeteer';
import type {
  Test,
  Tests,
} from './types';
import type { Logger } from './logger';

import Future from 'fluture';
import path from 'path';

export type CaptureTests = (
  tests: Tests,
  outputDirectory: string,
) => Fluture<*, void>;

const captureTest = async(
  logger: Logger,
  page: Page,
  baseUrl: string,
  outputDirectory: string,
  test: Test,
) => {
  logger.debug('[captureTest]');


  const filename = `${test.key}.png`;
  const source = `${baseUrl}${test.url}`;
  const target = path.join(outputDirectory, filename);

  logger.info(`Capturing ${filename}`);

  if (test.viewport != null) {
    logger.info('setting viewport');
    logger.info(test.viewport);
    // $FlowFixMe
    await page.setViewport(test.viewport);
  }

  logger.info(`Navigating to ${source}`);
  await page.goto(source, {
    waitUntil: 'networkidle2',
  });

  logger.info(`Writing to ${target}`);
  await page.screenshot({
    path: target,
    fullPage: true,
  });
};

const captureTests = (
  logger: Logger,
  puppeteer: Puppeteer,
  baseUrl: string,
  viewport: ?Object,
): CaptureTests => (
  tests,
  outputDirectory,
) => {

  return Future.tryP(async() => {
    logger.debug('[captureTests]');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (viewport != null) {
      await page.setViewport(viewport);
    }

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < tests.length; x++) {
      const test = tests[x];
      await captureTest(
        logger,
        page,
        baseUrl,
        outputDirectory,
        test,
      );
    }

    await browser.close();
  });
};

export default captureTests;

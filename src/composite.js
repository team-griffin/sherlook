// @flow
/* global process global */
import type {
  CliFlags,
} from './common/types';

import puppeteer from 'puppeteer';
import mkdirp from 'mkdirp';
import fs from 'fs';
import PixelDiff from 'pixel-diff';
import rimraf from 'rimraf';
import rc from 'rc';

import _common from './common';
import _refresh from './refresh';
import _test from './test';

const composite = (flags: CliFlags) => {
  const common = _common(flags, puppeteer, console, rc);
  const refresh = _refresh(
    mkdirp,
    common.logger,
    common.captureTests,
    common.config,
    process,
  );
  const test = _test(
    common.logger,
    common.config,
    common.captureTests,
    global.it,
    global.describe,
    global.before,
    global.after,
    fs,
    PixelDiff,
    mkdirp,
    rimraf,
  );

  return {
    refresh,
    test,
  };
};

export default composite;

// @flow
import typeof Rc from 'rc';
import type {
  CliFlags,
  Config,
} from './types';

import * as r from 'ramda';

export type GetConfig = (flags: CliFlags) => Config;

const defaultConfig = {
  baseUrl: '',
  outputDirectory: 'sherlook',
  threshold: 80,
  viewport: void 0,
  tests: [],
  key: void 0,
  loglevel: 'warn',
};

// $FlowFixMe
const getConfig = (
  rc: Rc,
): GetConfig => (flags) => {
  const cliConfig = r.pipe(
    // $FlowFixMe
    r.when(
      r.always(flags.verbose),
      r.assoc('loglevel', 'info'),
    ),
  )(flags);

  return r.pipe(
    rc,
    r.merge(defaultConfig),
    r.merge(r.__, cliConfig),
    r.unless(
      r.propSatisfies(r.isNil, 'key'),
      (config) => r.over(
        r.lensProp('tests'),
        r.filter(
          r.propEq('key', config.key),
        ),
        config,
      ),
    ),
  )('sherlook', {}, flags);
};

export default getConfig;

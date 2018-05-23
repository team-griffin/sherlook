// @flow
import type { CliFlags } from './common';

import composite from './composite';

export default (
  flags: CliFlags,
) => composite(flags);

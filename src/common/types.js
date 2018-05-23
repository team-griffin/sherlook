// @flow
export type Test = {
  key: string,
  url: string,
  threshold?: number,
  viewport?: Object,
};

export type Tests = Array<Test>;

export type CliFlags = {
  config?: string,
  verbose?: boolean,
  key?: string,
};

export type Config = {
  baseUrl: string,
  outputDirectory: string,
  threshold: number,
  viewport: ?Object,
  tests: Tests,
  loglevel: string,
  key: ?string,
};

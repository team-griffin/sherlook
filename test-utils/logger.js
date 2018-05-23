import sinon from 'sinon';

export default () => ({
  log: sinon.spy(),
  debug: sinon.spy(),
  info: sinon.spy(),
  warn: sinon.spy(),
  error: sinon.spy(),
});

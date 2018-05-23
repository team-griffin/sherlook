import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import refresh from '../refresh';

describe('refresh::refresh', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const captureTests = this.captureTests = sinon.stub().returns(Future.of({}));
    const config = this.config = {
      outputDirectory: 'snapshots',
      tests: [],
    };
    const mkdirp = this.mkdirp = sinon.stub().callsFake((x, done) => done());
    const process = this.process = {
      exit: sinon.spy(),
    };
    this.refresh = refresh(logger, captureTests, config, mkdirp, process);
  });

  it('returns a promise', function () {
    const p = this.refresh();

    expect(p).to.be.instanceof(Promise);
  });
  it('creates a directory for snapshots', async function () {
    const { refresh, mkdirp } = this;

    await refresh();

    expect(mkdirp.called).to.be.true;
    expect(mkdirp.calledWith(path.resolve('snapshots')));
  });
  it('captures tests', async function () {
    const { refresh, captureTests, config } = this;

    await refresh();

    expect(captureTests.called).to.be.true;
    expect(captureTests.calledWith(config.tests, path.resolve('snapshots'))).to.be.true;
  });
  context('when a key is provided', function(){
    it('outputs a log message', async function () {
      const { refresh, logger, config } = this;
      config.key = 'my-key';

      await refresh();

      expect(logger.log.called).to.be.true;
    });
  });
  context('when an uncaught error occurrs', function () {
    it('logs an error and exits the process', async function () {
      const { refresh, mkdirp, logger, process } = this;
      mkdirp.callsFake((x, done) => done(new Error('some error')));

      await refresh();

      expect(logger.error.called).to.be.true;
      expect(process.exit.called).to.be.true;
    });
  });
});

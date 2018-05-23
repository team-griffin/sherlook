import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import test from '../test';

describe('test::test', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const tests = this.tests = [];
    const config = this.config = {
      tests,
    };
    const describe = this.describe = sinon.stub().callsFake((n, fn) => fn());
    const before = this.before = sinon.stub().callsFake((fn) => {
      const context = {
        timeout: () => {},
      };
      fn.call(context);
    });
    const after = this.after = sinon.stub().callsFake((fn) => fn());
    const setup = this.setup = sinon.stub().returns(Future.of({}));
    const verify = this.verify = sinon.stub().returns(Future.of(config.tests));
    const capture = this.capture = sinon.stub().returns(Future.of(config.tests));
    const generateTests = this.generateTests = sinon.spy();
    const teardown = this.teardown = sinon.stub().returns(Future.of({}));

    this.service = test(
      logger,
      config,
      describe,
      before,
      after,
      setup,
      verify,
      capture,
      generateTests,
      teardown
    );
    this.service();
  });

  it('creates a mocha describe', function () {
    const { describe } = this;

    expect(describe.called).to.be.true;
  });
  it('creates a before', function () {
    const { before } = this;

    expect(before.called).to.be.true;
  });
  it('calls setup', function () {
    const { setup } = this;

    expect(setup.called).to.be.true;
  });
  it('calls verify', function () {
    const { verify, tests } = this;

    expect(verify.called).to.be.true;
    expect(verify.calledWith(tests)).to.be.true;
  });
  it('calls capture', function () {
    const { capture, tests } = this;

    expect(capture.called).to.be.true;
    expect(capture.calledWith(tests)).to.be.true;
  });
  it('creates an after', function () {
    const { after } = this;

    expect(after.called).to.be.true;
  });
  it('calls teardown', function () {
    const { teardown } = this;

    expect(teardown.called).to.be.true;
  });
  it('generates tests', function () {
    const { generateTests, tests } = this;

    expect(generateTests.called).to.be.true;
    expect(generateTests.calledWith(tests)).to.be.true;
  });
});

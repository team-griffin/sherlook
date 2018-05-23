import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import capture from '../capture';

describe('test::capture', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const captureTests = this.captureTests = sinon.stub().returns(Future.of({}));
    const config = this.config = {
      outputDirectory: 'snapshots',
    };
    this.capture = capture(logger, captureTests, config);
    this.tests = [];
  });

  it('returns a future', function () {
    const f = this.capture(this.tests);

    expect(Future.isFuture(f)).to.be.true;
  });
  it('captures tests', async function () {
    const { tests, capture, captureTests } = this;

    await capture(tests).promise();

    expect(captureTests.called).to.be.true;
    expect(captureTests.lastCall.args[0]).to.equal(tests);
  });
  it('saves to a tmp directory', async function () {
    const { tests, capture, captureTests } = this;

    await capture(tests).promise();

    expect(captureTests.called).to.be.true;
    expect(captureTests.lastCall.args[1]).to.equal(path.resolve('snapshots/tmp'));
  });
  it('resolves with the original tests', async function () {
    const { tests, capture } = this;

    const result = await capture(tests).promise();

    expect(result).to.equal(tests);
  });
});

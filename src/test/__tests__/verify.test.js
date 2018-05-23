import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import verify from '../verify';

describe('test::verify', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const fs = this.fs = {
      statSync: sinon.stub(),
    };
    const config = this.config = {
      outputDirectory: 'snapshots',
    };
    this.tests = [
      {
        key: 'test-1',
        url: '/test-1',
      },
    ];
    this.verify = verify(logger, fs, config);
  });

  it('returns a future', function () {
    const result = this.verify(this.tests);

    expect(Future.isFuture(result)).to.be.true;
  });
  it('resolves with the tests', async function () {
    const result = await this.verify(this.tests).promise();

    expect(result).to.equal(this.tests);
  });
  it('checks that the test files exist', async function () {
    await this.verify(this.tests).promise();

    expect(this.fs.statSync.called).to.be.true;
    expect(this.fs.statSync.calledWith(path.resolve('snapshots/test-1.png')));
  });
  context('when file does not exist', function(){
    it('rejects with an error', function () {
      this.fs.statSync.throws({
        code: 'ENOENT',
      });

      return this.verify(this.tests).promise().then(
        () => { throw new Error('should not resolve'); },
        (err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.contain(this.tests[0].key);
        },
      );
    });
  });
  context('when an unknown error occurs', function(){
    it('rejects with an error', function () {
      const err = new Error('some error');
      this.fs.statSync.throws(err);

      return this.verify(this.tests).promise().then(
        () => { throw new Error('should not resolve'); },
        (e) => expect(e).to.equal(err),
      );
    });
  });
});

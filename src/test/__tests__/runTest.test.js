import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import runTest from '../runTest';

describe('test::runTest', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const config = this.config = {
      threshold: 50,
    };
    const pixelDiffResult = this.pixelDiffResult = {
      code: 1,
      differences: 10000,
    };
    const pixelDiff = this.pixelDiff = {
      runWithPromise: sinon.stub().resolves(pixelDiffResult),
      hasPassed: sinon.stub().callsFake((code) => code === 1),
    };
    const PixelDiff = this.PixelDiff = sinon.stub().returns(pixelDiff);
    const testConfig = this.testConfig = {
      key: 'test-1',
      url: '/test1.png',
      threshold: 10,
    };
    const context = this.context = {
      timeout: sinon.spy(),
    };
    this.service = runTest(logger, config, PixelDiff);
  });

  it('returns a function', function () {
    const result = this.service(this.testConfig, 'snapshots');

    expect(result).to.be.instanceof(Function);
  });
  it('returns a promise', function () {
    const result = this.service(this.testConfig, 'snapshots').call(this.context);

    expect(result).to.be.instanceof(Promise);
  });
  it('compares the current image to the previous image', function () {
    const { service, testConfig, PixelDiff, pixelDiff } = this;

    service(testConfig, 'snapshots').call(this.context);

    expect(PixelDiff.called).to.be.true;
    const args = PixelDiff.lastCall.args[0];

    expect(args.imageAPath).to.equal('snapshots/test-1.png');
    expect(args.imageBPath).to.equal('snapshots/tmp/test-1.png');

    expect(pixelDiff.runWithPromise.called).to.be.true;
  });
  context('when images differ', function(){
    beforeEach(function(){
      this.pixelDiffResult.code = 9; // failing code
    });

    it('throws an error', function () {
      const { service, testConfig } = this;

      return service(testConfig, 'snapshots').call(this.context).then(
        () => {
          throw new Error('should not resolve');
        },
        (err) => {
          expect(err).to.be.instanceof(Error);
        },
      );
    });
    it('creats a diff image', function () {
      const { service, testConfig, PixelDiff } = this;

      return service(testConfig, 'snapshots').call(this.context).then(
        () => {
          throw new Error('should not resolve');
        },
        () => {
          expect(PixelDiff.lastCall.args[0].imageOutputPath).to.equal('snapshots/diff/test-1.png');
        },
      );
    });
  });
  context('when images are the same', function(){
    it('does nothing', function () {
      const { service, testConfig } = this;

      return service(testConfig, 'snapshots').call(this.context);
    });
  });

  describe('threshold', function(){
    it('uses the test threshold', async function () {
      const { service, testConfig, PixelDiff } = this;

      await service(testConfig, 'snapshots').call(this.context);

      const threshold = PixelDiff.lastCall.args[0].threshold;

      expect(threshold).to.equal(0.9);
    });
    it('falls back to the config threshold', async function () {
      const { service, testConfig, PixelDiff } = this;
      delete testConfig.threshold;

      await service(testConfig, 'snapshots').call(this.context);

      const threshold = PixelDiff.lastCall.args[0].threshold;

      expect(threshold).to.equal(0.5);
    });
    it('defaults to 80%', async function () {
      const { service, testConfig, config, PixelDiff } = this;
      delete testConfig.threshold;
      delete config.threshold;

      await service(testConfig, 'snapshots').call(this.context);

      const threshold = PixelDiff.lastCall.args[0].threshold;

      expect(threshold).to.equal(1 - (80 / 100));
    });
  });
});

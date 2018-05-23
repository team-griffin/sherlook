import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import teardown from '../teardown';

describe('test::teardown', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const config = this.config = {
      outputDirectory: 'snapshots',
    };
    const rimraf = this.rimraf = sinon.stub().callsFake((x, done) => done());
    this.teardown = teardown(logger, config, rimraf);
  });

  it('returns a future', function () {
    const result = this.teardown();

    expect(Future.isFuture(result)).to.be.true;
  });
  it('deletes the tmp folder', async function () {
    await this.teardown().promise();

    expect(this.rimraf.called).to.be.true;
    expect(this.rimraf.lastCall.args[0]).to.equal(path.resolve('snapshots/tmp'));
  });
});

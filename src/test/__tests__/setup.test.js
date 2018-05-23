import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import setup from '../setup';

describe('test::setup', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const mkdirp = this.mkdirp = sinon.stub().callsFake((x, done) => done());
    const config = this.config = {
      outputDirectory: 'snapshots',
    };
    this.setup = setup(logger, mkdirp, config);
  });

  it('returns a future', function () {
    const result = this.setup();

    expect(Future.isFuture(result)).to.be.true;
  });
  it('creates a tmp directory', async function () {
    await this.setup().promise();

    expect(this.mkdirp.calledWith(path.resolve('snapshots/tmp'))).to.be.true;
  });
  it('creates a diff directory', async function () {
    await this.setup().promise();

    expect(this.mkdirp.calledWith(path.resolve('snapshots/diff'))).to.be.true;
  });
});

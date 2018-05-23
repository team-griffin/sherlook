import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';
import path from 'path';

import { stubLogger } from '../../../test-utils';
import generateTests from '../generateTests';

describe('test::generateTests', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const config = this.config = {
      outputDirectory: 'snapshots',
    };
    const it = this.it = sinon.spy();
    const runTest = this.runTest = sinon.stub().returns('run-test');
    const tests = this.tests = [
      {
        key: 'test-1',
        url: '/test1.png',
        threshold: 10,
      },
    ];
    this.service = generateTests(logger, config, it, runTest);
  });

  it('returns void', function () {
    const result = this.service(this.tests);

    expect(result).to.equal(void 0);
  });
  it('creates a mocha test for each test', function () {
    const { service, tests, it, runTest } = this;
    tests.push({
      key: 'test-2',
      url: 'test2.png',
    });
    tests.push({
      key: 'test-3',
      url: 'test3.png',
    });

    service(tests);

    expect(it.called).to.be.true;
    expect(it.calledThrice).to.be.true;
  });
  it('runs the test', function () {
    const { service, tests, runTest, it } = this;

    service(tests);

    expect(it.calledWith(tests[0].key), 'run-test').to.be.true;
    expect(runTest.calledWith(tests[0], path.resolve('snapshots'))).to.be.true;
  });
});

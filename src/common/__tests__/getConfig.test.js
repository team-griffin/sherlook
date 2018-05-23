import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';

import getConfig from '../getConfig';

describe('common::getConfig', function(){
  beforeEach(function(){
    const configFile = {
      baseUrl: 'https://google.co.uk',
      threshold: 100,
      loglevel: 'error',
      tests: [
        {
          key: 'test-1',
          url: 'test1.com',
        },
        {
          key: 'test-2',
          url: 'test2.com',
        },
      ],
    };
    const rc = this.rc = sinon.stub().returns(configFile);
    const flags = this.flags = {
      config: 'my-config-file',
    };
    const service = this.service = getConfig(rc);
  });

  it('requires the config file', function () {
    const { service, flags, rc } = this;

    const result = service(flags);

    expect(rc.called).to.be.true;
    expect(rc.calledWith('sherlook', {}, flags)).to.be.true;

    expect(result.baseUrl).to.equal('https://google.co.uk');
    expect(result.threshold).to.equal(100);
    expect(result.loglevel).to.equal('error');
  });
  it('provides default values', function () {
    const { service, flags, rc } = this;
    rc.returns({});

    const result = service(flags);

    expect(result.baseUrl).to.equal('');
    expect(result.outputDirectory).to.equal('sherlook');
    expect(result.threshold).to.equal(80);
    expect(result.tests).to.deep.equal([]);
    expect(result.key).to.equal(undefined);
    expect(result.loglevel).to.equal('warn');
  });
  it('gives priority to cli flags', function () {
    const { service, flags } = this;
    flags.verbose = true;
    flags.key = 'super-key';

    const result = service(flags);

    expect(result.loglevel).to.equal('info');
    expect(result.key).to.equal('super-key');
  });
  it('filters tests by a given key', function () {
    const { service, flags } = this;
    flags.key = 'test-2';

    const result = service(flags);

    expect(result.tests).to.have.length(1);
    expect(result.tests[0].key).to.equal('test-2');
  });
});

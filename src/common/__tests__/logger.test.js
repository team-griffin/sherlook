import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';

import logger from '../logger';

describe('common::logger', function(){
  beforeEach(function(){
    const config = this.config = {
      loglevel: 'warn',
    };
    const console = this.console = {
      log: sinon.spy(),
    };
    this.logger = logger(config, console);
  });

  it('returns an object', function () {
    expect(this.logger).to.be.instanceof(Object);
  });
  it('logs a message', function () {
    this.logger.log('my message');

    expect(this.console.log.called).to.be.true;
    expect(this.console.log.calledWith('my message')).to.be.true;
  });
  it('logs an error', function () {
    const { logger, console } = this;
    const err = new Error('an error');
    logger.error(err);

    expect(this.console.log.called).to.be.true;
    expect(this.console.log.calledWith('ERROR: %s', err)).to.be.true;
  });
  it('does not log if the log level is not met', function () {
    const { logger, console } = this;
    logger.info('dont print this');

    expect(this.console.log.called).to.be.false;
  });
});

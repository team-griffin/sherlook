import { expect } from 'chai';
import sinon from 'sinon';
import Future from 'fluture';

import { stubLogger } from '../../../test-utils';
import captureTests from '../captureTests';

describe('common::captureTests', function(){
  beforeEach(function(){
    const logger = this.logger = stubLogger();
    const page = this.page = {
      goto: sinon.stub().resolves(),
      screenshot: sinon.stub().resolves(),
      setViewport: sinon.stub().resolves(),
    };
    const browser = this.browser = {
      newPage: sinon.stub().resolves(page),
      close: sinon.stub().resolves(),
    };
    const puppeteer = this.puppeteer = {
      launch: sinon.stub().resolves(browser),
    };
    const baseUrl = this.baseUrl = 'https://google.co.uk';
    const tests = this.tests = [
      {
        key: 'test1',
        url: '/test-one',
      },
      {
        key: 'test2',
        url: '/test-two',
      },
    ];
    const dir = this.dir = 'snapshots';

    this.service = captureTests(logger, puppeteer, baseUrl);
  });

  it('returns a future', function() {
    const { service, tests, dir } = this;

    const f = service(tests, dir);

    expect(Future.isFuture(f)).to.be.true;
  });
  it('sets the viewport', async function(){
    const { tests, dir, page, logger, puppeteer, baseUrl } = this;
    const v = {};
    const service = captureTests(logger, puppeteer, baseUrl, v);

    await service(tests, dir).promise();

    expect(page.setViewport.called).to.be.true;
    expect(page.setViewport.calledWith(v)).to.be.true;
  });

  it('navigates to each url', async function () {
    const { service, tests, dir, page } = this;

    await service(tests, dir).promise();

    expect(page.goto.called).to.be.true;
    expect(page.goto.calledTwice).to.be.true;

    expect(page.goto.firstCall.args[0]).to.equal('https://google.co.uk/test-one');
    expect(page.goto.lastCall.args[0]).to.equal('https://google.co.uk/test-two');
  });
  it('waits until the page has loaded', async function () {
    const { service, tests, dir, page } = this;

    await service(tests, dir).promise();

    expect(page.goto.called).to.be.true;
    expect(page.goto.calledTwice).to.be.true;

    expect(page.goto.firstCall.args[1].waitUntil).to.equal('networkidle2');
  });
  it('sets the viewport per page', async function(){
    const { service, tests, dir, page } = this;
    tests[0].viewport = {};

    await service(tests, dir).promise();

    expect(page.setViewport.called).to.be.true;
    expect(page.setViewport.calledWith(tests[0].viewport)).to.be.true;
  });

  it('takes a screenshot', async function () {
    const { service, tests, dir, page } = this;

    await service(tests, dir).promise();

    expect(page.screenshot.called).to.be.true;
    expect(page.screenshot.calledTwice).to.be.true;
  });
  it('writes the screenshot to the specified location', async function () {
    const { service, tests, dir, page } = this;

    await service(tests, dir).promise();

    expect(page.screenshot.firstCall.args[0].path).to.equal('snapshots/test1.png');
    expect(page.screenshot.lastCall.args[0].path).to.equal('snapshots/test2.png');
  });
});

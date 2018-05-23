import { expect } from 'chai';

import main from '../';

describe('composite', function(){
  it('is a function', function () {
    expect(main).to.be.instanceof(Function);
  });
  it('returns an object', function () {
    expect(main({})).to.be.instanceof(Object);
  });
  it('contains a refresh method', function () {
    expect(main({}).refresh).to.be.instanceof(Function);
  });
  it('contains a test method', function () {
    expect(main({}).test).to.be.instanceof(Function);
  });
});

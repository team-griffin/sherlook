import path from 'path';
import compose from '../dist/sherlook';

describe('sherlook integration test', function(){
  const { refresh, test } = compose({
    loglevel: 'warn',
    config: path.join(__dirname, 'config'),
  });

  describe('refresh', function(){
    it('refreshes', async function () {
      this.timeout(1000 * 60 * 60);
      await refresh();
    });
  });

  describe('test', function(){
    test();
  });

});

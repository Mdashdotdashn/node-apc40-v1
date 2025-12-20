const { APC40 } = require('../lib');

describe('APC40 connected event', () => {
  let apc;

  afterEach(() => {
    if (apc) {
      apc.disconnect();
    }
  });

  it('should emit connected event when APC40 is connected', (done) => {
    apc = new APC40({ autoConnect: false });
    apc.on('connected', () => {
      // If this event is emitted, the test passes
      done();
    });
    apc.connect();
  });
});

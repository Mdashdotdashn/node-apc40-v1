const { APC40 } = require('../lib');

const apc = new APC40();



apc.on('slider', (event) => {
  console.log(`Slider ${event.index} moved to value ${event.value}`);
});

console.log('Listening for slider movements (volume faders 0-8)...');

// Keep process alive
process.stdin.resume();

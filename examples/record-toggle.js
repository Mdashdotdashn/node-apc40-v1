/**
 * Example: Toggle record LEDs on/off when pressed
 */

const { APC40, BUTTONS } = require('../lib');

const apc = new APC40();
const recordStates = new Array(8).fill(false);

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press record arm buttons to toggle their LEDs on/off.');
});

apc.on('record', (event) => {
  if (event.pressed) {
    recordStates[event.index] = !recordStates[event.index];
    apc.setRecordLED(event.index, recordStates[event.index]);
    console.log(`Record ${event.index + 1} is now ${recordStates[event.index] ? 'ON' : 'OFF'}`);
  }
});

apc.on('error', (error) => {
  console.error('Error:', error.message);
});

apc.on('disconnected', () => {
  console.log('✗ Disconnected from APC40');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  apc.disconnect();
  process.exit(0);
});

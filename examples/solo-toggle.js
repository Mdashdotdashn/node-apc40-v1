/**
 * Example: Toggle solo LEDs on/off when pressed
 */

const { APC40, BUTTONS } = require('../lib');

const apc = new APC40();
const soloStates = new Array(8).fill(false);

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press solo buttons to toggle their LEDs on/off.');
});

apc.on('solo', (event) => {
  if (event.pressed) {
    soloStates[event.index] = !soloStates[event.index];
    apc.setSoloLED(event.index, soloStates[event.index]);
    console.log(`Solo ${event.index + 1} is now ${soloStates[event.index] ? 'ON' : 'OFF'}`);
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

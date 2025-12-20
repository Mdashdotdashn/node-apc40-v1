/**
 * Example: Toggle activator LEDs on/off when pressed
 */

const { APC40, BUTTONS } = require('../lib');

const apc = new APC40();
const activatorStates = new Array(8).fill(false);

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press activator buttons to toggle their LEDs on/off.');
});

apc.on('activator', (event) => {
  if (event.pressed) {
    activatorStates[event.index] = !activatorStates[event.index];
    apc.setActivatorLED(event.index, activatorStates[event.index]);
    console.log(`Activator ${event.index + 1} is now ${activatorStates[event.index] ? 'ON' : 'OFF'}`);
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

/**
 * Example demonstrating clip launch grid coordinates
 * Shows how the new grid-based API makes clip launching intuitive
 */

const { APC40, LED_NOTES, ClipLEDColor, CONTROLLER_IDS, BUTTONS } = require('../lib');

console.log('Connecting to APC40...\n');

const apc = new APC40({ autoConnect: false });

// Track which clips are lit
const clipStates = new Map();

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press clip launch buttons - grid coordinates will be logged\n');

  // Light up a few clips at startup
  apc.setClipLaunchColor(0, 0, ClipLEDColor.GREEN);
  apc.setClipLaunchColor(1, 1, ClipLEDColor.GREEN);
  apc.setClipLaunchColor(2, 2, ClipLEDColor.GREEN);

  // Track initial states
  clipStates.set('0-0', true);
  clipStates.set('1-1', true);
  clipStates.set('2-2', true);
});

// Listen for clip launch events with grid coordinates
apc.on('clip-launch', (event) => {
  const { x, y, pressed } = event;
  const stateKey = `${x}-${y}`;

  if (pressed) {
    console.log(`\n📍 Clip Launch Pressed at Grid [${x}, ${y}]`);
    console.log(`   Track: ${x + 1}, Clip: ${y + 1}`);

    // Toggle the clip
    if (clipStates.get(stateKey)) {
      // Turn off
      apc.setClipLaunchColor(x, y, ClipLEDColor.OFF);
      clipStates.set(stateKey, false);
      console.log(`   → Clip OFF`);
    } else {
      // Turn on
      apc.setClipLaunchColor(x, y, ClipLEDColor.GREEN);
      clipStates.set(stateKey, true);
      console.log(`   → Clip ON`);
    }
  } else {
    console.log(`📍 Clip Launch Released at Grid [${x}, ${y}]`);
  }
});

// Still support low-level button events for other buttons
apc.on('button-down', (event) => {
  const { note } = event;

  // Exit on STOP button
  if (note === BUTTONS.STOP) {
    console.log('\nStop button pressed. Exiting...');
    apc.disconnect();
    process.exit(0);
  }
});

apc.on('error', (error) => {
  console.error('\n✗ Connection Error:', error.message);
});

apc.on('disconnected', () => {
  console.log('✗ Disconnected from APC40');
});

apc.connect();

/**
 * Basic example of using the APC40 module
 */

const { APC40, LED_NOTES, ClipLEDColor, CONTROLLER_IDS } = require('../lib');

console.log('Connecting to APC40...\n');

const apc = new APC40({ autoConnect: false });

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press the STOP button to exit.\n');

  // Light up a few buttons
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_1, ClipLEDColor.GREEN);
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_2, ClipLEDColor.RED);
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_3, ClipLEDColor.YELLOW);

  // Set master level
  apc.setController(CONTROLLER_IDS.MASTER_LEVEL, 100);
});

// Listen for button presses
apc.on('button-down', (event) => {
  console.log(`Button pressed - Note: 0x${event.note.toString(16)}, Channel: ${event.channel}`);

  // Exit on STOP button (0x5c)
  if (event.note === 0x5c) {
    console.log('\nStop button pressed. Exiting...');
    apc.disconnect();
    process.exit(0);
  }

  // Try to toggle LED on button press (only for clip launch buttons 0x35-0x39)
  if (event.note >= 0x35 && event.note <= 0x39) {
    apc.setClipLED(event.note, ClipLEDColor.GREEN, event.channel);
  }
});

apc.on('button-up', (event) => {
  console.log(`Button released - Note: 0x${event.note.toString(16)}`);
  apc.setClipLED(event.note, ClipLEDColor.OFF);
});

// Listen for knob/fader changes
apc.on('controller', (event) => {
  console.log(
    `Controller changed - ID: 0x${event.controlId.toString(16)}, Value: ${event.value}, Channel: ${event.channel}`
  );
});

apc.on('error', (error) => {
  console.error('\n✗ Connection Error:', error.message);
  
  const inputs = APC40.getInputs();
  const outputs = APC40.getOutputs();
  
  console.log('\nAvailable MIDI Devices:');
  console.log('─────────────────────');
  
  if (inputs.length > 0) {
    console.log('Inputs:');
    inputs.forEach((port, i) => console.log(`  ${i + 1}. ${port}`));
  } else {
    console.log('Inputs: (none)');
  }
  
  if (outputs.length > 0) {
    console.log('Outputs:');
    outputs.forEach((port, i) => console.log(`  ${i + 1}. ${port}`));
  } else {
    console.log('Outputs: (none)');
  }
  
  console.log('\nNote: Make sure the APC40 is connected and powered on.');
  console.log('If the APC40 is listed, you may need to update the deviceName option.');
});

apc.on('disconnected', () => {
  console.log('✗ Disconnected from APC40');
});

// Now manually connect
apc.connect();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  apc.disconnect();
  process.exit(0);
});

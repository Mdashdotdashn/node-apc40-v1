/**
 * Basic example of using the APC40 module
 */

const { APC40, LED_NOTES, ClipLEDColor, CONTROLLER_IDS, INPUT_NOTES, getButtonName, getControllerName } = require('../lib');

console.log('Connecting to APC40...\n');

const apc = new APC40({ autoConnect: false });

// Track clip launch button states for toggling
const clipLaunchStates = new Map();

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press the STOP button to exit.');
  console.log('Press clip launch buttons to toggle them on/off.\n');

  // Light up clip launch buttons at startup
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_1, ClipLEDColor.GREEN);
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_2, ClipLEDColor.RED);
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_3, ClipLEDColor.YELLOW);
  
  // Initialize state tracking for startup LEDs
  for (let channel = 0; channel < 8; channel++) {
    const key = `${LED_NOTES.CLIP_LAUNCH_1}-${channel}`;
    if (channel === 0) clipLaunchStates.set(`${LED_NOTES.CLIP_LAUNCH_1}-0`, true);
    if (channel === 0) clipLaunchStates.set(`${LED_NOTES.CLIP_LAUNCH_2}-0`, true);
    if (channel === 0) clipLaunchStates.set(`${LED_NOTES.CLIP_LAUNCH_3}-0`, true);
  }

  // Light up some activator/solo/record arm buttons at startup
  // Channel 0 (track 1)
  apc.setLED(LED_NOTES.ACTIVATOR, ClipLEDColor.GREEN, 0);
  apc.setLED(LED_NOTES.SOLO, ClipLEDColor.RED, 0);

  // Channel 2 (track 3)
  apc.setLED(LED_NOTES.RECORD_ARM, ClipLEDColor.YELLOW, 2);
  apc.setLED(LED_NOTES.ACTIVATOR, ClipLEDColor.GREEN, 2);

  // Channel 4 (track 5)
  apc.setLED(LED_NOTES.RECORD_ARM, ClipLEDColor.RED, 4);

  // Set master level
  apc.setController(CONTROLLER_IDS.MASTER_LEVEL, 100);
});

// Listen for button presses
apc.on('button-down', (event) => {
  const buttonName = getButtonName(event.note);
  console.log(`Button pressed: ${buttonName} (0x${event.note.toString(16)}), Channel: ${event.channel}`);

  // Exit on STOP button
  if (event.note === INPUT_NOTES.STOP) {
    console.log('\nStop button pressed. Exiting...');
    apc.disconnect();
    process.exit(0);
  }

  // Toggle clip launch buttons - turn on if off, turn off if on
  if (event.note >= INPUT_NOTES.CLIP_LAUNCH_1 && event.note <= INPUT_NOTES.CLIP_LAUNCH_5) {
    const stateKey = `${event.note}-${event.channel}`;
    const isLit = clipLaunchStates.get(stateKey);
    
    if (isLit) {
      // Turn off
      apc.setClipLED(event.note, ClipLEDColor.OFF, event.channel);
      clipLaunchStates.set(stateKey, false);
      console.log(`  → Clip OFF`);
    } else {
      // Turn on
      apc.setClipLED(event.note, ClipLEDColor.GREEN, event.channel);
      clipLaunchStates.set(stateKey, true);
      console.log(`  → Clip ON`);
    }
  }
});

apc.on('button-up', (event) => {
  const buttonName = getButtonName(event.note);
  console.log(`Button released: ${buttonName} (0x${event.note.toString(16)})`);
  
  // Don't turn off clip launch buttons - they maintain their toggled state
  // Only turn off other momentary buttons
  if (!(event.note >= INPUT_NOTES.CLIP_LAUNCH_1 && event.note <= INPUT_NOTES.CLIP_LAUNCH_5)) {
    apc.setClipLED(event.note, ClipLEDColor.OFF, event.channel);
  }
});

// Listen for knob/fader changes
apc.on('controller', (event) => {
  const controllerName = getControllerName(event.controlId, event.channel);
  console.log(
    `Controller changed: ${controllerName}, Value: ${event.value}, Channel: ${event.channel}`
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

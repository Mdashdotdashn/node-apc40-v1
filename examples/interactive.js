/**
 * Example: Interactive mode selection and light testing
 */

const { APC40, LED_NOTES, ClipLEDColor, APC40Mode, LEDRingType, CONTROLLER_IDS } = require('../lib');

const apc = new APC40({
  deviceName: 'APC40',
  mode: APC40Mode.GENERIC,
});

let lightIndex = 0;
const testLights = [
  LED_NOTES.CLIP_LAUNCH_1,
  LED_NOTES.CLIP_LAUNCH_2,
  LED_NOTES.CLIP_LAUNCH_3,
  LED_NOTES.CLIP_LAUNCH_4,
  LED_NOTES.CLIP_LAUNCH_5,
  LED_NOTES.SCENE_LAUNCH_1,
  LED_NOTES.SCENE_LAUNCH_2,
  LED_NOTES.PLAY,
  LED_NOTES.STOP,
  LED_NOTES.RECORD,
];

const colors = [
  ClipLEDColor.GREEN,
  ClipLEDColor.RED,
  ClipLEDColor.YELLOW,
];

apc.on('connected', () => {
  console.log('✓ Connected to APC40\n');
  console.log('Controls:');
  console.log('- Press buttons to toggle LED colors');
  console.log('- Move knobs to see controller values');
  console.log('- Press STOP ALL CLIPS to exit\n');

  // Initialize all clip launch lights
  for (let i = 0; i < 5; i++) {
    apc.setClipLED(LED_NOTES.CLIP_LAUNCH_1 + i, ClipLEDColor.GREEN);
  }

  // Setup LED ring types for device knobs
  for (let i = 0; i < 8; i++) {
    apc.setLEDRingType(i, LEDRingType.VOLUME_STYLE, 0);
  }
});

apc.on('button-down', (event) => {
  // Exit on STOP ALL CLIPS
  if (event.note === LED_NOTES.STOP_ALL_CLIPS) {
    console.log('\nExiting...');
    apc.disconnect();
    process.exit(0);
  }

  // Cycle through colors on button press
  const colorIndex = (lightIndex++) % colors.length;
  apc.setClipLED(event.note, colors[colorIndex], event.channel);
});

apc.on('button-up', (event) => {
  // Dim on release
  apc.setClipLED(event.note, ClipLEDColor.GREEN, event.channel);
});

apc.on('controller', (event) => {
  if (event.controlId === CONTROLLER_IDS.MASTER_LEVEL) {
    console.log(`Master Level: ${Math.round((event.value / 127) * 100)}%`);
  }
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

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  apc.disconnect();
  process.exit(0);
});

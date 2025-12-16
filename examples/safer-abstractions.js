/**
 * Example demonstrating safer abstractions with enums and type-safe helpers
 * This shows how to use ButtonType and ControllerType for more maintainable code
 */

const {
  APC40,
  LED_NOTES,
  ClipLEDColor,
  CONTROLLER_IDS,
  INPUT_NOTES,
  ButtonType,
  ControllerType,
  getButtonType,
  getButtonIndex,
  getControllerType,
  getControllerName,
  getButtonName,
} = require('../lib');

console.log('Connecting to APC40...\n');

const apc = new APC40({ autoConnect: false });

apc.on('connected', () => {
  console.log('✓ Connected to APC40');
  console.log('Press buttons and move controllers to see type-safe event handling.');
  console.log('Press the STOP button to exit.\n');

  // Light up some buttons
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_1, ClipLEDColor.GREEN);
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_2, ClipLEDColor.RED);
  apc.setLED(LED_NOTES.RECORD_ARM, ClipLEDColor.YELLOW, 0);
});

// Listen for button presses with type-safe handling
apc.on('button-down', (event) => {
  const buttonType = getButtonType(event.note);
  const buttonName = getButtonName(event.note);
  const buttonIndex = getButtonIndex(event.note);

  console.log(`\n📍 Button Pressed: ${buttonName}`);

  // Type-safe handling based on button type
  if (buttonType === ButtonType.RECORD_ARM) {
    console.log(`   → Record Arm on Track ${event.channel + 1}`);
  } else if (buttonType === ButtonType.SOLO) {
    console.log(`   → Solo on Track ${event.channel + 1}`);
  } else if (buttonType === ButtonType.ACTIVATOR) {
    console.log(`   → Activator on Track ${event.channel + 1}`);
  } else if (buttonType === ButtonType.CLIP_LAUNCH) {
    console.log(`   → Clip Launch ${buttonIndex} on Track ${event.channel + 1}`);
  } else if (buttonType === ButtonType.SCENE_LAUNCH) {
    console.log(`   → Scene Launch ${buttonIndex}`);
  } else if (buttonType === ButtonType.STOP) {
    console.log('   → Stop button pressed. Exiting...');
    apc.disconnect();
    process.exit(0);
  } else if (buttonType === ButtonType.PLAY) {
    console.log('   → Play button pressed');
  } else if (buttonType === ButtonType.RECORD) {
    console.log('   → Record button pressed');
  } else if (buttonType === ButtonType.SHIFT) {
    console.log('   → Shift modifier activated');
  } else {
    console.log(`   → Type: ${buttonType || 'UNKNOWN'}`);
  }

  // Light up clip launches when pressed
  if (buttonType === ButtonType.CLIP_LAUNCH) {
    apc.setClipLED(event.note, ClipLEDColor.GREEN, event.channel);
  }
});

// Listen for controller events with type-safe handling
apc.on('controller', (event) => {
  const controllerType = getControllerType(event.controlId);
  const controllerName = getControllerName(event.controlId, event.channel);

  // Only log controllers to reduce spam
  if (event.value % 5 === 0) {
    // Log every 5th value change
    if (controllerType === ControllerType.TRACK_LEVEL) {
      console.log(`🎚️  ${controllerName}: ${event.value}`);
    } else if (controllerType === ControllerType.DEVICE_KNOB) {
      console.log(`🎛️  ${controllerName}: ${event.value}`);
    } else if (controllerType === ControllerType.CROSSFADER) {
      console.log(`↔️  ${controllerName}: ${event.value}`);
    }
  }
});

apc.connect();

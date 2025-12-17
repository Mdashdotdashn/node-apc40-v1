# node-apc40-v1

A Node.js library for interfacing with the Akai APC40 MIDI controller. Provides a TypeScript-friendly, event-based API for handling buttons, faders, knobs, and LED feedback.

## Installation

Install via npm:

```bash
npm install node-apc40-v1
```

Or, if using directly from a local path or GitHub:

```bash
npm install /path/to/node-apc40-v1
# or
npm install Mdashdotdashn/node-apc40-v1
```

## Usage

Here’s a basic example of how to use the library:

```js
const { APC40, LEDS, COLORS } = require('node-apc40-v1');

const apc = new APC40();

apc.on('ready', () => {
  console.log('APC40 connected!');
  // Light up a button
  apc.setLED(LEDS.CLIP_LAUNCH[0][0], COLORS.GREEN_FULL);
});

apc.on('button', (id, velocity) => {
  console.log(`Button ${id} pressed, velocity: ${velocity}`);
  // Turn off the LED when button is released
  if (velocity === 0) apc.setLED(id, COLORS.OFF);
});

apc.on('fader', (id, value) => {
  console.log(`Fader ${id} moved to ${value}`);
});

// Clean up on exit
process.on('SIGINT', () => {
  apc.close();
  process.exit();
});
```

## Features
- Event-based API for all controls
- LED and color control (including blinking)
- TypeScript support
- Utility functions for MIDI message parsing

## Documentation
See the [API documentation](./README.md) and `examples/` directory for more usage examples.

## License
MIT

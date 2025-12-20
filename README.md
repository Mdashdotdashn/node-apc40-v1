#### `setRecordLED(index: number, on: boolean, channel?: number): void`
Set a record arm LED by track index (0-7) and boolean state. Turns the LED on or off for the given track.
#### `record`
Emitted when a record arm button is pressed or released.
```typescript
apc.on('record', (event: { index: number, pressed: boolean }) => {
  // event.index: track index (0-7)
  // event.pressed: true for press, false for release
});
```
**Example: Toggle record arm LEDs on press**
```javascript
const { APC40, BUTTONS } = require('node-apc40-v1');
const apc = new APC40();
const recordStates = new Array(8).fill(false);

apc.on('record', (event) => {
  if (event.pressed) {
    recordStates[event.index] = !recordStates[event.index];
    apc.setRecordLED(event.index, recordStates[event.index]);
    console.log(`Record ${event.index + 1} is now ${recordStates[event.index] ? 'ON' : 'OFF'}`);
  }
});
```
#### `setSoloLED(index: number, on: boolean, channel?: number): void`
Set a solo LED by track index (0-7) and boolean state. Turns the LED on or off for the given track.
#### `solo`
Emitted when a solo button is pressed or released.
```typescript
apc.on('solo', (event: { index: number, pressed: boolean }) => {
  // event.index: track index (0-7)
  // event.pressed: true for press, false for release
});
```
**Example: Toggle solo LEDs on press**
```javascript
const { APC40, BUTTONS } = require('node-apc40-v1');
const apc = new APC40();
const soloStates = new Array(8).fill(false);

apc.on('solo', (event) => {
  if (event.pressed) {
    soloStates[event.index] = !soloStates[event.index];
    apc.setSoloLED(event.index, soloStates[event.index]);
    console.log(`Solo ${event.index + 1} is now ${soloStates[event.index] ? 'ON' : 'OFF'}`);
  }
});
```
# APC40 MIDI

A simple Node.js module for controlling the Akai APC40 MIDI controller, inspired by [launchpad-midi](https://github.com/ojdon/launchpad-midi).

## Requirements

- **Node.js 14.15+** (required by easymidi dependency)
- APC40 MIDI controller connected via USB

## Installation

```bash
npm install node-apc40-v1
```

## Quick Start

```javascript
const { APC40, LED_NOTES, ClipLEDColor } = require('node-apc40-v1');

const apc = new APC40();

apc.on('connected', () => {
  console.log('APC40 connected!');
  
  // Light up a clip launch button (green)
  apc.setClipLED(LED_NOTES.CLIP_LAUNCH_1, ClipLEDColor.GREEN);
});

apc.on('button-down', (event) => {
  console.log(`Button pressed: 0x${event.note.toString(16)}`);
});

apc.on('button-up', (event) => {
  console.log(`Button released: 0x${event.note.toString(16)}`);
});

apc.on('controller', (event) => {
  console.log(`Knob/Fader: ${event.controlId}, Value: ${event.value}`);
});

apc.on('error', (error) => {
  console.error('Error:', error);
});
```

## API

### Constructor

```typescript
const apc = new APC40(options?: APC40Options);
```

**Options:**
- `deviceName` (string, default: "APC40"): MIDI device name to connect to
- `mode` (APC40Mode, default: GENERIC): Operation mode
- `autoConnect` (boolean, default: true): Automatically connect on instantiation

### Methods

#### `connect(): boolean`
Manually connect to the APC40 device. Returns `true` on success.

#### `disconnect(): void`
Disconnect from the device.


#### `setLED(note: number, state: LEDState, channel?: number): void`
Set an LED to a simple on/off state.

#### `setActivatorLED(index: number, on: boolean, channel?: number): void`
Set an activator LED by track index (0-7) and boolean state. Turns the LED on or off for the given track.
#### `activator`
Emitted when an activator button is pressed or released.
```typescript
apc.on('activator', (event: { index: number, pressed: boolean }) => {
  // event.index: track index (0-7)
  // event.pressed: true for press, false for release
});
```

#### `setClipLED(note: number, color: ClipLEDColor, channel?: number): void`
Set a clip launch LED to a specific color (useful for CLIP_LAUNCH buttons).

#### `clearLED(note: number, channel?: number): void`
Turn off an LED.

#### `setController(controlId: number, value: number, channel?: number): void`
Update a controller value (e.g., knob position, fader level).

#### `setLEDRingType(knobNumber: number, ringType: LEDRingType, channel?: number): void`
Configure LED ring display type for device knobs.

#### Static: `APC40.getInputs(): string[]`
List available MIDI input devices.

#### Static: `APC40.getOutputs(): string[]`
List available MIDI output devices.

### Events

#### `connected`
Emitted when successfully connected to the APC40.

#### `disconnected`
Emitted when disconnected from the APC40.

#### `button-down`
Emitted when a button is pressed.
```typescript
apc.on('button-down', (event: ButtonEvent) => {
  // event.note: button note number
  // event.velocity: velocity value
  // event.channel: MIDI channel
});
```

#### `button-up`
Emitted when a button is released.

#### `controller`
Emitted when a knob/fader/controller value changes.
```typescript
apc.on('controller', (event: ControllerEvent) => {
  // event.controlId: controller ID
  // event.value: controller value (0-127)
  // event.channel: MIDI channel
});
```

#### `error`
Emitted on errors (e.g., device not found).

## Constants

### LED Notes
Access common button note numbers via `LED_NOTES`:
- `CLIP_LAUNCH_1` through `CLIP_LAUNCH_5`
- `SCENE_LAUNCH_1` through `SCENE_LAUNCH_5`
- `RECORD_ARM`, `SOLO`, `ACTIVATOR`
- `PLAY`, `STOP`, `RECORD`
- `UP`, `DOWN`, `LEFT`, `RIGHT`
- `TAP_TEMPO`, `NUDGE_PLUS`, `NUDGE_MINUS`
- And more...

### LED Colors
Use `ClipLEDColor` enum for clip launch buttons:
- `OFF` (0)
- `GREEN` (1)
- `GREEN_BLINK` (2)
- `RED` (3)
- `RED_BLINK` (4)
- `YELLOW` (5)
- `YELLOW_BLINK` (6)

### Controller IDs
Access controller numbers via `CONTROLLER_IDS`:
- `TRACK_LEVEL` (per-track volume)
- `MASTER_LEVEL`
- `CROSSFADER`
- `DEVICE_KNOB_1` through `DEVICE_KNOB_8`
- `TRACK_KNOB_1` through `TRACK_KNOB_8`
- `FOOTSWITCH_1`, `FOOTSWITCH_2`
- `CUE_LEVEL`

### LED Ring Types
Use `LEDRingType` enum:
- `OFF`
- `SINGLE`
- `VOLUME_STYLE`
- `PAN_STYLE`

### Operation Modes
Use `APC40Mode` enum:
- `GENERIC` - Generic control mode
- `ABLETON_LIVE` - Ableton Live specific mode
- `ALTERNATE_ABLETON` - Alternative Ableton mode

## Examples


See the `examples/` directory for more detailed usage:
- `basic.js` - Simple button, controller, and activator LED toggle example
- `interactive.js` - Interactive mode with light testing

**Example: Toggle activator LEDs on press**
```javascript
const { APC40, BUTTONS } = require('node-apc40-v1');
const apc = new APC40();
const activatorStates = new Array(8).fill(false);

apc.on('activator', (event) => {
  if (event.pressed) {
    activatorStates[event.index] = !activatorStates[event.index];
    apc.setActivatorLED(event.index, activatorStates[event.index]);
    console.log(`Activator ${event.index + 1} is now ${activatorStates[event.index] ? 'ON' : 'OFF'}`);
  }
});
```

Run an example:
```bash
npm run build
node examples/basic.js
```

## Protocol Reference

This module implements the APC40 Communications Protocol (Rev 1, May 1, 2009) which communicates with the device via MIDI System Exclusive messages.

## License

MIT

## References

- [APC40 Communications Protocol](https://cdn.inmusicbrands.com/akai/apc40/APC40_Communications_Protocol_rev_1.pdf_1db97c1fdba23bacf47df0f9bf64e913.pdf)
- [launchpad-midi](https://github.com/ojdon/launchpad-midi) - Inspiration for the API design

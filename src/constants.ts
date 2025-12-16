/**
 * APC40 MIDI Protocol Constants
 */

export const PROTOCOL = {
  SYSEX_START: 0xf0,
  SYSEX_END: 0xf7,
  MANUFACTURER_ID: 0x47, // Akai Professional
  DEVICE_ID: 0x7f, // Broadcast
  PRODUCT_ID: 0x73, // APC40
};

export const MESSAGE_TYPES = {
  INQUIRY_REQUEST: 0x06,
  INQUIRY_RESPONSE: 0x02,
  INITIALIZE: 0x60,
  LED: 0x90, // Note On/Off
  CONTROLLER: 0xb0, // CC
};

export enum APC40Mode {
  GENERIC = 0x40,
  ABLETON_LIVE = 0x41,
  ALTERNATE_ABLETON = 0x42,
}

// LED Control
export const LED_NOTES = {
  RECORD_ARM: 0x30,
  SOLO: 0x31,
  ACTIVATOR: 0x32,
  TRACK_SELECTION: 0x33,
  CLIP_STOP: 0x34,
  CLIP_LAUNCH_1: 0x35,
  CLIP_LAUNCH_2: 0x36,
  CLIP_LAUNCH_3: 0x37,
  CLIP_LAUNCH_4: 0x38,
  CLIP_LAUNCH_5: 0x39,
  CLIP_TRACK: 0x3a,
  DEVICE_ON_OFF: 0x3b,
  DETAIL_VIEW: 0x3e,
  MASTER: 0x50,
  STOP_ALL_CLIPS: 0x51,
  SCENE_LAUNCH_1: 0x52,
  SCENE_LAUNCH_2: 0x53,
  SCENE_LAUNCH_3: 0x54,
  SCENE_LAUNCH_4: 0x55,
  SCENE_LAUNCH_5: 0x56,
  PAN: 0x57,
  SEND_A: 0x58,
  SEND_B: 0x59,
  SEND_C: 0x5a,
  PLAY: 0x5b,
  STOP: 0x5c,
  RECORD: 0x5d,
  UP: 0x5e,
  DOWN: 0x5f,
  RIGHT: 0x60,
  LEFT: 0x61,
  SHIFT: 0x62,
  TAP_TEMPO: 0x63,
  NUDGE_PLUS: 0x64,
  NUDGE_MINUS: 0x65,
};

// LED States/Colors
export enum LEDState {
  OFF = 0,
  ON = 1,
  BLINK = 2,
}

export enum ClipLEDColor {
  OFF = 0,
  GREEN = 1,
  GREEN_BLINK = 2,
  RED = 3,
  RED_BLINK = 4,
  YELLOW = 5,
  YELLOW_BLINK = 6,
}

// Controller IDs
export const CONTROLLER_IDS = {
  TRACK_LEVEL: 0x07,
  MASTER_LEVEL: 0x0e,
  CROSSFADER: 0x0f,
  DEVICE_KNOB_1: 0x10,
  DEVICE_KNOB_2: 0x11,
  DEVICE_KNOB_3: 0x12,
  DEVICE_KNOB_4: 0x13,
  DEVICE_KNOB_5: 0x14,
  DEVICE_KNOB_6: 0x15,
  DEVICE_KNOB_7: 0x16,
  DEVICE_KNOB_8: 0x17,
  TRACK_KNOB_1: 0x30,
  TRACK_KNOB_2: 0x31,
  TRACK_KNOB_3: 0x32,
  TRACK_KNOB_4: 0x33,
  TRACK_KNOB_5: 0x34,
  TRACK_KNOB_6: 0x35,
  TRACK_KNOB_7: 0x36,
  TRACK_KNOB_8: 0x37,
  FOOTSWITCH_1: 0x40,
  FOOTSWITCH_2: 0x43,
  CUE_LEVEL: 0x2f,
};

export enum LEDRingType {
  OFF = 0,
  SINGLE = 1,
  VOLUME_STYLE = 2,
  PAN_STYLE = 3,
}

/**
 * Button type classification for safer abstraction
 */
export enum ButtonType {
  // Track buttons (channel-based, range 0-7)
  RECORD_ARM = 'RECORD_ARM',
  SOLO = 'SOLO',
  ACTIVATOR = 'ACTIVATOR',
  TRACK_SELECTION = 'TRACK_SELECTION',

  // Clip buttons (channel-based)
  CLIP_LAUNCH = 'CLIP_LAUNCH',
  CLIP_STOP = 'CLIP_STOP',
  CLIP_TRACK = 'CLIP_TRACK',

  // Scene buttons
  SCENE_LAUNCH = 'SCENE_LAUNCH',

  // Device/navigation buttons
  DEVICE_ON_OFF = 'DEVICE_ON_OFF',
  DETAIL_VIEW = 'DETAIL_VIEW',

  // Control buttons
  MASTER = 'MASTER',
  STOP_ALL_CLIPS = 'STOP_ALL_CLIPS',
  PAN = 'PAN',
  SEND_A = 'SEND_A',
  SEND_B = 'SEND_B',
  SEND_C = 'SEND_C',

  // Transport buttons
  PLAY = 'PLAY',
  STOP = 'STOP',
  RECORD = 'RECORD',
  TAP_TEMPO = 'TAP_TEMPO',

  // Navigation buttons
  UP = 'UP',
  DOWN = 'DOWN',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',

  // Modifiers
  SHIFT = 'SHIFT',

  // Nudge buttons
  NUDGE_PLUS = 'NUDGE_PLUS',
  NUDGE_MINUS = 'NUDGE_MINUS',

  // Recording/quantization
  REC_QUANT = 'REC_QUANT',
  MIDI_OVERDUB = 'MIDI_OVERDUB',
  METRONOME = 'METRONOME',
}

/**
 * Button state for track control buttons
 */
export enum TrackButtonState {
  OFF = 0,
  ON = 1,
  BLINK = 2,
}

/**
 * Controller type classification for safer abstraction
 */
export enum ControllerType {
  TRACK_LEVEL = 'TRACK_LEVEL',
  MASTER_LEVEL = 'MASTER_LEVEL',
  CROSSFADER = 'CROSSFADER',
  DEVICE_KNOB = 'DEVICE_KNOB',
  TRACK_KNOB = 'TRACK_KNOB',
  FOOTSWITCH = 'FOOTSWITCH',
  CUE_LEVEL = 'CUE_LEVEL',
}

// Button Input Notes (from device)
export const INPUT_NOTES = {
  RECORD_ARM: 0x30,
  SOLO: 0x31,
  ACTIVATOR: 0x32,
  TRACK_SELECTION: 0x33,
  CLIP_STOP: 0x34,
  CLIP_LAUNCH_1: 0x35,
  CLIP_LAUNCH_2: 0x36,
  CLIP_LAUNCH_3: 0x37,
  CLIP_LAUNCH_4: 0x38,
  CLIP_LAUNCH_5: 0x39,
  CLIP_TRACK: 0x3a,
  DEVICE_ON_OFF: 0x3b,
  DETAIL_VIEW: 0x3e,
  REC_QUANT: 0x3f,
  MIDI_OVERDUB: 0x40,
  METRONOME: 0x41,
  MASTER: 0x50,
  STOP_ALL_CLIPS: 0x51,
  SCENE_LAUNCH_1: 0x52,
  SCENE_LAUNCH_2: 0x53,
  SCENE_LAUNCH_3: 0x54,
  SCENE_LAUNCH_4: 0x55,
  SCENE_LAUNCH_5: 0x56,
  PAN: 0x57,
  SEND_A: 0x58,
  SEND_B: 0x59,
  SEND_C: 0x5a,
  PLAY: 0x5b,
  STOP: 0x5c,
  RECORD: 0x5d,
  UP: 0x5e,
  DOWN: 0x5f,
  RIGHT: 0x60,
  LEFT: 0x61,
  SHIFT: 0x62,
  TAP_TEMPO: 0x63,
  NUDGE_PLUS: 0x64,
  NUDGE_MINUS: 0x65,
};

/**
 * Helper function to get button name from note number
 */
export function getButtonName(note: number): string {
  for (const [name, value] of Object.entries(INPUT_NOTES)) {
    if (value === note) {
      return name;
    }
  }
  return `UNKNOWN (0x${note.toString(16).toUpperCase()})`;
}

/**
 * Get the button type for a given note
 */
export function getButtonType(note: number): ButtonType | null {
  switch (note) {
    case INPUT_NOTES.RECORD_ARM:
      return ButtonType.RECORD_ARM;
    case INPUT_NOTES.SOLO:
      return ButtonType.SOLO;
    case INPUT_NOTES.ACTIVATOR:
      return ButtonType.ACTIVATOR;
    case INPUT_NOTES.TRACK_SELECTION:
      return ButtonType.TRACK_SELECTION;
    case INPUT_NOTES.CLIP_STOP:
      return ButtonType.CLIP_STOP;
    case INPUT_NOTES.CLIP_LAUNCH_1:
    case INPUT_NOTES.CLIP_LAUNCH_2:
    case INPUT_NOTES.CLIP_LAUNCH_3:
    case INPUT_NOTES.CLIP_LAUNCH_4:
    case INPUT_NOTES.CLIP_LAUNCH_5:
      return ButtonType.CLIP_LAUNCH;
    case INPUT_NOTES.CLIP_TRACK:
      return ButtonType.CLIP_TRACK;
    case INPUT_NOTES.DEVICE_ON_OFF:
      return ButtonType.DEVICE_ON_OFF;
    case INPUT_NOTES.DETAIL_VIEW:
      return ButtonType.DETAIL_VIEW;
    case INPUT_NOTES.REC_QUANT:
      return ButtonType.REC_QUANT;
    case INPUT_NOTES.MIDI_OVERDUB:
      return ButtonType.MIDI_OVERDUB;
    case INPUT_NOTES.METRONOME:
      return ButtonType.METRONOME;
    case INPUT_NOTES.MASTER:
      return ButtonType.MASTER;
    case INPUT_NOTES.STOP_ALL_CLIPS:
      return ButtonType.STOP_ALL_CLIPS;
    case INPUT_NOTES.SCENE_LAUNCH_1:
    case INPUT_NOTES.SCENE_LAUNCH_2:
    case INPUT_NOTES.SCENE_LAUNCH_3:
    case INPUT_NOTES.SCENE_LAUNCH_4:
    case INPUT_NOTES.SCENE_LAUNCH_5:
      return ButtonType.SCENE_LAUNCH;
    case INPUT_NOTES.PAN:
      return ButtonType.PAN;
    case INPUT_NOTES.SEND_A:
      return ButtonType.SEND_A;
    case INPUT_NOTES.SEND_B:
      return ButtonType.SEND_B;
    case INPUT_NOTES.SEND_C:
      return ButtonType.SEND_C;
    case INPUT_NOTES.PLAY:
      return ButtonType.PLAY;
    case INPUT_NOTES.STOP:
      return ButtonType.STOP;
    case INPUT_NOTES.RECORD:
      return ButtonType.RECORD;
    case INPUT_NOTES.UP:
      return ButtonType.UP;
    case INPUT_NOTES.DOWN:
      return ButtonType.DOWN;
    case INPUT_NOTES.RIGHT:
      return ButtonType.RIGHT;
    case INPUT_NOTES.LEFT:
      return ButtonType.LEFT;
    case INPUT_NOTES.SHIFT:
      return ButtonType.SHIFT;
    case INPUT_NOTES.TAP_TEMPO:
      return ButtonType.TAP_TEMPO;
    case INPUT_NOTES.NUDGE_PLUS:
      return ButtonType.NUDGE_PLUS;
    case INPUT_NOTES.NUDGE_MINUS:
      return ButtonType.NUDGE_MINUS;
    default:
      return null;
  }
}

/**
 * Check if a button type has multiple instances (like clip launches or scenes)
 */
export function getButtonIndex(note: number): number | null {
  const clipLaunches = [
    INPUT_NOTES.CLIP_LAUNCH_1,
    INPUT_NOTES.CLIP_LAUNCH_2,
    INPUT_NOTES.CLIP_LAUNCH_3,
    INPUT_NOTES.CLIP_LAUNCH_4,
    INPUT_NOTES.CLIP_LAUNCH_5,
  ];

  const sceneLaunches = [
    INPUT_NOTES.SCENE_LAUNCH_1,
    INPUT_NOTES.SCENE_LAUNCH_2,
    INPUT_NOTES.SCENE_LAUNCH_3,
    INPUT_NOTES.SCENE_LAUNCH_4,
    INPUT_NOTES.SCENE_LAUNCH_5,
  ];

  const clipIndex = clipLaunches.indexOf(note);
  if (clipIndex !== -1) {
    return clipIndex + 1; // 1-based index
  }

  const sceneIndex = sceneLaunches.indexOf(note);
  if (sceneIndex !== -1) {
    return sceneIndex + 1; // 1-based index
  }

  return null;
}

/**
 * Helper function to get controller name from controller ID
 */
export function getControllerName(controllerId: number, channel?: number): string {
  // Check absolute controllers
  for (const [name, value] of Object.entries(CONTROLLER_IDS)) {
    if (value === controllerId) {
      // Add channel info for banked controllers
      if (channel !== undefined) {
        if (controllerId === CONTROLLER_IDS.TRACK_LEVEL) {
          return `TRACK_LEVEL_${channel + 1}`;
        } else if (controllerId >= 0x10 && controllerId <= 0x17) {
          // Device knobs
          const knobNum = controllerId - 0x10 + 1;
          return `DEVICE_KNOB_${knobNum}`;
        }
      }
      return name;
    }
  }
  return `UNKNOWN (0x${controllerId.toString(16).toUpperCase()})`;
}

/**
 * Get the controller type for a given controller ID
 */
export function getControllerType(
  controllerId: number
): ControllerType | null {
  if (controllerId === CONTROLLER_IDS.TRACK_LEVEL) {
    return ControllerType.TRACK_LEVEL;
  } else if (controllerId === CONTROLLER_IDS.MASTER_LEVEL) {
    return ControllerType.MASTER_LEVEL;
  } else if (controllerId === CONTROLLER_IDS.CROSSFADER) {
    return ControllerType.CROSSFADER;
  } else if (controllerId >= 0x10 && controllerId <= 0x17) {
    return ControllerType.DEVICE_KNOB;
  } else if (controllerId >= 0x30 && controllerId <= 0x37) {
    return ControllerType.TRACK_KNOB;
  } else if (
    controllerId === CONTROLLER_IDS.FOOTSWITCH_1 ||
    controllerId === CONTROLLER_IDS.FOOTSWITCH_2
  ) {
    return ControllerType.FOOTSWITCH;
  } else if (controllerId === CONTROLLER_IDS.CUE_LEVEL) {
    return ControllerType.CUE_LEVEL;
  }
  return null;
}

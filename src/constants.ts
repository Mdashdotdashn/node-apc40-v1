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

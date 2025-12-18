import { EventEmitter } from 'events';
import * as midi from 'easymidi';
import { APC40Mode, ClipLEDColor, LEDRingType, LEDState } from './constants';
import {
  buildInitializeMessage,
  buildLEDOnMessage,
  buildLEDOffMessage,
  buildControllerMessage,
  bytesToBuffer,
  parseNoteMessage,
  parseControllerMessage,
} from './utils';

export interface APC40Options {
  deviceName?: string;
  autoConnect?: boolean;
}

export interface ButtonEvent {
  note: number;
  velocity: number;
  channel: number;
}

export interface ControllerEvent {
  controlId: number;
  value: number;
  channel: number;
}

export interface ClipLaunchEvent {
  x: number; // Track column (0-7)
  y: number; // Clip row (0-4)
  pressed: boolean; // true for press, false for release
}

/**
 * Main APC40 controller class
 * 
 * NOTE: Always uses ALTERNATE_ABLETON mode for maximum API consistency.
 * This mode provides:
 * - ALL buttons as momentary (simpler, more consistent behavior)
 * - ALL LEDs (including rings) controlled by the host
 * - NO firmware-managed banking or special cases
 * See initialize() method.
 */
export class APC40 extends EventEmitter {
  private input?: midi.Input;
  private output?: midi.Output;
  private deviceName: string;
  private readonly mode: APC40Mode = APC40Mode.ALTERNATE_ABLETON;
  private isConnected: boolean = false;

  constructor(options: APC40Options = {}) {
    super();
    this.deviceName = options.deviceName || 'APC40';

    if (options.autoConnect !== false) {
      this.connect();
    }
  }

  /**
   * Connect to the APC40 device
   */
  connect(): boolean {
    try {
      const inputs = midi.getInputs();
      const outputs = midi.getOutputs();

      const inputName = inputs.find((name) => name.includes(this.deviceName));
      const outputName = outputs.find((name) => name.includes(this.deviceName));

      if (!inputName || !outputName) {
        throw new Error(
          `Could not find APC40 device. Available inputs: ${inputs.join(', ')}. Available outputs: ${outputs.join(', ')}`
        );
      }

      this.input = new midi.Input(inputName);
      this.output = new midi.Output(outputName);

      // Setup input handlers for note on/off
      this.input.on('noteon', (msg: any) => {
        this.handleNoteOn(msg);
      });

      this.input.on('noteoff', (msg: any) => {
        this.handleNoteOff(msg);
      });

      // Setup input handler for CC (control change) messages
      (this.input as any).on('cc', (msg: any) => {
        this.handleControlChange(msg);
      });

      this.isConnected = true;
      this.initialize();
      this.resetToDefaults();
      this.emit('connected');

      return true;
    } catch (error) {
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Reset device to default state: turn off all LEDs and set all controllers to 0
   */
  private resetToDefaults(): void {
    if (!this.output) {
      return;
    }

    // Turn off all channel-based LEDs (0x30-0x39) across all 8 channels
    // Use noteon with velocity 0 (OFF) rather than noteoff
    const channelBasedNotes = [
      0x30, // RECORD_ARM
      0x31, // SOLO
      0x32, // ACTIVATOR
      0x33, // TRACK_SELECTION
      0x34, // CLIP_STOP
      0x35, // CLIP_LAUNCH_1
      0x36, // CLIP_LAUNCH_2
      0x37, // CLIP_LAUNCH_3
      0x38, // CLIP_LAUNCH_4
      0x39, // CLIP_LAUNCH_5
    ];

    channelBasedNotes.forEach((note) => {
      for (let channel = 0; channel < 8; channel++) {
        try {
          (this.output as any).send('noteon', {
            note: note & 0x7f,
            velocity: 0, // OFF
            channel: channel & 0x0f,
          });
        } catch (error) {
          // Silently ignore errors during reset
        }
      }
    });

    // Turn off all non-channel LEDs
    const globalNotes = [
      0x3a, // CLIP_TRACK
      0x3b, // DEVICE_ON_OFF
      0x3e, // DETAIL_VIEW
      0x50, // MASTER
      0x51, // STOP_ALL_CLIPS
      0x52, // SCENE_LAUNCH_1
      0x53, // SCENE_LAUNCH_2
      0x54, // SCENE_LAUNCH_3
      0x55, // SCENE_LAUNCH_4
      0x56, // SCENE_LAUNCH_5
      0x57, // PAN
      0x58, // SEND_A
      0x59, // SEND_B
      0x5a, // SEND_C
      0x5b, // PLAY
      0x5c, // STOP
      0x5d, // RECORD
      0x5e, // UP
      0x5f, // DOWN
      0x60, // RIGHT
      0x61, // LEFT
      0x62, // SHIFT
      0x63, // TAP_TEMPO
      0x64, // NUDGE_PLUS
      0x65, // NUDGE_MINUS
    ];

    globalNotes.forEach((note) => {
      try {
        (this.output as any).send('noteon', {
          note: note & 0x7f,
          velocity: 0, // OFF
          channel: 0,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    });

    // Reset all track level controllers (0x07 with channels 0-7)
    for (let channel = 0; channel < 8; channel++) {
      try {
        (this.output as any).send('cc', {
          controller: 0x07,
          value: 0,
          channel,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    }

    // Reset master level and other global controllers
    const globalControllers = [
      0x0e, // MASTER_LEVEL
      0x0f, // CROSSFADER
      0x2f, // CUE_LEVEL
    ];
    globalControllers.forEach((controller) => {
      try {
        (this.output as any).send('cc', {
          controller,
          value: 0,
          channel: 0,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    });

    // Reset all device knobs (0x10-0x17)
    for (let knob = 0x10; knob <= 0x17; knob++) {
      try {
        (this.output as any).send('cc', {
          controller: knob,
          value: 0,
          channel: 0,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    }

    // Reset all track knobs (0x30-0x37)
    for (let knob = 0x30; knob <= 0x37; knob++) {
      try {
        (this.output as any).send('cc', {
          controller: knob,
          value: 0,
          channel: 0,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    }

    // Reset footswitches
    [0x40, 0x43].forEach((controller) => {
      try {
        (this.output as any).send('cc', {
          controller,
          value: 0,
          channel: 0,
        });
      } catch (error) {
        // Silently ignore errors during reset
      }
    });
  }

  /**
   * Disconnect from the device
   */
  disconnect(): void {
    if (this.input) {
      this.input.close();
      this.input = undefined;
    }
    if (this.output) {
      this.output.close();
      this.output = undefined;
    }
    this.isConnected = false;
    this.emit('disconnected');
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Initialize the APC40
   */
  private initialize(): void {
    const msg = buildInitializeMessage(this.mode, 1, 0, 0);
    this.sendRawMessage(msg);
  }

  /**
   * Send raw MIDI message
   */
  private sendRawMessage(bytes: number[]): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    try {
      this.output.send('sysex', bytes);
    } catch (error: any) {
      // Log sysex errors for debugging
      console.error('Sysex error:', error.message);
    }
  }

  /**
   * Handle note on message
   */
  private handleNoteOn(msg: any): void {
    const note = msg.note?.number ?? msg.note ?? 0;
    const velocity = msg.velocity ?? msg.velocity ?? 0;
    const channel = msg.channel ?? 0;

    if (velocity > 0) {
      this.emit('button-down', {
        note,
        velocity,
        channel,
      } as ButtonEvent);

      // Check if this is a clip launch button and emit high-level event
      const clipLaunchEvent = this.getNoteAsClipLaunch(note, channel);
      if (clipLaunchEvent) {
        this.emit('clip-launch', {
          ...clipLaunchEvent,
          pressed: true,
        } as ClipLaunchEvent);
      }
    }
  }

  /**
   * Handle note off message
   */
  private handleNoteOff(msg: any): void {
    const note = msg.note?.number ?? msg.note ?? 0;
    const velocity = msg.velocity ?? msg.velocity ?? 0;
    const channel = msg.channel ?? 0;

    this.emit('button-up', {
      note,
      velocity,
      channel,
    } as ButtonEvent);

    // Check if this is a clip launch button and emit high-level event
    const clipLaunchEvent = this.getNoteAsClipLaunch(note, channel);
    if (clipLaunchEvent) {
      this.emit('clip-launch', {
        ...clipLaunchEvent,
        pressed: false,
      } as ClipLaunchEvent);
    }
  }

  /**
   * Convert note and channel to clip launch grid coordinates if applicable
   * Returns {x, y} where x is track (0-7) and y is clip (0-4), or null if not a clip launch button
   */
  private getNoteAsClipLaunch(
    note: number,
    channel: number
  ): { x: number; y: number } | null {
    // CLIP_LAUNCH_1 = 0x35, CLIP_LAUNCH_2 = 0x36, ..., CLIP_LAUNCH_5 = 0x39
    const CLIP_LAUNCH_START = 0x35;
    const CLIP_LAUNCH_END = 0x39;

    if (note >= CLIP_LAUNCH_START && note <= CLIP_LAUNCH_END) {
      return {
        x: channel, // Track (0-7)
        y: note - CLIP_LAUNCH_START, // Clip (0-4)
      };
    }

    return null;
  }

  /**
   * Handle CC (control change) message
   */
  private handleControlChange(msg: any): void {
    const controlId = msg.controller ?? 0;
    const value = msg.value ?? 0;
    const channel = msg.channel ?? 0;

    this.emit('controller', {
      controlId,
      value,
      channel,
    } as ControllerEvent);
  }

  /**
   * Handle incoming MIDI messages (legacy, not used with easymidi)
   */
  private handleMidiMessage(msg: any): void {
    if (!msg || !msg.data || msg.data.length === 0) {
      return;
    }

    const bytes = Array.from(msg.data) as number[];

    // Try to parse as note message
    const noteMsg = parseNoteMessage(bytes);
    if (noteMsg) {
      if (noteMsg.isNoteOn && noteMsg.velocity > 0) {
        this.emit('button-down', {
          note: noteMsg.note,
          velocity: noteMsg.velocity,
          channel: noteMsg.channel,
        } as ButtonEvent);
      } else {
        this.emit('button-up', {
          note: noteMsg.note,
          velocity: noteMsg.velocity,
          channel: noteMsg.channel,
        } as ButtonEvent);
      }
      return;
    }

    // Try to parse as controller message
    const ccMsg = parseControllerMessage(bytes);
    if (ccMsg) {
      this.emit('controller', {
        controlId: ccMsg.controlId,
        value: ccMsg.value,
        channel: ccMsg.channel,
      } as ControllerEvent);
      return;
    }
  }

  /**
   * Set LED state
   */
  setLED(note: number, state: LEDState | number, channel: number = 0): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    try {
      (this.output as any).send('noteon', {
        note: note & 0x7f,
        velocity: state & 0x7f,
        channel: channel & 0x0f,
      });
    } catch (error) {
      console.error('Error setting LED:', error);
    }
  }

  /**
   * Set clip launch LED color
   */
  setClipLED(note: number, color: ClipLEDColor, channel: number = 0): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    try {
      (this.output as any).send('noteon', {
        note: note & 0x7f,
        velocity: color & 0x7f,
        channel: channel & 0x0f,
      });
    } catch (error) {
      console.error('Error setting clip LED:', error);
    }
  }

  /**
   * Set clip launch LED color using grid coordinates
   * @param x Track column (0-7)
   * @param y Clip row (0-4)
   * @param color LED color value
   */
  setClipLaunchColor(x: number, y: number, color: ClipLEDColor): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    // Map grid coordinates to MIDI note and channel
    // y (0-4) maps to notes 0x35-0x39
    // x (0-7) maps to channels 0-7
    const note = 0x35 + y;
    const channel = x & 0x07;

    try {
      (this.output as any).send('noteon', {
        note: note & 0x7f,
        velocity: color & 0x7f,
        channel: channel & 0x0f,
      });
    } catch (error) {
      console.error('Error setting clip launch LED:', error);
    }
  }

  /**
   * Turn off an LED
   */
  clearLED(note: number, channel: number = 0): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    try {
      (this.output as any).send('noteoff', {
        note: note & 0x7f,
        velocity: 0,
        channel: channel & 0x0f,
      });
    } catch (error) {
      console.error('Error clearing LED:', error);
    }
  }

  /**
   * Set controller value (knob, fader, etc.)
   */
  setController(controlId: number, value: number, channel: number = 0): void {
    if (!this.output) {
      throw new Error('Not connected to APC40');
    }

    try {
      (this.output as any).send('cc', {
        controller: controlId & 0x7f,
        value: value & 0x7f,
        channel: channel & 0x0f,
      });
    } catch (error) {
      console.error('Error setting controller:', error);
    }
  }

  /**
   * Set LED ring type for knobs
   */
  setLEDRingType(
    knobNumber: number,
    ringType: LEDRingType,
    channel: number = 0
  ): void {
    // LED ring type control IDs start at 0x18 for device knobs
    const controlId = 0x18 + knobNumber;
    this.setController(controlId, ringType, channel);
  }

  /**
   * List available MIDI inputs
   */
  static getInputs(): string[] {
    return midi.getInputs();
  }

  /**
   * List available MIDI outputs
   */
  static getOutputs(): string[] {
    return midi.getOutputs();
  }
}

export default APC40;

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
      this.emit('connected');

      return true;
    } catch (error) {
      this.emit('error', error);
      return false;
    }
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

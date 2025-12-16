import { PROTOCOL, MESSAGE_TYPES, APC40Mode } from './constants';

/**
 * Builds a System Exclusive (SysEx) message for APC40
 */
export function buildSysExMessage(messageId: number, data: number[]): number[] {
  const message: number[] = [];

  message.push(PROTOCOL.SYSEX_START);
  message.push(PROTOCOL.MANUFACTURER_ID);
  message.push(PROTOCOL.DEVICE_ID);
  message.push(PROTOCOL.PRODUCT_ID);
  message.push(messageId);

  // Data length as 16-bit value (MSB, LSB)
  const dataLength = data.length;
  message.push((dataLength >> 8) & 0x7f); // MSB
  message.push(dataLength & 0x7f); // LSB

  message.push(...data);
  message.push(PROTOCOL.SYSEX_END);

  return message;
}

/**
 * Builds initialization message (Type 0)
 */
export function buildInitializeMessage(
  mode: APC40Mode,
  versionHigh: number,
  versionLow: number,
  bugfixLevel: number
): number[] {
  const data = [mode, versionHigh, versionLow, bugfixLevel];
  return buildSysExMessage(MESSAGE_TYPES.INITIALIZE, data);
}

/**
 * Builds LED control message (Note On)
 */
export function buildLEDOnMessage(
  note: number,
  velocity: number,
  channel: number = 0
): number[] {
  return [
    0x90 | (channel & 0x0f), // Note On
    note & 0x7f,
    velocity & 0x7f,
  ];
}

/**
 * Builds LED control message (Note Off)
 */
export function buildLEDOffMessage(note: number, channel: number = 0): number[] {
  return [
    0x80 | (channel & 0x0f), // Note Off
    note & 0x7f,
    0x00,
  ];
}

/**
 * Builds controller value update message
 */
export function buildControllerMessage(
  controlId: number,
  value: number,
  channel: number = 0
): number[] {
  return [
    0xb0 | (channel & 0x0f), // CC
    controlId & 0x7f,
    value & 0x7f,
  ];
}

/**
 * Converts a byte array to a Buffer
 */
export function bytesToBuffer(bytes: number[]): Buffer {
  return Buffer.from(bytes);
}

/**
 * Parses an inbound note message
 */
export function parseNoteMessage(
  bytes: number[]
): { isNoteOn: boolean; note: number; velocity: number; channel: number } | null {
  if (bytes.length < 3) {
    return null;
  }

  const status = bytes[0];
  const isNoteOn = (status & 0xf0) === 0x90;

  if (!isNoteOn && (status & 0xf0) !== 0x80) {
    return null;
  }

  return {
    isNoteOn,
    note: bytes[1] & 0x7f,
    velocity: bytes[2] & 0x7f,
    channel: status & 0x0f,
  };
}

/**
 * Parses an inbound controller message
 */
export function parseControllerMessage(
  bytes: number[]
): { controlId: number; value: number; channel: number } | null {
  if (bytes.length < 3) {
    return null;
  }

  const status = bytes[0];

  if ((status & 0xf0) !== 0xb0) {
    return null;
  }

  return {
    controlId: bytes[1] & 0x7f,
    value: bytes[2] & 0x7f,
    channel: status & 0x0f,
  };
}

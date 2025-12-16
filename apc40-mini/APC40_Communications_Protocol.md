## Page 1

Communications Protocol for
Akai APC40 Controller

---

## Page 2

Table of Contents
Introduction .................................................................................................................................................... 3
Scope ............................................................................................................................................................. 3
Glossary ......................................................................................................................................................... 3
General Format of MIDI System Exclusive message .................................................................................... 3
Communications from PC Host to device - “Outbound” messages ............................................................... 4
“Universal” MIDI messages ...................................................................................................................... 4
Device Enquiry .................................................................................................................................... 4
Format of Device Inquiry Request message from Host to Device ................................................. 4
Format of response from APC40 to Device Inquiry message ........................................................ 4
Outbound APC40 Sysex Message Types ................................................................................................ 6
Outbound Message Type 0: Introduction ............................................................................................ 6
Format of Type 0 outbound message ............................................................................................ 7
Outbound Message Type 1: LEDs. ..................................................................................................... 8
Format of Type 1 outbound Midi note-on messages ..................................................................... 8
Format of Type 1 outbound Midi note-off messages ..................................................................... 8
Assignment of Note number messages to LEDs. Note 0x30 to 0x39 use MIDI Channel 0 to 7 to
indicate Tracks 1-8. All other note values ignore the MIDI Channel. ............................................ 8
Outbound Message Type 2: Controller Value Update messages ..................................................... 10
MIDI Controller message ............................................................................................................. 10
Assignment of controller numbers to absolute controllers ........................................................... 10
Interpretation of LED Ring Types ...................................................................................................... 12
Communications from device to PC Host - “Inbound” messages ............................................................... 15
Inbound Standard MIDI Message types ................................................................................................. 15
Type NOTE1: Note-on/Note-off messages ....................................................................................... 15
Midi note-on messages ................................................................................................................ 15
Midi note-off messages ................................................................................................................ 16
Type CC1: Absolute Controller messages ........................................................................................ 18
MIDI Controller message ............................................................................................................. 18
Assignment of controller numbers to absolute controllers ........................................................... 18
Type CC2: Relative Controller messages ......................................................................................... 19
MIDI Controller message ............................................................................................................. 19
Interpretation of MIDI Controller values for Relative Controllers ................................................. 19
Assignment of controller numbers to relative controllers ............................................................. 20
Document History ........................................................................................................................................ 20

---

## Page 3


| byte
number | value | description |
|---|---|---|
| 1 | 0xF0 | MIDI System exclusive message start |
| 2 | 0x47 | Manufacturers ID Byte |
| 3 | <DeviceID> | System Exclusive Device ID |
| 4 | 0x73 | Product model ID |
| 5 | <Message ID> | Message type identifier |
| 6 | <DataLengthMS> | Number of data bytes to follow (most significant) |
| 7 | <DataLengthLS> | Number of data bytes to follow (least significant) |
| 8 | n data bytes | Data field – n bytes long |
| n+8 | 0xF7 | MIDI System exclusive message terminator |

Generic Communication Protocol for Akai APC40 Controller
Introduction
The Akai APC40 Controller is a device that provides a control surface interface to Ableton Live software.
This controller can alternately be used for controlling other software applications as well. The means of
communication will be by MIDI messages over USB.
Scope
This document describes the format of messages between the APC40 and the PC/Mac Host.
Glossary
Outbound: The term “outbound” is used to describe messages sent from the PC Host to the device, i.e.
from the viewpoint of the PC Host.
Inbound: The term “inbound” is used to describe messages sent from the device to the PC Host, i.e. from
the viewpoint of the PC Host.
General Format of MIDI System Exclusive message
The System Exclusive messages exchanged between the PC Host and the device will be of the following
format:
byte value description
number
1 0xF0 MIDI System exclusive message start
2 0x47 Manufacturers ID Byte
3 <DeviceID> System Exclusive Device ID
4 0x73 Product model ID
5 <Message ID> Message type identifier
6 <DataLengthMS> Number of data bytes to follow (most significant)
7 <DataLengthLS> Number of data bytes to follow (least significant)
8 n data bytes Data field – n bytes long
n+8 0xF7 MIDI System exclusive message terminator
The Manufacturer's identity field will contain the one-byte code allocated to Akai Professional, which is 0x47
Rev 1 – May 1, 2009 Page 3

---

## Page 4


| byte
number | value | Description |
|---|---|---|
| 1 | 0xF0 | MIDI System exclusive message start |
| 2 | 0x7E | Non-Realtime Message |
| 3 | 0x00 | Channel to inquire. (Set to 0 for this protocol.) |
| 4 | 0x06 | Inquiry Message |
| 5 | 0x01 | Inquiry Request |
| 6 | 0xF7 | MIDI System exclusive message terminator |


| byte
number | value | description |
|---|---|---|

Generic Communication Protocol for Akai APC40 Controller
The System Exclusive Device ID is typically used to select between multiple devices connected to the same
PC Host. In our application, we only expect one APC40 to be connected at any one time and so a value of
0x7F (broadcast) should be used (and it is unlikely that the APC40 will pay any regard to this field).
The Product model ID is intended to select between different Akai Professional devices that are connected to
the PC Host to ensure that the message is only received by APC40 devices.
The Message type identifier identifies the type of the message. This field will determine the size of the data
field and how the data field bytes should be interpreted.
There will be a number of data bytes in the message. Different message types are likely to have a different
data field lengths/formats.
Communications from PC Host to device - “Outbound” messages
“Universal” MIDI messages
Device Enquiry
APC40 supports the standard MMC Device Enquiry message. These System Exclusive messages are part
of the Midi Machine Control Standard and do not follow the general format for APC40 System Exclusive
messages.
Format of Device Inquiry Request message from Host to Device
byte value Description
number
1 0xF0 MIDI System exclusive message start
2 0x7E Non-Realtime Message
3 0x00 Channel to inquire. (Set to 0 for this protocol.)
4 0x06 Inquiry Message
5 0x01 Inquiry Request
6 0xF7 MIDI System exclusive message terminator
The APC40 Controller will respond to a Device Inquiry Request message with the following message:
Format of response from APC40 to Device Inquiry message
byte value description
number
Rev 1 – May 1, 2009 Page 4

---

## Page 5


| byte
number | value | description |
|---|---|---|
| 1 | 0xF0 | MIDI System exclusive message start |
| 2 | 0x7E | Non-Realtime Message |
| 3 | <MIDI Channel> | Common MIDI channel setting |
| 4 | 0x06 | Inquiry Message |
| 5 | 0x02 | Inquiry Response |
| 6 | 0x47 | Manufacturers ID Byte |
| 7 | 0x73 | Product model ID |
| 8 | 0x00 | Number of data bytes to follow (most significant) |
| 9 | 0x19 | Number of data bytes to follow (least significant) |
| 10 | <Version1> | Software version major most significant |
| 11 | <Version2> | Software version major least significant |
| 12 | <Version3> | Software version minor most significant |
| 13 | <Version4> | Software version minor least significant |
| 14 | <DeviceID> | System Exclusive Device ID |
| 15 | <Serial1> | Serial Number first digit |
| 16 | <Serial2> | Serial Number second digit |
| 17 | <Serial3> | Serial Number third digit |
| 18 | <Serial4> | Serial Number fourth digit |
| 19 | <Manufacturing1> | Manufacturing Data byte 1 |
| 20 | <Manufacturing2> | Manufacturing Data byte 2 |
| 21 | <Manufacturing3 | Manufacturing Data byte 3 |
| 22 | <Manufacturing4> | Manufacturing Data byte 4 |
| 23 | <Manufacturing5> | Manufacturing Data byte 5 |
| 24 | <Manufacturing6> | Manufacturing Data byte 6 |
| 25 | <Manufacturing7> | Manufacturing Data byte 7 |
| 26 | <Manufacturing8> | Manufacturing Data byte 8 |

Generic Communication Protocol for Akai APC40 Controller
byte value description
number
1 0xF0 MIDI System exclusive message start
2 0x7E Non-Realtime Message
3 <MIDI Channel> Common MIDI channel setting
4 0x06 Inquiry Message
5 0x02 Inquiry Response
6 0x47 Manufacturers ID Byte
7 0x73 Product model ID
8 0x00 Number of data bytes to follow (most significant)
9 0x19 Number of data bytes to follow (least significant)
10 <Version1> Software version major most significant
11 <Version2> Software version major least significant
12 <Version3> Software version minor most significant
13 <Version4> Software version minor least significant
14 <DeviceID> System Exclusive Device ID
15 <Serial1> Serial Number first digit
16 <Serial2> Serial Number second digit
17 <Serial3> Serial Number third digit
18 <Serial4> Serial Number fourth digit
19 <Manufacturing1> Manufacturing Data byte 1
20 <Manufacturing2> Manufacturing Data byte 2
21 <Manufacturing3 Manufacturing Data byte 3
22 <Manufacturing4> Manufacturing Data byte 4
23 <Manufacturing5> Manufacturing Data byte 5
24 <Manufacturing6> Manufacturing Data byte 6
25 <Manufacturing7> Manufacturing Data byte 7
26 <Manufacturing8> Manufacturing Data byte 8
Rev 1 – May 1, 2009 Page 5

---

## Page 6


| byte
number | value | description |
|---|---|---|
| 27 | <Manufacturing9> | Manufacturing Data byte 9 |
| 28 | <Manufacturing10> | Manufacturing Data byte 10 |
| 29 | <Manufacturing11> | Manufacturing Data byte 11 |
| 30 | <Manufacturing12> | Manufacturing Data byte 12 |
| 31 | <Manufacturing13> | Manufacturing Data byte 13 |
| 32 | <Manufacturing14> | Manufacturing Data byte 14 |
| 33 | <Manufacturing15> | Manufacturing Data byte 15 |
| 34 | <Manufacturing16> | Manufacturing Data byte 16 |
| 35 | 0xF7 | MIDI System exclusive message terminator |


| Mode | Identifier | Name |
|---|---|---|
| 0 | 0x40 | Generic Mode |
| 1 | 0x41 | Ableton Live Mode |
| 2 | 0x42 | Alternate Ableton Live Mode |

Generic Communication Protocol for Akai APC40 Controller
byte value description
number
27 <Manufacturing9> Manufacturing Data byte 9
28 <Manufacturing10> Manufacturing Data byte 10
29 <Manufacturing11> Manufacturing Data byte 11
30 <Manufacturing12> Manufacturing Data byte 12
31 <Manufacturing13> Manufacturing Data byte 13
32 <Manufacturing14> Manufacturing Data byte 14
33 <Manufacturing15> Manufacturing Data byte 15
34 <Manufacturing16> Manufacturing Data byte 16
35 0xF7 MIDI System exclusive message terminator
Outbound APC40 Sysex Message Types
There will be three types of message from the PC host to the device.
Outbound Message Type 0: Introduction
This message is sent before any other device-specific message (i.e. other than Device Enquiry). It instructs
the APC40 to perform the necessary initialization and informs the firmware of the version number of the
application in order that changes in the application can be catered for in the APC40 firmware.
There are three modes that are accepted. The unit defaults to Mode 0 on startup.
Mode Identifier Name
0 0x40 Generic Mode
1 0x41 Ableton Live Mode
2 0x42 Alternate Ableton Live Mode
Notes Regarding Generic Mode (Mode 0):
-[CLIP LAUNCH] buttons are momentary and should light the green LED when ON
-[CLIP STOP] buttons are momentary and should light its LED when ON
-[ACTIVATOR], [SOLO], [RECORD ARM] are toggle buttons and should light its LED when ON
-[TRACK SELECTION] buttons (1-8 + MASTER) are radio style and only one of the 9 buttons are ON at a
time. When ON its LED should light. These buttons will NOT send out MIDI in generic mode for its
state. These buttons dictate which one of nine banks the DEVICE CONTROL knobs and DEVICE
CONTROL switches belong to. These knobs and switches will output on a different MIDI channel
Rev 1 – May 1, 2009 Page 6

---

## Page 7


| byte
number | value | description |
|---|---|---|
| 1 | 0xF0 | MIDI System exclusive message start |
| 2 | 0x47 | Manufacturers ID Byte |
| 3 | <DeviceID> | System Exclusive Device ID |
| 4 | 0x73 | Product model ID |
| 5 | 0x60 | Message type identifier |
| 6 | 0x00 | Number of data bytes to follow (most significant) |

Generic Communication Protocol for Akai APC40 Controller
based on the current Track Selection (track 1 = MIDI channel 0, track 8 = MIDI channel 7, MASTER =
MIDI channel 8). Upon pressing one of the Track Selection buttons, the current position of the 8
Device Control knobs will be sent.
-[CLIP/TRACK (1)], [DEVICE ON/OFF (2)], [(cid:197) (3)], [(cid:198) (4)] will be toggle style and will light its LED when
ON
-[DETAIL VIEW (5)], [REC QUANTIZATION (6)], [MIDI OVERDUB (7)], [METRONOME (8)] will be
momentary style and will light its LED when ON
-[SCENE LAUNCH] and [STOP ALL CLIPS] buttons are momentary buttons and will light its LED when
ON
-TRACK CONTROL buttons are toggle buttons and will light its LED when ON
-TRACK CONTROL KNOBS and buttons are NOT banked in any way
-[PLAY], [STOP], [RECORD], [UP], [DOWN], [LEFT], [RIGHT], [SHIFT], [NUDGE+], [NUDGE-], [TAP
TEMPO] are momentary buttons
-LED rings are all set to SINGLE style
Notes Regarding Ableton Live Mode (Mode 1):
- All buttons are momentary buttons
- Device control knobs and buttons are not banked within the APC40
- LED Rings around the knobs are controlled by the APC40 but can be updated by the Host
- All other LEDs are controlled by the Host
Notes Regarding Alternate Ableton Live Mode (Mode 2):
- All buttons are momentary buttons
- Device control knobs and buttons are not banked within the APC40
- All LEDs are controlled by the Host
Format of Type 0 outbound message
byte value description
number
1 0xF0 MIDI System exclusive message start
2 0x47 Manufacturers ID Byte
3 <DeviceID> System Exclusive Device ID
4 0x73 Product model ID
5 0x60 Message type identifier
6 0x00 Number of data bytes to follow (most significant)
Rev 1 – May 1, 2009 Page 7

---

## Page 8


| byte
number | value | description |
|---|---|---|
| 7 | 0x04 | Number of data bytes to follow (least significant) |
| 8 | 0x40 or 0x41 or 0x42 | Application/Configuration identifier |
| 9 | <Version High> | PC application Software version major |
| 10 | <Version Low> | PC application Software version minor |
| 11 | <Bugfix Level> | PC Application Software bug-fix level |
| 12 | 0xF7 | MIDI System exclusive message terminator |


| byte
number | value | description |
|---|---|---|
| 1 | 0x9<chan> | MIDI Note-on. The 4-bit <chan> value will be used for the track strips |
| 2 | <ControlID> | identifier for LED object (“note number”) |
| 3 | state | control value (This value will describe the state or color of the LED:
OFF/ON/blinking, etc) |


| byte
number | value | description |
|---|---|---|
| 1 | 0x8<chan> | MIDI Note-off. The 4-bit <chan> value will be used for the track strips |
| 2 | <ControlID> | identifier for LED object (“note number”) |
| 3 | (unused) | control value (ignored) |

Generic Communication Protocol for Akai APC40 Controller
byte value description
number
7 0x04 Number of data bytes to follow (least significant)
8 0x40 or 0x41 or 0x42 Application/Configuration identifier
9 <Version High> PC application Software version major
10 <Version Low> PC application Software version minor
11 <Bugfix Level> PC Application Software bug-fix level
12 0xF7 MIDI System exclusive message terminator
Outbound Message Type 1: LEDs.
This message is used to control the states of the LEDs. A note-on message will cause the specified LED to
switch on. A note-off message will cause the specified LED to switch off. The field normally associated with
note number will be used to specify the LED. The field normally associated with velocity will indicate the
LED display type. The field normally associated with MIDI Channel will indicate the Track for certain LEDs.
A Note On message with a velocity of zero is equivalent to a Note Off message, however it is preferred that
an actual Note Off message is used.
Format of Type 1 outbound Midi note-on messages
byte value description
number
1 0x9<chan> MIDI Note-on. The 4-bit <chan> value will be used for the track strips
2 <ControlID> identifier for LED object (“note number”)
3 state control value (This value will describe the state or color of the LED:
OFF/ON/blinking, etc)
Format of Type 1 outbound Midi note-off messages
byte value description
number
1 0x8<chan> MIDI Note-off. The 4-bit <chan> value will be used for the track strips
2 <ControlID> identifier for LED object (“note number”)
3 (unused) control value (ignored)
Assignment of Note number messages to LEDs. Note 0x30 to 0x39 use MIDI Channel 0
Rev 1 – May 1, 2009 Page 8

---

## Page 9


| note
number | MIDI Channel | corresponding LED | Velocity |
|---|---|---|---|
| 0x30 (C_3) | 0-7 = Track 1-8 | RECORD ARM | 0=off, 1-127=on |
| 0x31 (C#3) | 0-7 = Track 1-8 | SOLO | 0=off, 1-127=on |
| 0x32 (D_3) | 0-7 = Track 1-8 | ACTIVATOR | 0=off, 1-127=on |
| 0x33 (D#3) | 0-7 = Track 1-8 | TRACK SELECTION | 0=off, 1-127=on |
| 0x34 (E_3) | 0-7 = Track 1-8 | CLIP STOP | 0=off, 1=on, 2=blink, 3-127=on |
| 0x35 (F_3) | 0-7 = Track 1-8 | CLIP LAUNCH 1 | 0=off, 1=green, 2=green blink, 3=red, 4=red
blink, 5=yellow, 6=yellow blink, 7-127=green |
| 0x36 (F#3) | 0-7 = Track 1-8 | CLIP LAUNCH 2 | 0=off, 1=green, 2=green blink, 3=red, 4=red
blink, 5=yellow, 6=yellow blink, 7-127=green |
| 0x37 (G_3) | 0-7 = Track 1-8 | CLIP LAUNCH 3 | 0=off, 1=green, 2=green blink, 3=red, 4=red
blink, 5=yellow, 6=yellow blink, 7-127=green |
| 0x38 (G#3) | 0-7 = Track 1-8 | CLIP LAUNCH 4 | 0=off, 1=green, 2=green blink, 3=red, 4=red
blink, 5=yellow, 6=yellow blink, 7-127=green |
| 0x39 (A_3) | 0-7 = Track 1-8 | CLIP LAUNCH 5 | 0=off, 1=green, 2=green blink, 3=red, 4=red
blink, 5=yellow, 6=yellow blink, 7-127=green |
| 0x3A (A#3) | 0-8 = Track 1-8, MASTER
(mode 0 only) | CLIP/TRACK (1) | 0=off, 1-127=on |
| 0x3B (B_3) | 0-8 = Track 1-8, MASTER
(mode 0 only) | DEVICE ON/OFF (2) | 0=off, 1-127=on |
| 0x3C (C_4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | (cid:197) (3) | 0=off, 1-127=on |
| 0x3D (C#4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | (cid:206) (4) | 0=off, 1-127=on |
| 0x3E (D_4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | DETAIL VIEW (5) | 0=off, 1-127=on |
| 0x3F (D#4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | REC QUANT (6) | 0=off, 1-127=on |
| 0x40 (E_4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | MIDI OVERDUB (7) | 0=off, 1-127=on |
| 0x41 (F_4) | 0-8 = Track 1-8, MASTER
(mode 0 only) | METRONOME (8) | 0=off, 1-127=on |
|  |  |  |  |

Generic Communication Protocol for Akai APC40 Controller
to 7 to indicate Tracks 1-8. All other note values ignore the MIDI Channel.
note MIDI Channel corresponding LED Velocity
number
0x30 (C_3) 0-7 = Track 1-8 RECORD ARM 0=off, 1-127=on
0x31 (C#3) 0-7 = Track 1-8 SOLO 0=off, 1-127=on
0x32 (D_3) 0-7 = Track 1-8 ACTIVATOR 0=off, 1-127=on
0x33 (D#3) 0-7 = Track 1-8 TRACK SELECTION 0=off, 1-127=on
0x34 (E_3) 0-7 = Track 1-8 CLIP STOP 0=off, 1=on, 2=blink, 3-127=on
0x35 (F_3) 0-7 = Track 1-8 0=off, 1=green, 2=green blink, 3=red, 4=red
CLIP LAUNCH 1 blink, 5=yellow, 6=yellow blink, 7-127=green
0x36 (F#3) 0-7 = Track 1-8 0=off, 1=green, 2=green blink, 3=red, 4=red
CLIP LAUNCH 2 blink, 5=yellow, 6=yellow blink, 7-127=green
0x37 (G_3) 0-7 = Track 1-8 0=off, 1=green, 2=green blink, 3=red, 4=red
CLIP LAUNCH 3 blink, 5=yellow, 6=yellow blink, 7-127=green
0x38 (G#3) 0-7 = Track 1-8 0=off, 1=green, 2=green blink, 3=red, 4=red
CLIP LAUNCH 4 blink, 5=yellow, 6=yellow blink, 7-127=green
0x39 (A_3) 0-7 = Track 1-8 0=off, 1=green, 2=green blink, 3=red, 4=red
CLIP LAUNCH 5 blink, 5=yellow, 6=yellow blink, 7-127=green
0x3A (A#3) 0-8 = Track 1-8, MASTER CLIP/TRACK (1)
(mode 0 only) 0=off, 1-127=on
0x3B (B_3) 0-8 = Track 1-8, MASTER
(mode 0 only) DEVICE ON/OFF (2) 0=off, 1-127=on
0x3C (C_4) 0-8 = Track 1-8, MASTER
(mode 0 only) (cid:197) (3) 0=off, 1-127=on
0x3D (C#4) 0-8 = Track 1-8, MASTER
(mode 0 only) (cid:206) (4) 0=off, 1-127=on
0x3E (D_4) 0-8 = Track 1-8, MASTER
(mode 0 only) DETAIL VIEW (5) 0=off, 1-127=on
0x3F (D#4) 0-8 = Track 1-8, MASTER
(mode 0 only) REC QUANT (6) 0=off, 1-127=on
0x40 (E_4) 0-8 = Track 1-8, MASTER
(mode 0 only) MIDI OVERDUB (7) 0=off, 1-127=on
0x41 (F_4) 0-8 = Track 1-8, MASTER
(mode 0 only) METRONOME (8) 0=off, 1-127=on
Rev 1 – May 1, 2009 Page 9

---

## Page 10


| note
number | MIDI Channel | corresponding LED | Velocity |
|---|---|---|---|
| 0x50 (G#5) |  | MASTER | 0=off, 1-127=on |
|  |  |  |  |
| 0x52 (A#5) |  | SCENE LAUNCH 1 | 0=off, 1=on, 2=blink, 3-127=on |
| 0x53 (B_5) |  | SCENE LAUNCH 2 | 0=off, 1=on, 2=blink, 3-127=on |
| 0x54 (C_6) |  | SCENE LAUNCH 3 | 0=off, 1=on, 2=blink, 3-127=on |
| 0x55 (C#7) |  | SCENE LAUNCH 4 | 0=off, 1=on, 2=blink, 3-127=on |
| 0x56 (D_7) |  | SCENE LAUNCH 5 | 0=off, 1=on, 2=blink, 3-127=on |
| 0x57 (D#7) |  | PAN | 0=off, 1-127=on |
| 0x58 (E_7) |  | SEND A | 0=off, 1-127=on |
| 0x59 (F_7) |  | SEND B | 0=off, 1-127=on |
| 0x5A (F#_7) |  | SEND C | 0=off, 1-127=on |


| byte
number | value | description |
|---|---|---|
| 1 | 0xB<chan> | MIDI Controller. The 4-bit <chan> value will be used for the track strips |
| 2 | <ControlID> | identifier for control surface object |
| 3 | data | control value |


| control | MIDI Channel | control ID | notes |
|---|---|---|---|
| Track Level | 0-7 = Tracks 1-8 | 0x07 |  |

Generic Communication Protocol for Akai APC40 Controller
note MIDI Channel corresponding LED Velocity
number
0x50 (G#5) MASTER 0=off, 1-127=on
0x52 (A#5) SCENE LAUNCH 1 0=off, 1=on, 2=blink, 3-127=on
0x53 (B_5) SCENE LAUNCH 2 0=off, 1=on, 2=blink, 3-127=on
0x54 (C_6) SCENE LAUNCH 3 0=off, 1=on, 2=blink, 3-127=on
0x55 (C#7) SCENE LAUNCH 4 0=off, 1=on, 2=blink, 3-127=on
0x56 (D_7) SCENE LAUNCH 5 0=off, 1=on, 2=blink, 3-127=on
0x57 (D#7) PAN 0=off, 1-127=on
0x58 (E_7) SEND A 0=off, 1-127=on
0x59 (F_7) SEND B 0=off, 1-127=on
0x5A (F#_7) SEND C 0=off, 1-127=on
Outbound Message Type 2: Controller Value Update messages
Controls that report an absolute value for their position for inbound messages can have their controller value
updated via a Controller Value Update message. This will be done using a MIDI controller message. The
field normally associated with controller number will be used to specify the Control ID. The field normally
associated with controller value will be used to update the value of a controller on the APC40.
MIDI Controller message
byte value description
number
1 0xB<chan> MIDI Controller. The 4-bit <chan> value will be used for the track strips
2 <ControlID> identifier for control surface object
3 data control value
Assignment of controller numbers to absolute controllers
control MIDI Channel control ID notes
Track Level 0-7 = Tracks 1-8 0x07
Rev 1 – May 1, 2009 Page 10

---

## Page 11


| control | MIDI Channel | control ID | notes |
|---|---|---|---|
| Master Level |  | 0x0E |  |
| Crossfader |  | 0x0F |  |
| DEVICE Knob 1 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x10 |  |
| DEVICE Knob 2 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x11 |  |
| DEVICE Knob 3 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x12 |  |
| DEVICE Knob 4 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x13 |  |
| DEVICE Knob 5 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x14 |  |
| DEVICE Knob 6 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x15 |  |
| DEVICE Knob 7 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x16 |  |
| DEVICE Knob 8 | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x17 |  |
| DEVICE Knob 1
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x18 | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 2
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x19 | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 3
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1A | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 4
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1B | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 5
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1C | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 6
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1D | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 7
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1E | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| DEVICE Knob 8
LED Ring Type | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x1F | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |

Generic Communication Protocol for Akai APC40 Controller
control MIDI Channel control ID notes
Master Level 0x0E
Crossfader 0x0F
DEVICE Knob 1 0-8 = Tracks 1-8, Master 0x10
(for mode 0 only)
DEVICE Knob 2 0-8 = Tracks 1-8, Master 0x11
(for mode 0 only)
DEVICE Knob 3 0-8 = Tracks 1-8, Master 0x12
(for mode 0 only)
DEVICE Knob 4 0-8 = Tracks 1-8, Master 0x13
(for mode 0 only)
DEVICE Knob 5 0-8 = Tracks 1-8, Master 0x14
(for mode 0 only)
DEVICE Knob 6 0-8 = Tracks 1-8, Master 0x15
(for mode 0 only)
DEVICE Knob 7 0-8 = Tracks 1-8, Master 0x16
(for mode 0 only)
DEVICE Knob 8 0-8 = Tracks 1-8, Master 0x17
(for mode 0 only)
DEVICE Knob 1 0-8 = Tracks 1-8, Master 0x18 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 2 0-8 = Tracks 1-8, Master 0x19 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 3 0-8 = Tracks 1-8, Master 0x1A 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 4 0-8 = Tracks 1-8, Master 0x1B 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 5 0-8 = Tracks 1-8, Master 0x1C 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 6 0-8 = Tracks 1-8, Master 0x1D 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 7 0-8 = Tracks 1-8, Master 0x1E 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
DEVICE Knob 8 0-8 = Tracks 1-8, Master 0x1F 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type (for mode 0 only) 127=Single
Rev 1 – May 1, 2009 Page 11

---

## Page 12


| control | MIDI Channel | control ID | notes |
|---|---|---|---|
| TRACK Knob 1 |  | 0x30 |  |
| TRACK Knob 2 |  | 0x31 |  |
| TRACK Knob 3 |  | 0x32 |  |
| TRACK Knob 4 |  | 0x33 |  |
| TRACK Knob 5 |  | 0x34 |  |
| TRACK Knob 6 |  | 0x35 |  |
| TRACK Knob 7 |  | 0x36 |  |
| TRACK Knob 8 |  | 0x37 |  |
| TRACK Knob 1
LED Ring Type |  | 0x38 | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 2
LED Ring Type |  | 0x39 | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 3
LED Ring Type |  | 0x3A | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 4
LED Ring Type |  | 0x3B | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 5
LED Ring Type |  | 0x3C | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 6
LED Ring Type |  | 0x3D | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 7
LED Ring Type |  | 0x3E | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |
| TRACK Knob 8
LED Ring Type |  | 0x3F | 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
127=Single |

Generic Communication Protocol for Akai APC40 Controller
control MIDI Channel control ID notes
TRACK Knob 1 0x30
TRACK Knob 2 0x31
TRACK Knob 3 0x32
TRACK Knob 4 0x33
TRACK Knob 5 0x34
TRACK Knob 6 0x35
TRACK Knob 7 0x36
TRACK Knob 8 0x37
TRACK Knob 1 0x38 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 2 0x39 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 3 0x3A 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 4 0x3B 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 5 0x3C 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 6 0x3D 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 7 0x3E 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
TRACK Knob 8 0x3F 0=off, 1=Single, 2=Volume Style, 3=Pan Style, 4-
LED Ring Type 127=Single
Interpretation of LED Ring Types
The LED rings will display its controller value with the LEDs based on the LED Ring Types. This LED Ring
Type can be set by the Host by sending an appropriate controller value message. The “Min” and “Max”
columns below will state the range of the controller value that will match the LED states as shown in the
“Display” column. The “LED STATES” column below will show the state of each of the 15 LEDs going from
left to right. A “0” indicates that the LED within the LED ring is OFF. A “1” indicates that the LED within the
LED ring in ON.
Rev 1 – May 1, 2009 Page 12

---

## Page 13


| MIN | MAX | LED STATES |
|---|---|---|
| 0 | 3 | 100000000000000 |
| 4 | 8 | 110000000000000 |
| 9 | 12 | 010000000000000 |
| 13 | 17 | 011000000000000 |
| 18 | 21 | 001000000000000 |
| 22 | 25 | 001100000000000 |
| 26 | 30 | 000100000000000 |
| 31 | 34 | 000110000000000 |
| 35 | 38 | 000010000000000 |
| 39 | 43 | 000011000000000 |
| 44 | 47 | 000001000000000 |
| 48 | 52 | 000001100000000 |
| 53 | 56 | 000000100000000 |
| 57 | 60 | 000000110000000 |
| 61 | 65 | 000000010000000 |
| 66 | 69 | 000000011000000 |
| 70 | 73 | 000000001000000 |
| 74 | 78 | 000000001100000 |
| 79 | 82 | 000000000100000 |
| 83 | 87 | 000000000110000 |
| 88 | 91 | 000000000010000 |
| 92 | 95 | 000000000011000 |
| 96 | 100 | 000000000001000 |
| 101 | 104 | 000000000001100 |
| 105 | 108 | 000000000000100 |
| 109 | 113 | 000000000000110 |
| 114 | 117 | 000000000000010 |
| 118 | 122 | 000000000000011 |
| 123 | 127 | 000000000000001 |

Generic Communication Protocol for Akai APC40 Controller
A. SINGLE
MIN MAX LED STATES
0 3 100000000000000
4 8 110000000000000
9 12 010000000000000
13 17 011000000000000
18 21 001000000000000
22 25 001100000000000
26 30 000100000000000
31 34 000110000000000
35 38 000010000000000
39 43 000011000000000
44 47 000001000000000
48 52 000001100000000
53 56 000000100000000
57 60 000000110000000
61 65 000000010000000
66 69 000000011000000
70 73 000000001000000
74 78 000000001100000
79 82 000000000100000
83 87 000000000110000
88 91 000000000010000
92 95 000000000011000
96 100 000000000001000
101 104 000000000001100
105 108 000000000000100
109 113 000000000000110
114 117 000000000000010
118 122 000000000000011
123 127 000000000000001
B. VOLUME STYLE
Rev 1 – May 1, 2009 Page 13

---

## Page 14


| MIN | MAX | LED STATES |
|---|---|---|
| 0 | 0 | 000000000000000 |
| 1 | 9 | 100000000000000 |
| 10 | 18 | 110000000000000 |
| 19 | 27 | 111000000000000 |
| 28 | 36 | 111100000000000 |
| 37 | 45 | 111110000000000 |
| 46 | 54 | 111111000000000 |
| 55 | 63 | 111111100000000 |
| 64 | 71 | 111111110000000 |
| 72 | 80 | 111111111000000 |
| 81 | 89 | 111111111100000 |
| 90 | 98 | 111111111110000 |
| 99 | 107 | 111111111111000 |
| 108 | 116 | 111111111111100 |
| 117 | 126 | 111111111111110 |
| 127 | 127 | 111111111111111 |


| MIN | MAX | LED STATES |
|---|---|---|
| 0 | 8 | 111111110000000 |
| 9 | 17 | 011111110000000 |
| 18 | 26 | 001111110000000 |
| 27 | 35 | 000111110000000 |
| 36 | 44 | 000011110000000 |
| 45 | 53 | 000001110000000 |
| 54 | 62 | 000000110000000 |

Generic Communication Protocol for Akai APC40 Controller
MIN MAX LED STATES
0 0 000000000000000
1 9 100000000000000
10 18 110000000000000
19 27 111000000000000
28 36 111100000000000
37 45 111110000000000
46 54 111111000000000
55 63 111111100000000
64 71 111111110000000
72 80 111111111000000
81 89 111111111100000
90 98 111111111110000
99 107 111111111111000
108 116 111111111111100
117 126 111111111111110
127 127 111111111111111
C. PAN STYLE
MIN MAX LED STATES
0 8 111111110000000
9 17 011111110000000
18 26 001111110000000
27 35 000111110000000
36 44 000011110000000
45 53 000001110000000
54 62 000000110000000
Rev 1 – May 1, 2009 Page 14

---

## Page 15


| MIN | MAX | LED STATES |
|---|---|---|
| 63 | 64 | 000000010000000 |
| 65 | 73 | 000000011000000 |
| 74 | 82 | 000000011100000 |
| 83 | 91 | 000000011110000 |
| 92 | 100 | 000000011111000 |
| 101 | 109 | 000000011111100 |
| 110 | 118 | 000000011111110 |
| 119 | 127 | 000000011111111 |


| byte
number | value | description |
|---|---|---|
| 1 | 0x9<chan> | MIDI Note-on. The 4-bit <chan> value will be used for the track strips. |
| 2 | <ControlID> | identifier for control surface object (“note number”) |
| 3 | 0x7F | control value (non-zero) |

Generic Communication Protocol for Akai APC40 Controller
MIN MAX LED STATES
63 64 000000010000000
65 73 000000011000000
74 82 000000011100000
83 91 000000011110000
92 100 000000011111000
101 109 000000011111100
110 118 000000011111110
119 127 000000011111111
Communications from device to PC Host - “Inbound” messages
These messages will be used to report control surface events from the device to the PC Host and as a
response to requests from the PC host.
Inbound Standard MIDI Message types
These messages will use standard MIDI messages.
Each message type will contain a Control Identifier field which will identify the control surface object to which
the message pertains.
Each message type will contain a data field which may contain information about either the new value of the
control surface object or how it has changed since the last report.
Type NOTE1: Note-on/Note-off messages
Some devices (such as buttons) have two states and the transitions between these states will be reported
using MIDI note-on (when the button is depressed) and note-off (when the button is released). The field
normally associated with note number will be used to specify the Control ID.
Midi note-on messages
byte value description
number
1 0x9<chan> MIDI Note-on. The 4-bit <chan> value will be used for the track strips.
2 <ControlID> identifier for control surface object (“note number”)
3 0x7F control value (non-zero)
Rev 1 – May 1, 2009 Page 15

---

## Page 16


| byte
number | value | description |
|---|---|---|
| 1 | 0x8<chan> | MIDI Note-off. The 4-bit <chan> value will be used for the track strips |
| 2 | <ControlID> | identifier for control surface object (“note number”) |
| 3 | 0x7F | control value (ignored) |


| control | MIDI Channel | note number | Mode 0 Button Type |
|---|---|---|---|
| RECORD ARM | 0-7 = Track 1-8 | 0x30 (C_3) | Toggle |
| SOLO | 0-7 = Track 1-8 | 0x31 (C#3) | Toggle |
| ACTIVATOR | 0-7 = Track 1-8 | 0x32 (D_3) | Toggle |
| TRACK SELECTION | 0-7 = Track 1-8 | 0x33 (D#3) | N/A |
| CLIP STOP | 0-7 = Track 1-8 | 0x34 (E_3) | Momentary |
| CLIP LAUNCH 1 | 0-7 = Track 1-8 | 0x35 (F_3) | Momentary |
| CLIP LAUNCH 2 | 0-7 = Track 1-8 | 0x36 (F#3) | Momentary |
| CLIP LAUNCH 3 | 0-7 = Track 1-8 | 0x37 (G_3) | Momentary |
| CLIP LAUNCH 4 | 0-7 = Track 1-8 | 0x38 (G#3) | Momentary |
| CLIP LAUNCH 5 | 0-7 = Track 1-8 | 0x39 (A_3) | Momentary |
| CLIP/TRACK (1) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3A (A#3) | Toggle |
| DEVICE ON/OFF (2) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3B (B_3) | Toggle |
| (cid:197) (3) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3C (C_4) | Toggle |
| (cid:206) (4) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3D (C#4) | Toggle |
| DETAIL VIEW (5) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3E (D_4) | Momentary |
| REC QUANT (6) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x3F (D#4) | Momentary |

Generic Communication Protocol for Akai APC40 Controller
Midi note-off messages
byte value description
number
1 0x8<chan> MIDI Note-off. The 4-bit <chan> value will be used for the track strips
2 <ControlID> identifier for control surface object (“note number”)
3 0x7F control value (ignored)
Assignment of note numbers to buttons. Note 0x30 to 0x49 use MIDI Channel 0 to 7 to indicate Tracks 1-8.
All other note values ignore the MIDI Channel. In Mode 1 or Mode 2, all buttons act as momentary buttons.
control MIDI Channel note number Mode 0 Button Type
RECORD ARM 0-7 = Track 1-8 0x30 (C_3) Toggle
SOLO 0-7 = Track 1-8 0x31 (C#3) Toggle
ACTIVATOR 0-7 = Track 1-8 0x32 (D_3) Toggle
TRACK SELECTION 0-7 = Track 1-8 0x33 (D#3) N/A
CLIP STOP 0-7 = Track 1-8 0x34 (E_3) Momentary
CLIP LAUNCH 1 0-7 = Track 1-8 0x35 (F_3) Momentary
CLIP LAUNCH 2 0-7 = Track 1-8 0x36 (F#3) Momentary
CLIP LAUNCH 3 0-7 = Track 1-8 0x37 (G_3) Momentary
CLIP LAUNCH 4 0-7 = Track 1-8 0x38 (G#3) Momentary
CLIP LAUNCH 5 0-7 = Track 1-8 0x39 (A_3) Momentary
CLIP/TRACK (1) 0-8 = Tracks 1-8, Master 0x3A (A#3) Toggle
(for mode 0 only)
0-8 = Tracks 1-8, Master 0x3B (B_3) Toggle
DEVICE ON/OFF (2) (for mode 0 only)
0-8 = Tracks 1-8, Master 0x3C (C_4) Toggle
(cid:197) (3) (for mode 0 only)
0-8 = Tracks 1-8, Master 0x3D (C#4) Toggle
(cid:206) (4) (for mode 0 only)
0-8 = Tracks 1-8, Master 0x3E (D_4) Momentary
DETAIL VIEW (5) (for mode 0 only)
0-8 = Tracks 1-8, Master 0x3F (D#4) Momentary
REC QUANT (6) (for mode 0 only)
Rev 1 – May 1, 2009 Page 16

---

## Page 17


| control | MIDI Channel | note number | Mode 0 Button Type |
|---|---|---|---|
| MIDI OVERDUB (7) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x40 (E_4) | Momentary |
| METRONOME (8) | 0-8 = Tracks 1-8, Master
(for mode 0 only) | 0x41 (F_4) | Momentary |
|  |  |  |  |
| MASTER |  | 0x50 (G#5) | N/A |
| STOP ALL CLIPS |  | 0x51 (A_5) | Momentary |
| SCENE LAUNCH 1 |  | 0x52 (A#5) | Momentary |
| SCENE LAUNCH 2 |  | 0x53 (B_5) | Momentary |
| SCENE LAUNCH 3 |  | 0x54 (C_6) | Momentary |
| SCENE LAUNCH 4 |  | 0x55 (C#6) | Momentary |
| SCENE LAUNCH 5 |  | 0x56 (D_6) | Momentary |
| PAN |  | 0x57 (D#6) | Toggle |
| SEND A |  | 0x58 (E_6) | Toggle |
| SEND B |  | 0x59 (F_6) | Toggle |
| SEND C |  | 0x5A (F#6) | Toggle |
| PLAY |  | 0x5B (G_6) | Momentary |
| STOP |  | 0x5C (G#6) | Momentary |
| RECORD |  | 0x5D (A_6) | Momentary |
| UP |  | 0x5E (A#6) | Momentary |
| DOWN |  | 0x5F (B_6) | Momentary |
| RIGHT |  | 0x60 (C_7) | Momentary |
| LEFT |  | 0x61 (C#7) | Momentary |
| SHIFT |  | 0x62 (D_7) | Momentary |
| TAP TEMPO |  | 0x63 (D#7) | Momentary |
| NUDGE + |  | 0x64 (E_7) | Momentary |
| NUDGE - |  | 0x65 (F_7) | Momentary |

Generic Communication Protocol for Akai APC40 Controller
control MIDI Channel note number Mode 0 Button Type
0-8 = Tracks 1-8, Master 0x40 (E_4) Momentary
MIDI OVERDUB (7) (for mode 0 only)
0-8 = Tracks 1-8, Master 0x41 (F_4) Momentary
METRONOME (8) (for mode 0 only)
MASTER 0x50 (G#5) N/A
STOP ALL CLIPS 0x51 (A_5) Momentary
SCENE LAUNCH 1 0x52 (A#5) Momentary
SCENE LAUNCH 2 0x53 (B_5) Momentary
SCENE LAUNCH 3 0x54 (C_6) Momentary
SCENE LAUNCH 4 0x55 (C#6) Momentary
SCENE LAUNCH 5 0x56 (D_6) Momentary
PAN 0x57 (D#6) Toggle
SEND A 0x58 (E_6) Toggle
SEND B 0x59 (F_6) Toggle
SEND C 0x5A (F#6) Toggle
PLAY 0x5B (G_6) Momentary
STOP 0x5C (G#6) Momentary
RECORD 0x5D (A_6) Momentary
UP 0x5E (A#6) Momentary
DOWN 0x5F (B_6) Momentary
RIGHT 0x60 (C_7) Momentary
LEFT 0x61 (C#7) Momentary
SHIFT 0x62 (D_7) Momentary
TAP TEMPO 0x63 (D#7) Momentary
NUDGE + 0x64 (E_7) Momentary
NUDGE - 0x65 (F_7) Momentary
Rev 1 – May 1, 2009 Page 17

---

## Page 18


| byte number | value | description |
|---|---|---|
| 1 | 0xB<chan> | MIDI Controller. The 4-bit <chan> value will be used for the track. |
| 2 | <ControlID> | identifier for control surface object |
| 3 | data | control value |


| control | MIDI Channel | control ID | notes |
|---|---|---|---|
| Track Level | 0-7 = Tracks 1-8 | 0x07 |  |
| Master Level |  | 0x0E |  |
| Crossfader |  | 0x0F |  |
| DEVICE Knob 1 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x10 |  |
| DEVICE Knob 2 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x11 |  |
| DEVICE Knob 3 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x12 |  |
| DEVICE Knob 4 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x13 |  |
| DEVICE Knob 5 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x14 |  |
| DEVICE Knob 6 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x15 |  |
| DEVICE Knob 7 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x16 |  |
| DEVICE Knob 8 | 0-8 = Tracks 1-8, Master
(for Mode 0 only) | 0x17 |  |
|  |  |  |  |

Generic Communication Protocol for Akai APC40 Controller
Type CC1: Absolute Controller messages
Most controls will report an absolute value for their position. This will be done using a MIDI controller
message. The field normally associated with controller number will be used to specify the Control ID. The
field normally associated with controller value will be used to report the absolute control value.
MIDI Controller message
byte number value description
1 0xB<chan> MIDI Controller. The 4-bit <chan> value will be used for the track.
2 <ControlID> identifier for control surface object
3 data control value
Assignment of controller numbers to absolute controllers
control MIDI Channel control ID notes
Track Level 0-7 = Tracks 1-8 0x07
Master Level 0x0E
Crossfader 0x0F
DEVICE Knob 1 0-8 = Tracks 1-8, Master 0x10
(for Mode 0 only)
DEVICE Knob 2 0-8 = Tracks 1-8, Master 0x11
(for Mode 0 only)
DEVICE Knob 3 0-8 = Tracks 1-8, Master 0x12
(for Mode 0 only)
DEVICE Knob 4 0-8 = Tracks 1-8, Master 0x13
(for Mode 0 only)
DEVICE Knob 5 0-8 = Tracks 1-8, Master 0x14
(for Mode 0 only)
DEVICE Knob 6 0-8 = Tracks 1-8, Master 0x15
(for Mode 0 only)
DEVICE Knob 7 0-8 = Tracks 1-8, Master 0x16
(for Mode 0 only)
DEVICE Knob 8 0-8 = Tracks 1-8, Master 0x17
(for Mode 0 only)
Rev 1 – May 1, 2009 Page 18

---

## Page 19


| control | MIDI Channel | control ID | notes |
|---|---|---|---|
| TRACK Knob1 |  | 0x30 |  |
| TRACK Knob 2 |  | 0x31 |  |
| TRACK Knob 3 |  | 0x32 |  |
| TRACK Knob 4 |  | 0x33 |  |
| TRACK Knob 5 |  | 0x34 |  |
| TRACK Knob 6 |  | 0x35 |  |
| TRACK Knob 7 |  | 0x36 |  |
| TRACK Knob 8 |  | 0x37 |  |
| Footswitch 1 |  | 0x40 | Value of 0x7F when depressed and
a value of 0x00 when released |
| Footswitch 2 |  | 0x43 | Value of 0x7F when depressed and
a value of 0x00 when released |


| byte number | value | description |
|---|---|---|
| 1 | 0xB<chan> | MIDI Controller. The 4-bit <chan> value will be used for the track strips |
| 2 | <ControlID> | identifier for control surface object |
| 3 | data | control change |


| data value sent | interpretation |
|---|---|
| 0x00 | No change occured. Control is stationary. |

Generic Communication Protocol for Akai APC40 Controller
control MIDI Channel control ID notes
TRACK Knob1 0x30
TRACK Knob 2 0x31
TRACK Knob 3 0x32
TRACK Knob 4 0x33
TRACK Knob 5 0x34
TRACK Knob 6 0x35
TRACK Knob 7 0x36
TRACK Knob 8 0x37
Footswitch 1 0x40 Value of 0x7F when depressed and
a value of 0x00 when released
Footswitch 2 0x43 Value of 0x7F when depressed and
a value of 0x00 when released
Type CC2: Relative Controller messages
Some controls will report a relative change in their value. This will be done using a MIDI controller message.
The field normally associated with controller number will be used to specify the Control ID. The field normally
associated with controller value will be used to report the change in the control value.
MIDI Controller message
byte number value description
1 0xB<chan> MIDI Controller. The 4-bit <chan> value will be used for the track strips
2 <ControlID> identifier for control surface object
3 data control change
Interpretation of MIDI Controller values for Relative Controllers
The value in the data field will indicate a relative change; values 01 to 63 describe a positive change and
values 127 down to 64 describe a negative change.
data value sent interpretation
0x00 No change occured. Control is stationary.
Rev 1 – May 1, 2009 Page 19

---

## Page 20


| data value sent | interpretation |
|---|---|
| 0x01 | The controller incremented its value by 1 since the last report |
| 0x02 | The controller incremented its value by 2 since the last report |
| ... | ... |
| 0x3f | The controller incremented its value by 63 since the last report |
| 0x40 | The controller decremented its value by 64 since the last report |
| 0x41 | The controller decremented its value by 63 since the last report |
| ... | ... |
| 0x7e | The controller decremented its value by 2 since the last report |
| 0x7f | The controller decremented its value by 1 since the last report |


| control | control ID | notes |
|---|---|---|
| CUE LEVEL | 0x2F |  |


| Date |  | Author |
|---|---|---|
| May 1, 2009 | First Draft based on APC40 document | Alex Souppa |

Generic Communication Protocol for Akai APC40 Controller
data value sent interpretation
0x01 The controller incremented its value by 1 since the last report
0x02 The controller incremented its value by 2 since the last report
... ...
0x3f The controller incremented its value by 63 since the last report
0x40 The controller decremented its value by 64 since the last report
0x41 The controller decremented its value by 63 since the last report
... ...
0x7e The controller decremented its value by 2 since the last report
0x7f The controller decremented its value by 1 since the last report
Assignment of controller numbers to relative controllers
control control ID notes
CUE LEVEL 0x2F
Document History
Date Author
May 1, 2009 First Draft based on APC40 document Alex Souppa
Rev 1 – May 1, 2009 Page 20

---

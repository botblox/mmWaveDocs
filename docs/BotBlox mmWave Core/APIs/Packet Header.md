---
sidebar_position: 1
sidebar_label: Packet Header
---

# Packet Header reference

`Mmw_output_message_header_t` is the header at the beginning of every
output packet sent over UART. It contains the packet-level information needed
by a receiver to identify and process the packet.

The header is 40 bytes long and contains the following fields in order:

| Byte offset | Type | Field | Description |
| ---: | --- | --- | --- |
| 0–7 | `uint16_t[4]` | `magicWord` | An 8-byte sequence used to identify the beginning of a packet. |
| 8–11 | `uint32_t` | `version` | Version number. |
| 12–15 | `uint32_t` | `totalPacketLen` | Total packet length in bytes, including the end padding that rounds the packet length up to a multiple of 32 bytes. |
| 16–19 | `uint32_t` | `platform` | |
| 20–23 | `uint32_t` | `frameNumber` | Frame number for the collection of chirps whose ADC results were used to calculate the detected-object and other output data. |
| 24–27 | `uint32_t` | `timeCpuCycles` | Time, in CPU cycles, at which the packet was created. |
| 28–31 | `uint32_t` | `numDetectedObj` | Number of detected objects. This value is also included in the TLV for detected points, but is repeated in the header for quick access. |
| 32–35 | `uint32_t` | `numTLVs` | Number of TLVs contained in the packet. Use this value to determine how many TLVs to decode. |
| 36–39 | `uint32_t` | `subFrameNumber` | Subframe number. This is only relevant when using advanced frame configurations; the default value is `0`. |

## Magic word

The first 8 bytes of the header form the magic word. It is represented as an
array of four 16-bit unsigned integers:

```c
uint16_t magicWord[4] = {0x0102, 0x0304, 0x0506, 0x0708};
```


## Packet length and padding

`totalPacketLen` is always a multiple of 32 bytes because padding is appended after the final TLV. The amount of padding is calculated as:

```text
padding = (32 - (unpaddedPacketLen % 32)) % 32
totalPacketLen = unpaddedPacketLen + padding
```

E.g. a packet containing 100 bytes of header and TLV data receives 28 bytes of padding, giving a `totalPacketLen` of 128 bytes. If the unpadded packet is already a multiple of 32 bytes, no padding is added.


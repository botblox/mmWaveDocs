---
sidebar_position: 2
sidebar_label: TLV Types
---

# Reference

Each type-length-value (TLV) item consists of an 8-byte TLV header followed by
its payload. The TLV header contains two 32-bit unsigned integers:

| Byte offset | Type | Field | Description |
| ---: | --- | --- | --- |
| 0–3 | `uint32_t` | `type` | Identifies the data contained in the payload. |
| 4–7 | `uint32_t` | `length` | Length associated with the TLV item. |

The `numTLVs` field in the [output packet header](<../Packet Header.md>) specifies
how many TLV items are contained in the packet.

## TLV types

The TLV type values are defined by `Mmw_output_message_type_e`. Starting from
zero, the available values are:

| Value | Type | Description |
| ---: | --- | --- |
| `0` | `MMW_OUTPUT_MSG_DETECTED_POINTS` | List of detected points. |
| `1` | `MMW_OUTPUT_MSG_RANGE_PROFILE` | Range profile. |
| `2` | `MMW_OUTPUT_MSG_NOISE_PROFILE` | Noise floor profile. |
| `3` | `MMW_OUTPUT_MSG_AZIMUTH_STATIC_HEAT_MAP` | Samples used to calculate the static azimuth heatmap. |
| `4` | `MMW_OUTPUT_MSG_RANGE_DOPPLER_HEAT_MAP` | Range/Doppler heatmap. |
| `5` | `MMW_OUTPUT_MSG_STATS` | Statistics info. |
| `6` | `MMW_OUTPUT_MSG_DETECTED_POINTS_SIDE_INFO` | Side infor for the detected points. |
| `7` | `MMW_OUTPUT_MSG_AZIMUT_ELEVATION_STATIC_HEAT_MAP` | Samples used to calculate the static azimuth/elevation heatmap. All virtual antennas are exported. This type is unused. |
| `8` | `MMW_OUTPUT_MSG_TEMPERATURE_STATS` | Temperature statistics from the radar front end. |

Any other value is not not supported and can be discarded.

---
sidebar_position: 7
sidebar_label: Stats Information
---

# Reference

Type: `MMW_OUTPUT_MSG_STATS`

Length: `sizeof(Mmw_output_message_stats_t)`, or 24 bytes.

Value: Data-path statistics stored in `Mmw_output_message_stats_t`, describing
inter-frame processing time, processing margins, output transmission time, and
CPU load.

## Data fields

All timing values are in microseconds, µs. CPU load values are percentages.

| Type | Field | Description |
| --- | --- | --- |
| `uint32_t` | `interFrameProcessingTime` | Inter-frame processing time for the current frame or sub-frame (µs). |
| `uint32_t` | `transmitOutputTime` | Time spent transmitting the output for the previous frame or the previous occurrence for the same `subFrameNumber` (µs). |
| `uint32_t` | `interFrameProcessingMargin` | Processing margin for the previous frame, or the previous occurrence for the same `subFrameNumber` (µs). This excludes UART or Ethernet transmission time. To include transport overhead, subtract `transmitOutputTime` from this value. |
| `uint32_t` | `interChirpProcessingMargin` | Always `0` because this margin is not computed. This does not mean that no margin was available. Measuring it would require notifying the CPU at the beginning and end of every chirp's HWA–EDMA processing, separate from the CPU, whereas the CPU itself is intentionally left available for other processing. The field is retained for completeness. |
| `uint32_t` | `activeFrameCPULoad` | CPU percentage load (%) during the active frame duration. |
| `uint32_t` | `interFrameCPULoad` | CPU percentage load (%) during the inter-frame duration. |

Note that for sub-frame operation, 'previous' means the previous occurrence of the same `subFrameNumber`, not necessarily the immediately preceding sub-frame, which may have a different `subFrameNumber`.

To calculate the remaining margin after output transmission:

```text
marginIncludingTransport = interFrameProcessingMargin - transmitOutputTime
```

Transport time can be significant when streaming debug data (heatmaps, etc), so include it when using these statistics to estimate the maximum frame rate. Recommendations is to increase baudrate or use gigabit ethernet to reduce transport time.

## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in the output packet. This includes stats information.

---
sidebar_position: 7
sidebar_label: Stats Information
---

# Reference

Type: `MMW_OUTPUT_MSG_STATS`

Length: `sizeof(Mmw_output_message_stats_t)`, or 24 bytes.

Value: Data-path statistics stored in `Mmw_output_message_stats_t`, describing
inter-frame processing time, processing margins, output transmission time, and
CPU load. This structure is the payload of the stats information TLV item.

## Data fields

All timing values are in microseconds (µs). CPU load values are percentages (%).

| Type | Field | Description |
| --- | --- | --- |
| `uint32_t` | `interFrameProcessingTime` | Inter-frame processing time in µs. |
| `uint32_t` | `transmitOutputTime` | Transmission time of output detection information in µs. |
| `uint32_t` | `interFrameProcessingMargin` | Inter-frame processing margin in µs. |
| `uint32_t` | `interChirpProcessingMargin` | Inter-chirp processing margin in µs. Always 0 because it is not computed. |
| `volatile uint32_t` | `activeFrameCPULoad` | CPU load (%) during the active frame duration. |
| `volatile uint32_t` | `interFrameCPULoad` | CPU load (%) during the inter-frame duration. |

## Processing timing

The timing fields in `Mmw_output_message_stats_t` refer to the following
processing intervals:

| Field | Reported value |
| --- | --- |
| `interChirpProcessingMargin` | Always 0; this margin is not computed. |
| `interFrameProcessingTime` | Inter-frame processing time for the current sub-frame or frame. |
| `interFrameProcessingMargin` | Inter-frame processing margin for the previous sub-frame with the same `subFrameNumber`, or the previous frame. Excludes UART transmission time. |
| `transmitOutputTime` | UART transmission time for the previous sub-frame with the same `subFrameNumber`, or the previous frame. |

Here, `subFrameNumber` is the field in `MmwDemo_output_message_header_t`.
For sub-frame operation, “previous” means the previous occurrence of that same
sub-frame number, rather than necessarily the immediately preceding sub-frame.

### Inter-chirp processing margin

:::note

An `interChirpProcessingMargin` value of 0 does not indicate that no processing
margin occurred. The field is always set to 0 because margin is not computed.

:::

Only the hardware accelerator (HWA) and enhanced direct memory access (EDMA) modules
are involved in 1D FFT processing, not the CPU itself. Measuring the chirp processing margin would
require notifying the CPU at every chirp when processing begins (i.e. the chirp
event) and when the HWA–EDMA computation ends. However, the CPU is intentionally kept free during 1D processing so that an application
can use this time to execute post-processing algorithms. It is still added for completeness though.

### Inter-frame margin and transport overhead

The reported `interFrameProcessingMargin` excludes UART / ethernet transmission time.
This exposes the processing margin without the influence of a slow transport.
UART / ethernet transmission can take significantly longer when streaming debug data such
as heatmaps, while a deployed product may use a faster interface such as LVDS or higher speed Ethernet.

To account for data transmit overhead, subtract the reported transmission time
from the reported processing margin:

```text
marginIncludingTransport = interFrameProcessingMargin - transmitOutputTime
```

Both values describe the previous frame or the previous occurrence of the same
sub-frame. The `interFrameProcessingTime` in the same packet describes the
current frame or sub-frame instead. Keep this distinction in mind when using
the statistics to determine the maximum frame rate for a configuration.

## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in the output
packet, including stats information. Its arguments are stored in
`Mmw_GuiMonSel_t`.

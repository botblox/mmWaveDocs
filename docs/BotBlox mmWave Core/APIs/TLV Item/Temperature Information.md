---
sidebar_position: 8
sidebar_label: Temperature Information
---

# Reference

Type: `MMW_OUTPUT_MSG_TEMPERATURE_STATS`

Length: `sizeof(Mmw_temperatureStats_t)`, or 28 bytes

The payload contains 4 bytes for `tempReportValid`, 4 bytes for
`temperatureReport.time`, and 10x 2 bytes for the temperature sensor fields.
With standard 4-byte alignment, no additional padding is needed. This length excludes TLV header.

Value: Detailed temperature report from the radar front end, stored in
`Mmw_temperatureStats_t`. The report is a snapshot taken just before
transmitting data over UART / ethernet.

This TLV is sent along with the [Stats Information](<./Stats Information.md>) TLV.

## Data fields

| Type | Field | Description |
| --- | --- | --- |
| `int32_t` | `tempReportValid` | Return value of `rlRfGetTemperatureReport`. A value of 0 indicates that `temperatureReport` is valid; any other value means report should be ignored. |
| `rlRfTempData_t` | `temperatureReport` | Temperature report captured just before transmission. |

:::note

Check `tempReportValid` before using the report. Despite its name, 0 means the
report is valid; a nonzero value means its values should be ignored.

:::

## Temperature report

The `rlRfTempData_t` structure contains the radar subsystem's local time and
temperature sensor readings. All temperature readings are signed, with
1 LSB representing 1°C. The timestamp uses 1 LSB per millisecond.

| Type | Field | Description |
| --- | --- | --- |
| `uint32_t` | `time` | Radar subsystem local time since device power-up, in ms. |
| `int16_t` | `tmpRx0Sens` | RX0 temperature sensor reading, in °C. |
| `int16_t` | `tmpRx1Sens` | RX1 temperature sensor reading, in °C. |
| `int16_t` | `tmpRx2Sens` | RX2 temperature sensor reading, in °C. |
| `int16_t` | `tmpRx3Sens` | RX3 temperature sensor reading, in °C. |
| `int16_t` | `tmpTx0Sens` | TX0 temperature sensor reading, in °C. |
| `int16_t` | `tmpTx1Sens` | TX1 temperature sensor reading, in °C. |
| `int16_t` | `tmpTx2Sens` | TX2 temperature sensor reading, in °C. |
| `int16_t` | `tmpPmSens` | PM temperature sensor reading, in °C. |
| `int16_t` | `tmpDig0Sens` | TX3 temperature sensor reading, in °C. |
| `int16_t` | `tmpDig1Sens` | Reserved. Don't interpret as a temperature reading. |

## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in
the output packet. This includes temperature information.

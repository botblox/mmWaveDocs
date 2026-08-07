---
sidebar_position: 4
sidebar_label: Noise Profile
---

# Reference

:::note

The noise floor profile is sent only in TDM mode so far. Sending in DDM mode is not supported yet!

:::

Type: `MMW_OUTPUT_MSG_NOISE_PROFILE`

Length: (`Range FFT size`) × (`sizeof(uint16_t)`, or 2 bytes)

Value: Dense array containing one noise-floor value for each range bin. The
values have the same unsigned Q8 format as the
[range profile](<./Range Profile.md>), but are selected from the maximum
positive Doppler bin rather than the zero-Doppler bin.

## How the values are produced

The range and noise profiles are derived from the same range–Doppler detection
matrix. See [How the values are produced](<./Range Profile.md#how-the-values-are-produced>)
for the complete processing sequence and Q8 conversion.

Previously for Range profile, range profile selects Doppler bin zero:

$$
\operatorname{rangeProfile}[r]
=
\operatorname{rawValueToOutput}[r,0]
$$

The Noise profile instead selects:

$$
d_{\mathrm{noise}}
=
\frac{N_D}{2}-1
$$

and transmits:

$$
\operatorname{noiseProfile}[r]
=
\operatorname{rawValueToOutput}
\left[r,\frac{N_D}{2}-1\right]
$$

$r$ is the range-bin index,

$N_{D}$ is the number of Doppler FFT bins.
The selected bin represents the maximum positive Doppler frequency, corresponding
to the maximum positive unambiguous radial speed.

In a stationary scene, objects and static clutter are (generally) concentrated
near the zero-Doppler bin. The values in the maximum-Doppler bin therefore
provide an estimate of the receiver noise floor at each range bin. A fast-moving
object or interference occupying this maximal Doppler bin can raise the reported noise
profile above the underlying receiver noise floor. Therefore, knowing the noise floor in advance is a useful metric.

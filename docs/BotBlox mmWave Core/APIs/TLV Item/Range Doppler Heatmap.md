---
sidebar_position: 5
sidebar_label: Range/Doppler Heatmap
---

# Reference

Type: `MMW_OUTPUT_MSG_RANGE_DOPPLER_HEAT_MAP`

Length: (`Range FFT size`) × (`Number of Doppler bins`) ×
(`sizeof(uint16_t)`, or 2 bytes)

Value: The complete range–Doppler detection matrix from
`DetectionMatrix::data`. Each matrix cell is an unsigned Q8-formatted raw value in the
same format used by the [range profile](<./Range Profile.md>) and
[noise profile](<./Noise Profile.md>).

## How the values are produced

See [How the values are produced](<./Range Profile.md#how-the-values-are-produced>)
for the range FFT, Doppler FFT, virtual-antenna summation, and Q8 conversion.

Unlike previous profile TLVs, the heatmap does not select only one Doppler bin. It
contains every range–Doppler bin value:

$$
\operatorname{Heatmap}[r,d]
=
\operatorname{rawValueToOutput}[r,d]
$$

where:

- $r$ is the range-bin index, from $0$ to $R-1$.
- $d$ is the Doppler-bin index, from $0$ to $D-1$.
- $R$ is the number of range bins.
- $D$ is the number of Doppler FFT bins.

The related profile TLVs are slices through this same matrix:

$$
\operatorname{rangeProfile}[r]
=
\operatorname{heatmap}[r,0]
$$

$$
\operatorname{noiseProfile}[r]
=
\operatorname{heatmap}
\left[r,\frac{D}{2}-1\right]
$$

## Payload order

The matrix is serialized in 'row-major' order. All Doppler bins for one range bin
are sent contiguously before moving to the next range bin. For example,

```text
heatmap[0, 0], heatmap[0, 1], ..., heatmap[0, D-1],
heatmap[1, 0], heatmap[1, 1], ..., heatmap[1, D-1],
...
heatmap[R-1, 0], heatmap[R-1, 1], ..., heatmap[R-1, D-1]
```

The flattened payload index at $(r,d)$ is:

$$
\operatorname{index}(r,d)=rD+d
$$

Because every cell occupies 2 bytes, its start byte offset from the beginning of the
TLV payload is:

$$
\operatorname{offset}(r,d)=2(rD+d)
$$

The payload therefore contains $R\times D$ consecutive `uint16_t` values and
has a total length of $2*R*D$ bytes.

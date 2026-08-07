---
sidebar_position: 6
sidebar_label: Azimuth Static Heatmap
---

# Reference

:::note

The azimuth static heatmap is sent only in the TDM mode. DDM mode is not supported yet.

:::

Type: `MMW_OUTPUT_MSG_AZIMUT_STATIC_HEAT_MAP`

Length: (`Range FFT size`) × (`Number of virtual antennas`) ×
(`sizeof(cmplx16ImRe_t)`, or 4 bytes)

Value: The complete `DPU_AoAProcHWA_HW_Resources::azimuthStaticHeatMap`
array. It contains one complex symbol for every virtual antenna at every range
bin.

## How values are produced

1. hhhhhh

   $$
   RangeFFT[r,c,v]
   =
   \sum_{n=0}^{S-1}
   ADC[c,n,v] * w_{Range}[n]
   * e^{-j2\pi rn/N_R}
   $$

   Here, $S$ is the number of ADC samples,

   $N_R$ is the range-FFT length (either equal to number of samples or next power of two greater. Strictly speaking, it is actually HALF this value because only half the FFT bins after RangeFFT contain unique information due to real, not complex I/Q, sampling),

   $w[n]$ is the range fft window, and

   $r$ is the range-bin index.
   

## Complex sample format

Each `cmplx16ImRe_t` occupies 4 bytes and stores its imaginary component
before its real component:

| Byte offset | Type | Component |
| ---: | --- | --- |
| 0–1 | `int16_t` | Imaginary |
| 2–3 | `int16_t` | Real |

## Payload order

Let $R$ be the number of range bins and $N$ be the number of virtual
antenna channels. All virtual antenna channels for one range bin are sent contiguously
before moving to the next range bin:

```text
Imag(ant 0, range 0), Real(ant 0, range 0), ...,
Imag(ant N-1, range 0), Real(ant N-1, range 0),
...
Imag(ant 0, range R-1), Real(ant 0, range R-1), ...,
Imag(ant N-1, range R-1), Real(ant N-1, range R-1)
```

Equivalently, the complex samples are ordered as:

```text
heatmap[range 0][ant 0], ..., heatmap[range 0][ant N-1],
...
heatmap[range R-1][ant 0], ..., heatmap[range R-1][ant N-1]
```

The host GUI can use these complex antenna symbols to construct the static azimuth
heatmap.

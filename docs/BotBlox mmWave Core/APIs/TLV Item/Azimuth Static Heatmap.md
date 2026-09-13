---
sidebar_position: 6
sidebar_label: Azimuth Static Heatmap
---

# Reference

:::note

The azimuth static heatmap is sent only in the TDM mode. DDM mode is not supported yet but potentially can be added in future.

:::

Type: `MMW_OUTPUT_MSG_AZIMUTH_STATIC_HEAT_MAP`

Length: (`Range FFT size`) × (`Number of virtual antennas`) ×
(`sizeof(cmplx16ImRe_t)`, or 4 bytes)

Value: The complete `DPU_AoAProcHWA_HW_Resources::azimuthStaticHeatMap`
array. It contains one complex symbol for every virtual antenna at every range
bin.

## How values are produced

1. See [How values are produced](<./Range Profile.md#how-values-are-produced>) for the range FFT on the ADC samples radar cube.

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

   Basically, the resutling radar cube is indexed:

   $$
   RangeFFT\!\left[
   \text{range bin},\;
   \text{chirp number},\;
   \text{virtual antenna channel}
   \right]
   $$

2. For a single range bin, R, a Doppler FFT is performed across slow time (i.e. the chirp dimension) for that selected range bin, R, and the virtual antenna channel. Its complex output is therefore indexed by Dopper bin and virtual antenna channel.

   $$
   DopplerFFT_{R}[d,v]
   =
   \sum_{c=0}^{C-1}
   RangeFFT_[R,c,v] * w_{Doppler}[c]
   * e^{-j2\pi dc/N_D}
   $$

   $C$ is the number of chirps for each virtual antenna channel,

   $N_D$ is the DopplerFFT length (either equal to the number of chirps in a CPI or next nearest power of two of that number greater). For TDM, this number should be divided by the number of TX antennas because each TX-RX virtual antenna channel only samples when its corresponding TX antenna is transmitting. For DDM (note azimuthal heatmap generation is not yet supported for this mode anyway), this DopplerFFT length is not divided by anything as every TX-RX virtual antenna channel is sampling at the same time,

   $w_{Doppler}[c]$ is the Doppler window, and

   $d$ is the
   Doppler-bin index.

   $R$ is the selected fixed range bin
   
   The resulting complex array is logically indexed as:

   $$
   DopplerFFT_{R}\!\left[
   \text{Doppler bin},\;
   \text{virtual antenna channel}
   \right]
   $$

   Crucially, we adjust this equation to only care about Doppler bin = 0 for static objects. Hence the equation collapses to:

   $$
   DopplerFFT_{R}[d=0,v]
   =
   \sum_{c=0}^{C-1}
   RangeFFT_[R,c,v] * w_{Doppler}[c]
   $$

3. Repeat this calculation for every single range bin to get the azimuthal static heatmap for all range bins. Gain phase and calibration coefficients are multipled to these values before outputted.

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

A host GUI can use these complex antenna symbols to construct the static azimuth
heatmap on a display, which is most useful for debugging purposes!

## Interpreting these values

For a single value of the heatmap array, the first two bytes represent the imaginary component and the last two bytes represent the real component. These can be regard (conceptual shorthand) as the summed and scaled ADC values for each range, virtual antenna channel bin.

1. The range FFT converts the ADC samples into complex responses at different ranges.
2. For each range and virtual antenna, the Doppler bin = 0 (static) calculation takes a windowed, coherent sum, across chirps, of those complex responses at different range.
3. Scaling, rounding, and saturation keep the result within integer representation.
4. Complex gain and phase calibration corrects values for each individual antenna channel.

The real and imaginary components:

$$
\operatorname{amplitude}
=
\sqrt{\operatorname{real}^2+\operatorname{imaginary}^2}
$$

Amplitude measures the strength of that static response in the DSP’s own numerical units. Phase differences between virtual antennas provide the information used to estimate angle. Hence, angle estimation from the azimuthal static heatmap is possible.

$$
\operatorname{phase}
=
\operatorname{atan2}
\left(\operatorname{imaginary},\operatorname{real}\right)
$$

$\operatorname{atan2}(y,x)$ is the two-argument arctangent. It is related to
the ordinary one-argument arctangent:

$$
\theta=\arctan\left(\frac{y}{x}\right)
$$

Where y is the imaginary and x is the real component on an argand graph.

It uses the signs of both $x$ and $y$ to place $\theta$ in the correct
quadrant. Unlike $\arctan(y/x)$, $\operatorname{atan2}(y,x)$ handles $x=0$ and
distinguishes points in opposite quadrants that have the same ratio $y/x$. Its
result covers the full phase range $(-\pi,\pi]$.


## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in
the output packet. This includes the azimuth static heatmap.

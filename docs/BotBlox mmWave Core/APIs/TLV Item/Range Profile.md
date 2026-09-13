---
sidebar_position: 3
sidebar_label: Range Profile
---

# Reference

Type: `MMW_OUTPUT_MSG_RANGE_PROFILE`

Length: (`Range FFT size`) × (`sizeof(uint16_t)`, or 2 bytes)

Value: Dense array of range points at the 0th Doppler bin (stationary objects).
Each point is the normalised sum of the log₂ magnitudes across the virtual
antenna channels, represented in unsigned Q8 format.

## How values are produced

1. A range FFT is performed on the ADC samples from each RX antenna for each
   chirp (functionally for each virtual antenna channel). This produces the radar cube: a collection of complex values that can
   be indexed by range bin, chirp number, and virtual antenna channel.

   Set $ADC[c,n,v]$ be ADC sample $n$ from any chirp $c$ associated with virtual
   antenna channel $v$. The range FFT produces:

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
   
   Basically, the resulting
   radar cube is indexed:

   $$
   RangeFFT\!\left[
   \text{range bin},\;
   \text{chirp number},\;
   \text{virtual antenna channel}
   \right]
   $$

2. A Doppler FFT is performed across slow time (i.e. the chirp dimension) for
   each range bin and virtual antenna channel. Its complex output can be indexed
   by range bin, Doppler bin, and virtual antenna channel.

   $$
   DopplerFFT[r,d,v]
   =
   \sum_{c=0}^{C-1}
   RangeFFT[r,c,v] * w_{Doppler}[c]
   * e^{-j2\pi dc/N_D}
   $$

   $C$ is the number of chirps for each virtual antenna channel,
   
   $N_D$ is the DopplerFFT length (either equal to the number of chirps in a CPI or next nearest power of two of that number greater). For TDM, this number should be divided by the number of TX antennas because each TX-RX virtual antenna channel only samples when its corresponding TX antenna is transmitting. For DDM, this DopplerFFT length is not divided by anything as every TX-RX virtual antenna channel is sampling at the same time,
   
   $w_{Doppler}[c]$ is the Doppler window, and
   
   $d$ is the
   Doppler-bin index.
   
   The resulting complex array is logically indexed as:

   $$
   DopplerFFT\!\left[
   \text{range bin},\;
   \text{Doppler bin},\;
   \text{virtual antenna channel}
   \right]
   $$

   In the equations below, $DopplerFFT_v[r,d]$ is another way of writing $DopplerFFT[r,d,v]$.
   I've omitted implementation-specific FFT scaling factors.

3. The log₂ magnitude is calculated for every Doppler FFT output:

   $$
   LogDopFFT_v[r,d] = \log_2\left(\left|DopplerFFT_v[r,d]\right|\right)
   $$

   $DopplerFFT_v[r,d]$ is the complex Doppler FFT output. Taking its magnitude,
   $|DopplerFFT_v[r,d]|$, removes complex phase. The HWA represents the resulting
   log₂ magnitude internally as an unsigned Q11-formatted value.

4. A second FFT is performed across the virtual antenna channel dimension. Only
   zero-frequency bin is retained because that bin is the sum of all its
   inputs (convince yourself that is a mathematical property of FFTs). FFT scaling normalises this sum by the FFT length $N'$.

   For virtual antenna FFT bin $k$, the scaled FFT output is:

   $$
   VirtualFFT[r,d,k]
   =
   \frac{1}{N'}
   \sum_{v=0}^{N-1}
   LogDopFFT_v[r,d]
   e^{-j2\pi kv/N'}
   $$

   $N'$ is the virtual antenna channel FFT length (either equal to the number of virtual antenna channels or next power of two from that number greater. FFT inputs are zero-padded for indices beyond number of virtual antenna channels in the latter case so they don't contribute to sum),

   At zero-frequency bin, $k=0$, complex exponential equals one:

   $$
   e^{-j2\pi(0)v/N'} = 1
   $$

   Therefore, the retained output is the normalised sum across all virtual
   antenna channels:

   $$
   VirtualFFT[r,d,0]
   =
   \frac{1}{N'}
   \sum_{v=0}^{N-1}
   LogDopFFT_v[r,d]
   $$

5. The result is converted from unsigned Q11 format to unsigned Q8 format.

For these equations:

- $r$ is the range-bin index.
- $d$ is the Doppler-bin index.
- $v$ is the virtual-antenna index.
- $N$ is the number of virtual antenna channels.
- $N' = 2^{\lceil\log_2 N\rceil}$ is the next power-of-two FFT length, as outlined in (4). When
  $N$ is already a power of two, $N'=N$.

The complete relationship from the Doppler FFT output to the raw Q8 integer is:

$$
\operatorname{rawValueToOutput}[r,d]
\approx 2^8\operatorname{VirtualFFT}[r,d,0]
= \frac{2^8}{N'}\sum_{v=0}^{N-1}\operatorname{LogDopFFT}_v[r,d]
= \frac{2^8}{N'}\sum_{v=0}^{N-1}
\log_2\left(\left|DopplerFFT_v[r,d]\right|\right)
$$

The approximation accounts for fixed-point quantisation and
implementation-specific HWA scaling omitted for clarity.
Dividing the raw integer by $2^8=256$ recovers the decoded log₂ value:

$$
\operatorname{decodedValue}[r,d]
= \frac{\operatorname{rawValueToOutput}[r,d]}{2^8}
\approx \operatorname{VirtualFFT}[r,d,0]
= \frac{1}{N'}\sum_{v=0}^{N-1}\operatorname{LogDopFFT}_v[r,d]
= \frac{1}{N'}\sum_{v=0}^{N-1}
\log_2\left(\left|DopplerFFT_v[r,d]\right|\right)
$$

The range-profile TLV contains only Doppler bin zero, so its transmitted values
are `rawValueToOutput[r, 0]` for each range bin $r$.

## Q8 representation

Each range point is stored in a 16-bit unsigned integer (`uint16_t`). Its bits
are interpreted as an unsigned Q8 fixed-point value, with an implied binary
point between bits 8 and 7.

```text
 Bit  15                         8   7                         0
     +----------------------------+----------------------------+
     |      Integer: 8 bits       |     Fraction: 8 bits       |
     +----------------------------+----------------------------+
                  iiiiiiii . ffffffff
```

The lower 8 bits are the fractional part, so one count represents
`1 / 2^8 = 1 / 256`. Decode a received value by dividing it by 256:

```text
decoded value = raw value (uint16_t) / 256
```

For example, a raw value of `13107` (`0x3333`) represents:

```text
13107 / 256 = 51.19921875
```

This unsigned 16-bit representation can express values from `0` to
`65535 / 256`, or approximately `255.996`.

## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in
the output packet. This includes the range profile.

import useBaseUrl from '@docusaurus/useBaseUrl';

# APIs

## Output packets

The mmWave Core sends detection information over UART once per frame. Each
output packet contains:

- A packet header
  ([`Mmw_output_message_header_t`](<./Packet Header.md>)).
- One or more [type-length-value (TLV) items](<./TLV Item/index.md>) containing the
  output data.

Each TLV item contains a type, a length (`Mmw_output_message_tl_t`), and
its payload. The available TLV types are defined by
`Mmw_output_message_type_e`, with their numerical values defined in
`mmw_output.h`. Detailed payload formats will be documented separately.

Packet length can vary from frame to frame depending on the number of detected
objects and the data included. The end of each packet is padded so that its
total length is always a multiple of 32 bytes.

<figure>
  <img
    src={useBaseUrl('/img/mmwave/apis/output_packet_uart.png')}
    alt="Output structure of a TLV packet sent over UART"
  />
  <figcaption>
    Output structure of TLV packet sent over UART. Ensure that the UART receiver
    is reading chunks of 32 bytes to ensure full packets are received.
  </figcaption>
</figure>

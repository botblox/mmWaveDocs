---
sidebar_position: 2
sidebar_label: Detected Points
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Reference

Type: `MMW_OUTPUT_MSG_DETECTED_POINTS`

Length: (`Number of detected objects`) * (`size of struct PointCloudCartesian`)

Value: Dense array of detected objects. Each value listed has no padding.

`struct PointCloudCartesian`

| Byte offset | Type | Field | Description |
| ---: | --- | --- | --- |
| 0–3 | `float` | `x` | Coordinate in meters. The x axis is parallel to the horizontal placement of the antenna array and when orthogonally plotted with the y axis, it creates the azimuthal plane. Positive x-direction is rightward in the azimuth plane when observed from the antenna array boresight outwards and negative x-direction is leftward. |
| 4–7 | `float` | `y` | Coordinate in meters. The y axis is perpendicular to the horizontal placement of the antenna array and when orthogonally plotted with the x axis, it creates the azimuthal plane. Positive y-direction is directed in front of the boresight from the antenna array and negative y-direction is behind the boresight. |
| 8–11 | `float` | `z` | Coordinate in meters. The z axis is perpendicular to the azimuthal plane created by the x-y axes. When orthogonally plotted with the x axis, this makes the elevational plane and when orthogonally plotted with the y axis, this makes the range plane. A positive z-axis value indicates upward direction from the antenna array and a negative z-axis value indicates downward direction. |
| 12–15 | `float` | `velocity` | Doppler velocity estimate in m/s. Positive velocity means the target is moving away from the antenna and negative velocity means target is moving towards the antenna. This should not be confused with the overall velocity as this will depend on the chosen reference frame. This velocity measurement is purely from the 1D reference frame of the antenna y-axis only. |


## Diagram

<figure>
  <img
    src={useBaseUrl('/img/mmwave/apis/coordinate_geometry.png')}
    alt="Coordinate geometry"
  />
  <figcaption>
    x, y, z axis as referenced in `struct PointCloudCartesian`. Example 4RX+3TX antenna shown with horizontal placement parallel to x-axis, vertical placement parallel to z-axis. y-axis referencing direction away/toward boresight.
  </figcaption>
</figure>

## Selecting the output

The CLI config command `guiMonitor` selects the TLV elements that are sent in
the output packet. This includes detected points.

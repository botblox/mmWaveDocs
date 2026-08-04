---
sidebar_position: 1
slug: /
---

# BotBlox mmWave Core Documentation

Welcome to the documentation for **BotBlox mmWave Core**.

These docs are designed to help you bring up the radar, understand the measurements it produces, and configure it for your application. They begin with practical setup instructions, then introduce radar concepts before moving into signal processing and advanced configuration.

You do not need previous radar experience to use these docs. The introductory sections explain the concepts needed to make informed configuration decisions, while the technical sections provide more detail for users working directly with the radar processing pipeline.

## How These Docs Are Organized

### Quickstart

The **Quickstart** guide walks through the shortest path from receiving the hardware to collecting radar data.

It covers the initial setup process, connecting to the module, loading a configuration, and confirming that the radar is operating correctly.

New users should generally begin here.

### Radar Fundamentals

The **Radar Fundamentals** section explains the main measurements and performance characteristics of a radar system:

- **Range:** How the radar determines the distance to a target
- **Velocity:** How relative motion is measured using the Doppler effect
- **Angle:** How the direction of a target is estimated
- **Resolution:** How well the radar can distinguish nearby targets
- **Radar Cross Section:** Why some objects are easier to detect than others

These pages focus on what each measurement means, what affects it, and the tradeoffs involved when configuring the sensor.

### Technical Fundamentals

The **Technical Fundamentals** section explains what happens inside the radar and its processing chain.

You do not need to read this entire section before using the radar. It is most useful when you want to understand why a configuration behaves a certain way, diagnose unexpected results, or develop your own radar-processing software. Note that the BotBlox mmWave Core does have its own firmware.

### Configuration Guide

The **Configuration Guide** explains how to configure mmWave Core for a particular application.


Radar parameters are interconnected. Increasing range, resolution, frame rate, or sensitivity may require compromises elsewhere. This section explains those relationships and helps you choose settings that stay within the module's hardware and processing limits.

### BotBlox mmWave Core

The **BotBlox mmWave Core** section introduces the module itself, including its hardware, capabilities, interfaces, and available resources.

Start here when evaluating the product or learning how it fits into a larger sensing system.



## Frequently Asked Questions

### Where should I start?

For your first setup, begin with the **Quickstart** guide.

After confirming that the radar is working, read the relevant **Radar Fundamentals** pages to understand the measurements you want to optimize. You can then use the **Configuration Guide** to select or modify a configuration.

A typical path through the documentation is:

1. Quickstart
2. Range, Velocity, Angle, and Resolution
3. Choosing a Configuration
4. Tuning by Application
5. Technical Fundamentals as needed

### Do I need previous radar or signal-processing experience?

No.

The **Radar Fundamentals** section introduces the most important concepts without assuming an advanced signal-processing background. More detailed topics, such as FFT processing and CFAR detection, are separated into the **Technical Fundamentals** section.

Basic familiarity with graphs, frequency, and coordinate systems is helpful but not required.

### What can mmWave Core measure?

Depending on the selected configuration and processing mode, the radar can estimate quantities such as:

- Distance to a detected target
- Relative radial velocity
- Horizontal and vertical direction
- Signal strength
- Signal-to-noise ratio

These measurements may be provided as detected points, tracked targets, radar heatmaps, or lower-level processing data, depending on the software configuration.

### What is the difference between a detection and a tracked object?

A **detection** is an individual radar reflection that passes the configured detection thresholds.

A physical object may produce several detections, one detection, or no reliable detection at all. The number and location of detections may change as the object moves or rotates.

A **tracked object** is produced by processing detections across multiple frames. Tracking software attempts to group related detections and estimate a more stable position and velocity for the underlying target.

See **CFAR**, **Signal Processing Pipeline**, and **Tracking** for more detail.

### What determines whether an object can be detected?

Detection depends on both the radar configuration and the target.

Important factors include:

- Target distance
- Radar cross section
- Target material, shape, and orientation
- Transmit and receive antenna gain
- Signal-processing gain
- Noise and interference
- CFAR and detection thresholds
- Multipath reflections
- Environmental conditions

A large object is not always a strong radar target. Its orientation and geometry can cause most of the reflected energy to travel away from the radar.

See **Radar Cross Section** and **Noise** for more information.


### Can the radar measure range, velocity, and angle simultaneously?

Yes, but each measurement is produced through a different part of the radar-processing pipeline.

Range is primarily determined from the frequency difference between transmitted and received FMCW signals. Velocity is estimated from phase changes across repeated chirps. Angle is estimated from phase differences between receiving antennas.

The available resolution and unambiguous measurement limits depend on the chirp design, antenna arrangement, frame structure, and processing configuration.

### Can I maximize range, resolution, velocity, and frame rate at the same time?

Usually not.

Radar configuration involves tradeoffs. For example:

- Better range resolution requires more chirp bandwidth.
- Longer maximum range may require a lower frequency slope or longer sampling period.
- Better velocity resolution generally requires more chirps.
- A higher frame rate leaves less time for collecting and processing each frame.
- Additional antennas and chirps can improve angle estimation but increase frame duration and processing requirements.

The **Choosing a Configuration** page explains how to balance these requirements.

### What is the difference between accuracy and resolution?

**Accuracy** describes how close a measurement is to the target's actual value.

**Resolution** describes whether two nearby targets can be distinguished from one another.

A radar may estimate the range of a single strong target accurately while still being unable to separate it from another target located within the same range-resolution cell.

The **Resolution** page discusses range, velocity, and angular resolution in more detail.

### Why does measured performance differ from theoretical calculations?

Configuration equations generally describe theoretical limits or idealized performance. Real measurements are also affected by:

- Receiver noise
- Antenna patterns
- Target RCS variation
- Calibration
- Quantization
- Windowing and FFT processing
- Detection thresholds
- Multipath reflections
- Interference
- Hardware limits

For this reason, theoretical calculations should be used as a starting point and verified through application-specific testing.

### Do I need to understand FMCW and FFTs before changing a configuration?

Not for basic configuration changes.

The **Choosing a Configuration** and **Tuning by Application** pages provide practical guidance without requiring a complete understanding of the processing chain.

However, understanding **FMCW**, **FFTs**, **CFAR**, and the **Signal Processing Pipeline** becomes valuable when creating a custom configuration, interpreting lower-level radar data, or diagnosing unexpected detections.

### Which configuration should I use?

Choose a configuration based on the application's most important requirements, such as:

- Maximum target distance
- Required range resolution
- Expected target speeds
- Required field of view
- Desired frame rate
- Number and type of targets
- Available processing and communication bandwidth

Start with **Choosing a Configuration**, then use **Tuning by Application** for application-specific recommendations.

### Can I directly edit every configuration parameter?

Many parameters can be adjusted, but not every combination is valid.

Configurations must remain within limits related to:

- RF bandwidth
- ADC sampling rate
- Chirp timing
- Frame timing
- Memory
- Processing capacity
- Thermal and power constraints
- Available transmit and receive channels

Invalid combinations may be rejected by the firmware or may produce incomplete or unreliable data. Review **Hardware Limits** and the **Advanced Reference** before making large changes to the chirp or frame structure.

---

## Next Steps

Begin with the **Quickstart** guide to connect the hardware and collect your first radar data.

For an introduction to radar performance, continue to **Radar Fundamentals**. To select or modify a radar configuration, visit **Choosing a Configuration**.
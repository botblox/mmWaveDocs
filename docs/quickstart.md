---
sidebar_position: 2
---

# Quick Start

## Flashing the BB-MMx-A-1 (MM1, MM2, MM3) board

- Attach MM1 with MMB baseboard. 
- Change SOP mode to SOP0 = 1, SOP1 = 0, SOP2 = 1 for flash mode. To change between flash mode and normal mode requires that the `SOP2_PMIC_CLK` pin (i.e. pin 1 on `J2` connector) is pulled high rather than pulled low. To do this, depop `R57` which pulls `SOP2` down. Instead, use a pull up on pin 3 of `J2` to 3.3V (10K resistor). Use `VDDIO_3.3V` rail if possible, you can use `TP15` for this supply. Alternatively, can just use 3.3V.
- Power cycle the board if changed SOP mode.
- Connect a USB to picoclasp 4 pin cable to `J3` on the MMB board. 
- Install the mmWave MCUplus SDK `mmwave_mcuplus_sdk_04_07_02_01-{operating_system}-Install.{exe|bin}` [here](https://www.ti.com/tool/MMWAVE-MCUPLUS-SDK)
You will need a Linux or Windows system for this. I also have a link for a google drive of an unzipped archive tarball of the sdk [here](https://drive.google.com/file/d/1cwH54HAjw54wbBJ0hACZkTADh8oHw7I2/view?usp=sharing) for the Linux build if you are having trouble extracting.
- Locate `/path/to/mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm/awr2x44P_mmw_demoTDM.appimage`
- Locate `/path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/awr2x44P/sbl_qspi.release.tiimage`

### Program using UniFlash

- Download [here](https://www.ti.com/tool/UNIFLASH)
- Select AWR2944EVM as device. Although we may need to add other profiles in future
- Select 'select and load images'
- Upload `sbl_qspi.release.tiimage` as SBL image and `awr2x44P_mmw_demoTDM.appimage` as App Image. 
- When ready, click `Load Image`
- Once flash is sucessful, power off board and put it back into functional mode by removing pullup on pin 3 of `J2` (SOP2) and repopulated `R57` with 10K resistor.

### Program using Python

- Ensure `python3.9+` is available. Run `which python` to confirm the version available
- Navigate to `/path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/awr2x44P/default.cfg` 
- For flashing the app image. make the following change

```
# send the application image to flash. Flash it at 0xA0000 as the SBL expects it at this location
### ORIGINAL for Debug
# --file=../../ti/utils/ccsdebug/awr2944_ccsdebug.appimage --operation=flash --flash-offset=0xA0000
### Demo
--file=../../ti/demo/awr2x44P/mmw_tdm/awr2x44P_mmw_demo_TDM.appimage --operation=flash --flash-offset=0xA0000
```

- Flash with `python /path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/boot/uart_uniflash.py -p <COM_PORT or serial device> --cfg=default.cfg`

## Ethernet demo

For the ethernet demo, the process is the same, but use `/path/to/mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm/awr2x44P_mmw_demoTDMENET.appimage`

## Troubleshooting:

- If you receive `[ERROR] Cortex_R5_0: XMODEM send failed`, it is likely that you forgot to correctly setup the SOP jumper pins for flashing mode. Refer to step 1.
- If it takes forever to flash, unplug the USB and then power cycle the board. Make sure you plug in the USB AFTER power cycling the board.

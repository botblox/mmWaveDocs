---
sidebar_position: 2
---

# Quick Start

## Flashing the BB-MMx-A-1 (MM1, MM2, MM3) board

- Attach MM1 with MMB baseboard itself.
- There is no need to power the board directly through `J4` as power can be supplied from USB.
- You will need to change SOP mode to SOP0 = 1, SOP1 = 0, SOP2 = 1 for QSPI uart flash mode. To change between flash mode and normal mode requires that the `SOP2_PMIC_CLK` pin  is pulled high rather than pulled low. This is pin 3 on `J2` connector. `SOP2_PMIC_CLK` is not pulled on the radar chip (it is a high impedance input at reset with no pull) and there are no other pullups / pull downs available. Depop `R57` to remove the only 10K pulldown. Use a pull up to 3.3V (10K resistor). Use `VDDIO_3.3V` rail if possible, you can use `TP15` for this supply. Alternatively, can use `3.3V_SYS` rail or an external 3.3V so long as grounds are shared.
- Power cycle the board if changed SOP mode.
- Connect a USB-A to PicoClasp 4 pin cable to `J3` on the MMB board. 
- Connect the USB-A to a programming machine and confirm that you see the usb device appear. Use `lsusb` and `dmesg` on GNU/Linux based distros or `Device Manager` if using Windows.
- Install the mmWave MCUplus SDK `mmwave_mcuplus_sdk_04_07_02_01-{operating_system}-Install.{exe|bin}` [here](https://www.ti.com/tool/MMWAVE-MCUPLUS-SDK)
Note the difference if you are using a Linux-based or Windows system. I also have a link for a google drive of an unzipped archive tarball of the sdk [here](https://drive.google.com/file/d/1cwH54HAjw54wbBJ0hACZkTADh8oHw7I2/view?usp=sharing) for the Linux build if you are having trouble extracting on a linux-based system.
- Locate `/path/to/mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm/awr2x44P_mmw_demoTDMEnet.appimage` and `/path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/awr2x44P/sbl_qspi.release.tiimage`
- Install `Sysconfig` from [here](https://www.ti.com/tool/SYSCONFIG#downloads) as this is important if you later want to download tools like the `Mmwave_Demo_Visualizer` and `CCS Studio` for flashing updated code or debugging.
- Install `CCS Studio` from [here](https://www.ti.com/tool/CCSTUDIO)


### Program using UniFlash

- Install `UniFlash` from [here](https://www.ti.com/tool/UNIFLASH)
- If you are programming the AWR2944EVM board, then select AWR2944EVM as device. For the `AWR2944P`, choose a `AWR2x44P` as the device with serial connection. 

![Selecting the AWR2944EVM device in UniFlash](/img/quickstart/uniflash_selecting_awr2944evm.png)

![Selecting the AWR2x44P serial device in UniFlash](/img/quickstart/uniflash_selecting_awr2944P_chip.png)

- Select 'select and load images' when you find the devices.

- Upload `sbl_qspi.release.tiimage` as SBL image and `awr2x44P_mmw_demoTDMEnet.appimage` as App Image for `AWR2944P` device. Use `awr2944_mmw_demoTDMEnet.appimage` as App Image for `AWR2944EVM` board.
- When ready, click `Load Image`
- Once flash is sucessful, power off board and put it back into functional mode by removing pullup on pin 3 of `J2` (SOP2) and repopulated `R57` with 10K resistor OR use another MMB baseboard.
- You may get errors here and usually the troubleshooting involves trying a different machine (Linux/Windows), making sure that you plug in USB AFTER powering the board, or by making sure to trigger a reset (on the EVM board by pressing `SW1`). On the MM1 board, you will need to trigger a reset with a JLink device on `J7` or by configuring `AR_NRST` (pin 10 on `J7` or `TP30`) with a switch that pulls it low.

### Program using Python

- Ensure `python3.9+` is available. Run `which python` and `python --version` to confirm the version available
- Navigate to `/path/to/mmwave_mcuplus_sdk_04_07_02_01/mmwave_mcuplus_sdk_04_07_02_01/scripts/unix/setenv.sh` for Linux-based systems or `/home/aaronelijah/Documents/BotBlox/Repos-Misc/mmwave_ti/mmwave_mcuplus_sdk_04_07_02_01/mmwave_mcuplus_sdk_04_07_02_01/scripts/windows/setenv.bat` for Windows system. Make the following edits

```
export MMWAVE_SDK_DEVICE=awr2x44P
```

Furthermore, check that `MMWAVE_SDK_TOOLS_INSTALL_PATH`, `CCS_INSTALL_PATH`, `SYSCONFIG_INSTALL_PATH` path are all correctly set based on your system.

- Navigate to `/path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/awr2x44P/default.cfg` 
- For flashing the app image. make the following change

```
# send the application image to flash. Flash it at 0xA0000 as the SBL expects it at this location
### ORIGINAL for Debug
# --file=../../ti/utils/ccsdebug/awr2944_ccsdebug.appimage --operation=flash --flash-offset=0xA0000
### Demo
--file=../../ti/demo/awr2x44P/mmw_tdm/awr2x44P_mmw_demoTDMEnet.appimage --operation=flash --flash-offset=0xA0000
```

- Flash with `python /path/to/mcu_plus_sdk_awr2x44p_10_02_00_04/tools/boot/uart_uniflash.py -p <COM_PORT or serial device> --cfg=/path/to/mmwave_mcuplus_sdk_04_07_02_01/tools/awr2x44P/default.cfg`
- Note the slightly different SDK path to the previous but it is still included in the tarball.

## Troubleshooting:

- If you receive `[ERROR] Cortex_R5_0: XMODEM send failed`, it is likely that you forgot to correctly setup the SOP jumper pins for flashing mode. Refer to step 1.
- If it takes forever to flash, unplug the USB and then power cycle the board. Make sure you plug in the USB AFTER power cycling the board.

# Visualiser (this may not work for MM1+MMB)

- Set yourself up with `mmWave_Demo_Visualizer` version 4.7.0 [here](https://dev.ti.com/gallery/info/mmwave/mmWave_Demo_Visualizer//)
- You can download this on both Windows or Linux but I have had more success on the online version on Linux based systems. 
- Open this on Chrome with the [TI Cloud Agent chrome extension](https://chromewebstore.google.com/detail/ticloudagent-bridge/pfillhniocmjcapelhjcianojmoidjdk) installed
- Go to `Options` -> `Serial Port` and configure the `User/Application port` and the `Auxillary Data port`. The MM1 only exposes a single `User/Application port` used for flashing so it may not be possible to actually use this visualiser software.


![Selecting the serial ports in the demo visualiser](/img/quickstart/visualiser_select_serial_port.png)

![Selecting the config to upload in the plots page](/img/quickstart/visualiser_plots_page.png)
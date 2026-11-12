---
sidebar_position: 3
---

# MM1 Flash Configuration Patch

The MM1 (rev A) board uses an MX25R6435F QSPI flash device. The AWR2x44P EVM-generated files use a GD25B64C, so the QSPI configuration must be changed in both SBL projects and in the MMW application for it to run.

## Prepare The SDK

Set `/path/to/mmwave_mcuplus_sdk_04_07_02_01` to the SDK installation directory on the target machine. Source or import the environment before building.

Linux:

```bash
source /path/to/mmwave_mcuplus_sdk_04_07_02_01/mmwave_mcuplus_sdk_04_07_02_01/scripts/unix/setenv.sh
```

Windows Command Prompt:

```bat
call C:\path\to\mmwave_mcuplus_sdk_04_07_02_01\mmwave_mcuplus_sdk_04_07_02_01\scripts\windows\setenv.bat
```

Check `MMWAVE_SDK_TOOLS_INSTALL_PATH`, `CCS_INSTALL_PATH`, and `SYSCONFIG_INSTALL_PATH` and adjust them for the local installation. Your versions of CCS Studio and Sysconfig may vary from the defaults in the SDK and generally this isn't a problem as long as you change the values.

## Prepare The Sources

Duplicate the two EVM SBL projects:

```bash
cd /path/to/mmwave_mcuplus_sdk_04_07_02_01/mcu_plus_sdk_awr2x44p_10_02_00_04/examples/drivers/boot
cp -a sbl_qspi/awr2x44p-evm sbl_qspi/mm1
cp -a sbl_uart_uniflash/awr2x44p-evm sbl_uart_uniflash/mm1
```

Generate the MMW Ethernet application files:

```bash
cd /path/to/mmwave_mcuplus_sdk_04_07_02_01/mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm
make
```

On Windows, use `gmake` instead:

```bat
cd C:\path\to\mmwave_mcuplus_sdk_04_07_02_01\mmwave_mcuplus_sdk_04_07_02_01\ti\demo\awr2x44P\mmw_tdm
gmake clean
gmake all
```

Run this only before applying `mm1_flash.patch`, to create or regenerate `mss\mssgenerated`. After applying the patch, do not run `gmake clean` or `gmake all`, because they regenerate or remove the patched files.

## Apply The Patch

The complete unified patch is stored beside this page as `mm1_flash.patch`. Copy that file into the SDK installation directory, or copy its contents into a file with that name. Apply it from the SDK installation directory:

```bash
cd /path/to/mmwave_mcuplus_sdk_04_07_02_01
patch -p1 --dry-run < mm1_flash.patch
patch -p1 < mm1_flash.patch
```

The patch updates these three generated files:

- `mcu_plus_sdk_awr2x44p_10_02_00_04/examples/drivers/boot/sbl_qspi/mm1/.../ti_board_open_close.c`
- `mcu_plus_sdk_awr2x44p_10_02_00_04/examples/drivers/boot/sbl_uart_uniflash/mm1/.../ti_board_open_close.c`
- `mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm/mss/mssgenerated/ti_board_open_close.c`

The flash values become `manufacturerId=0xC2`, `deviceId=0x2817`, and `enableType=2`. If the dry run reports that a file is already patched, inspect it rather than forcing the patch.

Do not run SysConfig after applying the patch. It will regenerate the edited files.

## Build The Images

Build the two SBL projects with regeneration disabled:

```bash
cd /path/to/mmwave_mcuplus_sdk_04_07_02_01/mcu_plus_sdk_awr2x44p_10_02_00_04/examples/drivers/boot/sbl_uart_uniflash/mm1/r5fss0-0_nortos
make PROFILE=release SYSTEM_FLAG=true

cd /path/to/mmwave_mcuplus_sdk_04_07_02_01/mcu_plus_sdk_awr2x44p_10_02_00_04/examples/drivers/boot/sbl_qspi/mm1/r5fss0-0_nortos
make PROFILE=release SYSTEM_FLAG=true
```

Then rebuild the MMW application without `syscfg_enet`:

```bash
cd /path/to/mmwave_mcuplus_sdk_04_07_02_01/mmwave_mcuplus_sdk_04_07_02_01/ti/demo/awr2x44P/mmw_tdm
make PROC_CHAIN=TDM \
     mssDemoObjClean \
     dssDemoObjClean \
     mssDemoEnet \
     dssDemoEnet \
     enetbin
```

Do not use `mmwDemoTDMEnet`, `objClean`, or `clean` after applying the patch because those targets regenerate or delete the generated configuration.

Finally, update `tools/awr2x44P/default.cfg` to use the MM1 SBL images and rebuilt `awr2x44P_mmw_demoTDMEnet.appimage`. Keep the application flash offset at `0xA0000`.

# MintSnap

**MintSnap** is a [Cinnamon](https://github.com/linuxmint/Cinnamon) extension that lets you snap your windows into flexible, customizable regions on your desktop.

MintSnap is **inspired by the Snap Layouts experience introduced in Windows 11**, bringing a similar flexible window-management concept to Linux Mint and the Cinnamon desktop environment.

Unlike a typical tiling system based on fixed rows and columns, MintSnap allows you to create layouts with independently sized regions. Horizontal and vertical dividers do not have to span the entire screen, and regions do not have to be evenly distributed.

## Install

Download the code in this repository and place it in the directory:

```bash
~/.local/share/cinnamon/extensions/mintsnap@r3adk
```

Or clone the repository directly into the Cinnamon extensions directory:

```bash
git clone https://github.com/KariMahfoudi/MintSnap.git ~/.local/share/cinnamon/extensions/mintsnap@r3adk
```

After installing the extension, open **Cinnamon Extensions**, find **MintSnap**, and click the `+` button to enable it.

> **Note:** The extension UUID and installation directory must match the UUID defined in `metadata.json`.

## Quick Start

After enabling the extension, press `<SUPER>+G` to open the layout editor.

The editor starts with a 2x2 grid layout. Click and drag the dividers — the lines between regions — to resize the regions.

If you want to split a region, press `<SHIFT>` or `<CTRL>` while hovering over the region to split it horizontally or vertically.

The dotted guide lines are located at 1/3, 1/2, and 2/3 along the axis.

Use the `right mouse button` to remove dividers.

Use `<Page Up>` and `<Page Down>` to increase or decrease the spacing between the regions.

After creating your desired layout, exit the editor using `<SUPER>+G` or `<ESC>`.

### Snapping Windows

Start dragging a window and press the `<CTRL>` key.

The layout will become visible. Move your mouse over the region where you want the window to be placed and release the mouse button.

The window will then be snapped into that region.

When the mouse hovers over the border between two regions, those regions are merged into a single region into which the window will snap.

In the settings, you can change the modifier key or enable your secondary mouse button to show the layout.

If you want to make the snapping region even larger, hold the `<ALT>` key while hovering over adjacent regions to merge them into a single large snapping region.

## Loading and Saving Presets

There are 8 slots available for layout presets.

Presets 4–8 are read-only **system presets**, while 1–4 are **user presets**.

When the layout editor is open, press `<SPACE>` to view the available presets and click the preset you want to load.

To save a layout, press the `<ALT>` key to open the save preset dialog and select one of the four user slots.

### Quick Preset Loading

You can quickly load a preset by opening the layout editor and immediately pressing the number corresponding to the desired preset:

```text
1 – 8
```

## License

MintSnap is released under the **GNU General Public License v3.0 (GPL-3.0)**.

Because MintSnap is based on the GPL-licensed Fancy Tiles project, the original license and applicable attribution are preserved.

See the [`LICENSE`](LICENSE) file for the complete license text.

## Author

**Karim Mahfoudi**

GitHub: https://github.com/KariMahfoudi

MintSnap is developed and maintained by **Karim Mahfoudi**.

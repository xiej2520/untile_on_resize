# Untile on Resize

I hate tiling windows

Allows resizing snapped windows by untiling them when they are resized in Plasma 6 kwin.
Has some strange behavior due to quirks of kwin quick tiling:

## Install

```sh
kpackagetool6 --type=KWin/Script -i untile_on_resize
```

Then go to Settings -> Window Management -> Kwin scripts -> checkbox

## Notes

This untiles a window when it is

- In a tile with another window, and then resized. This prevents resizing the
  window from resizing all other windows behind it in the same tile.
- In a tile with another tile with the same parent. E.g. snap one window to the
  left, snap one window to the right, and resize one of them. Kwin currently
  resizes them together, marked as won't implement an option.
  <https://invent.kde.org/plasma/kwin/-/merge_requests/5665>
  This untiles the window that is being resized, so it can be resized separately
  to create overlapping windows.
  - This allows snapping a window, resizing it alone, then snapping a window next
    to it with the adjusted size. But when you resize it after this, it only
    resizes one window and removes that window from its tile.

Setting a window's tile to null removes it from the tile. If you try to snap it
back to the tile, it doesn't work (kwin quick tile behavior?). You have to snap
it to a different tile (e.g. top left/bottom left) and then back to get it to
tile again.

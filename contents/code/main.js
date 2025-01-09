function init() {
	const windows = workspace.windowList();
	for (const window of windows) {
		windowAdded(window);
	}
}

workspace.windowAdded.connect(windowAdded);

// from what I can tell, snapped windows go to the QuickRootTile, which stores
// its children (left, right, etc.) in its own members instead of m_children,
// so I can't access it in the API

function windowAdded(client) {
	// interactiveMoveResizedFinished doesn't pass client for some reason
	// 
	// remove window from tile when it is resized, and there are other windows in
	// the tile, or it is tiled with another window
	// this allows resizing a window, then snapping a window next to it
	client.interactiveMoveResizeStarted.connect(() => {
		//print("\n===resize triggered on", client.caption, client.x, client.y, client.width, client.height, client.tile);
		//for (const w of workspace.stackingOrder) {
		//	if (w.tile !== null) {
		//		print(w.caption, "tile:", w.tile, "parent:", w.tile?.parent);
		//	}
		//}
		if (client.tile !== null) {
			//print("tile isn't null, setting to null");
			//print("tile.tiles", client.tile.tiles, "tile.windows", client.tile.windows.map(w => w.caption));
			//print("parent tile", client.tile.parent, "p.tiles", client.tile.parent.tiles, "p.windows", client.tile.parent.windows);
			//const tm = workspace.tilingForScreen(workspace.activeScreen);
			for (const w of workspace.stackingOrder) {
				if (w === client) {
					continue;
				}
				if (w.tile == client.tile) {
					//print("---found in same tile", w.tile, client.tile, w.caption, "|", client.caption);
					client.tile = null;
					break;
				}
				if (w.tile?.parent === client.tile.parent) {
					//print("--found tiled together under", w.tile.parent, w.tile.parent.windows.map(w => w.caption), client.caption, "|", w.caption);
					//print("removing", client.caption, "from tile", client.tile);
					// tiled together, break tiling
					client.tile = null;
					break;
				}
			}
			//print("\n=========");
		} else {
			//print("tile is null");
		}
	});

	// setting a tile to null removes the window from that tile. if you try to snap
	// that window back to that tile, it won't work and it'll stay null. but if you
	// snap it to a different tile, then snap it back, it'll change.


	// immediately removing tile on tileChanged stops us from snapping a window,
	// resizing it, and then snapping another window to fit that tile's resized size
	//client.tileChanged.connect(tile => {
	//	print("tile changed", client.caption, tile, client.tile);
	//});
}

init();

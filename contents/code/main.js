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
		if (client.tile !== null) {
			for (const w of workspace.stackingOrder) {
				if (w === client) {
					continue;
				}
				if (w.tile == client.tile) {
					client.tile = null;
					break;
				}
				if (w.tile?.parent === client.tile.parent) {
					// tiled together, break tiling
					client.tile = null;
					break;
				}
			}
		} else {
		}
	});

	// setting a tile to null removes the window from that tile. if you try to snap
	// that window back to that tile, it won't work and it'll stay null. but if you
	// snap it to a different tile, then snap it back, it'll change.


	// immediately removing tile on tileChanged stops us from snapping a window,
	// resizing it, and then snapping another window to fit that tile's resized size
}

init();



const Main = imports.ui.main;
const Panel = imports.ui.panel;


function getUsableScreenArea(displayIdx) {
  
    if (typeof displayIdx !== 'number') {
        global.logError('getUsableScreenArea: displayIdx is not a number');
        return null;
    }

    const display = global.display.get_monitor_geometry(displayIdx);

    let top = display.y;
    let bottom = display.y + display.height;
    let left = display.x;
    let right = display.x + display.width;


    for (let panel of Main.panelManager.getPanelsInMonitor(displayIdx)) {
        if (!panel.isHideable()) {
            switch (panel.panelPosition) {
                case Panel.PanelLoc.top:
                    top += panel.height;
                    break;
                case Panel.PanelLoc.bottom:
                    bottom -= panel.height;
                    break;
                case Panel.PanelLoc.left:
                    left += panel.height;
                    break;
                case Panel.PanelLoc.right:
                    right -= panel.height;
                    break;
            }
        }
    }

    let width = Math.max(0, right - left);
    let height = Math.max(0, bottom - top);
    return { x: left, y: top, width: width, height: height };
}


function snapToRect(metaWindow, rect) {
    if (!metaWindow || !rect) {
        global.logError('No metaWindow or rect');
        return;
    }

    let clientRect = metaWindow.get_frame_rect();
    
    if (clientRect.x === rect.x &&
        clientRect.y === rect.y &&
        clientRect.width === rect.width &&
        clientRect.height === rect.height) {
        return;
    }

    metaWindow.move_resize_frame(
        false,
        rect.x, rect.y,
        rect.width, rect.height);
}


module.exports = {
    getUsableScreenArea,
    snapToRect
}; 
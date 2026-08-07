const Main = imports.ui.main;

class MintSnapExtension {
    constructor() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;

        global.log("[MintSnap] enabled");

        Main.notify(
            "MintSnap",
            "Extension successfully loaded"
        );
    
        let window = global.display.focus_window;
    
        if (window){
            global.log("[MintSnap] Active window:" + window.get_title());

            Main.notify(
                "MintSnap",
                "Active window: " + window.get_title()
            );

        }
    else {
        Main.notify(
            "MintSnap",
            "No active window"
        );
    }    
    }

    disable() {
        this.enabled = false;
        global.log("[MintSnap] disabled");
    }
}

let extension = null;

function init() {
}

function enable() {
    extension = new MintSnapExtension();
    extension.enable();
}

function disable() {
    if (extension !== null) {
        extension.disable();
        extension = null;
    }
}
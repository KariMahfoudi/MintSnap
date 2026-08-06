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
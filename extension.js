const Main = imports.ui.main;
const Settings = imports.ui.settings;

class MintSnapExtension {
    constructor() {
        this.enabled = false;
        this.settings = null;
        this.focusSignal= null;
    }

    enable() {
        this.enabled = true;

        this.settings = new Settings.ExtensionSettings(this, "mintsnap@krim");
        this.settings.bind("Notify focus changes", "notifyFocusChanges", this._onNotifyFocusChangesChanged.bind(this));
        global.log("[MintSnap] enabled");

        Main.notify(
            "MintSnap",
            "Extension successfully loaded"
        );

        this.focusSignal = global.display.connect('notify::focus-window', ()=>{this.onFocusChanged});
    }

    onFocusChanged(){
        let window = global.display.focus_window;
        if(!window){
            return;
        }

        let title = window.get_title();
        global.log("[MintSnap] Focus changed to: " + title);
        if (this.notifyFocusChange){
            Main.notify(
                "MintSnap",
                "Active window:" +title);
        }

    }

    
    
        l

    disable() {
        this.enabled = false;
 
        if (this.focusSignal !== null){
            global.display.disconnect(this.focusSignal);
            this.focusSignal = null;
        }



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
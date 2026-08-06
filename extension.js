const Main = imports.ui.main;
class MintSnapExtension{
    constructor() {
        this.enabled = false;
    }
    enable(){
        this.enabled = true;

        global.log("[MinsSnap] enabled");

        Main.notify(
            "MintSnap",
            "Extension successfully loaded"
        );
    }

    disable(){
        this.enabled =false;
        global.log("[MinsSnap] disabled");
    }
}

let extension = null;

function enable(){
    extension = new MintSnapExtension();
    extension.enable();
}
function disable(){
   if (extension !== null){
       extension.disable();
       extension = null;
}
}
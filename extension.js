

const { Application } = require('./application');

const UUID = 'mintsnap@r3adk';
let application = null;



function init() {
}

function enable() {
    application = new Application(UUID);
}

function disable() {
    if (application) {
        application.destroy();
        application = null;
    }
}

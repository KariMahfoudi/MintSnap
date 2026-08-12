const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Meta = imports.gi.Meta;

const { WindowSnapper } = require('./window-snapper');


const MAX_RESTARTS = 100;


class DragSession {
    #window;
    #options;
    #layoutFor;           
    #snappers = [];

    #cancelled = false;
    #restarts = 0;
    #pendingRestartId = 0;
    #activationPollerId = 0;

    /**
     * @param {Meta.Window} params.window     window being dragged
     * @param {Function}    params.layoutFor  (monitorIdx) => LayoutNode
     * @param {object}      params.options    resolved settings snapshot
     *
     * Settings are snapshot once here so a mid-drag setting change can't
     * corrupt in-flight state.
     */
    constructor({ window, layoutFor, options }) {
        this.#window = window;
        this.#layoutFor = layoutFor;
        this.#options = options;

        const nMonitors = global.display.get_n_monitors();
        for (let i = 0; i < nMonitors; i++) {
            this.#snappers.push(this.#buildSnapper(i));
        }

        this.#startActivationPoller();
    }

    onGrabRestart(window) {
        this.#window = window;
    }

    tryRestart() {
        if (this.#cancelled) return false;
        if (this.#restarts >= MAX_RESTARTS) {
            global.logWarning(`fancytiles: hit MAX_RESTARTS (${MAX_RESTARTS}), giving up`);
            return false;
        }
        const [anchorX, anchorY, state] = global.get_pointer();
        if (!(state & Clutter.ModifierType.BUTTON1_MASK)) return false;

        this.#scheduleRestart(anchorX, anchorY);
        return true;
    }


    finish() {
        if (this.#pendingRestartId) {
            GLib.source_remove(this.#pendingRestartId);
            this.#pendingRestartId = 0;
        }
        this.#stopActivationPoller();

        for (const snapper of this.#snappers) {
            if (!this.#cancelled) snapper.finalize();
            snapper.destroy();
        }
        this.#snappers = [];
        this.#window = null;
    }



    #buildSnapper(monitorIdx) {
        const o = this.#options;
        return new WindowSnapper(
            monitorIdx,
            this.#layoutFor(monitorIdx),
            this.#window,
            o.enableSnappingModifiers,
            o.enableMultiSnappingModifiers,
            o.mergeAdjacentOnHover,
            o.mergingRadius,
            o.activateWithNonPrimaryButton,
            o.autoStartSnapping,
        );
    }

    #scheduleRestart(anchorX, anchorY) {
        this.#restarts += 1;
        this.#pendingRestartId = GLib.idle_add(GLib.PRIORITY_HIGH_IDLE, () => {
            this.#pendingRestartId = 0;
            this.#reissueGrab(anchorX, anchorY);
            return GLib.SOURCE_REMOVE;
        });
    }

    #reissueGrab(anchorX, anchorY) {

        const [, , state] = global.get_pointer();
        if (!(state & Clutter.ModifierType.BUTTON1_MASK) || !this.#window) {
            this.finish();
            return;
        }

        try {
            
            global.display.begin_grab_op(
                this.#window,
                Meta.GrabOp.MOVING,
                /* pointer_already_grabbed */ false,
                /* frame_action            */ true,
                /* button                  */ 1,
                /* modmask                 */ 0,
                global.get_current_time(),
                anchorX,
                anchorY,
            );
        } catch (e) {
            global.logError(`fancytiles: restart grab failed: ${e}`);
            this.#cancelled = true;
            this.finish();
            return;
        }

        for (const snapper of this.#snappers) snapper.refreshFromPointer();
    }

    #startActivationPoller() {
        this.#activationPollerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
            for (const snapper of this.#snappers) snapper.refreshFromPointer();
            return GLib.SOURCE_CONTINUE;
        });
    }

    #stopActivationPoller() {
        if (!this.#activationPollerId) return;
        GLib.source_remove(this.#activationPollerId);
        this.#activationPollerId = 0;
    }
}

module.exports = { DragSession };

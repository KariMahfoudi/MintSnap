const Cairo = imports.cairo;
const Main = imports.ui.main;
const SignalManager = imports.misc.signalManager;
const St = imports.gi.St;

const { drawLayout } = require('./drawing');
const { snapToRect, getUsableScreenArea } = require('./window-utils');
const { SnappingOperation } = require('./node_tree');


class WindowSnapper {

    #container
    #drawingArea;


    #window;


    #layout;


    #snappingOperation;


    #enableSnappingModifiers;

    #enableMultiSnappingModifiers;


    #enableAdjacentMerging;


    #mergingRadius;


    #activateWithNonPrimaryButton;

    #signals = new SignalManager.SignalManager(null);

    constructor(displayIdx, layout, window, enableSnappingModifiers, enableMultiSnappingModifiers, enableAdjacentMerging, mergingRadius, activateWithNonPrimaryButton, autoStartSnapping) {
    
        this.#layout = layout;

        
        this.#window = window;

    
        this.#enableSnappingModifiers = enableSnappingModifiers;

        
        this.#enableMultiSnappingModifiers = enableMultiSnappingModifiers;

        this.#enableAdjacentMerging = enableAdjacentMerging;

        this.#mergingRadius = mergingRadius;

    
        this.#activateWithNonPrimaryButton = activateWithNonPrimaryButton;

    
        let workArea = getUsableScreenArea(displayIdx);


        this.#container = new St.Bin({
            reactive: false,
            can_focus: false,
        });
        this.#container.set_size(workArea.width, workArea.height);
        this.#container.set_position(workArea.x, workArea.y);

        this.#drawingArea = new St.DrawingArea({
            reactive: false,
            can_focus: false
        });
        this.#drawingArea.connect('repaint', (area) => { this.#onRepaint(area); });
        this.#container.set_fill(true, true);
        this.#container.set_child(this.#drawingArea);

        Main.uiGroup.add_actor(this.#container);

        this.#layout.calculateRects(workArea.x, workArea.y, workArea.width, workArea.height);
        this.#snappingOperation = new SnappingOperation(this.#layout, this.#enableSnappingModifiers, this.#enableMultiSnappingModifiers, this.#enableAdjacentMerging, this.#mergingRadius, this.#activateWithNonPrimaryButton, autoStartSnapping);

        this.#signals.connect(this.#window, 'position-changed', this.#onWindowMoved.bind(this));
    }

    get isSnappingEnabled() {
        return this.#snappingOperation ? this.#snappingOperation.isSnappingEnabled : false;
    }


    refreshFromPointer() {
        if (!this.#snappingOperation) return;
        const [x, y, state] = global.get_pointer();
        const result = this.#snappingOperation.onMotion(x, y, state);
        if (!(result && result.shouldRedraw)) return;
        if (this.#snappingOperation.showRegions) {
            this.#container.show();
        } else {
            this.#container.hide();
        }
        this.#drawingArea.queue_repaint();
    }

    finalize() {
        const snappingRect = this.#snappingOperation.currentSnapToRect();
        if (snappingRect) {
           
            snapToRect(this.#window, snappingRect);
        }

        this.#snappingOperation.cancel();
        this.#snappingOperation = null;
    }

    destroy() {
        this.#signals.disconnectAllSignals();
        this.#signals = null;

        if (this.#snappingOperation) {
            this.#snappingOperation.cancel();
            this.#snappingOperation = null;
        }

        Main.uiGroup.remove_actor(this.#container);
        this.#container = null;
        this.#drawingArea = null;
        this.#layout = null;
    }

    #onRepaint(area) {
        let cr = area.get_context();

        cr.setOperator(Cairo.Operator.CLEAR);
        cr.paint();
        cr.setOperator(Cairo.Operator.OVER);

    
        if (this.#snappingOperation && this.#snappingOperation.showRegions) {
            let [x, y] = area.get_transformed_position();
            drawLayout(
                cr,
                this.#snappingOperation.tree,
                { x: x, y: y, width: area.get_width(), height: area.get_height() },
                this.colors);
        }

        cr.$dispose();
    }


    #onWindowMoved() {
        this.refreshFromPointer();
    }
}

module.exports = { WindowSnapper }; 

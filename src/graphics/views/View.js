import { 
    EventEmitter,
} from "../../events/index.js"
import { Vec2 } from "../../math/Vec2.js";

export class View {
    #parent = null;
    #views = [];
    #isVisible = true;
    #isPickable = true;
    #eventEmitter = new EventEmitter();

    // --[ init ]---------------------------------------------------------------
    constructor() {}

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) { return true; }
    getX() { return 0; }
    getY() { return 0; }

    localToChild(x, y) { return new Vec2(x, y); }
    childToLocal(x, y) { return new Vec2(x, y); }

    // --[ parent ]-------------------------------------------------------------
    getParent() {
        return this.#parent;
    }

    removeFromParent() {
        if (this.#parent !== null) {
            this.#parent.removeView(this);
            this.#parent = null;
        }
    }

    // --[ views ]--------------------------------------------------------------
    addView(v) {
        v.removeFromParent();
        v.#parent = this;
        this.#views.push(v);

        return v;
    }

    removeView(v) {
        var index = this.#views.indexOf(v);
        if (index >= 0) {
            v.#parent = null;
            this.#views.splice(index, 1);
        }

        return v;
    }

    getViews() {
        return this.#views;
    }

    getViewCount() {
        return this.#views.length;
    }

    pickView(x, y) {
        let childXY = this.localToChild(x, y);
        for (var i = this.getViewCount() - 1; i >= 0; i--) {
            var view = this.#views[i];
            if (view.isVisible() && view.isPickable() && view.isInBounds(childXY.x, childXY.y)) {
                // View was picked.
                return view;
            }
        }

        // No child view was picked.
        return null;
    }

    // --[ visible ]------------------------------------------------------------
    setVisible(v) {
        this.#isVisible = v;
    }

    isVisible() {
        return this.#isVisible;
    }

    // --[ pickable ]-----------------------------------------------------------
    setPickable(p) {
        this.#isPickable = p;
    }

    isPickable() {
        return this.#isPickable;
    }

    // --[ drawing ]------------------------------------------------------------
    draw(context) {
        if (this.#isVisible) {
            this.drawSelf(context);

            context.translate(this.getX(), this.getY());
            this.drawChildren(context);
            context.translate(-this.getX(), -this.getY());
        }
    }

    drawSelf(context) { }

    drawChildren(context) {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].draw(context);
        }
    }

    // --[ event emitter ]------------------------------------------------------
    addEventListener(type, callback, owner = null) {
        this.#eventEmitter.add(type, callback, owner);
    }

    removeEventListener(type, callback, owner = null) {
        this.#eventEmitter.remove(type, callback, owner);
    }

    emitEvent(type, event) {
        this.#eventEmitter.emit(type, event);
    }

    // --[ mouse events ]-------------------------------------------------------
    onMouseDown(event) { this.emitEvent(event.type, event); }
    onMouseUp(event) { this.emitEvent(event.type, event); }
    onMouseMove(event) { this.emitEvent(event.type, event); }
    onMouseDrag(event) { this.emitEvent(event.type, event); }
    onMouseEnter(event) { this.emitEvent(event.type, event); }
    onMouseExit(event) { this.emitEvent(event.type, event); }
    onMouseWheel(event) { this.emitEvent(event.type, event); }
}



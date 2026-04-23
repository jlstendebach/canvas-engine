import { EventEmitter } from "../../events/index.js"
import { Vec2 } from "../../math/Vec2.js";


export class View {
    #parent = null;
    #views = [];
    #isVisible = true;
    #isPickable = true;
    #eventEmitter = new EventEmitter();

    // MARK: - Properties ------------------------------------------------------
    get parent() { 
        return this.#parent; 
    }

    get views() { 
        return this.#views.slice(); // Return a copy to prevent external modification
    }

    get isVisible() {
        return this.#isVisible;
    }

    get isPickable() {
        return this.#isPickable;
    }

    get eventEmitter() {
        return this.#eventEmitter;
    }

    // MARK: - Bounds ----------------------------------------------------------
    isInBounds(x, y) { return true; }
    getX() { return 0; }
    getY() { return 0; }
    getXY() { return new Vec2(this.getX(), this.getY());  }

    localToChild(x, y) { return new Vec2(x, y); }
    childToLocal(x, y) { return new Vec2(x, y); }

    // MARK: - Parent ----------------------------------------------------------
    removeFromParent() {
        if (this.#parent !== null) {
            this.#parent.removeView(this);
            this.#parent = null;
        }
        return this;
    }

    /**
     * Checks if the given view is in the parent chain of this view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if the view is in the parent chain, false otherwise.
     */
    isViewInParentChain(view) {
        let current = this;
        while (current !== null) {
            if (current === view) {
                return true;
            }
            current = current.#parent;
        }
        return false;
    }   

    // MARK: - Views -----------------------------------------------------------
    addView(view) {
        if (!(view instanceof View)) {
            throw new TypeError("addView expects an instance of View");
        }
        if (view === this) {
            throw new Error("Cannot add a view to itself");
        }
        if (this.isViewInParentChain(view)) {
            throw new Error("Cannot add an ancestor view as a child");
        }        
        view.removeFromParent();
        view.#parent = this;
        this.#views.push(view);

        return this;
    }

    removeView(view) {
        var index = this.#views.indexOf(view);
        if (index >= 0) {
            view.#parent = null;
            this.#views.splice(index, 1);
        }

        return this;
    }

    pickView(x, y) {
        let childXY = this.localToChild(x, y);
        for (var i = this.#views.length - 1; i >= 0; i--) {
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
        this.#isVisible = v === true;
        return this;
    }

    isVisible() {
        return this.#isVisible;
    }

    // --[ pickable ]-----------------------------------------------------------
    setPickable(p) {
        this.#isPickable = p === true;
        return this;
    }

    isPickable() {
        return this.#isPickable;
    }

    // --[ drawing ]------------------------------------------------------------
    draw(context) {
        if (this.#isVisible) {
            this.drawSelf(context);

            context.save();
            context.translate(this.getX(), this.getY());
            this.drawChildren(context);
            context.restore();
        }
    }

    drawSelf(context) {
        // Base view does not draw anything. Subclasses should override this method.
    }

    drawChildren(context) {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].draw(context);
        }
    }

    // --[ event emitter ]------------------------------------------------------
    addEventListener(type, callback, owner = null) {
        this.#eventEmitter.addListener(type, callback, owner);
        return this;
    }

    removeEventListener(type, callback, owner = null) {
        this.#eventEmitter.removeListener(type, callback, owner);
        return this;
    }

    emitEvent(type, event) {
        this.#eventEmitter.emit(type, event);
        return this;
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



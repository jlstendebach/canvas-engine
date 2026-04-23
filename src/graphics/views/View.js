import { EventEmitter } from "../../events/index.js"
import { Vec2 } from "../../math/Vec2.js";


export class View {
    #position = new Vec2();
    #parent = null;
    #views = [];
    #isVisible = true;
    #isPickable = true;
    #eventEmitter = new EventEmitter();

    // MARK: - Properties ------------------------------------------------------
    set position(position) {
        this.#position.set(position.x, position.y);
    }
    
    get position() { 
        return this.#position; 
    }    

    get parent() { 
        return this.#parent; 
    }

    get views() { 
        return this.#views.slice(); // Return a copy to prevent external modification
    }

    set isVisible(visible) {
        this.#isVisible = visible === true;
    }

    get isVisible() {
        return this.#isVisible;
    }

    set isPickable(pickable) {
        this.#isPickable = pickable === true;
    }

    get isPickable() {
        return this.#isPickable;
    }

    get eventEmitter() {
        return this.#eventEmitter;
    }

    // MARK: - Bounds ----------------------------------------------------------
    isInBounds(x, y) { return true; }
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
     * Checks if this view is a descendant of the specified view.
     * @param {View} view - The view to check.
     * @returns {boolean} Returns true if this view is a descendant of the specified view, false otherwise.
     */
    isDescendantOf(view) {
        let current = this;
        while (current !== null) {
            if (current === view) {
                return true;
            }
            current = current.#parent;
        }
        return false;
    }

    /**
     * Checks if this view is an ancestor of the specified view.
     * @param {View} view - The view to check.
     * @returns {boolean} Returns true if this view is an ancestor of the specified view, false otherwise.
     */
    isAncestorOf(view) {
        return view.isDescendantOf(this);
    }

    // MARK: - Views -----------------------------------------------------------
    addView(view) {
        if (!(view instanceof View)) {
            throw new TypeError("addView expects an instance of View");
        }
        if (view === this) {
            throw new Error("Cannot add a view to itself");
        }
        if (this.isDescendantOf(view)) {
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

    /**
     * Gets the number of child views. This is the preferred method for getting 
     * the number of child views as it does not create a copy of the views array.
     * @returns {number} Returns the number of child views.
     */
    getViewCount() {
        return this.#views.length;
    }

    pickView(x, y) {
        let childXY = this.localToChild(x, y);
        for (var i = this.#views.length - 1; i >= 0; i--) {
            var view = this.#views[i];
            if (view.#isVisible && view.#isPickable && view.isInBounds(childXY.x, childXY.y)) {
                // View was picked.
                return view;
            }
        }

        // No child view was picked.
        return null;
    }

    // --[ drawing ]------------------------------------------------------------
    draw(context) {
        if (this.#isVisible) {
            this.drawSelf(context);

            context.save();
            context.translate(this.#position.x, this.#position.y);
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

    // --[ mouse events ]-------------------------------------------------------
    onMouseDown(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseUp(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseMove(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseDrag(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseEnter(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseExit(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseWheel(event) { this.#eventEmitter.emit(event.type, event); }

 
}



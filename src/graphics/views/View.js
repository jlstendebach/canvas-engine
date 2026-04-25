import { EventEmitter } from "../../events/index.js"
import { Vec2 } from "../../math/Vec2.js";

/**
 * Base class for all views in the scene graph.
 */
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

    // MARK: - Bounds ----------------------------------------------------------
    /**
     * Checks if a point in parent space is contained within this view.
     * @param {Number} x - The x coordinate in parent space.
     * @param {Number} y - The y coordinate in parent space.
     * @returns {boolean} Returns true if the point is in this view, false otherwise.
     */
    isInBounds(x, y) { 
        // Base view has no bounds. Subclasses should override this method.
        return true; 
    }
    
    /**
     * Converts a point from local space to child space. If there are no 
     * transformations, then local space and child space are the same.
     * - "Local space" is the coordinate space of this view and is relative to his
     * view's origin. A value of (0, 0) represents the origin of this view.
     * - "Child space" is the coordinate space of the children before any transformations. 
     * 
     * 
     * @param {Number} x - The x coordinate in local space.
     * @param {Number} y - The y coordinate in local space.
     * @returns {Vec2} The point in child space.
     */
    localToChild(x, y) { 
        // Base view has no transformations. Subclasses should override this method.
        return new Vec2(x, y); 
    }

    /**
     * Converts a point from child space to local space. Local space is the 
     * coordinate space of this view.
     * @param {Number} x - The x coordinate in child space.
     * @param {Number} y - The y coordinate in child space.
     * @returns {Vec2} The point in local space.
     */
    childToLocal(x, y) { 
        // Base view has no transformations. Subclasses should override this method.
        return new Vec2(x, y); 
    }

    // MARK: - Views -----------------------------------------------------------
    /**
     * Adds a child view to this view.
     * If the view already has a parent, it is removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {View} The added view.
     * @throws {TypeError} If view is not an instance of View.
     * @throws {Error} If adding self or creating an ancestor cycle.
     */
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

        return view;
    }

    /**
     * Removes a direct child view from this view.
     * @param {View} view - The child view to remove.
     * @returns {View} The input view.
     */
    removeView(view) {
        var index = this.#views.indexOf(view);
        if (index >= 0) {
            view.#parent = null;
            this.#views.splice(index, 1);
        }

        return view;
    }

    /**
     * Removes all child views from this view.
     * @returns {void}
     */
    removeAllViews() {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].#parent = null;
        }
        this.#views = [];
    }

    /**
     * Gets a shallow copy of this view's children.
     * @returns {View[]} A copy of the child view array.
     */
    getViews() {
        return this.#views.slice();
    }

    /**
     * Gets the number of child views. This is the preferred method for getting 
     * the number of child views as it does not create a copy of the views array.
     * @returns {number} Returns the number of child views.
     */
    getViewCount() {
        return this.#views.length;
    }

    /**
     * Picks the topmost visible and pickable child at the given local-space point.
     * @param {Number} x - The x coordinate in local space.
     * @param {Number} y - The y coordinate in local space.
     * @returns {View|null} The picked child view, or null if none match.
     */
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

    // MARK: - Parent ----------------------------------------------------------
    /**
     * Detaches this view from its current parent.
     * @returns {void}
     */
    removeFromParent() {
        if (this.#parent !== null) {
            this.#parent.removeView(this);
            this.#parent = null;
        }
    }

    /**
     * Checks if this view is a descendant of the specified view.
     * @param {View} view - The view to check.
     * @returns {boolean} Returns true if this view is a descendant of the specified view, false otherwise.
     */
    isDescendantOf(view) {
        let current = this.#parent;
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

    // MARK: - Drawing ---------------------------------------------------------
    /**
     * Draws this view and its children when visible.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     * @returns {void}
     */
    draw(context) {
        if (this.#isVisible) {
            this.drawSelf(context);

            context.save();
            context.translate(this.#position.x, this.#position.y);
            this.drawChildren(context);
            context.restore();
        }
    }

    /**
     * Draws this view's own content.
     * Subclasses should override this method.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     * @returns {void}
     */
    drawSelf(context) {
        // Base view does not draw anything. Subclasses should override this method.
    }

    /**
     * Draws all child views in insertion order.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     * @returns {void}
     */
    drawChildren(context) {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].draw(context);
        }
    }

    // MARK: - Events ----------------------------------------------------------
    /**
     * Registers an event listener on this view.
     * @param {string} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} [owner=null] - Optional listener owner.
     * @param {boolean} [once=false] - True to remove listener after first invocation.
     * @returns {*} A listener token/object from the underlying EventEmitter.
     */
    addEventListener(type, callback, owner = null, once = false) {
        return this.#eventEmitter.addListener(type, callback, owner, once);
    }

    /**
     * Removes an event listener from this view.
     * @param {string} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} [owner=null] - Optional listener owner.
     * @returns {boolean} True if a listener was removed.
     */
    removeEventListener(type, callback, owner = null) {
        return this.#eventEmitter.removeListener(type, callback, owner);
    }

    // MARK: - Mouse Events ----------------------------------------------------
    onMouseDown(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseUp(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseMove(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseDrag(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseEnter(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseExit(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseWheel(event) { this.#eventEmitter.emit(event.type, event); }

 
}



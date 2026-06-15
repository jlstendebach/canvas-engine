import { EventEmitter } from "../../events/EventEmitter.js";
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
     * @param {Vec2} point - The point in parent space.
     * @returns {boolean} True if the point is inside this view, false otherwise.
     */
    isInBounds(point) { 
        // Base view has no bounds. Subclasses should override this method.
        void point;
        return true; 
    }
    
    /**
     * Converts a point from local space to child space. If there are no 
     * transformations, then local space and child space are the same.
     * - "Local space" is the coordinate space of this view. It is relative to 
     *   this view's origin. A value of (0, 0) represents the origin of this view.
     * - "Child space" is the coordinate space of the children before any 
     *   transformations. 
     * @param {Vec2} point - The point in local space to convert.
     * @returns {Vec2} The point in child space.
     */
    localToChild(point) { 
        // Base view has no transformations. Subclasses should override this method.
        return point.clone(); 
    }

    /**
     * Converts a point from child space to local space. If there are no 
     * transformations, then local space and child space are the same.
     * - "Local space" is the coordinate space of this view. It is relative to 
     *   this view's origin. A value of (0, 0) represents the origin of this view.
     * - "Child space" is the coordinate space of the children before any 
     *   transformations. 
     * @param {Vec2} point - The point in child space to convert.
     * @returns {Vec2} The point in local space.
     */
    childToLocal(point) { 
        // Base view has no transformations. Subclasses should override this method.
        return point.clone(); 
    }

    // MARK: - Views -----------------------------------------------------------
    /**
     * Adds a child view to this view. If the view already has a parent, it is 
     * removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {View} The added view.
     * @throws {TypeError} If view is not an instance of View.
     * @throws {Error} If adding self or an ancestor view.
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
     * Removes a child view from this view.
     * @param {View} view - The child view to remove.
     * @returns {boolean} True if the view was removed, false if the view was not a child of this view.
     */
    removeView(view) {
        const index = this.#views.indexOf(view);
        if (index === -1) {
            return false;
        }
        view.#parent = null;
        this.#views.splice(index, 1);
        return true;
    }

    /**
     * Removes all child views from this view.
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
     * the number of child views as it does not create a copy of the views 
     * array.
     * @returns {number} The number of child views.
     */
    getViewCount() {
        return this.#views.length;
    }

    /**
     * Picks the topmost visible and pickable child at the given local-space 
     * point.
     * @param {Vec2} point - The point in local space.
     * @returns {View|null} The picked child view, or null if none are found.
     */
    pickView(point) {
        const childXY = this.localToChild(point);
        for (let i = this.#views.length - 1; i >= 0; i--) {
            const view = this.#views[i];
            if (view.#isVisible && view.#isPickable && view.isInBounds(childXY)) {
                return view;
            }
        }
        return null;
    }    

    // MARK: - Parent ----------------------------------------------------------
    /**
     * Removes this view from its parent.
     */
    removeFromParent() {
        if (this.#parent === null) {
            return;
        }
        this.#parent.removeView(this);
        this.#parent = null;
    }

    /**
     * Checks if this view is a descendant of the given view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if this view is a descendant of the given view, false otherwise.
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
     * Checks if this view is an ancestor of the given view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if this view is an ancestor of the given view, false otherwise.
     */
    isAncestorOf(view) {
        return view.isDescendantOf(this);
    }

    // MARK: - Drawing ---------------------------------------------------------
    /**
     * Draws this view and its descendants when visible.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    draw(context) {
        if (this.#isVisible === false) {
            return;
        }

        this.drawSelf(context);

        context.save();
        context.translate(this.#position.x, this.#position.y);
        this.drawChildren(context);
        context.restore();
    }

    /**
     * Draws this view's own content in parent space.
     * Subclasses should override this method.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    drawSelf(context) {        
        // Base view does not draw anything. Subclasses should override this method.
        void context;
    }

    /**
     * Draws all child views in insertion order.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    drawChildren(context) {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].draw(context);
        }
    }

    // MARK: - Events ----------------------------------------------------------
    /**
     * Registers an event listener on this view.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} [owner=null] - The object to bind the callback to, if applicable.
     * @param {boolean} [once=false] - True to remove listener after first invocation.
     * @returns {boolean} True if the listener was added, false if it was already registered.
     */
    addEventListener(type, callback, owner = null, once = false) {
        return this.#eventEmitter.addListener(type, callback, owner, once);
    }

    /**
     * Removes an event listener from this view.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} [owner=null] - The object the callback is bound to, if applicable.
     * @returns {boolean} True if a listener was removed, false otherwise.
     */
    removeEventListener(type, callback, owner = null) {
        return this.#eventEmitter.removeListener(type, callback, owner);
    }

    /**
     * Removes all event listeners from this view.
     * @param {*} [type=null] - The event type to remove, or null to remove all types.
     */
    removeAllEventListeners(type) {
        this.#eventEmitter.removeAllListeners(type);
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



import { EventEmitter } from "../../../events/EventEmitter.js";
import { Bounds } from "../../../math/Bounds.js";
import { Vec2 } from "../../../math/Vec2.js";

/**
 * Base class for all views in the scene graph.
 */
export class View {
    #position = new Vec2();

    #bounds = new Bounds();
    #isBoundsDirty = true;

    #isVisible = true;
    #isPickable = true;

    #parent = null;
    #views = [];
    #eventEmitter = new EventEmitter();

    // MARK: - Properties 
    set position(position) {
        if (position.equals(this.#position)) { return; }
        this.#position.set(position.x, position.y);
        this.onLayoutChanged();
    }
    get position() {
        return this.#position;
    }

    set x(value) {
        if (this.#position.x === value) { return; }
        this.#position.x = value;
        this.onLayoutChanged();
    }
    get x() {
        return this.#position.x;
    }

    set y(value) {
        if (this.#position.y === value) { return; }
        this.#position.y = value;
        this.onLayoutChanged();
    }
    get y() {
        return this.#position.y;
    }

    get bounds() {
        if (this.#isBoundsDirty) {
            this.updateBounds(this.#bounds);
            this.#isBoundsDirty = false;
        }
        return this.#bounds;
    }

    set isVisible(visible) {
        visible = visible === true;
        if (this.#isVisible === visible) { return; }
        this.#isVisible = visible;
        this.onLayoutChanged();
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

    get parent() {
        return this.#parent;
    }

    // MARK: - Initialization 
    constructor(options = {}) {
        this.position = options.position ?? new Vec2();
        this.position.x = options.x ?? this.position.x;
        this.position.y = options.y ?? this.position.y;
        this.isVisible = options.isVisible ?? true;
        this.isPickable = options.isPickable ?? true;
    }

    // MARK: - Bounds 
    updateBounds(out) {
        out.reset();
        for (let i = 0; i < this.#views.length; i++) {
            out.addBounds(this.#views[i].getBoundsInParentSpace());
        }
    }

    invalidateBounds() {
        if (this.#isBoundsDirty) {
            return;
        }
        this.#isBoundsDirty = true;
        this.onLayoutChanged();
    }

    onLayoutChanged() {
        if (this.#parent !== null) {
            this.#parent.onChildLayoutChanged();
        }
    }

    onChildLayoutChanged() {
        this.invalidateBounds();
    }

    localToParentBounds(bounds) {
        return new Bounds(
            bounds.minX + this.#position.x,
            bounds.minY + this.#position.y,
            bounds.maxX + this.#position.x,
            bounds.maxY + this.#position.y
        );
    }

    parentToLocalPoint(point) {
        return point.clone().subtract(this.#position);
    }

    getBoundsInParentSpace() {
        return this.localToParentBounds(this.bounds);
    }

    getBoundsInWorldSpace() {
        let bounds = this.getBoundsInParentSpace();
        let current = this.#parent;
        while (current !== null) {
            bounds = current.localToParentBounds(bounds);
            current = current.#parent;
        }
        return bounds;
    }

    /**
     * Checks if a point in parent space is contained within this view.
     * @param {Vec2} point - The point in parent space.
     * @returns {boolean} True if the point is inside this view, false otherwise.
     */
    containsPoint(point) {
        return this.bounds.containsPoint(point);
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
        return point;
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
        return point;
    }

    // MARK: - Views 
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
        this.invalidateBounds();
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
        this.invalidateBounds();
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
        this.invalidateBounds();
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

    pickView(point) {
        if (this.#isVisible === false || this.#isPickable === false) {
            return null;
        }

        const localPoint = this.parentToLocalPoint(point);

        // If the bounds are empty, we can treat this as a passthrough.
        if (!this.bounds.isEmpty() && !this.containsPoint(localPoint)) {
            return null;
        }

        // This is a bandaid fix for the SceneView and for the fact that we 
        // don't have a proper transformation system yet.
        const childPoint = this.localToChild(localPoint);

        // Check children in reverse order (topmost first)
        for (let i = this.#views.length - 1; i >= 0; i--) {
            const view = this.#views[i].pickView(childPoint);
            if (view !== null) {
                return view;
            }
        }

        // If the bounds are empty, we treat this as a passthrough, so we return
        // null. Otherwise, the point is within this view's bounds, so we return 
        // this view.
        return this.bounds.isEmpty() ? null : this;
    }

    // MARK: - Parent 
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

    // MARK: - Drawing 
    /**
     * Draws this view and its descendants when visible.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    draw(context) {
        if (this.#isVisible === false) {
            return;
        }

        context.save();
        context.translate(this.#position.x, this.#position.y);
        this.drawSelf(context);
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

    // MARK: - Events 
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

    // MARK: - Mouse Events 
    onMouseDown(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseUp(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseMove(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseDrag(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseEnter(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseExit(event) { this.#eventEmitter.emit(event.type, event); }
    onMouseWheel(event) { this.#eventEmitter.emit(event.type, event); }
}



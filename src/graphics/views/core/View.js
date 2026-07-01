import { EventEmitter } from "../../../events/EventEmitter.js";
import { Bounds } from "../../../math/Bounds.js";
import { Matrix2 } from "../../../math/Matrix2.js";
import { Vec2 } from "../../../math/Vec2.js";

/**
 * Base class for all views in the scene graph.
 */
export class View {
    static #TAU = Math.PI * 2;

    #position = new Vec2();
    #pivot = new Vec2();
    #rotation = 0;
    #scale = new Vec2(1, 1);

    #transform = new Matrix2();
    #isTransformDirty = true;

    #inverseTransform = new Matrix2();
    #isInverseTransformDirty = true;

    #bounds = new Bounds();
    #isBoundsDirty = true;

    #isVisible = true;
    #isPickable = true;

    #parent = null;
    #views = [];

    #eventEmitter = new EventEmitter();

    // MARK: - Position Accessors
    set position(value) {
        if (this.#position.equals(value)) { return; }
        this.#position.copy(value);
        this.invalidateTransform();
    }
    get position() {
        return this.#position;
    }

    set x(value) {
        if (this.#position.x === value) { return; }
        this.#position.x = value;
        this.invalidateTransform();
    }
    get x() {
        return this.#position.x;
    }

    set y(value) {
        if (this.#position.y === value) { return; }
        this.#position.y = value;
        this.invalidateTransform();
    }
    get y() {
        return this.#position.y;
    }

    // MARK: - Pivot Accessors
    set pivotX(value) {
        if (this.#pivot.x === value) { return; }
        this.#pivot.x = value;
        this.invalidateTransform();
    }
    get pivotX() {
        return this.#pivot.x;
    }

    set pivotY(value) {
        if (this.#pivot.y === value) { return; }
        this.#pivot.y = value;
        this.invalidateTransform();
    }
    get pivotY() {
        return this.#pivot.y;
    }

    // MARK: - Rotation Accessors
    set rotation(value) {
        let newValue = value % View.#TAU;
        if (newValue < 0) {
            newValue += View.#TAU;
        }
        if (this.#rotation === newValue) { return; }
        this.#rotation = newValue;
        this.invalidateTransform();
    }
    get rotation() {
        return this.#rotation;
    }

    // MARK: - Scale Accessors
    set scaleX(value) {
        if (this.#scale.x === value) { return; }
        this.#scale.x = value;
        this.invalidateTransform();
    }
    get scaleX() {
        return this.#scale.x;
    }

    set scaleY(value) {
        if (this.#scale.y === value) { return; }
        this.#scale.y = value;
        this.invalidateTransform();
    }
    get scaleY() {
        return this.#scale.y;
    }

    // MARK: - Transform Accessors
    get transform() {
        if (this.#isTransformDirty) {
            this.updateTransform(this.#transform);
            this.#isTransformDirty = false;
        }
        return this.#transform;
    }

    get inverseTransform() {
        if (this.#isInverseTransformDirty) {
            this.#inverseTransform.copy(this.transform).invert();
            this.#isInverseTransformDirty = false;
        }
        return this.#inverseTransform;
    }

    // MARK: - Bounds Accessors
    get bounds() {
        if (this.#isBoundsDirty) {
            this.updateBounds(this.#bounds);
            this.#isBoundsDirty = false;
        }
        return this.#bounds;
    }

    // MARK: - Other Accessors
    set isVisible(value) {
        if (typeof value !== "boolean") { return; }
        if (this.#isVisible === value) { return; }
        this.#isVisible = value;
        this.invalidateTransform();
    }
    get isVisible() {
        return this.#isVisible;
    }

    set isPickable(value) {
        if (typeof value !== "boolean") { return; }
        this.#isPickable = value;
    }
    get isPickable() {
        return this.#isPickable;
    }

    get parent() {
        return this.#parent;
    }

    get events() {
        return this.#eventEmitter;
    }

    // MARK: - Initialization 
    constructor(options = {}) {
        this.#position.x = options.x ?? options.position?.x ?? 0;
        this.#position.y = options.y ?? options.position?.y ?? 0;
        this.#isVisible = options.isVisible !== false;
        this.#isPickable = options.isPickable !== false;
    }

    // MARK: - Bounds 
    /**
     * Checks if a point in local space is contained within this view. 
     * @param {Vec2} point - The point in local space.
     * @returns {boolean} True if the point is inside this view, false otherwise.
     */
    containsPoint(point) {
        void point;
        return true;
    }

    updateBounds(out) {
        out.reset();
    }

    invalidateBounds() {
        if (this.#isBoundsDirty) {
            return;
        }
        this.#isBoundsDirty = true;
        this.parent?.onChildBoundsChanged();
    }

    onChildBoundsChanged() {
        // Subclasses can override this method to respond to child bounds changes.
    }

    // MARK: - Transformations
    updateTransform(out) {
        out.setTransform(
            this.#position.x,
            this.#position.y,
            this.#pivot.x,
            this.#pivot.y,
            this.#scale.x,
            this.#scale.y,
            this.#rotation
        );
    }

    invalidateTransform() {
        if (this.#isTransformDirty && this.#isInverseTransformDirty) {
            return;
        }
        this.#isTransformDirty = true;
        this.#isInverseTransformDirty = true;
        this.parent?.onChildBoundsChanged();
    }

    localToParentBounds(bounds) {
        return bounds.clone().applyMatrix(this.transform);
    }

    parentToLocalBounds(bounds) {
        return bounds.clone().applyMatrix(this.inverseTransform);
    }

    localToParentPoint(point) {
        return this.transform.transformPoint(point);
    }

    parentToLocalPoint(point) {
        return this.inverseTransform.transformPoint(point);
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

        const transform = this.transform;

        context.save();
        context.transform(
            transform.a, transform.b,
            transform.c, transform.d,
            transform.tx, transform.ty
        );
        this.onDraw(context);
        this.drawChildren(context);
        context.restore();
    }

    /**
     * Draws this view's own content in parent space.
     * Subclasses should override this method.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    onDraw(context) {
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

    // MARK: - Mouse Events 
    onMouseDown(event) { this.events.emit(event.type, event); }
    onMouseUp(event) { this.events.emit(event.type, event); }
    onMouseMove(event) { this.events.emit(event.type, event); }
    onMouseDrag(event) { this.events.emit(event.type, event); }
    onMouseEnter(event) { this.events.emit(event.type, event); }
    onMouseExit(event) { this.events.emit(event.type, event); }
    onMouseWheel(event) { this.events.emit(event.type, event); }
}



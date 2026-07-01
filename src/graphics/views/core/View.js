import { EventEmitter } from "../../../events/EventEmitter.js";
import { Bounds } from "../../../math/Bounds.js";
import { Transform } from "../../../math/Transform.js";
import { Vec2 } from "../../../math/Vec2.js";

/**
 * Base class for all views in the scene graph.
 */
export class View {
    #transform = new Transform(this.onTransformInvalidated.bind(this));

    #bounds = new Bounds();
    #isBoundsDirty = true;

    #isVisible = true;
    #isPickable = true;

    #parent = null;
    #views = [];

    #eventEmitter = new EventEmitter();

    // MARK: - Position Accessors
    get x() {
        return this.#transform.x;
    }
    set x(value) {
        this.#transform.x = value;
    }

    get y() {
        return this.#transform.y;
    }
    set y(value) {
        this.#transform.y = value;
    }

    // MARK: - Pivot Accessors
    get pivotX() {
        return this.#transform.pivotX;
    }
    set pivotX(value) {
        this.#transform.pivotX = value;
    }

    get pivotY() {
        return this.#transform.pivotY;
    }
    set pivotY(value) {
        this.#transform.pivotY = value;
    }

    // MARK: - Rotation Accessors
    get rotation() {
        return this.#transform.rotation;
    }
    set rotation(value) {
        this.#transform.rotation = value;
    }

    // MARK: - Scale Accessors
    get scaleX() {
        return this.#transform.scaleX;
    }
    set scaleX(value) {
        this.#transform.scaleX = value;
    }

    get scaleY() {
        return this.#transform.scaleY;
    }
    set scaleY(value) {
        this.#transform.scaleY = value;
    }

    // MARK: - Transform Accessors
    get transform() {
        return this.#transform;
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
    get isVisible() {
        return this.#isVisible;
    }
    set isVisible(value) {
        if (typeof value !== "boolean") { return; }
        if (this.#isVisible === value) { return; }
        this.#isVisible = value;
        this.onChildBoundsChanged();
    }

    get isPickable() {
        return this.#isPickable;
    }
    set isPickable(value) {
        if (typeof value !== "boolean") { return; }
        this.#isPickable = value;
    }

    get parent() {
        return this.#parent;
    }

    get events() {
        return this.#eventEmitter;
    }

    // MARK: - Initialization 
    constructor(options = {}) {
        this.#transform.x = options.x ?? options.position?.x ?? 0;
        this.#transform.y = options.y ?? options.position?.y ?? 0;
        this.#isVisible = options.isVisible !== false;
        this.#isPickable = options.isPickable !== false;
    }

    // MARK: - Position
    getPosition(out = new Vec2()) {
        return this.#transform.getPosition(out);
    }

    setX(x) {
        this.#transform.setX(x);
        return this;
    }

    setY(y) {
        this.#transform.setY(y);
        return this;
    }

    setPositionXY(x, y) {
        this.#transform.setPositionXY(x, y);
        return this;
    }

    setPosition(position) {
        this.#transform.setPosition(position);
        return this;
    }

    translateXY(dx, dy) {
        this.#transform.translateXY(dx, dy);
        return this;
    }

    translate(delta) {
        this.#transform.translate(delta);
        return this;
    }

    // MARK: - Pivot
    getPivot(out = new Vec2()) {
        return this.#transform.getPivot(out);
    }

    setPivotX(pivotX) {
        this.#transform.setPivotX(pivotX);
        return this;
    }

    setPivotY(pivotY) {
        this.#transform.setPivotY(pivotY);
        return this;
    }

    setPivotXY(pivotX, pivotY) {
        this.#transform.setPivotXY(pivotX, pivotY);
        return this;
    }

    setPivot(pivot) {
        this.#transform.setPivot(pivot);
        return this;
    }

    offsetPivotXY(dx, dy) {
        this.#transform.offsetPivotXY(dx, dy);
        return this;
    }

    offsetPivot(offset) {
        this.#transform.offsetPivot(offset);
        return this;
    }

    // MARK: - Scale
    getScale(out = new Vec2()) {
        return this.#transform.getScale(out);
    }

    setScaleX(scaleX) {
        this.#transform.setScaleX(scaleX);
        return this;
    }

    setScaleY(scaleY) {
        this.#transform.setScaleY(scaleY);
        return this;
    }

    setScale(scaleOrVector) {
        this.#transform.setScale(scaleOrVector);
        return this;
    }

    setScaleXY(scaleX, scaleY) {
        this.#transform.setScaleXY(scaleX, scaleY);
        return this;
    }

    scaleByXY(factorX, factorY) {
        this.#transform.scaleByXY(factorX, factorY);
        return this;
    }

    scaleBy(factorOrVector) {
        this.#transform.scaleBy(factorOrVector);
        return this;
    }

    // MARK: - Rotation
    setRotation(radians) {
        this.#transform.setRotation(radians);
        return this;
    }

    rotate(deltaRadians) {
        this.#transform.rotate(deltaRadians);
        return this;
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

    // MARK: - Transformations
    localToParentBounds(bounds) {
        return this.#transform.transformBounds(bounds);
    }

    parentToLocalBounds(bounds) {
        return this.#transform.inverseTransformBounds(bounds);
    }

    localToParentPoint(point) {
        return this.#transform.transformPoint(point);
    }

    parentToLocalPoint(point) {
        return this.#transform.inverseTransformPoint(point);
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
        this.#transform.withMatrix((matrix) => {
            context.transform(
                matrix.a, matrix.b,
                matrix.c, matrix.d,
                matrix.tx, matrix.ty
            );
        });
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

    // MARK: - Event Handlers
    onChildBoundsChanged() {
        // Subclasses can override this method to respond to child bounds changes.
    }

    onTransformInvalidated() {
        this.parent?.onChildBoundsChanged();
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



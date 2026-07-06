import { EventEmitter } from "../../../events/EventEmitter.js";
import { Bounds } from "../../../math/Bounds.js";
import { Transform } from "../../../math/Transform.js";
import { Vec2 } from "../../../math/Vec2.js";

/**
 * Base class for all views in the scene graph.
 */
export class View {
    // Authored states
    #isVisible = true;
    #isPickable = true;
    #transform = new Transform(this.onTransformInvalidated.bind(this));

    // Scene graph hierarchy
    #parent = null;
    #views = [];

    // Derived states
    #bounds = new Bounds();
    #isBoundsDirty = true;

    // Services
    #eventEmitter = new EventEmitter();

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    get x() {
        return this.#transform.x;
    }
    set x(value) {
        this.setX(value);
    }

    get y() {
        return this.#transform.y;
    }
    set y(value) {
        this.setY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    get pivotX() {
        return this.#transform.pivotX;
    }
    set pivotX(value) {
        this.setPivotX(value);
    }

    get pivotY() {
        return this.#transform.pivotY;
    }
    set pivotY(value) {
        this.setPivotY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    get rotation() {
        return this.#transform.rotation;
    }
    set rotation(value) {
        this.setRotation(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    get scaleX() {
        return this.#transform.scaleX;
    }
    set scaleX(value) {
        this.setScaleX(value);
    }

    get scaleY() {
        return this.#transform.scaleY;
    }
    set scaleY(value) {
        this.setScaleY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Transform Accessors
    // -------------------------------------------------------------------------

    get transform() {
        return this.#transform;
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds Accessors
    // -------------------------------------------------------------------------

    get bounds() {
        if (this.#isBoundsDirty) {
            this.updateBounds(this.#bounds);
            this.#isBoundsDirty = false;
        }
        return this.#bounds;
    }

    // -------------------------------------------------------------------------
    // MARK: - Other Accessors
    // -------------------------------------------------------------------------

    get isVisible() {
        return this.#isVisible;
    }
    set isVisible(value) {
        this.setVisible(value);
    }

    get isPickable() {
        return this.#isPickable;
    }
    set isPickable(value) {
        this.setPickable(value);
    }

    get parent() {
        return this.#parent;
    }
    set parent(value) {
        this.setParent(value);
    }

    get events() {
        return this.#eventEmitter;
    }

    // -------------------------------------------------------------------------
    // MARK: - Initialization 
    // -------------------------------------------------------------------------

    constructor(options = {}) {
        this.#transform.x = options.x ?? options.position?.x ?? 0;
        this.#transform.y = options.y ?? options.position?.y ?? 0;
        this.#isVisible = options.isVisible !== false;
        this.#isPickable = options.isPickable !== false;
    }

    // -------------------------------------------------------------------------
    // MARK: - Visibility and Pickability
    // -------------------------------------------------------------------------

    setVisible(isVisible) {
        if (typeof isVisible !== "boolean") { return; }
        if (this.#isVisible === isVisible) { return; }
        this.#isVisible = isVisible;
        this.onChildBoundsInvalidated();
        return this;
    }

    setPickable(isPickable) {
        if (typeof isPickable !== "boolean") { return; }
        this.#isPickable = isPickable;
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Position
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Rotation
    // -------------------------------------------------------------------------

    setRotation(radians) {
        this.#transform.setRotation(radians);
        return this;
    }

    rotate(deltaRadians) {
        this.#transform.rotate(deltaRadians);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Parent 
    // -------------------------------------------------------------------------

    /**
     * Attempts to remove this view from its current parent and add it to the 
     * new parent. If the new parent is null, this view will just be removed 
     * from its current parent.
     * 
     * **Note:** This method is a convenience method that calls `removeView` on
     * the current parent and `addView` on the new parent. As such, it should 
     * not be called directly from within `addView` or `removeView` as it will 
     * cause an infinite loop.
     * 
     * @param {View|null} parent - The new parent view, or null to remove from the current parent.
     * @returns {View} This.
     * @throws {Error} If settings parent to self or a descendant view.
     */
    setParent(parent) {
        if (parent === this.#parent) { return this; }

        // Remove from current parent if it exists
        if (this.#parent !== null) {
            this.#parent.removeView(this);
        }

        // Add to new parent if it exists
        if (parent !== null) {
            parent.addView(this);
        }

        return this;
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

    // -------------------------------------------------------------------------
    // MARK: - Children 
    // -------------------------------------------------------------------------

    /**
     * Adds a child view to this view if it is not already a child of this view. 
     * If it is, this method does nothing. If the view already has a parent that
     * is not this view, it is removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {View} This.
     * @throws {Error} If adding self or an ancestor view.
     */
    addView(view) {
        if (view.#parent === this) { return this; }

        // Ensure we aren't adding this view to itself even indirectly.
        if (view === this) {
            throw new Error("Cannot add a view to itself");
        }
        if (view.isAncestorOf(this)) {
            throw new Error("Cannot add an ancestor view as a child");
        }

        // Remove the view from its current parent if it has one.
        if (view.#parent !== null) {
            view.#parent.removeView(view);
        }

        // Add the view.
        this.#views.push(view);
        view.#parent = this;

        // The child view may have changed the bounds of this view.
        this.invalidateBounds();
        return this;
    }

    /**
     * Removes a child view from this view if it is a child. If the view is not 
     * a child, this method does nothing.
     * @param {View} view - The child view to remove.
     * @returns {View} This.
     */
    removeView(view) {
        if (view.#parent !== this) { return this; }

        // Find the index of the view in the child views array.
        const index = this.#views.indexOf(view);
        if (index === -1) { 
            // This should never happen because the view's parent reference 
            // indicates it is a child, but if it does, we still want to remove 
            // the parent reference.
            view.#parent = null;
            return this; 
        }

        // Remove the view.
        this.#views.splice(index, 1);
        view.#parent = null;

        // The child view may have changed the bounds of this view.
        this.invalidateBounds();
        return this;
    }

    /**
     * Removes all child views from this view.
     * @returns {View} This.
     */
    removeAllViews() {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].#parent = null;
        }
        this.#views.length = 0;
        this.invalidateBounds();
        return this;
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

        const bounds = this.bounds;
        const localPoint = this.parentToLocalPoint(point);

        // If the bounds are empty, we can treat this as a passthrough.
        if (!bounds.isEmpty() && !this.containsPoint(localPoint)) {
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
        return bounds.isEmpty() ? null : this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    localToParentPointXY(x, y, out = new Vec2()) {
        return this.#transform.transformPointXY(x, y, out);
    }

    localToParentPoint(point, out = new Vec2()) {
        return this.#transform.transformPoint(point, out);
    }

    localToParentVectorXY(x, y, out = new Vec2()) {
        return this.#transform.transformVectorXY(x, y, out);
    }

    localToParentVector(vector, out = new Vec2()) {
        return this.#transform.transformVector(vector, out);
    }

    localToParentBounds(bounds, out = new Bounds()) {
        return this.#transform.transformBounds(bounds, out);
    }

    parentToLocalPointXY(x, y, out = new Vec2()) {
        return this.#transform.inverseTransformPointXY(x, y, out);
    }

    parentToLocalPoint(point, out = new Vec2()) {
        return this.#transform.inverseTransformPoint(point, out);
    }

    parentToLocalVectorXY(x, y, out = new Vec2()) {
        return this.#transform.inverseTransformVectorXY(x, y, out);
    }

    parentToLocalVector(vector, out = new Vec2()) {
        return this.#transform.inverseTransformVector(vector, out);
    }

    parentToLocalBounds(bounds, out = new Bounds()) {
        return this.#transform.inverseTransformBounds(bounds, out);
    }

    /**
     * Holdover from the old transformation system. This method is only being 
     * kept for compatibility with the SceneView. It should be removed once the
     * SceneView is refactored to use the new transformation system.
     */
    localToChild(point) {
        return point;
    }

    /**
     * Holdover from the old transformation system. This method is only being 
     * kept for compatibility with the SceneView. It should be removed once the
     * SceneView is refactored to use the new transformation system.
     */
    childToLocal(point) {
        return point;
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds 
    // -------------------------------------------------------------------------

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
        this.parent?.onChildBoundsInvalidated();
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing 
    // -------------------------------------------------------------------------

    /**
     * Draws this view and its descendants when visible.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    draw(context) {
        if (this.#isVisible === false) { return; }

        context.save();
        try {
            this.#transform.withMatrix((m) => {
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            });
            this.onDraw(context);
            this.drawChildren(context);
        } finally {
            context.restore();
        }
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

    // -------------------------------------------------------------------------
    // MARK: - Event Handlers
    // -------------------------------------------------------------------------

    onChildBoundsInvalidated() {
        // Subclasses can override this method to respond to child bounds changes.
    }

    onTransformInvalidated() {
        this.parent?.onChildBoundsInvalidated();
    }

    // -------------------------------------------------------------------------
    // MARK: - Mouse Events
    // -------------------------------------------------------------------------

    onMouseDown(event) { this.events.emit(event.type, event); }
    onMouseUp(event) { this.events.emit(event.type, event); }
    onMouseMove(event) { this.events.emit(event.type, event); }
    onMouseDrag(event) { this.events.emit(event.type, event); }
    onMouseEnter(event) { this.events.emit(event.type, event); }
    onMouseExit(event) { this.events.emit(event.type, event); }
    onMouseWheel(event) { this.events.emit(event.type, event); }
}

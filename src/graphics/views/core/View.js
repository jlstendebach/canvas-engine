import { EventEmitter } from "../../../events/EventEmitter.js";
import { Bounds } from "../../../math/Bounds.js";
import { Matrix2 } from "../../../math/Matrix2.js";
import { Vec2 } from "../../../math/Vec2.js";
import { Transform } from "../../utils/Transform.js";

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

    #worldMatrix = new Matrix2();
    #isWorldMatrixDirty = true;
    #worldMatrixVersion = 0;
    #parentWorldMatrixVersion = -1;

    #inverseWorldMatrix = new Matrix2();
    #isInverseWorldMatrixDirty = true;

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

    get events() {
        return this.#eventEmitter;
    }

    // -------------------------------------------------------------------------
    // MARK: - Visibility and Pickability
    // -------------------------------------------------------------------------

    setVisible(isVisible) {
        if (typeof isVisible !== "boolean") { return this; }
        if (this.#isVisible === isVisible) { return this; }
        this.#isVisible = isVisible;
        this.onChildBoundsInvalidated();
        return this;
    }

    setPickable(isPickable) {
        if (typeof isPickable !== "boolean") { return this; }
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

    scaleXY(factorX, factorY) {
        this.#transform.scaleXY(factorX, factorY);
        return this;
    }

    scale(factorOrVector) {
        this.#transform.scale(factorOrVector);
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
     * Convenience method that calls the parent view's addView method. If the 
     * parent is not provided, is null, or is the same as the current parent, 
     * this method does nothing.
     * @param {View} parent - The parent view to add this view to.
     * @returns {View} This.
     */
    addToParent(parent) {
        if (!parent) { return this; }
        if (parent === this.parent) { return this; }
        parent.addView(this);
        return this;
    }

    /**
     * Convenience method that calls the parent view's removeView method to 
     * remove this view from its parent. If this view has no parent, this method
     * does nothing.
     * @returns {View} This.
     */
    removeFromParent() {
        if (!this.parent) { return this; }
        this.parent.removeView(this);
        return this;
    }

    /**
     * Checks if this view is a descendant of the given view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if this view is a descendant of the given view, false otherwise.
     */
    isDescendantOf(view) {
        let current = this.parent;
        while (current !== null) {
            if (current === view) { return true; }
            current = current.parent;
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
        if (view.parent === this) { return this; }

        // Ensure we aren't adding this view to itself even indirectly.
        if (view === this) {
            throw new Error("Cannot add a view to itself");
        }
        if (view.isAncestorOf(this)) {
            throw new Error("Cannot add an ancestor view as a child");
        }

        // Remove the view from its current parent if it has one.
        view.removeFromParent();
        if (view.parent !== null) {
            throw new Error("Failed to remove view from its current parent");
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
        if (view.parent !== this) { return this; }
        if (view === this) { return this; }

        // Find the index of the view in the child views array.
        const index = this.#views.indexOf(view);
        if (index === -1) {
            // This should never happen because the view's parent reference 
            // indicates it is a child, but if it does, we still want to remove 
            // the parent reference.
            view.#parent = null;
            view.#parentWorldMatrixVersion = -1;
            return this;
        }

        // Remove the view.
        this.#views.splice(index, 1);
        view.#parent = null;
        view.#parentWorldMatrixVersion = -1;

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
            this.#views[i].#parentWorldMatrixVersion = -1;
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

        // Check children in reverse order (topmost first)
        for (let i = this.#views.length - 1; i >= 0; i--) {
            const view = this.#views[i].pickView(localPoint);
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
    // MARK: - Conversions
    // -------------------------------------------------------------------------

    static convertPoint(point, fromView, toView, out = new Vec2()) {
        if (fromView === toView) {
            return out.copy(point);
        }
        if (fromView && toView === fromView.parent) {
            return fromView.localToParentPoint(point, out);
        }
        if (toView && fromView === toView.parent) {
            return toView.parentToLocalPoint(point, out);
        }

        out.copy(point);

        const matrix = new Matrix2();
        if (fromView) {
            fromView.getWorldMatrix(matrix).transformPoint(out, out);
        }
        if (toView) {
            toView.getInverseWorldMatrix(matrix).transformPoint(out, out);
        }
        return out;
    }

    toLocalPoint(ancestor, point, out = new Vec2()) {
        const chain = [];

        let view = this;
        while (view !== ancestor) {
            if (view === null) {
                throw new Error("The provided ancestor is not an ancestor of this view.");
            }

            chain.push(view);
            view = view.parent;
        }

        out.copy(point);

        for (let i = chain.length - 1; i >= 0; i--) {
            chain[i].transform.inverseTransformPoint(out, out);
        }

        return out;
    }

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
        if (this.#isBoundsDirty) { return this; }
        this.#isBoundsDirty = true;
        this.parent?.onChildBoundsInvalidated();
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - World Matrix
    // -------------------------------------------------------------------------

    getWorldMatrix(out = new Matrix2()) {
        if (!this.parent) {
            if (!this.#isWorldMatrixDirty) {
                this.#transform.getMatrix(this.#worldMatrix);
                this.#isWorldMatrixDirty = false;
                this.#isInverseWorldMatrixDirty = true;
                this.#worldMatrixVersion++;
            }
            return out.copy(this.#worldMatrix);
        }

        const parentWorldMatrix = this.parent.getWorldMatrix(out);

        if (
            !this.#isWorldMatrixDirty &&
            this.#parentWorldMatrixVersion === this.parent.#worldMatrixVersion
        ) {
            return out.copy(this.#worldMatrix);
        }

        //this.#worldMatrix.copy(parentWorldMatrix).append(this.#transform.unsafeGetMatrix());
        this.#transform.transformMatrix(parentWorldMatrix, this.#worldMatrix);

        this.#isWorldMatrixDirty = false;
        this.#isInverseWorldMatrixDirty = true;
        this.#parentWorldMatrixVersion = this.parent.#worldMatrixVersion;
        this.#worldMatrixVersion++;

        return out.copy(this.#worldMatrix);
    }

    getInverseWorldMatrix(out = new Matrix2()) {
        if (this.#isInverseWorldMatrixDirty) {
            this.getWorldMatrix();
            this.#inverseWorldMatrix.copy(this.#worldMatrix).invert();
            this.#isInverseWorldMatrixDirty = false;
        }

        return out.copy(this.#inverseWorldMatrix);
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
            let matrix = this.#transform.unsafeGetMatrix();
            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            matrix = null; // Clear reference to matrix to avoid accidental usage.
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
        this.#isWorldMatrixDirty = true;
        this.#isInverseWorldMatrixDirty = true;
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

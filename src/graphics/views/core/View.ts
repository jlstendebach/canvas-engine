import { EventEmitter } from "../../../events/EventEmitter.js";
import type { CanvasMouseEvent } from "../../../events/mouse/CanvasMouseEvent.js";
import { Bounds } from "../../../math/Bounds.js";
import { Matrix2 } from "../../../math/Matrix2.js";
import { Vec2 } from "../../../math/Vec2.js";
import { Transform } from "../../utils/Transform.js";

/**
 * Base class for all views in the scene graph.
 */
export class View {
    // Authored states
    #isVisible: boolean = true;
    #isPickable: boolean = true;
    #transform: Transform = new Transform(this.onTransformInvalidated.bind(this));

    // Scene graph hierarchy
    #parent: View | null = null;
    #views: View[] = [];

    // Derived states
    #bounds: Bounds = new Bounds();
    #isBoundsDirty: boolean = true;

    #worldMatrix: Matrix2 = new Matrix2();
    #isWorldMatrixDirty: boolean = true;
    #worldMatrixVersion: number = 0;
    #parentWorldMatrixVersion: number = -1;

    #inverseWorldMatrix: Matrix2 = new Matrix2();
    #isInverseWorldMatrixDirty: boolean = true;

    // Services
    #eventEmitter: EventEmitter | null = null;

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    get x(): number {
        return this.#transform.x;
    }
    set x(value: number) {
        this.setX(value);
    }

    get y(): number {
        return this.#transform.y;
    }
    set y(value: number) {
        this.setY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    get pivotX(): number {
        return this.#transform.pivotX;
    }
    set pivotX(value: number) {
        this.setPivotX(value);
    }

    get pivotY(): number {
        return this.#transform.pivotY;
    }
    set pivotY(value: number) {
        this.setPivotY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    get rotation(): number {
        return this.#transform.rotation;
    }
    set rotation(value: number) {
        this.setRotation(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    get scaleX(): number {
        return this.#transform.scaleX;
    }
    set scaleX(value: number) {
        this.setScaleX(value);
    }

    get scaleY(): number {
        return this.#transform.scaleY;
    }
    set scaleY(value: number) {
        this.setScaleY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Transform Accessors
    // -------------------------------------------------------------------------

    get transform(): Transform {
        return this.#transform;
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds Accessors
    // -------------------------------------------------------------------------

    get bounds(): Bounds {
        if (this.#isBoundsDirty) {
            this.updateBounds(this.#bounds);
            this.#isBoundsDirty = false;
        }
        return this.#bounds;
    }

    // -------------------------------------------------------------------------
    // MARK: - Other Accessors
    // -------------------------------------------------------------------------

    get isVisible(): boolean {
        return this.#isVisible;
    }
    set isVisible(value: boolean) {
        this.setVisible(value);
    }

    get isPickable(): boolean {
        return this.#isPickable;
    }
    set isPickable(value: boolean) {
        this.setPickable(value);
    }

    get parent(): View | null {
        return this.#parent;
    }

    get events(): EventEmitter {
        if (!this.#eventEmitter) {
            this.#eventEmitter = new EventEmitter();
        }
        return this.#eventEmitter;
    }

    // -------------------------------------------------------------------------
    // MARK: - Visibility and Pickability
    // -------------------------------------------------------------------------

    setVisible(isVisible: boolean): this {
        if (typeof isVisible !== "boolean") { return this; }
        if (this.#isVisible === isVisible) { return this; }
        this.#isVisible = isVisible;
        this.onChildBoundsInvalidated();
        return this;
    }

    setPickable(isPickable: boolean): this {
        if (typeof isPickable !== "boolean") { return this; }
        this.#isPickable = isPickable;
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Position
    // -------------------------------------------------------------------------

    getPosition(out: Vec2 = new Vec2()): Vec2 {
        return this.#transform.getPosition(out);
    }

    setX(x: number): this {
        this.#transform.setX(x);
        return this;
    }

    setY(y: number): this {
        this.#transform.setY(y);
        return this;
    }

    setPositionXY(x: number, y: number): this {
        this.#transform.setPositionXY(x, y);
        return this;
    }

    setPosition(position: Vec2): this {
        this.#transform.setPosition(position);
        return this;
    }

    translateXY(dx: number, dy: number): this {
        this.#transform.translateXY(dx, dy);
        return this;
    }

    translate(delta: Vec2): this {
        this.#transform.translate(delta);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    getPivot(out: Vec2 = new Vec2()): Vec2 {
        return this.#transform.getPivot(out);
    }

    setPivotX(pivotX: number): this {
        this.#transform.setPivotX(pivotX);
        return this;
    }

    setPivotY(pivotY: number): this {
        this.#transform.setPivotY(pivotY);
        return this;
    }

    setPivotXY(pivotX: number, pivotY: number): this {
        this.#transform.setPivotXY(pivotX, pivotY);
        return this;
    }

    setPivot(pivot: Vec2): this {
        this.#transform.setPivot(pivot);
        return this;
    }

    translatePivotXY(dx: number, dy: number): this {
        this.#transform.translatePivotXY(dx, dy);
        return this;
    }

    translatePivot(delta: Vec2): this {
        this.#transform.translatePivot(delta);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    getScale(out: Vec2 = new Vec2()): Vec2 {
        return this.#transform.getScale(out);
    }

    setScaleX(scaleX: number): this {
        this.#transform.setScaleX(scaleX);
        return this;
    }

    setScaleY(scaleY: number): this {
        this.#transform.setScaleY(scaleY);
        return this;
    }

    setScale(scaleOrVector: number | Vec2): this {
        this.#transform.setScale(scaleOrVector);
        return this;
    }

    setScaleXY(scaleX: number, scaleY: number): this {
        this.#transform.setScaleXY(scaleX, scaleY);
        return this;
    }

    scaleXY(factorX: number, factorY: number): this {
        this.#transform.scaleXY(factorX, factorY);
        return this;
    }

    scale(factorOrVector: number | Vec2): this {
        this.#transform.scale(factorOrVector);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation
    // -------------------------------------------------------------------------

    setRotation(radians: number): this {
        this.#transform.setRotation(radians);
        return this;
    }

    rotate(deltaRadians: number): this {
        this.#transform.rotate(deltaRadians);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Parent Management 
    // -------------------------------------------------------------------------

    /**
     * Convenience method that calls the parent view's addView method. If the
     * provided parent is already the current parent, this method does nothing.
     *
     * @param parent - The parent view to add this view to.
     * @returns This view.
     * @throws If the parent is null or undefined.
     */
    addToParent(parent: View): this {
        if (!parent) {
            throw new Error("Parent view cannot be null or undefined.");
        }
        if (parent === this.parent) { return this; }
        parent.addView(this);
        return this;
    }

    /**
     * Convenience method that calls the parent view's removeView method to
     * remove this view from its parent. If this view has no parent, this method
     * does nothing.
     *
     * @returns This view.
     */
    removeFromParent(): this {
        if (!this.parent) { return this; }
        this.parent.removeView(this);
        return this;
    }

    /**
     * Sends this view to the back of its parent's child list.
     *
     * @returns This view.
     */
    sendToBack(): this {
        if (!this.parent) { return this; }
        this.parent.setViewIndex(this, 0);
        return this;
    }

    /**
     * Brings this view to the front of its parent's child list.
     *
     * @returns This view.
     */
    bringToFront(): this {
        if (!this.parent) { return this; }
        this.parent.setViewIndex(this, this.parent.getViewCount() - 1);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Child Management 
    // -------------------------------------------------------------------------

    /**
     * Adds a child view to this view if it is not already a child of this view.
     * If it is, this method does nothing. If the view already has a parent
     * that is not this view, it is removed from that parent first.
     *
     * @param view - The child view to add.
     * @returns This view.
     * @throws If adding self or an ancestor view.
     */
    addView(view: View): this {
        return this.addViewAt(view, Infinity);
    }

    /**
     * Adds a child view at the specified index if it is not already a child.
     * If it is, this method does nothing. A view with another parent is
     * removed from that parent first.
     *
     * @param view - The child view to add.
     * @param index - The insertion index, following `Array.prototype.splice`
     *     semantics. Negative indices are offset from the end; large positive
     *     values append.
     * @returns This view.
     * @throws If view is null, undefined, this view, or an ancestor, or if it
     *     cannot be removed from its previous parent.
     */
    addViewAt(view: View, index: number): this {
        if (!view) {
            throw new Error("Cannot add null or undefined view");
        }
        if (view === this) {
            throw new Error("Cannot add a view to itself");
        }
        if (view.parent === this) {
            return this;
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
        this.#views.splice(index, 0, view);
        view.#setParent(this);
        this.invalidateBounds();

        return this;
    }

    /**
     * Removes a child view if it is a child of this view. Otherwise, this
     * method does nothing.
     *
     * @param view - The child view to remove.
     * @returns This view.
     */
    removeView(view: View): this {
        if (!view || view === this || view.parent !== this) {
            return this;
        }

        const index = this.#views.indexOf(view);
        if (index === -1) {
            // This should never happen because the view's parent reference 
            // indicates it is a child, but if it does, we still want to remove 
            // the parent reference.
            view.#setParent(null);
            return this;
        }

        return this.removeViewAt(index);
    }

    /**
     * Removes the child view at the specified index.
     *
     * @param index - The removal index, following `Array.prototype.splice`
     *     semantics. Negative indices are offset from the end. If no child
     *     exists at the resolved index, this is a no-op.
     * @returns This view.
     */
    removeViewAt(index: number): this {
        const view = this.#views.splice(index, 1)[0];
        if (!view) { return this; }

        view.#setParent(null);
        this.invalidateBounds();

        return this;
    }

    /**
     * Removes all child views from this view.
     *
     * @returns This view.
     */
    removeAllViews(): this {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].#setParent(null);
        }
        this.#views.length = 0;
        this.invalidateBounds();
        return this;
    }

    /**
     * Gets a shallow copy of this view's children.
     *
     * @returns A copy of the child view array.
     */
    getViews(): View[] {
        return this.#views.slice();
    }

    /**
     * Gets the child view at the specified index.
     *
     * @param index - The index of the child view to get.
     * @returns The child view at the specified index, or null if it does not
     *     exist.
     */
    getViewAt(index: number): View | null {
        return this.#views[index] ?? null;
    }

    /**
     * Gets the number of child views without creating a copy of the views
     * array. This is the preferred way to get the child count.
     *
     * @returns The number of child views.
     */
    getViewCount(): number {
        return this.#views.length;
    }

    /**
     * Gets the index of the specified child view.
     *
     * @param view - The child view to get the index of.
     * @returns The child view's index, or -1 if it is not a child of this view.
     */
    getViewIndex(view: View): number {
        return this.#views.indexOf(view);
    }

    /**
     * Sets the index of the specified child view.
     *
     * @param view - The child view to reorder.
     * @param index - The new index, following `Array.prototype.splice`
     *     semantics. Negative indices are offset from the end; large positive
     *     values append.
     * @returns This view.
     * @throws If the view is not a child of this view.
     */
    setViewIndex(view: View, index: number): this {
        if (!view) {
            throw new Error("Cannot set index of null or undefined view");
        }
        if (view.parent !== this) {
            throw new Error("View is not a child of this view");
        }

        const currentIndex = this.#views.indexOf(view);
        if (currentIndex === -1) {
            throw new Error("View was not found in the list of child views");
        }
        if (currentIndex === index) {
            return this;
        }

        this.#views.splice(currentIndex, 1);
        this.#views.splice(index, 0, view);
        return this;
    }

    /**
     * Checks if the specified view is a child of this view.
     *
     * @param view - The view to check.
     * @returns True if the view is a child of this view, false otherwise.
     */
    hasView(view: View): boolean {
        return this.#views.indexOf(view) !== -1;
    }

    // -------------------------------------------------------------------------
    // MARK: - Hierarchy Queries
    // -------------------------------------------------------------------------

    /**
     * Checks if this view is a descendant of the given view.
     *
     * @param view - The view to check.
     * @returns True if this view is a descendant of the given view, false
     *     otherwise.
     */
    isDescendantOf(view: View): boolean {
        if (!view || view === this) { return false; }

        let current = this.parent;
        while (current !== null) {
            if (current === view) { return true; }
            current = current.parent;
        }
        return false;
    }

    /**
     * Checks if this view is an ancestor of the given view.
     *
     * @param view - The view to check.
     * @returns True if this view is an ancestor of the given view, false
     *     otherwise.
     */
    isAncestorOf(view: View): boolean {
        if (!view || view === this) { return false; }
        return view.isDescendantOf(this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Hit Testing
    // -------------------------------------------------------------------------

    /**
     * Performs hit testing to find which view, if any, contains the specified
     * point.
     *
     * @param point - The point to test for picking.
     * @returns The picked view, or null if none.
     */
    pickView(point: Vec2): View | null {
        if (this.#isVisible === false || this.#isPickable === false) {
            return null;
        }

        const bounds = this.bounds;
        const localPoint = this.toLocalPoint(point, this.parent);

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

    toLocalPointXY(
        x: number,
        y: number,
        fromView: View | null,
        out: Vec2 = new Vec2()
    ): Vec2 {
        if (fromView) {
            if (fromView === this) {
                return out.set(x, y);
            }
            if (fromView === this.parent) {
                return this.transform.inverseTransformPointXY(x, y, out);
            }
            if (this === fromView.parent) {
                return fromView.transform.transformPointXY(x, y, out);
            }

            const matrix = new Matrix2();
            fromView.getWorldMatrix(matrix).transformPointXY(x, y, out);
            this.getInverseWorldMatrix(matrix).transformPointXY(out.x, out.y, out);

        } else {
            const matrix = new Matrix2();
            this.getInverseWorldMatrix(matrix).transformPointXY(x, y, out);
        }

        return out;
    }

    toLocalPoint(
        point: Vec2,
        fromView: View | null,
        out: Vec2 = new Vec2()
    ): Vec2 {
        return this.toLocalPointXY(point.x, point.y, fromView, out);
    }

    toLocalVectorXY(
        x: number,
        y: number,
        fromView: View | null,
        out: Vec2 = new Vec2()
    ): Vec2 {
        if (fromView) {
            if (fromView === this) {
                return out.set(x, y);
            }
            if (fromView === this.parent) {
                return this.transform.inverseTransformVectorXY(x, y, out);
            }
            if (this === fromView.parent) {
                return fromView.transform.transformVectorXY(x, y, out);
            }

            const matrix = new Matrix2();
            fromView.getWorldMatrix(matrix).transformVectorXY(x, y, out);
            this.getInverseWorldMatrix(matrix).transformVectorXY(out.x, out.y, out);

        } else {
            const matrix = new Matrix2();
            this.getInverseWorldMatrix(matrix).transformVectorXY(x, y, out);
        }

        return out;
    }

    toLocalVector(
        vector: Vec2,
        fromView: View | null,
        out: Vec2 = new Vec2()
    ): Vec2 {
        return this.toLocalVectorXY(vector.x, vector.y, fromView, out);
    }


    localToParentBounds(bounds: Bounds, out: Bounds = new Bounds()): Bounds {
        return this.#transform.transformBounds(bounds, out);
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds 
    // -------------------------------------------------------------------------

    /**
     * Checks if a point in local space is contained within this view.
     *
     * @param point - The point in local space.
     * @returns True if the point is inside this view, false otherwise.
     */
    containsPoint(point: Vec2): boolean {
        void point;
        return true;
    }

    updateBounds(out: Bounds): void {
        out.reset();
    }

    invalidateBounds(): this {
        if (this.#isBoundsDirty) { return this; }
        this.#isBoundsDirty = true;
        this.parent?.onChildBoundsInvalidated();
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - World Matrix
    // -------------------------------------------------------------------------

    getWorldMatrix(out: Matrix2 = new Matrix2()): Matrix2 {
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

        this.#transform.transformMatrix(parentWorldMatrix, this.#worldMatrix);

        this.#isWorldMatrixDirty = false;
        this.#isInverseWorldMatrixDirty = true;
        this.#parentWorldMatrixVersion = this.parent.#worldMatrixVersion;
        this.#worldMatrixVersion++;

        return out.copy(this.#worldMatrix);
    }

    getInverseWorldMatrix(out: Matrix2 = new Matrix2()): Matrix2 {
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
     *
     * @param context - The canvas drawing context.
     */
    draw(context: CanvasRenderingContext2D): void {
        if (this.#isVisible === false) { return; }

        context.save();
        try {
            let matrix: Matrix2 | null = this.#transform.unsafeGetMatrix();
            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            matrix = null; // Clear reference to matrix to avoid accidental usage.
            this.onDraw(context);
            this.drawChildren(context);
        } finally {
            context.restore();
        }
    }

    /**
     * Draws this view's own content in parent space. Subclasses should
     * override this method.
     *
     * @param context - The canvas drawing context.
     */
    onDraw(context: CanvasRenderingContext2D): void {
        // Base view does not draw anything. Subclasses should override this 
        // method.
        void context;
    }

    /**
     * Draws all child views in insertion order.
     *
     * @param context - The canvas drawing context.
     */
    drawChildren(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].draw(context);
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Handlers
    // -------------------------------------------------------------------------

    onChildBoundsInvalidated(): void {
        // Subclasses can override this method to respond to child bounds 
        // changes.
    }

    onTransformInvalidated(): void {
        this.#isWorldMatrixDirty = true;
        this.#isInverseWorldMatrixDirty = true;
        this.parent?.onChildBoundsInvalidated();
    }

    // -------------------------------------------------------------------------
    // MARK: - Mouse Events
    // -------------------------------------------------------------------------

    onMouseDown(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseUp(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseMove(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseDrag(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseEnter(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseExit(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    onMouseWheel(event: CanvasMouseEvent): void {
        this.events.emit(event.type, event);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #setParent(parent: View | null): void {
        this.#parent = parent;
        this.#parentWorldMatrixVersion = -1;
    }

}

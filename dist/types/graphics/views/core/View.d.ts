import { Bounds } from "../../../math/Bounds.js";
import { Matrix2 } from "../../../math/Matrix2.js";
import { Vec2 } from "../../../math/Vec2.js";
import { Transform } from "../../utils/Transform.js";
/**
 * Base class for all views in the scene graph.
 */
export declare class View {
    #private;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    get rotation(): number;
    set rotation(value: number);
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get transform(): Transform;
    get bounds(): Bounds;
    get isVisible(): boolean;
    set isVisible(value: boolean);
    get isPickable(): boolean;
    set isPickable(value: boolean);
    get parent(): any;
    get events(): any;
    setVisible(isVisible: any): this;
    setPickable(isPickable: any): this;
    getPosition(out?: Vec2): Vec2;
    setX(x: any): this;
    setY(y: any): this;
    setPositionXY(x: any, y: any): this;
    setPosition(position: any): this;
    translateXY(dx: any, dy: any): this;
    translate(delta: any): this;
    getPivot(out?: Vec2): Vec2;
    setPivotX(pivotX: any): this;
    setPivotY(pivotY: any): this;
    setPivotXY(pivotX: any, pivotY: any): this;
    setPivot(pivot: any): this;
    translatePivotXY(dx: any, dy: any): this;
    translatePivot(delta: any): this;
    getScale(out?: Vec2): Vec2;
    setScaleX(scaleX: any): this;
    setScaleY(scaleY: any): this;
    setScale(scaleOrVector: any): this;
    setScaleXY(scaleX: any, scaleY: any): this;
    scaleXY(factorX: any, factorY: any): this;
    scale(factorOrVector: any): this;
    setRotation(radians: any): this;
    rotate(deltaRadians: any): this;
    /**
     * Convenience method that calls the parent view's addView method.
     * If the provided parent is already the current parent, this method does
     * nothing.
     * @param {View} parent - The parent view to add this view to.
     * @returns {View} This.
     * @throws {Error} If the parent is null or undefined.
     */
    addToParent(parent: View): View;
    /**
     * Convenience method that calls the parent view's removeView method to
     * remove this view from its parent. If this view has no parent, this method
     * does nothing.
     * @returns {View} This.
     */
    removeFromParent(): View;
    /**
     * Sends this view to the back of its parent's child list.
     * @returns {View} This.
     */
    sendToBack(): View;
    /**
     * Brings this view to the front of its parent's child list.
     * @returns {View} This.
     */
    bringToFront(): View;
    /**
     * Adds a child view to this view if it is not already a child of this view.
     * If it is, this method does nothing. If the view already has a parent that
     * is not this view, it is removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {View} This.
     * @throws {Error} If adding self or an ancestor view.
     */
    addView(view: View): View;
    /**
     * Adds a child view to this view at the specified index if it is not
     * already a child of this view. If it is, this method does nothing. If the
     * view already has a parent that is not this view, it is removed from that
     * parent first.
     * @param {View} view - The child view to add.
     * @param {number} index - The index at which to add the child view. Index
     *     handling follows `Array.prototype.splice` semantics (for example,
     *     negative indices are offset from the end and large positive values
     *     append).
     * @returns {View} This.
     * @throws {Error} If view is null/undefined, if view is this view, if view is
     *     an ancestor of this view, or if the view cannot be removed from its
     *     previous parent.
     */
    addViewAt(view: View, index: number): View;
    /**
     * Removes a child view from this view if it is a child. If the view is not
     * a child, this method does nothing.
     * @param {View} view - The child view to remove.
     * @returns {View} This.
     */
    removeView(view: View): View;
    /**
     * Removes the child view at the specified index.
     * @param {number} index - The index of the child view to remove. Index
     *     handling follows `Array.prototype.splice` semantics (for example,
     *     negative indices are offset from the end). If no child exists at the
     *     resolved index, this is a no-op.
     * @returns {View} This.
     */
    removeViewAt(index: number): View;
    /**
     * Removes all child views from this view.
     * @returns {View} This.
     */
    removeAllViews(): View;
    /**
     * Gets a shallow copy of this view's children.
     * @returns {View[]} A copy of the child view array.
     */
    getViews(): View[];
    /**
     * Gets the child view at the specified index.
     * @param {number} index - The index of the child view to get.
     * @returns {View|null} The child view at the specified index, or null if it
     *     does not exist.
     */
    getViewAt(index: number): View | null;
    /**
     * Gets the number of child views. This is the preferred method for getting
     * the number of child views as it does not create a copy of the views
     * array.
     * @returns {number} The number of child views.
     */
    getViewCount(): number;
    /**
     * Gets the index of the specified child view.
     * @param {View} view - The child view to get the index of.
     * @returns {number} The index of the child view, or -1 if it is not a child
     *     of this view.
     */
    getViewIndex(view: View): number;
    /**
     * Sets the index of the specified child view.
     * @param {View} view - The child view to set the index of.
     * @param {number} index - The new index of the child view. Index handling
     *     follows `Array.prototype.splice` semantics (for example, negative
     *     indices are offset from the end and large positive values append).
     * @returns {View} This.
     * @throws {Error} If the view is not a child of this view.
     */
    setViewIndex(view: View, index: number): View;
    /**
     * Checks if the specified view is a child of this view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if the view is a child of this view, false
     *     otherwise.
     */
    hasView(view: View): boolean;
    /**
     * Checks if this view is a descendant of the given view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if this view is a descendant of the given view,
     *     false otherwise.
     */
    isDescendantOf(view: View): boolean;
    /**
     * Checks if this view is an ancestor of the given view.
     * @param {View} view - The view to check.
     * @returns {boolean} True if this view is an ancestor of the given view,
     *     false otherwise.
     */
    isAncestorOf(view: View): boolean;
    pickView(point: any): any;
    toLocalPointXY(x: any, y: any, fromView: any, out?: Vec2): any;
    toLocalPoint(point: any, fromView: any, out?: Vec2): any;
    toLocalVectorXY(x: any, y: any, fromView: any, out?: Vec2): any;
    toLocalVector(vector: any, fromView: any, out?: Vec2): any;
    localToParentBounds(bounds: any, out?: Bounds): Bounds;
    /**
     * Checks if a point in local space is contained within this view.
     * @param {Vec2} point - The point in local space.
     * @returns {boolean} True if the point is inside this view, false
     *     otherwise.
     */
    containsPoint(point: Vec2): boolean;
    updateBounds(out: any): void;
    invalidateBounds(): this;
    getWorldMatrix(out?: Matrix2): Matrix2;
    getInverseWorldMatrix(out?: Matrix2): Matrix2;
    /**
     * Draws this view and its descendants when visible.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * Draws this view's own content in parent space.
     * Subclasses should override this method.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    onDraw(context: CanvasRenderingContext2D): void;
    /**
     * Draws all child views in insertion order.
     * @param {CanvasRenderingContext2D} context - The canvas drawing context.
     */
    drawChildren(context: CanvasRenderingContext2D): void;
    onChildBoundsInvalidated(): void;
    onTransformInvalidated(): void;
    onMouseDown(event: any): void;
    onMouseUp(event: any): void;
    onMouseMove(event: any): void;
    onMouseDrag(event: any): void;
    onMouseEnter(event: any): void;
    onMouseExit(event: any): void;
    onMouseWheel(event: any): void;
}

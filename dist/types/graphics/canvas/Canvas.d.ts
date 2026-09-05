import { Vec2 } from "../../math/Vec2.js";
import { Size } from "../utils/Size.js";
import { CanvasRootView } from "./CanvasRootView.js";
export declare class Canvas {
    #private;
    get rootView(): CanvasRootView;
    get events(): any;
    get width(): any;
    get height(): any;
    get fillStyle(): any;
    set fillStyle(style: any);
    get isSmoothingEnabled(): boolean;
    set isSmoothingEnabled(value: boolean);
    constructor(selectorOrElement: any, contextType?: string);
    destroy(): void;
    isDestroyed(): boolean;
    getSize(out?: Size): Vec2;
    setFillStyle(color: any): this;
    setSmoothingEnabled(value: any): this;
    /**
     * Adds a child view to this canvas if it is not already a child of this
     * canvas. If it is, this method does nothing. If the view already has a
     * parent that is not this canvas, it is removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {Canvas} This.
     * @throws {Error} If adding self or an ancestor view.
     */
    addView(view: View): Canvas;
    /**
     * Adds a child view to this canvas at the specified index if it is not
     * already a child of this canvas. If it is, this method does nothing. If
     * the view already has a parent that is not this canvas, it is removed from
     * that parent first.
     * @param {View} view - The child view to add.
     * @param {number} index - The index at which to add the child view. Index
     *     handling follows `Array.prototype.splice` semantics (for example,
     *     negative indices are offset from the end and large positive values
     *     append).
     * @returns {Canvas} This.
     */
    addViewAt(view: View, index: number): Canvas;
    /**
     * Removes a child view from this canvas if it is a child. If the view is
     * not a child, this method does nothing.
     * @param {View} view - The child view to remove.
     * @returns {Canvas} This.
     */
    removeView(view: View): Canvas;
    /**
     * Removes the child view at the specified index.
     * @param {number} index - The index of the child view to remove. Index
     *     handling follows `Array.prototype.splice` semantics (for example,
     *     negative indices are offset from the end). If no child exists at the
     *     resolved index, this is a no-op.
     * @returns {Canvas} This.
     */
    removeViewAt(index: number): Canvas;
    /**
     * Removes all child views from this canvas.
     * @returns {Canvas} This.
     */
    removeAllViews(): Canvas;
    /**
     * Gets a shallow copy of this canvas's children.
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
     * Gets the number of child views. This is the preferred method for
     * getting the number of child views as it does not create a copy of the
     * views array.
     * @returns {number} The number of child views.
     */
    getViewCount(): number;
    /**
     * Gets the index of the specified child view.
     * @param {View} view - The child view to get the index of.
     * @returns {number} The index of the child view, or -1 if it is not a child
     *     of this canvas.
     */
    getViewIndex(view: View): number;
    /**
     * Sets the index of the specified child view.
     * @param {View} view - The child view to set the index of.
     * @param {number} index - The new index of the child view. Index handling
     *     follows `Array.prototype.splice` semantics (for example, negative
     *     indices are offset from the end and large positive values append).
     * @returns {Canvas} This.
     * @throws {Error} If the view is not a child of this canvas.
     */
    setViewIndex(view: View, index: number): Canvas;
    /**
     * Checks if the specified view is a child of this canvas.
     * @param {View} view - The view to check.
     * @returns {boolean} True if the view is a child of this canvas, false
     *     otherwise.
     */
    hasView(view: View): boolean;
    toLocalPointXY(x: any, y: any, fromView: any, out?: Vec2): Vec2;
    toLocalPoint(point: any, fromView: any, out?: Vec2): Vec2;
    toLocalVectorXY(x: any, y: any, fromView: any, out?: Vec2): Vec2;
    toLocalVector(vector: any, fromView: any, out?: Vec2): Vec2;
    draw(): void;
}

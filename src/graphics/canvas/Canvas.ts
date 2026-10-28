import type { EventEmitter } from "../../events/EventEmitter.js";
import { MouseEventProcessor } from "../../events/mouse/MouseEventProcessor.js";
import { Vec2 } from "../../math/Vec2.js";
import { CachedColor } from "../utils/CachedColor.js";
import type { Color } from "../utils/Color.js";
import type { ReadonlyColor } from "../utils/ReadonlyColor.js";
import { Size } from "../utils/Size.js";
import type { View } from "../views/core/View.js";
import { CanvasResizeEvent } from "./CanvasEvents.js";
import { CanvasRootView } from "./CanvasRootView.js";

export class Canvas {
    #element!: HTMLCanvasElement;
    #context!: CanvasRenderingContext2D;
    #contextType: string = "";
    #rootView: CanvasRootView | null = new CanvasRootView(this);
    #fillStyle: CachedColor | null = new CachedColor();
    #isSmoothingEnabled: boolean = false;

    #mouseProcessor: MouseEventProcessor | null = null;

    #resizeObserver: ResizeObserver | null = null;
    #mutationObserver: MutationObserver | null = null;

    // -------------------------------------------------------------------------
    // MARK: - Accessors 
    // -------------------------------------------------------------------------

    get rootView(): CanvasRootView | null {
        return this.#rootView;
    }

    get events(): EventEmitter | null {
        return this.#rootView?.events ?? null;
    }

    get width(): number {
        return this.#element.width;
    }

    get height(): number {
        return this.#element.height;
    }

    get fillStyle(): Color | null {
        return this.#fillStyle?.color ?? null;
    }
    set fillStyle(style: ReadonlyColor | null) {
        this.setFillStyle(style);
    }

    get isSmoothingEnabled(): boolean {
        return this.#isSmoothingEnabled;
    }
    set isSmoothingEnabled(value: boolean) {
        this.setSmoothingEnabled(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Initialization
    // -------------------------------------------------------------------------

    constructor(selectorOrElement: string | HTMLCanvasElement, contextType: string = "2d") {
        this.#initCanvas(selectorOrElement);
        this.#initContext(contextType);
        this.#attachDomEvents();
        this.#updateSize();
    }

    #initCanvas(selectorOrElement: string | HTMLCanvasElement): void {
        if (this.#element) {
            return;
        }
        if (typeof selectorOrElement === "string") {
            const element: HTMLCanvasElement | null = document.querySelector(selectorOrElement);
            if (!element) {
                throw new Error(`No canvas element found for selector: ${selectorOrElement}`);
            }
            this.#element = element;

        } else if (selectorOrElement instanceof HTMLCanvasElement) {
            this.#element = selectorOrElement;

        } else {
            throw new TypeError("Canvas constructor requires a CSS selector string or an HTMLCanvasElement.");
        }
    }

    #initContext(contextType: string): void {
        if (this.#context) {
            return;
        }
        if (typeof contextType !== "string") {
            throw new TypeError("Context type must be a string.");
        }

        const validContextTypes = ["2d"/*, "webgl", "webgl2", "webgpu", "bitmaprenderer"*/];
        if (!validContextTypes.includes(contextType)) {
            throw new Error(`Invalid context type: ${contextType}`);
        }

        const context = this.#element.getContext(contextType) as CanvasRenderingContext2D | null;
        if (!context) {
            throw new Error(`Failed to get context of type: ${contextType}`);
        }

        this.#context = context;
        this.#contextType = contextType;
    }

    // -------------------------------------------------------------------------
    // MARK: - Destruction
    // -------------------------------------------------------------------------

    destroy(): void {
        if (this.isDestroyed()) { return; }

        try {
            this.#detachDomEvents();
            this.#rootView?.removeAllViews();
            this.#rootView?.events.removeAllListeners();
        } catch (error) {
            console.error(error);
        } finally {
            // this.#element = null;
            // this.#context = null;
            this.#contextType = "";
            this.#rootView = null;
            this.#mouseProcessor = null;
        }
    }

    isDestroyed(): boolean {
        return this.#rootView === null;
    }

    // -------------------------------------------------------------------------
    // MARK: - Getters / Setters
    // -------------------------------------------------------------------------

    getSize(out: Size = new Size()): Size {
        return out.set(this.#element.width, this.#element.height);
    }

    setFillStyle(color: ReadonlyColor | null): this {
        this.#fillStyle = CachedColor.assign(this.#fillStyle, color);
        return this;
    }

    setSmoothingEnabled(value: boolean): this {
        this.#isSmoothingEnabled = value;
        if (this.#context instanceof CanvasRenderingContext2D) {
            this.#context.imageSmoothingEnabled = value;
        }
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Child Management
    // -------------------------------------------------------------------------

    /**
     * Adds a child view to this canvas if it is not already a child of this 
     * canvas. If it is, this method does nothing. If the view already has a 
     * parent that is not this canvas, it is removed from that parent first.
     * @param {View} view - The child view to add.
     * @returns {Canvas} This.
     * @throws {Error} If adding self or an ancestor view.
     */
    addView(view: View): this {
        this.#rootView?.addView(view);
        return this;
    }

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
    addViewAt(view: View, index: number): this {
        this.#rootView?.addViewAt(view, index);
        return this;
    }

    /**
     * Removes a child view from this canvas if it is a child. If the view is 
     * not a child, this method does nothing.
     * @param {View} view - The child view to remove.
     * @returns {Canvas} This.
     */
    removeView(view: View): this {
        this.#rootView?.removeView(view);
        return this;
    }

    /**
     * Removes the child view at the specified index.
     * @param {number} index - The index of the child view to remove. Index
     *     handling follows `Array.prototype.splice` semantics (for example,
     *     negative indices are offset from the end). If no child exists at the
     *     resolved index, this is a no-op.
     * @returns {Canvas} This.
     */
    removeViewAt(index: number): this {
        this.#rootView?.removeViewAt(index);
        return this;
    }

    /**
     * Removes all child views from this canvas.
     * @returns {Canvas} This.
     */
    removeAllViews(): this {
        this.#rootView?.removeAllViews();
        return this;
    }

    /**
     * Gets a shallow copy of this canvas's children.
     * @returns {View[]} A copy of the child view array.
     */
    getViews(): View[] {
        return this.#rootView?.getViews() ?? [];
    }

    /**
     * Gets the child view at the specified index.
     * @param {number} index - The index of the child view to get.
     * @returns {View|null} The child view at the specified index, or null if it
     *     does not exist.
     */
    getViewAt(index: number): View | null {
        return this.#rootView?.getViewAt(index) ?? null;
    }

    /**
     * Gets the number of child views. This is the preferred method for
     * getting the number of child views as it does not create a copy of the
     * views array.
     * @returns {number} The number of child views.
     */
    getViewCount(): number {
        return this.#rootView?.getViewCount() ?? 0;
    }

    /**
     * Gets the index of the specified child view.
     * @param {View} view - The child view to get the index of.
     * @returns {number} The index of the child view, or -1 if it is not a child
     *     of this canvas.
     */
    getViewIndex(view: View): number {
        return this.#rootView?.getViewIndex(view) ?? -1;
    }

    /**
     * Sets the index of the specified child view.
     * @param {View} view - The child view to set the index of.
     * @param {number} index - The new index of the child view. Index handling 
     *     follows `Array.prototype.splice` semantics (for example, negative 
     *     indices are offset from the end and large positive values append).
     * @returns {Canvas} This.
     * @throws {Error} If the view is not a child of this canvas.
     */
    setViewIndex(view: View, index: number): this {
        this.#rootView?.setViewIndex(view, index);
        return this;
    }

    /**
     * Checks if the specified view is a child of this canvas.
     * @param {View} view - The view to check.
     * @returns {boolean} True if the view is a child of this canvas, false 
     *     otherwise.
     */
    hasView(view: View): boolean {
        return this.#rootView?.hasView(view) ?? false;
    }

    // -------------------------------------------------------------------------
    // MARK: - Conversions
    // -------------------------------------------------------------------------

    toLocalPointXY(
        x: number, y: number, fromView: View | null, out: Vec2 = new Vec2()
    ): Vec2 {
        if (fromView) {
            fromView.getWorldMatrix().transformPointXY(x, y, out);
        } else {
            out.set(x, y);
        }
        return out;
    }

    toLocalPoint(
        point: Vec2, fromView: View | null, out: Vec2 = new Vec2()
    ): Vec2 {
        return this.toLocalPointXY(point.x, point.y, fromView, out);
    }

    toLocalVectorXY(
        x: number, y: number, fromView: View | null, out: Vec2 = new Vec2()
    ): Vec2 {
        if (fromView) {
            fromView.getWorldMatrix().transformVectorXY(x, y, out);
        } else {
            out.set(x, y);
        }
        return out;

    }

    toLocalVector(
        vector: Vec2, fromView: View | null, out: Vec2 = new Vec2()
    ): Vec2 {
        return this.toLocalVectorXY(vector.x, vector.y, fromView, out);
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing
    // -------------------------------------------------------------------------

    draw(): void {
        this.#context.save();
        this.#context.imageSmoothingEnabled = this.#isSmoothingEnabled;
        try {
            if (this.#fillStyle) {
                this.#context.fillStyle = this.#fillStyle.colorString;
                this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
            }
            this.#rootView?.draw(this.#context);

        } finally {
            this.#context.restore();
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    #attachDomEvents(): void {
        if (!this.#mouseProcessor && this.#rootView) {
            this.#mouseProcessor = new MouseEventProcessor(this.#element, this.#rootView);
            this.#mouseProcessor.attachDomEvents();
        }

        // Resize events
        if (!this.#resizeObserver) {
            this.#resizeObserver = new ResizeObserver(() => this.#updateSize());
            this.#resizeObserver.observe(this.#element);
        }

        // CSS changes
        if (!this.#mutationObserver) {
            this.#mutationObserver = new MutationObserver(() => this.#updateSize());
            this.#mutationObserver.observe(this.#element, {
                attributes: true,
                attributeFilter: ["style", "class"]
            });
        }
    }

    #detachDomEvents(): void {
        if (this.#mouseProcessor) {
            this.#mouseProcessor.detachDomEvents();
            this.#mouseProcessor = null;
        }

        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }

        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Size Helpers
    // -------------------------------------------------------------------------

    #getComputedSize(): Size {
        const style = getComputedStyle(this.#element)
        const getStyleFloat = (property: string): number => {
            return parseFloat(style.getPropertyValue(property)) || 0;
        }
        const size = new Size(getStyleFloat("width"), getStyleFloat("height"));

        // A box-sizing of border-box includes the padding and border in the 
        // element's width and height, so we must subtract those values.
        if (style.boxSizing === "border-box") {
            const paddingX = getStyleFloat("padding-left") + getStyleFloat("padding-right");
            const paddingY = getStyleFloat("padding-top") + getStyleFloat("padding-bottom");
            const borderX = getStyleFloat("border-left-width") + getStyleFloat("border-right-width");
            const borderY = getStyleFloat("border-top-width") + getStyleFloat("border-bottom-width");
            size.width -= (paddingX + borderX);
            size.height -= (paddingY + borderY);
        }

        // HTMLCanvasElement converts width and height values to integers, so we
        // round the computed size to avoid unnecessary resizes when the 
        // computed size has fractional pixels.
        return size.round();
    }

    #updateSize(): void {
        const size = this.#getComputedSize();

        if (this.#element.width === size.width && this.#element.height === size.height) {
            // Size is already correct, exit early.
            return;
        }

        // To preserve the existing canvas content when resizing, we draw the 
        // current canvas onto a temporary canvas, resize the original canvas, 
        // then draw the temporary canvas back onto the resized canvas.
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.#element.width;
        tempCanvas.height = this.#element.height;
        const tempContext = tempCanvas.getContext(this.#contextType) as CanvasRenderingContext2D | null;
        tempContext?.drawImage(this.#element, 0, 0);

        // Create the event before setting the size so that we still have access
        // to the old width and height values.
        const event = new CanvasResizeEvent(
            this,                 // app
            this.#element.width,  // oldWidth
            this.#element.height, // oldHeight
            size.width,           // width
            size.height           // height
        );

        // Set the new size.
        this.#element.width = size.width;
        this.#element.height = size.height;
        if (this.#context instanceof WebGL2RenderingContext ||
            this.#context instanceof WebGLRenderingContext
        ) {
            this.#context.viewport(0, 0, size.width, size.height);
        }

        // Draw the previous content back onto the resized canvas.
        this.#context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

        // Inform any listeners about the resize event.
        this.events?.emit(CanvasResizeEvent, event);
    }

}

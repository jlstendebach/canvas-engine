import { MouseEventProcessor } from "../../events/mouse/MouseEventProcessor.js";
import { Vec2 } from "../../math/Vec2.js";
import { CachedColor } from "../utils/CachedColor.js";
import { Size } from "../utils/Size.js";
import { CanvasResizeEvent } from "./CanvasEvents.js";
import { CanvasRootView } from "./CanvasRootView.js";

export class Canvas {
    #element = null;
    #context = null;
    #contextType = null;
    #rootView = new CanvasRootView(this);
    #fillStyle = new CachedColor();
    #isSmoothingEnabled = false;

    #mouseProcessor;

    #resizeObserver = null;
    #mutationObserver = null;

    // -------------------------------------------------------------------------
    // MARK: - Accessors 
    // -------------------------------------------------------------------------

    get rootView() {
        return this.#rootView;
    }

    get events() {
        return this.#rootView.events;
    }

    get width() {
        return this.#element.width;
    }

    get height() {
        return this.#element.height;
    }

    get fillStyle() {
        return this.#fillStyle.color;
    }
    set fillStyle(style) {
        this.setFillStyle(style);
    }
    
    get isSmoothingEnabled() {
        return this.#isSmoothingEnabled;
    }
    set isSmoothingEnabled(value) {
        this.setSmoothingEnabled(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Initialization
    // -------------------------------------------------------------------------

    constructor(selectorOrElement, contextType = "2d") {
        this.#initCanvas(selectorOrElement);
        this.#initContext(contextType);
        this.#attachDomEvents();
        this.#updateSize();
    }

    #initCanvas(selectorOrElement) {
        if (this.#element) {
            return;
        }
        if (typeof selectorOrElement === "string") {
            this.#element = document.querySelector(selectorOrElement);
            if (!this.#element) {
                throw new Error(`No canvas element found for selector: ${selectorOrElement}`);
            }

        } else if (selectorOrElement instanceof HTMLCanvasElement) {
            this.#element = selectorOrElement;

        } else {
            throw new TypeError("Canvas constructor requires a CSS selector string or an HTMLCanvasElement.");
        }
    }

    #initContext(contextType) {
        if (this.#context) {
            return;
        }
        if (typeof contextType !== "string") {
            throw new TypeError("Context type must be a string.");
        }

        const validContextTypes = ["2d", "webgl", "webgl2", "webgpu", "bitmaprenderer"];
        if (!validContextTypes.includes(contextType)) {
            throw new Error(`Invalid context type: ${contextType}`);
        }

        this.#context = this.#element.getContext(contextType);
        if (!this.#context) {
            throw new Error(`Failed to get context of type: ${contextType}`);
        }

        this.#contextType = contextType;
    }

    // -------------------------------------------------------------------------
    // MARK: - Destruction
    // -------------------------------------------------------------------------

    destroy() {
        if (this.isDestroyed()) { return; }

        try {
            this.#detachDomEvents();
            this.#rootView.removeAllViews();
            this.#rootView.events.removeAllListeners();
        } catch (error) {
            console.error(error);
        } finally {
            this.#element = null;
            this.#context = null;
            this.#contextType = null;
            this.#rootView = null;
            this.#fillStyle = null;
            this.#mouseProcessor = null;
        }
    }

    isDestroyed() {
        return this.#rootView === null;
    }

    // -------------------------------------------------------------------------
    // MARK: - Getters / Setters
    // -------------------------------------------------------------------------

    getSize(out = new Size()) {
        return out.set(this.#element.width, this.#element.height);
    }

    setFillStyle(color) {
        this.#fillStyle.color.copy(color);
        return this;
    }

    setSmoothingEnabled(value) {
        this.#isSmoothingEnabled = value;
        this.#context.imageSmoothingEnabled = value;
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
    addView(view) {
        this.#rootView.addView(view);
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
    addViewAt(view, index) {
        this.#rootView.addViewAt(view, index);
        return this;
    }

    /**
     * Removes a child view from this canvas if it is a child. If the view is 
     * not a child, this method does nothing.
     * @param {View} view - The child view to remove.
     * @returns {Canvas} This.
     */
    removeView(view) {
        this.#rootView.removeView(view);
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
    removeViewAt(index) {
        this.#rootView.removeViewAt(index);
        return this;
    }

    /**
     * Removes all child views from this canvas.
     * @returns {Canvas} This.
     */
    removeAllViews() {
        this.#rootView.removeAllViews();
        return this;
    }

    /**
     * Gets a shallow copy of this canvas's children.
     * @returns {View[]} A copy of the child view array.
     */
    getViews() {
        return this.#rootView.getViews();
    }

    /**
     * Gets the child view at the specified index.
     * @param {number} index - The index of the child view to get.
     * @returns {View|null} The child view at the specified index, or null if it
     *     does not exist.
     */
    getViewAt(index) {
        return this.#rootView.getViewAt(index);
    }

    /**
     * Gets the number of child views. This is the preferred method for
     * getting the number of child views as it does not create a copy of the
     * views array.
     * @returns {number} The number of child views.
     */
    getViewCount() {
        return this.#rootView.getViewCount();
    }

    /**
     * Gets the index of the specified child view.
     * @param {View} view - The child view to get the index of.
     * @returns {number} The index of the child view, or -1 if it is not a child
     *     of this view.
     */
    getViewIndex(view) {
        return this.#rootView.getViewIndex(view);
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
    setViewIndex(view, index) {
        this.#rootView.setViewIndex(view, index);
        return this;
    }

    /**
     * Checks if the specified view is a child of this canvas.
     * @param {View} view - The view to check.
     * @returns {boolean} True if the view is a child of this canvas, false 
     *     otherwise.
     */
    hasView(view) {
        return this.#rootView.hasView(view);
    }

    // -------------------------------------------------------------------------
    // MARK: - Conversions
    // -------------------------------------------------------------------------

    toLocalPointXY(x, y, fromView, out = new Vec2()) {
        if (fromView) {
            fromView.getWorldMatrix().transformPointXY(x, y, out);
        } else {
            out.set(x, y);
        }
        return out;
    }

    toLocalPoint(point, fromView, out = new Vec2()) {
        return this.toLocalPointXY(point.x, point.y, fromView, out);
    }

    toLocalVectorXY(x, y, fromView, out = new Vec2()) {
        if (fromView) {
            fromView.getWorldMatrix().transformVectorXY(x, y, out);
        } else {
            out.set(x, y);
        }
        return out;

    }

    toLocalVector(vector, fromView, out = new Vec2()) {
        return this.toLocalVectorXY(vector.x, vector.y, fromView, out);
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing
    // -------------------------------------------------------------------------

    draw() {
        this.#context.save();
        this.#context.imageSmoothingEnabled = this.#isSmoothingEnabled;
        try {
            if (this.#fillStyle.colorString) {
                this.#context.fillStyle = this.#fillStyle.colorString;
                this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
            }
            this.#rootView.draw(this.#context);

        } finally {
            this.#context.restore();
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    #attachDomEvents() {
        if (!this.#mouseProcessor) {
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

    #detachDomEvents() {
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

    #getComputedSize() {
        const style = getComputedStyle(this.#element)
        const getStyleFloat = (property) => parseFloat(style.getPropertyValue(property)) || 0;
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

    #updateSize() {
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
        const tempContext = tempCanvas.getContext(this.#contextType);
        tempContext.drawImage(this.#element, 0, 0);

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
        this.events.emit(CanvasResizeEvent, event);
    }

}

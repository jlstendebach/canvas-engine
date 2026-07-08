import { MouseEventProcessor } from "../../events/mouse/MouseEventProcessor.js";
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
        if (this.isDestroyed()) {
            return;
        }

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
    // MARK: - Size
    // -------------------------------------------------------------------------

    getSize(out = new Size()) {
        return out.set(this.#element.width, this.#element.height);
    }

    // -------------------------------------------------------------------------
    // MARK: - Fill Style
    // -------------------------------------------------------------------------

    setFillStyle(color) {
        this.#fillStyle.color.copy(color);
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Children
    // -------------------------------------------------------------------------

    addView(view) {
        this.#rootView.addView(view);
        return this;
    }

    removeView(view) {
        this.#rootView.removeView(view);
        return this;
    }

    removeAllViews() {
        this.#rootView.removeAllViews();
        return this;
    }

    getViewCount() {
        return this.#rootView.getViewCount();
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing
    // -------------------------------------------------------------------------

    draw() {
        this.#context.save();
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

        // Disable context menu on right click
        this.#element.oncontextmenu = () => false;

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

        // Restore default context menu behavior
        this.#element.oncontextmenu = null;

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

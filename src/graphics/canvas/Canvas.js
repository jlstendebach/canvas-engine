import { EventEmitter } from "../../events/EventEmitter.js";
import { MouseButton } from "../../events/mouse/MouseButton.js";
import { MouseEvent } from "../../events/mouse/MouseEvent.js";
import { MouseEventProcessor } from "../../events/mouse/MouseEventProcessor.js";
import { Vec2 } from "../../math/Vec2.js";
import { CachedColor } from "../utils/CachedColor.js";
import { CanvasResizeEvent } from "./CanvasEvents.js";
import { CanvasRootView } from "./CanvasRootView.js";

export class Canvas {
    #element = null;
    #context = null;
    #rootView = new CanvasRootView(this);
    #fillStyle = new CachedColor();

    #mouseProcessor = new MouseEventProcessor();
    #eventEmitter = new EventEmitter();

    #domAbortController = null;

    // MARK: - properties 
    get element() {
        return this.#element;
    }

    get context() {
        return this.#context;
    }

    get rootView() {
        return this.#rootView;
    }

    set fillStyle(style) {
        this.#fillStyle.color = style;
    }

    get fillStyle() {
        return this.#fillStyle.color;
    }

    get size() {
        return new Vec2(this.#element.width, this.#element.height);
    }

    // MARK: - initialization
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
    }

    // MARK: - destruction
    destroy() {
        if (this.isDestroyed()) {
            return;
        }

        try {
            this.#detachDomEvents();
            this.#rootView.removeAllViews();
            this.#rootView.removeAllEventListeners();
            this.#eventEmitter.removeAllListeners();
        } catch (error) {
            console.error(error);
        } finally {
            this.#element = null;
            this.#context = null;
            this.#rootView = null;
            this.#fillStyle = null;
            this.#mouseProcessor = null;
            this.#eventEmitter = null;
            this.#domAbortController = null;
        }
    }

    isDestroyed() {
        return this.#rootView === null;
    }    

    // MARK: - drawing
    addView(view) {
        return this.#rootView.addView(view);
    }

    removeView(view) {
        return this.#rootView.removeView(view);
    }

    removeAllViews() {
        this.#rootView.removeAllViews();
    }

    draw() {
        this.#updateSize();
        this.#context.save();

        try {
            const fillStyle = this.#fillStyle.colorString;
            if (fillStyle) {
                this.#context.fillStyle = fillStyle;
                this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
            }
            this.#rootView.draw(this.#context);

        } finally {
            this.#context.restore();
        }
    }

    // MARK: - events 
    addEventListener(type, callback, owner = null, once = false) {
        if (this.#isEventHandledByView(type)) {
            return this.#rootView.addEventListener(type, callback, owner, once);
        }
        return this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner = null) {
        if (this.#isEventHandledByView(type)) {
            return this.#rootView.removeEventListener(type, callback, owner);
        }
        return this.#eventEmitter.removeListener(type, callback, owner);
    }

    removeAllEventListeners(type) {
        this.#rootView.removeAllEventListeners(type);
        this.#eventEmitter.removeAllListeners(type);
    }

    // MARK: - event binding
    #attachDomEvents() {
        if (this.#domAbortController) {
            return;
        }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };

        // Mouse events
        this.#element.addEventListener("mousedown", this.#onMouseDown.bind(this), options);
        this.#element.addEventListener("mouseup", this.#onMouseUp.bind(this), options);
        this.#element.addEventListener("mouseout", this.#onMouseOut.bind(this), options);
        this.#element.addEventListener("mousemove", this.#onMouseMove.bind(this), options);
        this.#element.addEventListener("wheel", this.#onMouseWheel.bind(this), options);

        // Window events
        window.addEventListener("resize", this.#onWindowResized.bind(this), options);

        // Other events
        this.#element.oncontextmenu = () => false; // disable context menu on right click
    }

    #detachDomEvents() {
        if (!this.#domAbortController) {
            return;
        }
        this.#domAbortController.abort();
        this.#domAbortController = null;
        this.#element.oncontextmenu = null; // restore default context menu behavior
    }

    // MARK: - event handlers
    #onWindowResized() {
        this.#updateSize();
    }

    #onMouseDown(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.DOWN, event);
        if (mouseEvent) {
            this.#mouseProcessor.onMouseDown(mouseEvent);
        }
    }

    #onMouseUp(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.UP, event);
        if (mouseEvent) {
            this.#mouseProcessor.onMouseUp(mouseEvent);
        }
    }

    #onMouseMove(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.MOVE, event);
        if (mouseEvent) {
            this.#mouseProcessor.onMouseMove(mouseEvent);
        }
    }

    #onMouseOut(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.EXIT, event);
        if (mouseEvent) {
            this.#mouseProcessor.onMouseOut(mouseEvent);
        }
    }

    #onMouseWheel(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.WHEEL, event);
        if (mouseEvent) {
            this.#mouseProcessor.onMouseWheel(mouseEvent);
        }
    }

    // MARK: - event helpers
    #isEventHandledByView(eventType) {
        switch (eventType) {
            case MouseEvent.DOWN:
            case MouseEvent.UP:
            case MouseEvent.MOVE:
            case MouseEvent.DRAG:
            case MouseEvent.ENTER:
            case MouseEvent.EXIT:
            case MouseEvent.WHEEL:
                return true;
            default:
                return false;
        }
    }

    // MARK: - size helpers
    #getComputedSize() {
        const style = getComputedStyle(this.#element)
        const getStyleFloat = (property) => parseFloat(style.getPropertyValue(property)) || 0;
        const size = new Vec2(getStyleFloat("width"), getStyleFloat("height"));

        // A box-sizing of border-box includes the padding and border in the 
        // element's width and height, so we must subtract those values.
        if (style.boxSizing === "border-box") {
            const paddingX = getStyleFloat("padding-left") + getStyleFloat("padding-right");
            const paddingY = getStyleFloat("padding-top") + getStyleFloat("padding-bottom");        
            const borderX = getStyleFloat("border-left-width") + getStyleFloat("border-right-width");
            const borderY = getStyleFloat("border-top-width") + getStyleFloat("border-bottom-width");
            size.x -= (paddingX + borderX);
            size.y -= (paddingY + borderY);
        }

        // HTMLCanvasElement converts width and height values to integers, so we
        // round the computed size to avoid unnecessary resizes when the 
        // computed size has fractional pixels.
        return size.round();
    }

    #updateSize() {
        const size = this.#getComputedSize();

        if (this.#element.width === size.x && this.#element.height === size.y) {
            // Size is already correct, exit early.
            return;
        }

        // Create the event before setting the size so that we still have access
        // to the old width and height values.
        const event = new CanvasResizeEvent(
            this,                 // app
            this.#element.width,  // oldWidth
            this.#element.height, // oldHeight
            size.x,               // width
            size.y                // height
        );

        this.#element.width = size.x;
        this.#element.height = size.y;        
        if (this.#context instanceof WebGL2RenderingContext ||
            this.#context instanceof WebGLRenderingContext
        ) {
            this.#context.viewport(0, 0, size.x, size.y);
        }

        this.#eventEmitter.emit(CanvasResizeEvent, event);
    }

    // MARK: - mouse helpers
    #createMouseEvent(type, event) {
        const style = getComputedStyle(this.#element)
        const paddingX = parseFloat(style.getPropertyValue("padding-left")) || 0;
        const paddingY = parseFloat(style.getPropertyValue("padding-top")) || 0;        
        const coords = new Vec2(event.offsetX - paddingX, event.offsetY - paddingY);

        if (type !== MouseEvent.EXIT) {
            if (
                coords.x < 0 || 
                coords.y < 0 ||
                coords.x >= this.#element.width || 
                coords.y >= this.#element.height
            ) {
                return null;
            }
        }

        let dx, dy;
        if (type == MouseEvent.WHEEL) {
            dx = event.deltaX;
            dy = event.deltaY;
        } else {
            dx = event.movementX;
            dy = event.movementY;
        }

        return new MouseEvent(
            type,                                // type
            coords.x,                            // x
            coords.y,                            // y
            dx,                                  // dx
            dy,                                  // dy            
            MouseButton.fromIndex(event.button), // button
            event.buttons,                       // buttons
            this.#rootView,                      // target
            null                                 // related
        );
    }

}

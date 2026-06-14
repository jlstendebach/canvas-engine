import { CanvasResizeEvent } from "../events/CanvasEvents.js";
import { EventEmitter } from "../events/EventEmitter.js";
import { MouseButton } from "../events/mouse/MouseButton.js";
import { MouseEvent } from "../events/mouse/MouseEvent.js";
import { MouseEventProcessor } from "../events/mouse/MouseEventProcessor.js";
import { Vec2 } from "../math/Vec2.js";
import { CachedColor } from "./utils/CachedColor.js";
import { View } from "./views/View.js";

export class Canvas {
    #element = null;
    #context = null;
    #rootView = new CanvasRootView(this);
    #fillStyle = new CachedColor();

    #mouseProcessor = new MouseEventProcessor();
    #eventEmitter = new EventEmitter();

    #domAbortController = null;

    // MARK: - properties 
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
        this.#updateCanvasSize();
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
        this.#updateCanvasSize();
        this.#context.save();

        const fillStyle = this.#fillStyle.colorString;
        if (fillStyle) {
            this.#context.fillStyle = fillStyle;
            this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
        }
        this.#rootView.draw(this.#context);

        this.#context.restore();
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

    removeAllEventListeners(type = null) {
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
        this.#updateCanvasSize();
    }

    #onMouseDown(event) {
        this.#mouseProcessor.onMouseDown(this.#createMouseEvent(MouseEvent.DOWN, event));
    }

    #onMouseUp(event) {
        this.#mouseProcessor.onMouseUp(this.#createMouseEvent(MouseEvent.UP, event));
    }

    #onMouseMove(event) {
        this.#mouseProcessor.onMouseMove(this.#createMouseEvent(MouseEvent.MOVE, event));
    }

    #onMouseOut(event) {
        this.#mouseProcessor.onMouseOut(this.#createMouseEvent(MouseEvent.MOVE, event));
    }

    #onMouseWheel(event) {
        this.#mouseProcessor.onMouseWheel(this.#createMouseEvent(MouseEvent.WHEEL, event));
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
    #updateCanvasSize() {
        const style = getComputedStyle(this.#element)
        const getStyleFloat = (property) => parseFloat(style.getPropertyValue(property)) || 0;

        let width = getStyleFloat("width");
        let height = getStyleFloat("height");

        // When box-sizing is set to border-box, the computed width and height 
        // include padding and border, so we need to subtract those out to get 
        // the actual canvas size.
        if (style.boxSizing === "border-box") {
            const paddingX = getStyleFloat("padding-left") + getStyleFloat("padding-right");
            const paddingY = getStyleFloat("padding-top") + getStyleFloat("padding-bottom");        
            const borderX = getStyleFloat("border-left-width") + getStyleFloat("border-right-width");
            const borderY = getStyleFloat("border-top-width") + getStyleFloat("border-bottom-width");

            width -= (paddingX + borderX);
            height -= (paddingY + borderY);
        }

        this.#setSize(width, height);
    }

    #setSize(width, height) {
        if (this.#element.width === width && this.#element.height === height) {
            return;
        }

        // Create the event before setting the size so that we still have access
        // to the old width and height values.
        const event = new CanvasResizeEvent(
            this,                 // app
            this.#element.width,  // oldWidth
            this.#element.height, // oldHeight
            width,                // width
            height                // height
        );

        this.#element.width = width;
        this.#element.height = height;        
        if (this.#context instanceof WebGL2RenderingContext ||
            this.#context instanceof WebGLRenderingContext
        ) {
            this.#context.viewport(0, 0, width, height);
        }

        this.#eventEmitter.emit(CanvasResizeEvent, event);
    }

    // MARK: - mouse helpers
    #windowToLocal(x, y) {
        const style = getComputedStyle(this.#element)
        const getStyleFloat = (property) => parseFloat(style.getPropertyValue(property)) || 0;

        const paddingX = getStyleFloat("padding-left");
        const paddingY = getStyleFloat("padding-top");        

        return new Vec2(
            x - paddingX,
            y - paddingY
        );
    }

    #createMouseEvent(type, event) {
        let coords = this.#windowToLocal(event.offsetX, event.offsetY);
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
            this.#rootView,                          // target
            null                                 // related
        );
    }

}


// MARK: - CanvasRootView
export class CanvasRootView extends View {
    #canvas;

    get canvas() {
        return this.#canvas;
    }

    constructor(canvas) {
        super();
        this.#canvas = canvas;
    }
}
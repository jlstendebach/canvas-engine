import { CanvasResizeEvent } from "../events/CanvasEvents.js";
import { EventEmitter } from "../events/EventEmitter.js";
import { MouseButton } from "../events/mouse/MouseButton.js";
import { MouseEvent } from "../events/mouse/MouseEvent.js";
import { MouseEventProcessor } from "../events/mouse/MouseEventProcessor.js";
import { Vec2 } from "../math/Vec2.js";
import { CachedColor } from "./utils/CachedColor.js";
import { View } from "./views/View.js";

export class Canvas {
    #canvas = null;
    #context = null;
    #rootView = new View();
    #fillStyle = new CachedColor();

    #mouseProcessor = new MouseEventProcessor();
    #eventEmitter = new EventEmitter();

    #domAbortController = null;

    constructor(selectorOrElement, contextType="2d") {
        if (typeof selectorOrElement === "string") {
            this.#canvas = document.querySelector(selectorOrElement);
            if (!this.#canvas) {
                throw new Error(`No canvas element found for selector: ${selectorOrElement}`);
            }

        } else if (selectorOrElement instanceof HTMLCanvasElement) {
            this.#canvas = selectorOrElement;

        } else {
            throw new TypeError("Canvas constructor requires a CSS selector string or an HTMLCanvasElement.");
        }
        this.#context = this.#canvas.getContext(contextType);
        this.#attachDomEvents();
        this.updateCanvasSize();
    }

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
            this.#canvas = null;
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

    // MARK: - Properties ------------------------------------------------------
    get canvasElement() {
        return this.#canvas;
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

    // --[ size ]---------------------------------------------------------------
    setSize(w, h) {
        if (this.#canvas.width !== w || this.#canvas.height !== h) {
            // Create the event to emit.
            const event = new CanvasResizeEvent(
                this,                // canvas
                this.#canvas.width,  // old width
                this.#canvas.height, // old height
                w,                   // new width
                h                    // new height
            );

            // Set the size of the canvas.
            this.#canvas.width = w;
            this.#canvas.height = h;

            if (this.#context instanceof WebGL2RenderingContext ||
                this.#context instanceof WebGLRenderingContext    
            ) {
                this.#context.viewport(0, 0, w, h);
            }

            // Inform listeners of the event.
            this.#eventEmitter.emit(CanvasResizeEvent.name, event);
        }
    }

    getSize() {
        return new Vec2(this.#canvas.width, this.#canvas.height);
    }
    
    setWidth(w) {
        this.setSize(w, this.getHeight());
    }

    getWidth() {
        return this.#canvas.width;
    }

    setHeight(h) {
        this.setSize(this.getWidth(), h);
    }

    getHeight() {
        return this.#canvas.height;
    }

    // MARK: - Drawing ---------------------------------------------------------
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
        this.updateCanvasSize();

        // Save the state of the context to be restored later.
        this.#context.save();

        const fillStyle = this.#fillStyle.colorString;
        if (fillStyle) {
            this.#context.fillStyle = fillStyle;
            this.#context.fillRect(0, 0, this.getWidth(), this.getHeight());
        }
        this.#rootView.draw(this.#context);

        // Restore the context so we can start fresh next time.
        this.#context.restore();
    }


    // MARK: - Events ----------------------------------------------------------
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

    // MARK: - DOM event binding
    #attachDomEvents() {        
        if (this.#domAbortController) {
            return;
        }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };

        // Mouse events
        this.#canvas.addEventListener("mousedown", this.#onMouseDown.bind(this), options);
        this.#canvas.addEventListener("mouseup", this.#onMouseUp.bind(this), options);
        this.#canvas.addEventListener("mouseout", this.#onMouseUp.bind(this), options);
        this.#canvas.addEventListener("mousemove", this.#onMouseMove.bind(this), options);
        this.#canvas.addEventListener("wheel", this.#onMouseWheel.bind(this), options);

        // Window events
        window.addEventListener("resize", this.#onWindowResized.bind(this), options);

        // Other events
        this.#canvas.oncontextmenu = () => false; // disable context menu on right click
    }

    #detachDomEvents() {
        if (!this.#domAbortController) {
            return;
        }
        this.#domAbortController.abort();
        this.#domAbortController = null;
        this.#canvas.oncontextmenu = null; // restore default context menu behavior
    }

    // MARK: - DOM window event handlers
    #onWindowResized() {
        this.updateCanvasSize();
    }

    // MARK: - DOM mouse event handlers
    #onMouseDown(event) {
        this.#mouseProcessor.onMouseDown(this.createMouseEvent(MouseEvent.DOWN, event));
    }

    #onMouseUp(event) {
        this.#mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
    }
    
    #onMouseMove(event) {
        this.#mouseProcessor.onMouseMove(this.createMouseEvent(MouseEvent.MOVE, event));
    }
    
    #onMouseWheel(event) {
        this.#mouseProcessor.onMouseWheel(this.createMouseEvent(MouseEvent.WHEEL, event));
    }


    // MARK: - Helpers ---------------------------------------------------------
    windowToCanvasCoords(x, y) {
        let style = window.getComputedStyle
            ? getComputedStyle(this.#canvas, null)
            : this.#canvas.currentStyle;

        let paddingLeft = parseInt(style.paddingLeft) || 0;
        let paddingTop = parseInt(style.paddingTop) || 0;
        let bounds = this.#canvas.getBoundingClientRect();

        return new Vec2(
            Math.min(x - bounds.left - paddingLeft, bounds.width - 1),
            Math.min(y - bounds.top - paddingTop, bounds.height - 1)
        );

    }

    updateCanvasSize() {
        let width = this.#canvas.clientWidth;
        let height = this.#canvas.clientHeight;

        const style = window.getComputedStyle
            ? getComputedStyle(this.#canvas, null)
            : this.#canvas.currentStyle;

        const paddingLeft = parseInt(style.paddingLeft) || 0;
        const paddingRight = parseInt(style.paddingRight) || 0;
        const paddingTop = parseInt(style.paddingTop) || 0;
        const paddingBottom = parseInt(style.paddingBottom) || 0;

        width -= (paddingLeft + paddingRight);
        height -= (paddingTop + paddingBottom);

        this.setSize(width, height);
    }

    createMouseEvent(type, event) {
        let coords = this.windowToCanvasCoords(event.clientX, event.clientY);
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

}

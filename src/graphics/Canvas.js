import { View } from "./views/View.js";
import { CachedColor } from "./utils/CachedColor.js";

import { 
    CanvasResizeEvent, 
    EventEmitter, 
    MouseButton,
    MouseEvent,    
    MouseEventProcessor,
} from "../events/index.js";

import { Vec2 } from "../math/index.js";

export class Canvas {
    #id = "";
    #canvas = null;
    #context = null;
    #rootView = new View();
    #fillStyle = new CachedColor();

    #mouseProcessor = new MouseEventProcessor();
    #eventEmitter = new EventEmitter();

    constructor(id, contextType="2d") {
        this.#id = id;
        this.#canvas = document.getElementById(id);
        this.#context = this.#canvas.getContext(contextType);
        this.hookEvents();
        this.updateCanvasSize();
    }

    // MARK: - Properties ------------------------------------------------------
    set fillStyle(style) {
        this.#fillStyle.color = style;
    }

    get fillStyle() {
        return this.#fillStyle.color;
    }

    get rootView() {
        return this.#rootView;
    }


    // --[ canvas ]-------------------------------------------------------------
    getContext() {
        return this.#context;
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

    onWindowResized() {
        this.updateCanvasSize();
    }

    hookEvents() {        
        this.hookMouseEvents();
        this.hookOtherEvents();
    }

    hookMouseEvents() {
        // Mouse Down
        this.#canvas.addEventListener("mousedown", (event) => {
            this.#mouseProcessor.onMouseDown(this.createMouseEvent(MouseEvent.DOWN, event));
        });

        // Mouse Up
        this.#canvas.addEventListener("mouseup", (event) => {
            this.#mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        });

        // Mouse Out
        this.#canvas.addEventListener("mouseout", (event) => {
            this.#mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        });

        // Mouse Move
        this.#canvas.addEventListener("mousemove", (event) => {
            this.#mouseProcessor.onMouseMove(this.createMouseEvent(MouseEvent.MOVE, event));
        });

        // Mouse Wheel
        this.#canvas.addEventListener("wheel", (event) => {
            this.#mouseProcessor.onMouseWheel(this.createMouseEvent(MouseEvent.WHEEL, event));
        });

        // Context Menu - Disable right click context menu on the canvas.
        this.#canvas.oncontextmenu = () => false;
    }

    hookOtherEvents() {
        // Window Resized
        window.addEventListener("resize", () => {
            this.onWindowResized();
        });
    }

    // MARK: - Helpers ---------------------------------------------------------
    windowToCanvasCoords(x, y) {
        this.#canvas = document.getElementById(this.#id);

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
        this.#canvas = document.getElementById(this.#id);

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
        let dx = 0;
        let dy = 0;

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

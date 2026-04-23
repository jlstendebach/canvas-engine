import { View } from "./views/View.js";
import { CachedColor } from "./utils/CachedColor.js";

import { 
    CanvasResizeEvent, 
    MouseButton,
    MouseEvent,    
    MouseEventProcessor,
} from "../events/index.js";

import { Vec2 } from "../math/index.js";

export class Canvas {
    #id = "";
    #canvas = null;
    #context = null;
    #view = new View();
    #fillStyle = new CachedColor();
    #mouseProcessor = new MouseEventProcessor();

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
            this.emitEvent(CanvasResizeEvent.name, event);
        }
        return this;
    }

    getSize() {
        return new Vec2(this.#canvas.width, this.#canvas.height);
    }
    
    setWidth(w) {
        this.setSize(w, this.getHeight());
        return this;
    }

    getWidth() {
        return this.#canvas.width;
    }

    setHeight(h) {
        this.setSize(this.getWidth(), h);
        return this;
    }

    getHeight() {
        return this.#canvas.height;
    }

    // --[ background ]---------------------------------------------------------
    setFillStyle(style) {
        this.#fillStyle.color = style;
        return this;
    }

    // --[ drawing ]------------------------------------------------------------
    getView() { 
        return this.#view; 
    }

    addView(view) {
        this.#view.addView(view);
        return this;
    }

    removeView(view) {
        this.#view.removeView(view);
        return this;
    }

    draw() {
        this.updateCanvasSize();

        // Save the state of the context to be restored later.
        this.#context.save();

        this.#context.fillStyle = this.#fillStyle.colorString;
        this.#context.fillRect(0, 0, this.getWidth(), this.getHeight());
        this.#view.draw(this.#context);

        // Restore the context so we can start fresh next time.
        this.#context.restore();
    }


    // --[ events ]---------------------------------------------------------------
    addEventListener(type, callback, owner) {
        this.#view.addEventListener(type, callback, owner);
        return this;
    }

    removeEventListener(type, callback, owner) {
        this.#view.removeEventListener(type, callback, owner);
        return this;
    }

    emitEvent(type, event) {
        this.#view.eventEmitter.emit(type, event);
    }

    onWindowResized() {
        this.updateCanvasSize();
    }

    hookEvents() {
        /****************************/
        /* ---- Window Resized ---- */
        /****************************/
        window.addEventListener("resize", function () {
            this.onWindowResized();
        }.bind(this));

        /************************/
        /* ---- Mouse Down ---- */
        /************************/
        this.#canvas.addEventListener("mousedown", function (event) {
            this.#mouseProcessor.onMouseDown(this.createMouseEvent(MouseEvent.DOWN, event));
        }.bind(this));

        /**********************/
        /* ---- Mouse Up ---- */
        /**********************/
        this.#canvas.addEventListener("mouseup", function (event) {
            this.#mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        }.bind(this));

        /***********************/
        /* ---- Mouse Out ---- */
        /***********************/
        this.#canvas.addEventListener("mouseout", function (event) {
            this.#mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        }.bind(this));

        /************************/
        /* ---- Mouse Move ---- */
        /************************/
        this.#canvas.addEventListener("mousemove", function (event) {
            this.#mouseProcessor.onMouseMove(this.createMouseEvent(MouseEvent.MOVE, event));
        }.bind(this));

        /*************************/
        /* ---- Mouse Wheel ---- */
        /*************************/
        this.#canvas.addEventListener("wheel", function (event) {
            this.#mouseProcessor.onMouseWheel(this.createMouseEvent(MouseEvent.WHEEL, event));
        }.bind(this));

        /**************************/
        /* ---- Context Menu ---- */
        /**************************/
        this.#canvas.oncontextmenu = function () { return false; }

    }


    // --[ helpers ]--------------------------------------------------------------
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
            coords.x,                             // x
            coords.y,                             // y
            dx,                                  // dx
            dy,                                  // dy            
            MouseButton.fromIndex(event.button), // button
            event.buttons,                       // buttons
            this.#view,                          // target
            null                                 // related
        );
    }

}

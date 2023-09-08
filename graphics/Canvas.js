import { View } from "./views/View.js";

import { 
    CanvasResizeEvent, 
    MouseButton,
    MouseEvent,    
    MouseEventProcessor,
} from "../events/index.js";

import { Vec2 } from "../math/index.js";

export class Canvas {
    constructor(id, contextType="2d") {
        this.id = id;
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext(contextType);

        this.view = new View();
        this.fillStyle = "#fff";
        this.scale = 1;

        this.mouseProcessor = new MouseEventProcessor();

        this.hookEvents();
        this.updateCanvasSize();
    }


    // --[ canvas ]---------------------------------------------------------------
    getContext() {
        return this.context;
    }


    // --[ size ]---------------------------------------------------------------
    setSize(w, h) {
        if (this.canvas.width !== w || this.canvas.height !== h) {
            // Create the event to emit.
            const event = new CanvasResizeEvent(
                this,               // canvas
                this.canvas.width,  // old width
                this.canvas.height, // old height
                w,                  // new width
                h                   // new height
            );

            // Set the size of the canvas.
            this.canvas.width = w;
            this.canvas.height = h;

            // Inform listeners of the event.
            this.emitEvent(CanvasResizeEvent.name, event);
        }
    }
    
    setWidth(w) {
        this.setSize(w, this.getHeight());
    }

    getWidth() {
        return this.canvas.width;
    }

    setHeight(h) {
        this.setSize(this.getWidth(), h);
    }

    getHeight() {
        return this.canvas.height;
    }

    /*********/
    /* scale */
    /*********/
    setScale(s) {
        this.scale = s;
    }

    getScale() {
        return this.scale;
    }

    getScaledWidth() {
        return this.getWidth() / this.scale;
    }

    getScaledHeight() {
        return this.getHeight() / this.scale;
    }


    // --[ background ]-----------------------------------------------------------
    setFillStyleRGBA(r, g, b, a) {
        this.fillStyle = `rgba(${r},${g},${b},${a})`;
    }

    setFillStyle(style) {
        this.fillStyle = style;
    }


    // --[ drawing ]--------------------------------------------------------------
    getView() { return this.view; }

    addView(view) {
        return this.view.addView(view);
    }

    draw() {
        this.updateCanvasSize();

        // Save the state of the context to be restored later.
        this.context.save();

        this.context.scale(this.scale, this.scale);
        this.context.fillStyle = this.fillStyle;
        this.context.fillRect(0, 0, this.getScaledWidth(), this.getScaledHeight());
        this.view.draw(this.context);

        // Restore the context so we can start fresh next time.
        this.context.restore();
    }


    // --[ events ]---------------------------------------------------------------
    addEventListener(type, callback, owner) {
        this.view.addEventListener(type, callback, owner);
    }

    removeEventListener(type, callback, owner) {
        this.view.removeEventListener(type, callback, owner);
    }

    emitEvent(type, event) {
        this.view.emitEvent(type, event);
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
        this.canvas.addEventListener("mousedown", function (event) {
            this.mouseProcessor.onMouseDown(this.createMouseEvent(MouseEvent.DOWN, event));
        }.bind(this));

        /**********************/
        /* ---- Mouse Up ---- */
        /**********************/
        this.canvas.addEventListener("mouseup", function (event) {
            this.mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        }.bind(this));

        /***********************/
        /* ---- Mouse Out ---- */
        /***********************/
        this.canvas.addEventListener("mouseout", function (event) {
            this.mouseProcessor.onMouseUp(this.createMouseEvent(MouseEvent.UP, event));
        }.bind(this));

        /************************/
        /* ---- Mouse Move ---- */
        /************************/
        this.canvas.addEventListener("mousemove", function (event) {
            this.mouseProcessor.onMouseMove(this.createMouseEvent(MouseEvent.MOVE, event));
        }.bind(this));

        /*************************/
        /* ---- Mouse Wheel ---- */
        /*************************/
        this.canvas.addEventListener("wheel", function (event) {
            this.mouseProcessor.onMouseWheel(this.createMouseEvent(MouseEvent.WHEEL, event));
        }.bind(this));

        /**************************/
        /* ---- Context Menu ---- */
        /**************************/
        this.canvas.oncontextmenu = function () { return false; }

    }


    // --[ helpers ]--------------------------------------------------------------
    windowToCanvasCoords(x, y) {
        this.canvas = document.getElementById(this.id);

        let style = window.getComputedStyle
            ? getComputedStyle(this.canvas, null)
            : this.canvas.currentStyle;

        let paddingLeft = parseInt(style.paddingLeft) || 0;
        let paddingTop = parseInt(style.paddingTop) || 0;
        let bounds = this.canvas.getBoundingClientRect();

        return new Vec2(
            Math.min(x - bounds.left - paddingLeft, bounds.width - 1),
            Math.min(y - bounds.top - paddingTop, bounds.height - 1)
        );

    }

    updateCanvasSize() {
        this.canvas = document.getElementById(this.id);

        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;

        const style = window.getComputedStyle
            ? getComputedStyle(this.canvas, null)
            : this.canvas.currentStyle;

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
            dx = event.movementX / this.scale;
            dy = event.movementY / this.scale;
        }

        return new MouseEvent(
            type,                                // type
            coords.x / this.scale,               // x
            coords.y / this.scale,               // y
            dx,                                  // dx
            dy,                                  // dy            
            MouseButton.fromIndex(event.button), // button
            event.buttons,                       // buttons
            this.view,                           // target
            null                                 // related
        );
    }

}

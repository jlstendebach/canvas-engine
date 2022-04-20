import { View } from "./views/View.js";

import { 
    CanvasResizeEvent, 
    MouseButton,
    MouseEvent,    
    MouseEventProcessor,
    MouseMoveEvent,
    MouseWheelEvent,
} from "../events/Events.js";

import { Vec2 } from "../math/Math.js";

export class Canvas {
    constructor(id) {
        this.id = id;
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");

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


    // --[ size ]-----------------------------------------------------------------
    setWidth(w) {
        if (this.canvas.width !== w) {
            // Create the event to emit.
            const event = new CanvasResizeEvent(
                this,               // canvas
                this.canvas.width,  // old width
                this.canvas.height, // old height
                w,                  // new width
                this.canvas.height  // new height
            );

            // Set the width of the canvas.
            this.canvas.width = w;

            // Inform listeners of the event.
            this.emitEvent(CanvasResizeEvent.name, event);
        }
    }

    getWidth() {
        return this.canvas.width;
    }

    setHeight(h) {
        if (this.canvas.height !== h) {
            // Create the event to emit.
            const event = new CanvasResizeEvent(
                this,               // canvas
                this.canvas.width,  // old width
                this.canvas.height, // old height
                this.canvas.width,  // new width
                h                   // new height
            );

            // Set the width of the canvas.
            this.canvas.height = h;

            // Inform listeners of the event.
            this.emitEvent(CanvasResizeEvent.name, event);
        }
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
        this.context.translate(0.5, 0.5)

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
        let self = this;

        /****************************/
        /* ---- Window Resized ---- */
        /****************************/
        window.addEventListener("resize", function () {
            self.onWindowResized();
        });

        /************************/
        /* ---- Mouse Down ---- */
        /************************/
        this.canvas.addEventListener("mousedown", function (event) {
            let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
            let e = new MouseEvent(
                coords.x / self.scale, // x
                coords.y / self.scale, // y
                MouseButton.fromIndex(event.button),
            );
            self.mouseProcessor.onMouseDown(self.view, e);
        });

        /**********************/
        /* ---- Mouse Up ---- */
        /**********************/
        this.canvas.addEventListener("mouseup", function (event) {
            let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
            let e = new MouseEvent(
                coords.x / self.scale, // x
                coords.y / self.scale, // y
                MouseButton.fromIndex(event.button),
            );
            self.mouseProcessor.onMouseUp(self.view, e);
        });

        /***********************/
        /* ---- Mouse Out ---- */
        /***********************/
        this.canvas.addEventListener("mouseout", function (event) {
            let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
            let e = new MouseEvent(
                coords.x / self.scale, // x
                coords.y / self.scale, // y
                MouseButton.fromIndex(event.button),
            );
            self.mouseProcessor.onMouseUp(self.view, e);
        });

        /************************/
        /* ---- Mouse Move ---- */
        /************************/
        this.canvas.addEventListener("mousemove", function (event) {
            let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
            let e = new MouseMoveEvent(
                coords.x / self.scale, // x
                coords.y / self.scale, // y
                event.movementX / self.scale, // dx
                event.movementY / self.scale,  // dy
                MouseButton.fromIndex(event.button),
            );
            self.mouseProcessor.onMouseMove(self.view, e);
        });

        /*************************/
        /* ---- Mouse Wheel ---- */
        /*************************/
        this.canvas.addEventListener("wheel", function (event) {
            let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
            let e = new MouseWheelEvent(
                coords.x / self.scale, // x
                coords.y / self.scale, // y
                MouseButton.fromIndex(event.button),
                event.deltaY * -0.01
            );
            self.mouseProcessor.onMouseWheel(self.view, e);
        });

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

        this.setWidth(width);
        this.setHeight(height);
    }

}

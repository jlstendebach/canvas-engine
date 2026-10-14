import type { Canvas } from "./Canvas.js";

export class CanvasEvent {
    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }
}

export class CanvasResizeEvent extends CanvasEvent {
    oldWidth: number;
    oldHeight: number;
    width: number;
    height: number;

    constructor(
        canvas: Canvas,
        oldWidth: number,
        oldHeight: number,
        width: number,
        height: number
    ) {
        super(canvas);
        this.oldWidth = oldWidth;
        this.oldHeight = oldHeight;
        this.width = width;
        this.height = height;
    }
}
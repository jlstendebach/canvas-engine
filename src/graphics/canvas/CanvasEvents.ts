export class CanvasEvent {
    constructor(canvas) {
        this.canvas = canvas;
    }
}

export class CanvasResizeEvent extends CanvasEvent {
    constructor(canvas, oldWidth, oldHeight, width, height) {
        super(canvas);
        this.oldWidth = oldWidth;
        this.oldHeight = oldHeight;
        this.width = width;
        this.height = height;
    }
}
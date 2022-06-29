export class CanvasResizeEvent {
    constructor(canvas, oldWidth, oldHeight, width, height) {
        this.canvas = canvas;
        this.oldWidth = oldWidth;
        this.oldHeight = oldHeight;
        this.width = width;
        this.height = height;
    }
}
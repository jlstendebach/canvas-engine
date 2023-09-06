import { View } from "../View.js"

export class ShapeView extends View {
    constructor() {
        super();
        this.fillStyle = "white";
        this.strokeStyle = "black";
        this.strokeWidth = 1;
        this.strokeDash = [];
    }

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return false;
    }


    // --[ style ]--------------------------------------------------------------
    setFillStyle(style) { this.fillStyle = style; }
    getFillStyle() { return this.fillStyle; }

    setStrokeStyle(style) { this.strokeStyle = style; }
    getStrokeStyle() { return this.strokeStyle; }

    setStrokeWidth(width) { this.strokeWidth = width; }
    getStrokeWidth() { return this.strokeWidth; }

    setStrokeDash(dash) { this.strokeDash = dash; }
    getStrokeDash() { return this.strokeDash; }


    // --[ drawing ]------------------------------------------------------------
    path(context) { }

    fill(context) {
        let fillStyle = this.getFillStyle();
        if (fillStyle !== null) {
            context.fillStyle = fillStyle;
            context.fill();
        }
    }

    stroke(context) {
        if (this.isStroke()) {
            context.lineWidth = this.strokeWidth;
            context.strokeStyle = this.strokeStyle;
            context.setLineDash(this.strokeDash);
            context.stroke();
        }
    }

    drawSelf(context) {
        context.beginPath();
        if (this.isStroke()) {
            context.translate(0.5, 0.5);
            this.path(context);
            context.translate(-0.5, -0.5);    
        } else {
            this.path(context);
        }
        this.fill(context);
        this.stroke(context);
    }

    // --[ helpers ]------------------------------------------------------------
    isStroke() {
        return this.strokeStyle != null && this.strokeWidth > 0;
    }
}
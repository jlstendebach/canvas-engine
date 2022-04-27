import { View } from "../View.js"
import { Vec2 } from "../../../math/index.js"

export class VectorView extends View {
    constructor() {
        super();

        this.position = new Vec2(0, 0);
        this.vector = new Vec2(0, 0);

        this.strokeWidth = 3;
        this.isDashed = false;
        this.arrowWidth = 16;
        this.arrowHeight = 20;

        this.color = "#000";
    }

    // --[ bounds ]---------------------------------------------------------------
    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    getMidX() { return this.getX() + this.vector.x / 2; }
    getMidY() { return this.getY() + this.vector.y / 2; }

    getEndX() { return this.getX() + this.vector.x; }
    getEndY() { return this.getY() + this.vector.y; }

    isInBounds(x, y) { return false; }

    // --[ style ]----------------------------------------------------------------
    setStrokeWidth(w) { this.strokeWidth = w; }
    getStrokeWidth() { return this.strokeWidth; }

    setStrokeDashed(dashed) { this.isDashed = dashed; }
    isStrokeDashed() { return this.isDashed; }

    // --[ arrow ]----------------------------------------------------------------
    setArrowWidth(w) { this.arrowWidth = w; }
    getArrowWidth() { return this.arrowWidth; }

    setArrowHeight(h) { this.arrowHeight = h; }
    getArrowHeight() { return this.arrowHeight; }

    // --[ drawing ]--------------------------------------------------------------
    drawArrow(context) {
        const arrowMidScale = 0.8;

        const arrowHeight = Math.min(this.vector.length(), this.arrowHeight);
        const arrowWidth = this.arrowWidth * (arrowHeight / this.arrowHeight);

        const normal = Vec2.normal(this.vector).setLength(arrowWidth / 2);
        const inverse = Vec2.invert(this.vector).setLength(arrowHeight);

        const p1 = new Vec2(this.getEndX(), this.getEndY());
        const p2 = Vec2.add(p1, inverse).add(normal);
        const p3 = Vec2.add(p1, Vec2.mult(inverse, arrowMidScale));
        const p4 = Vec2.sub(p2, normal).sub(normal);

        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.lineTo(p4.x, p4.y);
        context.closePath();
        context.fill();

        return arrowHeight * arrowMidScale;
    }

    drawLine(context, arrowHeight) {
        const newMag = this.vector.length() - arrowHeight;
        const scaled = this.vector.copy().setLength(newMag);

        context.beginPath();
        context.moveTo(this.getX(), this.getY());
        context.lineTo(this.getX() + scaled.x, this.getY() + scaled.y);
        context.stroke();
    }

    drawSelf(context) {
        context.fillStyle = this.color;
        context.lineCap = "round"
        context.lineWidth = this.strokeWidth;
        context.setLineDash(this.isStrokeDashed() ? [this.strokeWidth * 2, this.strokeWidth * 3] : []);
        context.strokeStyle = this.color;

        let arrowHeight = this.drawArrow(context);
        this.drawLine(context, arrowHeight);
    }

}
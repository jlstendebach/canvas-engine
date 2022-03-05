import { View } from "./View.js"
import { Vec2Field } from "../../math/Math.js"

export class Vec2FieldView extends View {
    constructor(w, h) {
        super();
        this.field = new Vec2Field(1, 1);
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
        this.scale = 10;
    }

    // -------------------------------------------------------------------------
    isInBounds(x, y) {
        return (
            x >= this.getX()
            && x < this.getX() + this.getWidth()
            && y >= this.getY()
            && y < this.getY() + this.getHeight()
        );
    }

    setX(x) { this.x = x; }
    getX() { return this.x; }

    setY(y) { this.y = y; }
    getY() { return this.y; }

    setWidth(w) { this.w = w; }
    getWidth() { return this.w; }
    setHeight(h) { this.h = h; }
    getHeight() { return this.h; }

    getVector(x, y) {
        return this.field.getVector((x - this.getX()) / this.w, (y - this.getY()) / this.h);
    }

    // --[ drawing ]------------------------------------------------------------
    drawSelf(context) {
        context.save();
        context.translate(this.getX(), this.getY());

        context.strokeStyle = "red";
        context.fillStyle = "red";

        this.drawBounds(context);
        //this.drawDots(context);
        this.drawVectors(context);

        context.restore();
    }

    drawBounds(context) {
        context.beginPath();
        context.rect(0, 0, this.getWidth(), this.getHeight());
        context.stroke();
    }

    drawDots(context) {

        for (var x = 0; x < this.field.getWidth(); x++) {
            for (var y = 0; y < this.field.getHeight(); y++) {
                var draw_x = this.getWidth() * x / (this.field.getWidth() - 1);
                var draw_y = this.getHeight() * y / (this.field.getHeight() - 1);

                // draw a dot
                context.beginPath();
                context.arc(draw_x, draw_y, 1, 0, 2 * Math.PI);
                context.fill();
            }
        }

    }

    drawVectors(context) {
        context.beginPath();

        for (var x = 0; x < this.field.getWidth(); x++) {
            for (var y = 0; y < this.field.getHeight(); y++) {
                var draw_x = this.getWidth() * x / (this.field.getWidth() - 1);
                var draw_y = this.getHeight() * y / (this.field.getHeight() - 1);
                var vec = this.field.getVector(x, y);

                // draw the vector
                context.moveTo(draw_x, draw_y);
                context.lineTo(draw_x + vec.x * this.scale, draw_y + vec.y * this.scale);
            }
        }

        context.stroke();
    }
}

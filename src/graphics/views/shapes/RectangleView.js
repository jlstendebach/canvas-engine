import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/Math.js"

export class RectangleView extends ShapeView {
    constructor(w, h) {
        super();
        this.position = new Vec2();
        this.size = new Vec2(w, h);
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return (
            x >= this.getX()
            && x < this.getX() + this.getWidth()
            && y >= this.getY()
            && y < this.getY() + this.getHeight()
        );
    }

    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    setWidth(w) { this.size.x = w; }
    getWidth() { return this.size.x; }

    setHeight(h) { this.size.y = h; }
    getHeight() { return this.size.y; }


    // --[ drawing ]------------------------------------------------------------
    path(context) {
        context.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }

}
import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class CircleView extends ShapeView {
    constructor(r) {
        super();
        this.position = new Vec2();
        this.radius = r;
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return (
            Math.sqrt((this.position.x - x) ** 2 + (this.position.y - y) ** 2) <= this.radius
        );
    }

    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    setRadius(r) { this.radius = r; }
    getRadius() { return this.radius; }


    // --[ drawing ]------------------------------------------------------------
    path(context) {
        context.arc(this.getX(), this.getY(), this.getRadius(), 0, 2 * Math.PI);
    }

}
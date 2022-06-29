import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class LineView extends ShapeView {
    constructor(x1, y1, x2, y2) {
        super()
        this.p1 = new Vec2(x1, y1);
        this.p2 = new Vec2(x2, y2);
    }

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) { return false; }

    getX() { return this.p1.x; }
    getY() { return this.p1.y; }

    /************/
    /* vertex 1 */
    /************/
    setPoint1(x, y) {
        if (!isNaN(x) && !isNaN(y)) { // assume numbers
            this.p1.set(x, y);

        } else if (x instanceof Vec2) { // assume Vec2
            this.p1.set(x.x, x.y);
        }
    }
    setX1(x) { this.p1.x = x; }
    setY1(y) { this.p1.y = y; }

    getPoint1() { return this.p1; }
    getX1() { return this.p1.x; }
    getY1() { return this.p1.y; }

    /***********/
    /* point 2 */
    /***********/
    setPoint2(x, y) {
        if (!isNaN(x) && !isNaN(y)) { // assume numbers
            this.p2.set(x, y);

        } else if (x instanceof Vec2) { // assume Vec2
            this.p2.set(x.x, x.y);
        }
    }
    setX2(x) { this.p2.x = x; }
    setY2(y) { this.p2.y = y; }

    getPoint2() { return this.p2; }
    getX2() { return this.p2.x; }
    getY2() { return this.p2.y; }

    // --[ drawing ]------------------------------------------------------------
    path(context) {
        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
    }

    fill(context) { }

}
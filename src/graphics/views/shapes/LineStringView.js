import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/Math.js"

export class LineStringView extends ShapeView {
    constructor(points) {
        super()
        this.points = points || [];
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return false;
    }

    getX() {
        let v = this.getPoint(0);
        return (typeof v !== "undefined" && v !== null) ? v.x : 0;
    }
    getY() {
        let v = this.getPoint(0);
        return (typeof v !== "undefined" && v !== null) ? v.y : 0;
    }


    // --[ points ]-------------------------------------------------------------
    addPoint(x, y) {
        if (x instanceof Vec2) { // Vec2 provided
            this.points.push(x);

        } else if (!isNaN(x) && !isNaN(y)) { // numbers provided
            this.points.push(new Vec2(x, y));
        }
    }

    getPoint(index) {
        return this.points[index];
    }

    getPointCount() {
        return this.points.length;
    }

    clear() {
        this.points = [];
    }


    // --[ drawing ]------------------------------------------------------------
    path(context) {
        let count = this.getPointCount();
        if (count >= 2) {
            context.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < count; ++i) {
                context.lineTo(this.points[i].x, this.points[i].y);
            }
        }
    }

    fill(context) { }

}
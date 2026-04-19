import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class LineStringView extends ShapeView {
    constructor(points) {
        super()
        this.position = new Vec2();
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
            let p = this.points[0];
            context.moveTo(this.position.x + p.x, this.position.y + p.y);
            for (let i = 1; i < count; ++i) {
                p = this.points[i];
                context.lineTo(this.position.x + p.x, this.position.y + p.y);
            }
        }

    }

    fill(context) { }

}
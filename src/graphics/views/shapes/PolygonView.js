import { ShapeView } from "./ShapeView.js";

export class PolygonView extends ShapeView {
    #points = [];

    // MARK: - Properties
    set points(points) {
        if (!Array.isArray(points)) {
            throw new TypeError("Points must be an array of Vec2 objects.");
        }
        this.#points = points;
    }

    get points() {
        return this.#points;
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.#points = options.points ?? [];
    }

    // MARK: - Hit Testing
    containsPoint(point) {
        const target = point.clone().subtract(this.position);

        let isInside = false;

        for (let i = 0, j = this.#points.length - 1; i < this.#points.length; j = i++) {
            const p1 = this.#points[i];
            const p2 = this.#points[j];

            // Ensure the target is between the y-coordinates of the edge. If 
            // the target is above or below both points, it cannot intersect 
            // with the edge.
            if ((target.y < p1.y) === (target.y < p2.y)) {
                continue;
            }

            // m = (y2 - y1) / (x2 - x1)
            // x = x1 + (y - y1) / m 
            //   = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            const x = p1.x + ((target.y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y);
            if (x === target.x) {
                // The target is on the edge, so we consider it to be inside.
                return true;
            }

            // Is target to the left of the intersection point?
            if (target.x < x) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    // MARK: - Drawing
    path(context) {
        if (this.#points.length < 3) {
            return;
        }
        context.moveTo(this.#points[0].x, this.#points[0].y);
        for (let i = 1; i < this.#points.length; ++i) {
            context.lineTo(this.#points[i].x, this.#points[i].y);
        }
        context.closePath();
    }

}
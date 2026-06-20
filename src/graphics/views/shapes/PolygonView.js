import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

export class PolygonView extends ShapeView {
    #points = [];

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.#points = options.points ?? [];
    }

    // MARK: - Hit Testing
    isInBounds(point) {
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

            const side = p1.x + (target.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) - target.x;
            if (side === 0) {
                // The target is on the edge, so we consider it to be inside.
                return true;
            }

            if (side > 0) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    // MARK: - Points
    addPoint(point) {
        if (!(point instanceof Vec2)) {
            throw new TypeError("Point must be an instance of Vec2");
        }
        this.#points.push(point);
    }

    removePoint(index) {
        this.#points.splice(index, 1);
    }

    removeAllPoints() {
        this.#points = [];
    }

    getPoint(index) {
        return this.#points[index];
    }

    getPointCount() {
        return this.#points.length;
    }


    // MARK: - Drawing
    path(context) {
        console.log(this.#points.length);
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
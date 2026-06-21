import { ShapeView } from "./ShapeView.js";

export class LineStringView extends ShapeView {
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
        this.points = options.points ?? [];
    }

    // MARK: - Hit Testing
    isInBounds(point) {
        void point;
        return false;
    }

    // MARK: - Drawing
    path(context) {
        if (this.points.length < 2) {
            return;
        }

        let point = this.#points[0];
        context.moveTo(point.x, point.y);
        for (let i = 1; i < this.#points.length; i++) {
            point = this.#points[i];
            context.lineTo(point.x, point.y);
        }
    }

    fill(context) {
        // No fill for line strings
        void context;
    }

    // MARK: - Helpers
    #isPointOnLineSegment(point, start, end) {
        

    }
}
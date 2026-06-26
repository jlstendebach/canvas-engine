import { ShapeView } from "./ShapeView.js";
import { Vec2 } from "../../../math/Vec2.js";

export class LineView extends ShapeView {
    #points = [];

    // MARK: - Properties
    set points(points) {
        if (!Array.isArray(points)) {
            throw new TypeError("Points must be an array of Vec2 objects.");
        }
        this.#points = points;
        this.invalidateBounds();
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
    updateBounds(out) {
        if (this.#points.length === 0) {
            out.set(0, 0, 0, 0);
            return;
        }
        for (let i = 0; i < this.#points.length; i++) {
            out.addPoint(this.#points[i]);
        }
    }

    containsPoint(point) {
        if (!this.bounds.containsPoint(point)) {
            return false;
        }

        for (let i = 0; i < this.#points.length - 1; i++) {
            const start = this.#points[i];
            const end = this.#points[i + 1];
            if (this.#isPointOnLineSegment(point, start, end)) {
                return true;
            }
        }
        return false;
    }

    // MARK: - Drawing
    path(context) {
        if (this.points.length < 2) {
            return;
        }
        context.moveTo(this.#points[0].x, this.#points[0].y);
        for (let i = 1; i < this.#points.length; i++) {
            context.lineTo(this.#points[i].x, this.#points[i].y);
        }
    }

    fill(context) {
        // No fill for lines
        void context;
    }

    // MARK: - Helpers
    #isPointOnLineSegment(point, start, end) {
        const lineVec = end.clone().subtract(start);
        const pointVec = point.clone().subtract(start);

        // If the dot is negative, the point is before the start of the line.
        const dot = pointVec.dot(lineVec);
        if (dot < 0) {
            return false;
        }

        // If the projection is longer than the line, the point is past the end 
        // of the line.
        const scale = dot / lineVec.lengthSq();
        const projection = Vec2.scale(lineVec, scale);
        if (projection.length() > lineVec.length()) {
            return false;
        }

        // If the rejection is longer than half the stroke width, the point is 
        // too far from the line.
        const rejection = Vec2.subtract(pointVec, projection);
        const halfWidth = this.strokeWidth / 2;
        if (rejection.length() > halfWidth) {
            return false;
        }

        return true;  
    }
}
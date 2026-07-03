import { Vec2 } from "../../../math/Vec2.js";
import { Point } from "../../utils/Point.js";
import { PointList } from "../../utils/PointList.js";
import { ShapeView } from "./ShapeView.js";

export class LineView extends ShapeView {
    #pointList = new PointList(this.invalidateBounds.bind(this));

    // MARK: - Getters
    getPointCount() {
        return this.#pointList.getPointCount();
    }

    getPoint(index, out = new Point()) {
        return this.#pointList.getPoint(index, out);
    }

    getPointX(index) {
        return this.#pointList.getPointX(index);
    }

    getPointY(index) {
        return this.#pointList.getPointY(index);
    }

    // MARK: - Setters
    setPoint(index, x, y) {
        this.#pointList.setPoint(index, x, y);
        return this;
    }

    setPointX(index, x) {
        this.#pointList.setPointX(index, x);
        return this;
    }

    setPointY(index, y) {
        this.#pointList.setPointY(index, y);
        return this;
    }

    // MARK: - Modifiers
    addPoint(x, y) {
        this.#pointList.addPoint(x, y);
        return this;
    }

    insertPoint(index, x, y) {
        this.#pointList.insertPoint(index, x, y);
        return this;
    }

    removePoint(index) {
        this.#pointList.removePoint(index);
        return this;
    }

    clearPoints() {
        this.#pointList.clearPoints();
        return this;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        const rawPoints = this.#pointList.getRawPoints();
        const length = rawPoints.length;

        out.reset();

        if (length < 4) { return; }

        for (let i = 0; i < length; i += 2) {
            out.addPointXY(rawPoints[i], rawPoints[i + 1]);
        }
    }

    containsPoint(point) {
        const rawPoints = this.#pointList.getRawPoints();
        const length = rawPoints.length;

        if (length < 4) { return false; }
        if (!this.bounds.containsPoint(point)) { return false; }

        for (let i = 0; i <= length - 4; i += 2) {
            const x1 = rawPoints[i];
            const y1 = rawPoints[i + 1];
            const x2 = rawPoints[i + 2];
            const y2 = rawPoints[i + 3];
            if (this.#isPointOnLineSegment(point.x, point.y, x1, y1, x2, y2)) {
                return true;
            }
        }

        return false;
    }

    // MARK: - Drawing
    path(context) {
        const rawPoints = this.#pointList.getRawPoints();
        const length = rawPoints.length;

        if (length < 4) { return; }

        context.moveTo(rawPoints[0], rawPoints[1]);
        for (let i = 2; i < length; i += 2) {
            context.lineTo(rawPoints[i], rawPoints[i + 1]);
        }
    }

    fill(context) {
        // No fill for lines
        void context;
    }

    // MARK: - Helpers
    #isPointOnLineSegment(targetX, targetY, x1, y1, x2, y2) {
        const lineVec = new Vec2(x2 - x1, y2 - y1);
        const pointVec = new Vec2(targetX - x1, targetY - y1);

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
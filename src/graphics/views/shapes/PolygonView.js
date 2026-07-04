import { Point } from "../../utils/Point.js";
import { PointList } from "../../utils/PointList.js";
import { ShapeView } from "./ShapeView.js";

export class PolygonView extends ShapeView {
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
        if (length < 6) { return; }

        for (let i = 0; i < length; i += 2) {
            out.addPointXY(rawPoints[i], rawPoints[i + 1]);
        }
    }

    containsPoint(point) {
        const rawPoints = this.#pointList.getRawPoints();
        const length = rawPoints.length;
        if (length < 6) { return false; }
        if (!this.bounds.containsPoint(point)) { return false; }

        let isInside = false;

        let j = length - 2;
        for (let i = 0; i < length; i++) {
            const x1 = rawPoints[i];
            const y1 = rawPoints[i + 1];
            const x2 = rawPoints[j];
            const y2 = rawPoints[j + 1];
            j = i;

            // Ensure the target is between the y-coordinates of the edge. If 
            // the target is above or below both points, it cannot intersect 
            // with the edge.
            if ((point.y < y1) === (point.y < y2)) {
                continue;
            }

            // m = (y2 - y1) / (x2 - x1)
            // x = x1 + (y - y1) / m 
            //   = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            const x = x1 + ((point.y - y1) * (x2 - x1)) / (y2 - y1);
            if (x === point.x) {
                // The target is on the edge, so we consider it to be inside.
                return true;
            }

            // Is target to the left of the intersection point?
            if (point.x < x) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    // MARK: - Drawing
    path(context) {
        const rawPoints = this.#pointList.getRawPoints();
        const length = rawPoints.length;
        if (length < 6) { return; }

        context.moveTo(rawPoints[0], rawPoints[1]);
        for (let i = 2; i < length; i += 2) {
            context.lineTo(rawPoints[i], rawPoints[i + 1]);
        }
        context.closePath();
    }

}
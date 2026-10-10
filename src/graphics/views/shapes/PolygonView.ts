import { Vec2 } from "../../../math/Vec2.js";
import { PointList } from "../../utils/PointList.js";
import { ShapeView } from "./ShapeView.js";

export class PolygonView extends ShapeView {
    #pointList: PointList = new PointList(this.invalidateBounds.bind(this));

    // MARK: - Getters
    getPointCount(): number {
        return this.#pointList.getPointCount();
    }

    getPoint(index: number, out: Vec2 = new Vec2()): Vec2 {
        return this.#pointList.getPoint(index, out);
    }

    getPointX(index: number): number {
        return this.#pointList.getPointX(index);
    }

    getPointY(index: number): number {
        return this.#pointList.getPointY(index);
    }

    // MARK: - Setters
    setPointXY(index: number, x: number, y: number): this {
        this.#pointList.setPointXY(index, x, y);
        return this;
    }

    setPointX(index: number, x: number): this {
        this.#pointList.setPointX(index, x);
        return this;
    }

    setPointY(index: number, y: number): this {
        this.#pointList.setPointY(index, y);
        return this;
    }

    setPoint(index: number, point: Vec2): this {
        this.#pointList.setPoint(index, point);
        return this;
    }

    setPointsXY(points: number[]): this {
        this.#pointList.setPointsXY(points);
        return this;
    }

    setPoints(points: Vec2[]): this {
        this.#pointList.setPoints(points);
        return this;
    }

    // MARK: - Modifiers
    addPointXY(x: number, y: number): this {
        this.#pointList.addPointXY(x, y);
        return this;
    }

    addPoint(point: Vec2): this {
        this.#pointList.addPoint(point);
        return this;
    }

    insertPointXY(index: number, x: number, y: number): this {
        this.#pointList.insertPointXY(index, x, y);
        return this;
    }

    insertPoint(index: number, point: Vec2): this {
        this.#pointList.insertPoint(index, point);
        return this;
    }

    removePoint(index: number): this {
        this.#pointList.removePoint(index);
        return this;
    }

    clearPoints(): this {
        this.#pointList.clearPoints();
        return this;
    }

    // MARK: - Hit Testing
    override updateBounds(out: Bounds): void {
        const rawPoints = this.#pointList.unsafeGetPoints();
        const length = rawPoints.length;
        out.reset();
        if (length < 6) { return; }

        for (let i = 0; i < length; i += 2) {
            out.addPointXY(rawPoints[i], rawPoints[i + 1]);
        }
    }

    override containsPoint(point: Vec2): boolean {
        const rawPoints = this.#pointList.unsafeGetPoints();
        const length = rawPoints.length;
        if (length < 6) { return false; }
        if (!this.bounds.containsPoint(point)) { return false; }

        let isInside = false;

        let j = length - 2;
        for (let i = 0; i < length; i += 2) {
            const x2 = rawPoints[i];
            const y2 = rawPoints[i + 1];
            const x1 = rawPoints[j];
            const y1 = rawPoints[j + 1];
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
    override path(context: CanvasRenderingContext2D): void {
        const rawPoints = this.#pointList.unsafeGetPoints();
        const length = rawPoints.length;
        if (length < 6) { return; }

        context.moveTo(rawPoints[0], rawPoints[1]);
        for (let i = 2; i < length; i += 2) {
            context.lineTo(rawPoints[i], rawPoints[i + 1]);
        }
        context.closePath();
    }

}
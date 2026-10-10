import type { Bounds } from "../../../math/Bounds.js";
import { Vec2 } from "../../../math/Vec2.js";
import { PointList } from "../../utils/PointList.js";
import { ShapeView } from "./ShapeView.js";

export class LineView extends ShapeView {
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

        if (length < 4) { return; }

        for (let i = 0; i < length; i += 2) {
            out.addPointXY(rawPoints[i], rawPoints[i + 1]);
        }
    }

    override containsPoint(point: Vec2): boolean {
        const rawPoints = this.#pointList.unsafeGetPoints();
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
    override path(context: CanvasRenderingContext2D): void {
        const rawPoints = this.#pointList.unsafeGetPoints();
        const length = rawPoints.length;

        if (length < 4) { return; }

        context.moveTo(rawPoints[0], rawPoints[1]);
        for (let i = 2; i < length; i += 2) {
            context.lineTo(rawPoints[i], rawPoints[i + 1]);
        }
    }

    override fill(context: CanvasRenderingContext2D): void {
        // No fill for lines
        void context;
    }

    // MARK: - Helpers
    #isPointOnLineSegment(
        targetX: number,
        targetY: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): boolean {
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
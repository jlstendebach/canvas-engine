import { Vec2 } from "../../math/Vec2.js";

export class PointList {
    #points: number[] = [];
    #onChange?: () => void;

    constructor(onChange?: () => void) {
        this.#onChange = onChange;
    }

    // MARK: - Getters
    getPointCount(): number {
        return this.#points.length / 2;
    }

    getPoint(index: number, out: Vec2 = new Vec2()): Vec2 {
        const actualIndex = index * 2;
        return out.set(this.#points[actualIndex], this.#points[actualIndex + 1]);
    }

    getPointX(index: number): number {
        return this.#points[index * 2];
    }

    getPointY(index: number): number {
        return this.#points[index * 2 + 1];
    }

    // MARK: - Setters
    setPointXY(index: number, x: number, y: number): void {
        this.#assertIndex(index);
        const actualIndex = index * 2;
        if (this.#points[actualIndex] === x && this.#points[actualIndex + 1] === y) {
            return;
        }
        this.#points[actualIndex] = x;
        this.#points[actualIndex + 1] = y;
        this.#onChange?.();
    }

    setPointX(index: number, x: number): void {
        this.#assertIndex(index);
        const actualIndex = index * 2;
        if (this.#points[actualIndex] === x) { return; }
        this.#points[actualIndex] = x;
        this.#onChange?.();
    }

    setPointY(index: number, y: number): void {
        this.#assertIndex(index);
        const actualIndex = index * 2 + 1;
        if (this.#points[actualIndex] === y) { return; }
        this.#points[actualIndex] = y;
        this.#onChange?.();
    }

    setPoint(index: number, point: Vec2): void {
        this.setPointXY(index, point.x, point.y);
    }

    setPointsXY(points: number[]): void {
        this.#points.length = 0;
        for (let i = 0; i <= points.length - 2; i += 2) {
            this.#points.push(points[i], points[i + 1]);
        }
        this.#onChange?.();
    }

    setPoints(points: Vec2[]): void {
        this.#points.length = 0;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            this.#points.push(point.x, point.y);
        }
        this.#onChange?.();
    }

    // MARK: - Modifiers
    addPointXY(x: number, y: number): void {
        this.#points.push(x, y);
        this.#onChange?.();
    }

    addPoint(point: Vec2): void {
        this.addPointXY(point.x, point.y);
    }

    insertPointXY(index: number, x: number, y: number): void {
        this.#assertInsertIndex(index);
        this.#points.splice(index * 2, 0, x, y);
        this.#onChange?.();
    }

    insertPoint(index: number, point: Vec2): void {
        this.insertPointXY(index, point.x, point.y);
    }

    removePoint(index: number): void {
        this.#assertIndex(index);
        this.#points.splice(index * 2, 2);
        this.#onChange?.();
    }

    clearPoints(): void {
        if (this.#points.length === 0) { return; }
        this.#points.length = 0;
        this.#onChange?.();
    }

    // MARK: - Unsafe Access
    /**
     * WARNING: For performance reasons, this returns the raw underlying array.
     * Treat this as READ-ONLY. Do not push, pop, or mutate the points.
     * @returns The raw underlying array of points.
     */
    unsafeGetPoints(): readonly number[] {
        return this.#points;
    }

    // MARK: - Helpers
    #assertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.getPointCount()) {
            throw new RangeError(`Point index out of bounds: ${index} (length: ${this.getPointCount()})`);
        }
    }

    #assertInsertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index > this.getPointCount()) {
            throw new RangeError(`Insert index out of bounds: ${index} (length: ${this.getPointCount()})`);
        }
    }
}
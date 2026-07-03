import { Point } from "./Point.js";

export class PointList {
    #points = [];
    #onChange;

    constructor(onChange = null) {
        this.#onChange = onChange;
    }

    // MARK: - Getters
    getPointCount() {
        return this.#points.length / 2;
    }

    getPoint(index, out = new Point()) {
        const actualIndex = index * 2;
        return out.set(this.#points[actualIndex], this.#points[actualIndex + 1]);
    }

    getPointX(index) {
        return this.#points[index * 2];
    }

    getPointY(index) {
        return this.#points[index * 2 + 1];
    }

    // MARK: - Setters
    setPoint(index, x, y) {
        this.#assertIndex(index);
        const actualIndex = index * 2;
        if (this.#points[actualIndex] === x && this.#points[actualIndex + 1] === y) {
            return;
        }
        this.#points[actualIndex] = x;
        this.#points[actualIndex + 1] = y;
        this.#onChange?.();
    }

    setPointX(index, x) {
        this.#assertIndex(index);
        const actualIndex = index * 2;
        if (this.#points[actualIndex] === x) { return; }
        this.#points[actualIndex] = x;
        this.#onChange?.();
    }

    setPointY(index, y) {
        this.#assertIndex(index);
        const actualIndex = index * 2 + 1;
        if (this.#points[actualIndex] === y) { return; }
        this.#points[actualIndex] = y;
        this.#onChange?.();
    }

    // MARK: - Modifiers
    addPoint(x, y) {
        this.#points.push(x, y);
        this.#onChange?.();
    }

    insertPoint(index, x, y) {
        this.#assertInsertIndex(index);
        this.#points.splice(index * 2, 0, x, y);
        this.#onChange?.();
    }

    removePoint(index) {
        this.#assertIndex(index);
        this.#points.splice(index * 2, 2);
        this.#onChange?.();
    }

    clearPoints() {
        if (this.#points.length === 0) { return; }
        this.#points.length = 0;
        this.#onChange?.();
    }

    // MARK: - Unsafe Access
    /**
     * WARNING: For performance reasons, this returns the raw underlying array.
     * Treat this as READ-ONLY. Do not push, pop, or mutate the points.
     * @returns {readonly number[]}
     */
    getRawPoints() {
        return this.#points;
    }

    // MARK: - Helpers
    #assertIndex(index) {
        if (!Number.isInteger(index) || index < 0 || index >= this.getPointCount()) {
            throw new RangeError(`Point index out of bounds: ${index} (length: ${this.getPointCount()})`);
        }
    }

    #assertInsertIndex(index) {
        if (!Number.isInteger(index) || index < 0 || index > this.getPointCount()) {
            throw new RangeError(`Insert index out of bounds: ${index} (length: ${this.getPointCount()})`);
        }
    }
}
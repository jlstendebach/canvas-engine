import { Vec2 } from "../../../math/Vec2.js";
import { PolygonView } from "./PolygonView.js";
import { ShapeView } from "./ShapeView.js";

export class VectorView extends ShapeView {
    #vector = new Vec2();
    #arrowWidth;
    #arrowHeight;

    #polygon = new PolygonView();
    #isPathDirty = true;

    // MARK: - Accessors
    get vectorX() {
        return this.#vector.x;
    }
    set vectorX(value) {
        this.setVectorX(value);
    }

    get vectorY() {
        return this.#vector.y;
    }
    set vectorY(value) {
        this.setVectorY(value);
    }

    get arrowWidth() {
        return this.#arrowWidth;
    }
    set arrowWidth(value) {
        this.setArrowWidth(value);
    }

    get arrowHeight() {
        return this.#arrowHeight;
    }
    set arrowHeight(value) {
        this.setArrowHeight(value);
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.#vector.x = options.vector?.x ?? 0;
        this.#vector.y = options.vector?.y ?? 0;
        this.#arrowWidth = options.arrowWidth ?? 16;
        this.#arrowHeight = options.arrowHeight ?? 20;
    }

    // MARK: - Vector
    getVector(out = new Vec2()) {
        return out.copy(this.#vector);
    }

    setVectorXY(x, y) {
        if (this.#vector.x === x && this.#vector.y === y) { return this; }
        this.#vector.set(x, y);
        this.#invalidatePath();
        return this;
    }

    setVectorX(x) {
        if (this.#vector.x === x) { return this; }
        this.#vector.x = x;
        this.#invalidatePath();
        return this;
    }

    setVectorY(y) {
        if (this.#vector.y === y) { return this; }
        this.#vector.y = y;
        this.#invalidatePath();
        return this;
    }

    setVector(vector) {
        return this.setVectorXY(vector.x, vector.y);
    }

    setVectorLength(length) {
        this.#vector.setLength(length);
        this.#invalidatePath();
        return this;
    }

    // MARK: - Arrow
    setArrowWidth(width) {
        if (this.#arrowWidth === width) { return this; }
        this.#arrowWidth = width;
        this.#invalidatePath();
        return this;
    }

    setArrowHeight(height) {
        if (this.#arrowHeight === height) { return this; }
        this.#arrowHeight = height;
        this.#invalidatePath();
        return this;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        this.#updatePathIfDirty();
        this.#polygon.updateBounds(out);
    }

    containsPoint(point) { 
        this.#polygon.transform.copy(this.transform);
        return this.#polygon.containsPoint(point);
    }

    // MARK: - Drawing
    path(context) {
        this.#updatePathIfDirty();
        this.#polygon.path(context);
    }

    // MARK: - Helpers
    #invalidatePath() {
        this.#isPathDirty = true;
        this.invalidateBounds();
    }

    #updatePathIfDirty() {
        if (!this.#isPathDirty) { return; }
        this.#isPathDirty = false;

        const vector = this.#vector.clone();
        const vectorLength = vector.length();
        if (vectorLength < 1) {
            this.#polygon.points = [];
            return;
        }
        
        const arrowHeight = Math.min(vectorLength, this.#arrowHeight);
        const arrowWidth = (this.#arrowWidth * arrowHeight) / this.#arrowHeight;
        const normal = Vec2.normal(vector).scale(arrowWidth / (2 * vectorLength));
        const lineLength = vectorLength - arrowHeight;
        const point = vector.clone().setLength(lineLength);
        
        const points = [
            new Vec2(),
            point.clone(),
            point.add(normal).clone(),
            vector.clone(),
            point.subtract(normal).subtract(normal).clone(),
            point.add(normal).clone()
        ];

        this.#polygon.setPoints(points);
    }

}
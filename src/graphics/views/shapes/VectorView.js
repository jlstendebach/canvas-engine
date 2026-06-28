import { Vec2 } from "../../../math/Vec2.js";
import { PolygonView } from "./PolygonView.js";
import { ShapeView } from "./ShapeView.js";

export class VectorView extends ShapeView {
    #vector = new Vec2();
    #arrowWidth;
    #arrowHeight;

    #polygon = new PolygonView();
    #isPathDirty = true;

    // MARK: - Properties
    set vector(value) { 
        if (this.#vector.equals(value)) { return; }
        this.#vector.copy(value);
        this.#invalidatePath();
    }
    get vector() {
        return this.#vector;
    }

    set arrowWidth(value) {
        if (this.#arrowWidth === value) { return; }
        this.#arrowWidth = value;
        this.#isPathDirty = true;
    }
    get arrowWidth() {
        return this.#arrowWidth;
    }

    set arrowHeight(value) {
        if (this.#arrowHeight === value) { return; }
        this.#arrowHeight = value;
        this.#isPathDirty = true;
    }
    get arrowHeight() {
        return this.#arrowHeight;
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.#vector.x = options.vector?.x ?? 0;
        this.#vector.y = options.vector?.y ?? 0;
        this.#arrowWidth = options.arrowWidth ?? 16;
        this.#arrowHeight = options.arrowHeight ?? 20;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        this.#polygon.updateBounds(out);
    }

    containsPoint(point) { 
        return this.#polygon.containsPoint(point);
    }

    // MARK: - Drawing
    path(context) {
        this.#updatePathIfDirty();
        let point = this.#polygon.points[0];
        context.moveTo(point.x, point.y);
        for (let i = 1; i < this.#polygon.points.length; ++i) {
            point = this.#polygon.points[i];
            context.lineTo(point.x, point.y);
        }
    }

    // MARK: - Helpers
    #invalidatePath() {
        this.#isPathDirty = true;
    }

    #updatePathIfDirty() {
        if (!this.#isPathDirty) { 
            return;
        }
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
        
        this.#polygon.points = [
            new Vec2(),
            point.clone(),
            point.add(normal).clone(),
            vector.clone(),
            point.subtract(normal).subtract(normal).clone(),
            point.add(normal).clone()
        ]

        this.#polygon.invalidateBounds();
        this.invalidateBounds();
    }

}
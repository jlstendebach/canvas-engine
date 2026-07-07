import { ShapeView } from "./ShapeView.js";

const TAU = Math.PI * 2;

export class CircleView extends ShapeView {
    #radius;

    // MARK: - Accessors
    get radius() {
        return this.#radius;
    }
    set radius(value) {
        this.setRadius(value);
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.radius = options.radius ?? 10;
    }

    // MARK: - Radius
    setRadius(radius) {
        if (radius === this.#radius) { return this; }
        this.#radius = radius;
        this.invalidateBounds();
        return this;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        out.set(-this.#radius, -this.#radius, this.#radius, this.#radius);
    }

    containsPoint(point) {
        if (!this.bounds.containsPoint(point)) {
            return false;
        }
        return point.x * point.x + point.y * point.y <= this.#radius * this.#radius;
    }

    // MARK: - Drawing
    path(context) {
        context.arc(0, 0, this.#radius, 0, TAU);
    }

}
import { Bounds } from "../../../math/Bounds.js";
import { ShapeView } from "./ShapeView.js";

export class CircleView extends ShapeView {
    static #TAU = Math.PI * 2;
    #radius;

    // MARK: - Properties
    set radius(r) { 
        if (r === this.#radius) { return; }
        this.#radius = r; 
        this.invalidateBounds();
    }
    get radius() { 
        return this.#radius; 
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.radius = options.radius ?? 10;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        out.set(-this.#radius, -this.#radius, this.#radius, this.#radius);
    }

    containsPoint(point) {
        if (!this.bounds.containsPoint(point)) {
            return false;
        }
        return point.x*point.x + point.y*point.y <= this.#radius*this.#radius;
    }

    // MARK: - Drawing
    path(context) {
        context.arc(0, 0, this.#radius, 0, CircleView.#TAU);
    }

}
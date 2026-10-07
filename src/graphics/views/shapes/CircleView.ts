import type { Bounds } from "../../../math/Bounds.js";
import type { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

const TAU = Math.PI * 2;

export class CircleView extends ShapeView {
    #radius: number = 0;

    // MARK: - Accessors
    get radius(): number {
        return this.#radius;
    }
    set radius(value: number) {
        this.setRadius(value);
    }

    // MARK: - Initialization
    constructor(radius: number = 10) {
        super();
        this.radius = radius;
    }

    // MARK: - Radius
    setRadius(radius: number): this {
        if (radius === this.#radius) { return this; }
        this.#radius = radius;
        this.invalidateBounds();
        return this;
    }

    // MARK: - Hit Testing
    override updateBounds(out: Bounds): void {
        out.set(-this.#radius, -this.#radius, this.#radius, this.#radius);
    }

    override containsPoint(point: Vec2): boolean {
        if (!this.bounds.containsPoint(point)) {
            return false;
        }
        return point.x * point.x + point.y * point.y <= this.#radius * this.#radius;
    }

    // MARK: - Drawing
    override path(context: CanvasRenderingContext2D): void {
        context.arc(0, 0, this.#radius, 0, TAU);
    }

}
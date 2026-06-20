import { ShapeView } from "./ShapeView.js";

export class CircleView extends ShapeView {
    static #TAU = Math.PI * 2;
    #radius;

    // MARK: - Properties
    set radius(r) { 
        this.#radius = r; 
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
    isInBounds(point) {
        return (
            Math.sqrt((this.position.x - point.x) ** 2 + (this.position.y - point.y) ** 2) <= this.radius
        );
    }

    // MARK: - Drawing
    path(context) {
        context.arc(0, 0, this.#radius, 0, CircleView.#TAU);
    }

}
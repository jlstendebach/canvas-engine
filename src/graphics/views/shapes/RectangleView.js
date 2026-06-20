import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

export class RectangleView extends ShapeView {
    #size = new Vec2();

    // MARK: - Initialization 
    constructor(options = {}) {
        super(options);
        this.size = options.size ?? new Vec2(10, 10);
    }

    // MARK: - Properties 
    set size(size) { 
        this.#size.set(size.x, size.y); 
    }

    get size() { 
        return this.#size; 
    }

    // MARK: - Hit Testing
    isInBounds(point) {
        return (
            point.x >= this.position.x
            && point.x < this.position.x + this.#size.x
            && point.y >= this.position.y
            && point.y < this.position.y + this.#size.y
        );
    }

    // MARK: - Drawing
    path(context) {
        context.rect(0, 0, this.#size.x, this.#size.y);
    }

}
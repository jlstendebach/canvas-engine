import { Bounds } from "../../../math/Bounds.js";
import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

export class RectangleView extends ShapeView {
    #size = new Vec2();

    // MARK: - Initialization 
    constructor(options = {}) {
        super(options);
        this.size = options.size ?? new Vec2(10, 10);
        this.width = options.width ?? this.size.x;
        this.height = options.height ?? this.size.y;
    }

    // MARK: - Properties 
    set size(size) { 
        this.#size.set(size.x, size.y); 
    }
    get size() { 
        return this.#size; 
    }

    set width(value) {
        this.#size.x = value;
    }
    get width() {
        return this.#size.x;
    }

    set height(value) {
        this.#size.y = value;
    }
    get height() {
        return this.#size.y;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        out.set(0, 0, this.width, this.height);
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }

    // MARK: - Drawing
    path(context) {
        context.rect(0, 0, this.#size.x, this.#size.y);
    }

}
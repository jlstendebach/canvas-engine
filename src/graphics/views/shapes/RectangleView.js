import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

export class RectangleView extends ShapeView {
    #size = new Vec2();

    // MARK: - Accessors 
    set size(value) { 
        if (this.#size.equals(value)) { return; }
        this.#size.copy(value);
        this.invalidateBounds();
    }
    get size() { 
        return this.#size; 
    }

    set width(value) {
        if (this.#size.x === value) { return; }        
        this.#size.x = value;
        this.invalidateBounds();
    }
    get width() {
        return this.#size.x;
    }

    set height(value) {
        if (this.#size.y === value) { return; }
        this.#size.y = value;
        this.invalidateBounds();
    }
    get height() {
        return this.#size.y;
    }

    // MARK: - Initialization 
    constructor(options = {}) {
        super(options);
        this.#size.x = options.width ?? options.size?.x ?? 10;
        this.#size.y = options.height ?? options.size?.y ?? 10;
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
import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class RectangleView extends ShapeView {
    #size = null;

    constructor(width, height) {
        super();
        this.#size = new Vec2(width, height);
    }

    // MARK: - Properties ------------------------------------------------------
    set size(size) { 
        this.#size.set(size.x, size.y); 
    }

    get size() { 
        return this.#size; 
    }

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return (
            x >= this.position.x
            && x < this.position.x + this.#size.x
            && y >= this.position.y
            && y < this.position.y + this.#size.y
        );
    }

    // --[ drawing ]------------------------------------------------------------
    path(context) {
        context.rect(this.position.x, this.position.y, this.#size.x, this.#size.y);
    }

}
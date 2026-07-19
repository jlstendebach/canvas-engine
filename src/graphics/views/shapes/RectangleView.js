import { Size } from "../../utils/Size.js";
import { ShapeView } from "./ShapeView.js";

export class RectangleView extends ShapeView {
    #width = 10;
    #height = 10;

    // MARK: - Accessors 
    get width() {
        return this.#width;
    }    
    set width(value) {
        this.setWidth(value);
    }

    get height() {
        return this.#height;
    }
    set height(value) {
        this.setHeight(value);
    }

    // MARK: - Initialization 
    constructor(width = 10, height = 10) {
        super();
        this.#width = width;
        this.#height = height;
    }

    // MARK: - Size
    getSize(out = new Size()) {
        return out.set(this.#width, this.#height);
    }

    setSizeWH(width, height) {
        if (this.#width === width && this.#height === height) { return this; }
        this.#width = width;
        this.#height = height;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    setSize(size) {
        return this.setSizeWH(size.width, size.height);
    }

    setWidth(width) {
        if (this.#width === width) { return this; }
        this.#width = width;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    setHeight(height) {
        if (this.#height === height) { return this; }
        this.#height = height;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    // MARK: - Hit Testing
    updateBounds(out) {
        out.set(0, 0, this.#width, this.#height);
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }

    // MARK: - Drawing
    path(context) {
        context.rect(0, 0, this.#width, this.#height);
    }

    // MARK: - Events
    onSizeChanged() {}

}
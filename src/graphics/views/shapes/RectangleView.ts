import type { Bounds } from "../../../math/Bounds.js";
import type { Vec2 } from "../../../math/Vec2.js";
import { Size } from "../../utils/Size.js";
import { ShapeView } from "./ShapeView.js";

export class RectangleView extends ShapeView {
    #width: number;
    #height: number;

    // MARK: - Accessors 
    get width(): number {
        return this.#width;
    }
    set width(value: number) {
        this.setWidth(value);
    }

    get height(): number {
        return this.#height;
    }
    set height(value: number) {
        this.setHeight(value);
    }

    // MARK: - Initialization 
    constructor(width: number = 10, height: number = 10) {
        super();
        this.#width = width;
        this.#height = height;
    }

    // MARK: - Size
    getSize(out: Size = new Size()): Size {
        return out.set(this.#width, this.#height);
    }

    setSizeWH(width: number, height: number): this {
        if (this.#width === width && this.#height === height) { return this; }
        this.#width = width;
        this.#height = height;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    setSize(size: Size): this {
        return this.setSizeWH(size.width, size.height);
    }

    setWidth(width: number): this {
        if (this.#width === width) { return this; }
        this.#width = width;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    setHeight(height: number): this {
        if (this.#height === height) { return this; }
        this.#height = height;
        this.invalidateBounds();
        this.onSizeChanged();
        return this;
    }

    // MARK: - Hit Testing
    override updateBounds(out: Bounds): void {
        out.set(0, 0, this.#width, this.#height);
    }

    override containsPoint(point: Vec2): boolean {
        return this.bounds.containsPoint(point);
    }

    // MARK: - Drawing
    override path(context: CanvasRenderingContext2D): void {
        context.rect(0, 0, this.#width, this.#height);
    }

    // MARK: - Events
    onSizeChanged(): void { }

}
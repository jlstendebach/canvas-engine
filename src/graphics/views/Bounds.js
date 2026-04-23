import { Vec2 } from "../../math/Vec2.js";

export class Bounds {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = Number(value) || 0;
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = Number(value) || 0;
    }

    get width() {
        return this.#width;
    }

    set width(value) {
        this.#width = Number(value) || 0;
    }

    get height() {
        return this.#height;
    }

    set height(value) {
        this.#height = Number(value) || 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    getPosition() {
        return new Vec2(this.#x, this.#y);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    getSize() {
        return new Vec2(this.#width, this.#height);
    }

    setRect(x, y, width, height) {
        this.setPosition(x, y);
        this.setSize(width, height);
        return this;
    }

    containsPoint(x, y) {
        return (
            x >= this.#x
            && x < this.#x + this.#width
            && y >= this.#y
            && y < this.#y + this.#height
        );
    }

    intersects(bounds) {
        return (
            this.#x < bounds.x + bounds.width
            && this.#y < bounds.y + bounds.height
            && bounds.x < this.#x + this.#width
            && bounds.y < this.#y + this.#height
        );
    }

    clone() {
        return new Bounds(this.#x, this.#y, this.#width, this.#height);
    }
}

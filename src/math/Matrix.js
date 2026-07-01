import { Bounds } from "./Bounds.js";
import { Vec2 } from "./Vec2.js";

export class Matrix {
    a; b;
    c; d;
    tx; ty;

    // MARK: - Constructor
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    set(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }

    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        this.a = scaleX * cos;
        this.b = scaleX * sin;
        this.c = -scaleY * sin;
        this.d = scaleY * cos;
        this.tx = x - (pivotX * this.a) - (pivotY * this.c);
        this.ty = y - (pivotX * this.b) - (pivotY * this.d);

        return this;
    }

    // MARK: - Transformations
    translate(x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    }

    rotate(radians) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const a = this.a * cos + this.c * sin;
        const b = this.b * cos + this.d * sin;
        const c = this.c * cos - this.a * sin;
        const d = this.d * cos - this.b * sin;

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;

        return this;
    }

    scale(sx, sy) {
        this.a *= sx;
        this.b *= sx;
        this.c *= sy;
        this.d *= sy;
        return this;
    }

    transformPoint(point, out = new Vec2()) {
        return this.transformPointXY(point.x, point.y, out);
    }

    transformPointXY(x, y, out = new Vec2()) {
        return out.set(
            this.tx + (x * this.a) + (y * this.c),
            this.ty + (x * this.b) + (y * this.d)
        );
    }

    transformVector(vector, out = new Vec2()) {
        return this.transformVectorXY(vector.x, vector.y, out);
    }

    transformVectorXY(x, y, out = new Vec2()) {
        return out.set(
            (x * this.a) + (y * this.c),
            (x * this.b) + (y * this.d)
        );
    }

    transformBounds(bounds, out = new Bounds()) {
        const minX = bounds.minX;
        const minY = bounds.minY;
        const maxX = bounds.maxX;
        const maxY = bounds.maxY;

        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;        

        return out
            .reset()
            .addXY(a * minX + c * minY + tx, b * minX + d * minY + ty)
            .addXY(a * maxX + c * minY + tx, b * maxX + d * minY + ty)
            .addXY(a * maxX + c * maxY + tx, b * maxX + d * maxY + ty)
            .addXY(a * minX + c * maxY + tx, b * minX + d * maxY + ty);
    }

    identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
        return this;
    }

    multiply(other) {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const ty1 = this.ty;

        const a2 = other.a;
        const b2 = other.b;
        const c2 = other.c;
        const d2 = other.d;
        const tx2 = other.tx;
        const ty2 = other.ty;

        this.a = a1 * a2 + c1 * b2;
        this.b = b1 * a2 + d1 * b2;
        this.c = a1 * c2 + c1 * d2;
        this.d = b1 * c2 + d1 * d2;
        this.tx = a1 * tx2 + c1 * ty2 + tx1;
        this.ty = b1 * tx2 + d1 * ty2 + ty1;

        return this;
    }

    invert() {
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;

        const determinant = a * d - b * c;
        if (determinant === 0) {
            return this;
        }
        const invDet = 1 / determinant;

        this.a = d * invDet;
        this.b = -b * invDet;
        this.c = -c * invDet;
        this.d = a * invDet;
        this.tx = (c * ty - d * tx) * invDet;
        this.ty = (b * tx - a * ty) * invDet;

        return this;
    }

    // MARK: - Utilities
    copy(other) {
        return this.set(other.a, other.b, other.c, other.d, other.tx, other.ty);
    }

    clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
}
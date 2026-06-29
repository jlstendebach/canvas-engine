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

    transformXY(x, y, out = new Vec2()) {
        out.x = (x * this.a) + (y * this.c) + this.tx;
        out.y = (x * this.b) + (y * this.d) + this.ty;
        return out;
    }

    transformPoint(point, out = new Vec2()) {
        return this.transformXY(point.x, point.y, out);
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
        if (Math.abs(determinant) < 1e-6) {
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
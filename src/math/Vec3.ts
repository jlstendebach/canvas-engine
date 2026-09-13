export class Vec3 {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    // --[ ctor ]---------------------------------------------------------------
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // --[ static functions ]---------------------------------------------------
    static copy(v: Vec3): Vec3 {
        return new Vec3(v.x, v.y, v.z);
    }

    static add(u: Vec3, v: Vec3): Vec3 {
        return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z);
    }

    static subtract(u: Vec3, v: Vec3): Vec3 {
        return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z);
    }

    static multiply(u: Vec3, v: Vec3): Vec3 {
        return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z);
    }

    static divide(u: Vec3, v: Vec3): Vec3 {
        return new Vec3(u.x / v.x, u.y / v.y, u.z / v.z);
    }

    static scale(v: Vec3, s: number): Vec3 {
        return new Vec3(v.x * s, v.y * s, v.z * s);
    }

    static invert(v: Vec3): Vec3 {
        return new Vec3(-v.x, -v.y, -v.z);
    }

    static normalize(v: Vec3): Vec3 {
        return this.copy(v).normalize();
    }

    static cross(u: Vec3, v: Vec3): Vec3 {
        return new Vec3(
            u.y * v.z - u.z * v.y,
            u.z * v.x - u.x * v.z,
            u.x * v.y - u.y * v.x
        );
    }

    static interpolate(u: Vec3, v: Vec3, a: number): Vec3 {
        return new Vec3(
            u.x + (v.x - u.x) * a,
            u.y + (v.y - u.y) * a,
            u.z + (v.z - u.z) * a
        );
    }

    // --[ in-place operations ]------------------------------------------------
    set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    add(v: Vec3): this {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    subtract(v: Vec3): this {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiply(v: Vec3): this {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    divide(v: Vec3): this {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    scale(s: number): this {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    invert(): this {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    interpolate(v: Vec3, a: number): this {
        this.x += (v.x - this.x) * a;
        this.y += (v.y - this.y) * a;
        this.z += (v.z - this.z) * a;
        return this;
    }

    normalize(): this {
        return this.setMag(1);
    }

    // --[ information operations ]---------------------------------------------
    setMag(mag: number): this {
        if (this.x !== 0 || this.y !== 0 || this.z !== 0) {
            this.scale(mag / this.mag());
        }
        return this;
    }

    mag(): number {
        return Math.sqrt(this.magSquared());
    }

    magSquared(): number {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    dot(v: Vec3): number {
        return Math.sqrt(this.dotSquared(v));
    }

    dotSquared(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vec3): Vec3 {
        return Vec3.cross(this, v);
    }

}
export class Vec3 {
    static copy(v: any): Vec3;
    static add(u: any, v: any): Vec3;
    static subtract(u: any, v: any): Vec3;
    static multiply(u: any, v: any): Vec3;
    static divide(u: any, v: any): Vec3;
    static scale(v: any, s: any): Vec3;
    static invert(v: any): Vec3;
    static normalize(v: any): void;
    static cross(u: any, v: any): Vec3;
    static interpolate(u: any, v: any, a: any): Vec3;
    constructor(x: any, y: any, z: any);
    x: number;
    y: number;
    z: number;
    set r(r: number);
    get r(): number;
    set g(g: number);
    get g(): number;
    set b(b: number);
    get b(): number;
    set(x: any, y: any, z: any): this;
    add(v: any): this;
    subtract(v: any): this;
    multiply(v: any): this;
    divide(v: any): this;
    scale(s: any): this;
    invert(): this;
    interpolate(v: any, a: any): this;
    normalize(): this;
    setMag(mag: any): this;
    mag(): number;
    magSquared(): number;
    dot(v: any): number;
    dotSquared(v: any): number;
    cross(v: any): Vec3;
}
//# sourceMappingURL=Vec3.d.ts.map
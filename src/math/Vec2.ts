const TAU = Math.PI * 2;

export class Vec2 {
    x: number = 0;
    y: number = 0;

    // --[ ctor ]---------------------------------------------------------------
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    // --[ in-place operations ]------------------------------------------------
    /**
     * Sets the x and y components of this vector.
    * @param x - The x value.
    * @param y - The y value.
    * @returns This vector.
     */
    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    /********************/
    /* BASIC OPERATIONS */
    /********************/
    /**
     * Adds the given vector to this vector, in-place.
    * @param v - The vector to add to this vector.
    * @returns This vector.
     */
    add(v: Vec2): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Subtracts the given vector from this vector, in-place.
    * @param v - The vector to subtract from this vector.
    * @returns This vector.
     */
    subtract(v: Vec2): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiplies the components of this vector by the components of the given 
     * vector, in-place.
    * @param v - The vector by which to multiply this vector.
    * @returns This vector.
     */
    multiply(v: Vec2): this {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    /**
     * Divides the components of this vector by the components of the given 
     * vector, in-place.
    * @param v - The vector by which to divide this vector.
    * @returns This vector.
     */
    divide(v: Vec2): this {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    /**
     * Multiplies the components of this vector by the given scalar, in-place.
    * @param s - The scalar value.
    * @returns This vector.
     */
    multiplyScalar(s: number): this {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /**
     * Divides the components of this vector by the given scalar, in-place.
    * @param s - The scalar value.
    * @returns This vector.
     */
    divideScalar(s: number): this {
        this.x /= s;
        this.y /= s;
        return this;
    }

    /**
     * Multiplies the components of this vector by the given scalar, in-place.
     * Alias of multiplyScalar.
    * @param s - The scalar value.
    * @returns This vector.
     */
    scale(s: number): this {
        return this.multiplyScalar(s);
    }

    /**
     * Negates both components of this vector.
    * @returns This vector.
     */
    negate(): this {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Rounds each component of this vector down to the nearest integer.
    * @returns This vector.
     */
    floor(): this {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Rounds each component of this vector up to the nearest integer.
    * @returns This vector.
     */
    ceil(): this {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Rounds each component of this vector to the nearest integer.
    * @returns This vector.
     */
    round(): this {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /**********************/
    /* COMPLEX OPERATIONS */
    /**********************/
    /**
     * Rotates this vector by the given amount of radians. 
    * @param radians - The amount by which to rotate this vector.
    * @returns This vector.
     */
    rotate(radians: number): this {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return this.set(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Reflect this vector off of a surface whose normal is given, in-place.
    * @param normal - The normal of the surface.
    * @returns This vector.
     */
    reflect(normal: Vec2): this {
        const scale = 2 * this.dot(normal);
        this.x -= scale * normal.x;
        this.y -= scale * normal.y;
        return this;
    }

    /**
     * Mirror this vector across the given vector, in-place.
    * @param mirror - The mirror vector.
    * @returns This vector.
     */
    mirror(mirror: Vec2): this {
        const scale = 2 * this.dot(mirror);
        this.x = scale * mirror.x - this.x;
        this.y = scale * mirror.y - this.y;
        return this;
    }

    /**
     * Linearly interpolates this vector toward the target vector by a certain 
     * amount.
    * @param v - The target vector to interpolate this vector toward.
    * @param a - The amount by which to interpolate this vector toward 
     *     the target vector. This value will usually fall between 0 and 1. 
     *     A value of 0 will result in no interpolation toward the target vector. 
     *     A value of 1 will result in this vector being equal to the target.
     *     Values less than 0 will move this vector away from the target vector.
     *     Values more than 1 will move this vector past the target vector.
    * @returns This vector.
     */
    lerp(v: Vec2, a: number): this {
        // This method is more precise due to floating-point arithmetic error,
        // and ensures that the result is exact when a is 0 or 1.
        // Source: https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
        this.x = (1 - a) * this.x + a * v.x;
        this.y = (1 - a) * this.y + a * v.y;
        return this;
    }

    /**
     * Projects this vector onto the given vector, in-place.
    * @param v - The vector on which to project this vector.
    * @returns This vector.
     */
    project(v: Vec2): this {
        const scale = this.dot(v) / v.lengthSq();
        this.x = v.x * scale;
        this.y = v.y * scale;
        return this;
    }

    /**
     * Rejects this vector from the given vector, in-place.
    * @param v - The vector from which to reject this vector.
    * @returns This vector.
     */
    reject(v: Vec2): this {
        const scale = this.dot(v) / v.lengthSq();
        this.x -= v.x * scale;
        this.y -= v.y * scale;
        return this;
    }

    // --[ length operations ]--------------------------------------------------
    /**
    * @returns The length of this vector, squared.
     */
    lengthSq(): number {
        return this.x ** 2 + this.y ** 2;
    }

    /**
    * @returns The length of this vector.
     */
    length(): number {
        return Math.sqrt(this.lengthSq());
    }

    /**
     * Sets the length of this vector.
    * @param length - The new length.
    * @param current - The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
    * @returns This vector.
     */
    setLength(length: number, current: number = this.length()): this {
        const scale = length / current;
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    /**
     * Limits the length of this vector.
    * @param max - The maximum length.
    * @param current - The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
    * @returns This vector.
     */
    limitLength(max: number, current: number = this.length()): this {
        if (current > max) {
            this.setLength(max, current);
        }
        return this;
    }

    /**
     * Clamps the length of this vector between a min and max value.
    * @param min - The minimum length.
    * @param max - The maximum length.
    * @param current - The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
    * @returns This vector.
     */
    clampLength(
        min: number,
        max: number = Infinity,
        current: number = this.length()
    ): this {
        if (current < min) {
            this.setLength(min, current);

        } else if (current > max) {
            this.setLength(max, current);
        }
        return this;
    }

    /**
     * Sets the length of this vector to 1.
    * @param current - The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
    * @returns This vector.
     */
    normalize(current: number = this.length()): this {
        this.x /= current;
        this.y /= current;
        return this;
    }

    // --[ information operations ]---------------------------------------------
    dot(v: Vec2): number {
        return Vec2.dot(this, v);
    }

    angle(v: Vec2 = Vec2.unitX()): number {
        return Vec2.angle(this, v);
    }

    angleTau(v: Vec2 = Vec2.unitX()): number {
        return Vec2.angleTau(this, v);
    }

    distanceSq(v: Vec2): number {
        return Vec2.distanceSq(this, v);
    }

    distance(v: Vec2): number {
        return Vec2.distance(this, v);
    }

    // --[ helpers ]------------------------------------------------------------
    isZero(): boolean {
        return (this.x === 0 && this.y === 0);
    }

    isNotZero(): boolean {
        return (this.x !== 0 || this.y !== 0);
    }

    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    copy(v: Vec2): this {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    equals(v: Vec2): boolean {
        return (this.x === v.x && this.y === v.y);
    }

    toArray(): number[] {
        return [this.x, this.y];
    }

    toJson(): string {
        return JSON.stringify(this);
    }

    toString(): string {
        return "(" + this.x + "," + this.y + ")";
    }

    // --[ static methods ]-----------------------------------------------------
    /*********************/
    /* FACTORY FUNCTIONS */
    /*********************/
    static fromArray(array: number[], offset: number = 0): Vec2 {
        try {
            return new Vec2(
                array[offset] ?? 0,
                array[offset + 1] ?? 0
            );
        } catch {
            return new Vec2();
        }
    }

    static fromObject(object: { x?: number; y?: number }): Vec2 {
        return new Vec2(object.x ?? 0, object.y ?? 0);
    }

    static fromJson(str: string): Vec2 | null {
        try {
            const { x, y } = JSON.parse(str) as Record<string, unknown>;
            return new Vec2(
                typeof x === "number" ? x : 0,
                typeof y === "number" ? y : 0
            );
        } catch {
            return null;
        }
    }

    static fromAngle(radians: number): Vec2 {
        return new Vec2(Math.cos(radians), Math.sin(radians));
    }

    static random(length: number = 1): Vec2 {
        const radians = Math.random() * TAU;
        return new Vec2(length * Math.cos(radians), length * Math.sin(radians));
    }

    static unitX(): Vec2 {
        return new Vec2(1, 0);
    }

    static unitY(): Vec2 {
        return new Vec2(0, 1);
    }

    static zero(): Vec2 {
        return new Vec2();
    }

    static one(): Vec2 {
        return new Vec2(1, 1);
    }

    /**************/
    /* OPERATIONS */
    /**************/
    static add(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }

    static multiply(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x * v2.x, v1.y * v2.y);
    }

    static divide(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x / v2.x, v1.y / v2.y);
    }

    static multiplyScalar(v: Vec2, s: number): Vec2 {
        return new Vec2(v.x * s, v.y * s);
    }

    static divideScalar(v: Vec2, s: number): Vec2 {
        return new Vec2(v.x / s, v.y / s);
    }

    static scale(v: Vec2, s: number): Vec2 {
        return Vec2.multiplyScalar(v, s);
    }

    static negate(v: Vec2): Vec2 {
        return new Vec2(-v.x, -v.y);
    }

    static floor(v: Vec2): Vec2 {
        return new Vec2(Math.floor(v.x), Math.floor(v.y));
    }

    static ceil(v: Vec2): Vec2 {
        return new Vec2(Math.ceil(v.x), Math.ceil(v.y));
    }

    static round(v: Vec2): Vec2 {
        return new Vec2(Math.round(v.x), Math.round(v.y));
    }

    static rotate(v: Vec2, radians: number): Vec2 {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return new Vec2(
            v.x * cos - v.y * sin,
            v.x * sin + v.y * cos
        );
    }

    static reflect(v: Vec2, normal: Vec2): Vec2 {
        const scale = 2 * v.dot(normal);
        return new Vec2(
            v.x - normal.x * scale,
            v.y - normal.y * scale
        );
    }

    static mirror(v: Vec2, mirror: Vec2): Vec2 {
        const scale = 2 * v.dot(mirror);
        return new Vec2(
            mirror.x * scale - v.x,
            mirror.y * scale - v.y
        );
    }

    static lerp(v1: Vec2, v2: Vec2, a: number): Vec2 {
        return new Vec2(
            (1 - a) * v1.x + a * v2.x,
            (1 - a) * v1.y + a * v2.y
        );
    }

    static projection(v1: Vec2, v2: Vec2): Vec2 {
        const scale = v1.dot(v2) / v2.lengthSq();
        return new Vec2(
            v2.x * scale,
            v2.y * scale
        );
    }

    static rejection(v1: Vec2, v2: Vec2): Vec2 {
        const scale = v1.dot(v2) / v2.lengthSq();
        return new Vec2(
            v1.x - v2.x * scale,
            v1.y - v2.y * scale
        );
    }

    static normalize(v: Vec2, length: number = v.length()): Vec2 {
        return new Vec2(
            v.x / length,
            v.y / length
        );
    }

    static normal(v: Vec2): Vec2 {
        return new Vec2(-v.y, v.x);
    }

    static unitNormal(v: Vec2, length: number = v.length()): Vec2 {
        return new Vec2(
            -v.y / length,
            v.x / length
        );
    }

    static dot(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static angle(v1: Vec2, v2: Vec2 = Vec2.unitX()): number {
        return Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
    }

    static angleTau(v1: Vec2, v2: Vec2 = Vec2.unitX()): number {
        return (Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x) + TAU) % TAU;
    }

    static distanceSq(v1: Vec2, v2: Vec2): number {
        return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
    }

    static distance(v1: Vec2, v2: Vec2): number {
        return Math.sqrt(Vec2.distanceSq(v1, v2));
    }
}

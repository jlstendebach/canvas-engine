export declare class Vec2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /**
     * Sets the x and y components of this vector.
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Vec2} This vector.
     */
    set(x: number, y: number): Vec2;
    /********************/
    /********************/
    /**
     * Adds the given vector to this vector, in-place.
     * @param {Vec2} v The vector to add to this vector.
     * @returns {Vec2} This vector.
     */
    add(v: Vec2): Vec2;
    /**
     * Subtracts the given vector from this vector, in-place.
     * @param {Vec2} v The vector to subtract from this vector.
     * @returns {Vec2} This vector.
     */
    subtract(v: Vec2): Vec2;
    /**
     * Multiplies the components of this vector by the components of the given
     * vector, in-place.
     * @param {Vec2} v The vector by which to multiply this vector.
     * @returns {Vec2} This vector.
     */
    multiply(v: Vec2): Vec2;
    /**
     * Divides the components of this vector by the components of the given
     * vector, in-place.
     * @param {Vec2} v The vector by which to divide this vector.
     * @returns {Vec2} This vector.
     */
    divide(v: Vec2): Vec2;
    /**
     * Multiplies the components of this vector by the given scalar, in-place.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    multiplyScalar(s: number): Vec2;
    /**
     * Divides the components of this vector by the given scalar, in-place.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    divideScalar(s: number): Vec2;
    /**
     * Multiplies the components of this vector by the given scalar, in-place.
     * Alias of multiplyScalar.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    scale(s: number): Vec2;
    /**
     * Negates both components of this vector.
     * @returns {Vec2} This vector.
     */
    negate(): Vec2;
    /**
     * Rounds each component of this vector down to the nearest integer.
     * @returns {Vec2} This vector.
     */
    floor(): Vec2;
    /**
     * Rounds each component of this vector up to the nearest integer.
     * @returns {Vec2} This vector.
     */
    ceil(): Vec2;
    /**
     * Rounds each component of this vector to the nearest integer.
     * @returns {Vec2} This vector.
     */
    round(): Vec2;
    /**********************/
    /**********************/
    /**
     * Rotates this vector by the given amount of radians.
     * @param {Number} radians The amount by which to rotate this vector.
     * @returns {Vec2} This vector.
     */
    rotate(radians: number): Vec2;
    /**
     * Reflect this vector off of a surface whose normal is given, in-place.
     * @param {Vec2} normal The normal of the surface.
     * @returns {Vec2} This vector.
     */
    reflect(normal: Vec2): Vec2;
    /**
     * Mirror this vector across the given vector, in-place.
     * @param {Vec2} mirror The mirror vector.
     * @returns {Vec2} This vector.
     */
    mirror(mirror: Vec2): Vec2;
    /**
     * Linearly interpolates this vector toward the target vector by a certain
     * amount.
     * @param {Vec2} v The target vector to interpolate this vector toward.
     * @param {Number} a The amount by which to interpolate this vector toward
     *     the target vector. This value will usually fall between 0 and 1.
     *     A value of 0 will result in no interpolation toward the target vector.
     *     A value of 1 will result in this vector being equal to the target.
     *     Values less than 0 will move this vector away from the target vector.
     *     Values more than 1 will move this vector past the target vector.
     * @returns {Vec2} This vector.
     */
    lerp(v: Vec2, a: number): Vec2;
    /**
     * Projects this vector onto the given vector, in-place.
     * @param {Vec2} v The vector on which to project this vector.
     * @returns {Vec2} This vector.
     */
    project(v: Vec2): Vec2;
    /**
     * Rejects this vector from the given vector, in-place.
     * @param {Vec2} vector The vector from which to reject this vector.
     * @returns {Vec2} This vector.
     */
    reject(v: any): Vec2;
    /**
     * @returns {Number} The length of this vector, squared.
     */
    lengthSq(): number;
    /**
     * @returns {Number} The length of this vector.
     */
    length(): number;
    /**
     * Sets the length of this vector.
     * @param {Number} length The new length.
     * @param {Number} current The current length of this vector. Automatically
     *     calculated, but provided for efficiency in the case that the length
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    setLength(length: number, current?: number): Vec2;
    /**
     * Limits the length of this vector.
     * @param {Number} max The maximum length.
     * @param {Number} current The current length of this vector. Automatically
     *     calculated, but provided for efficiency in the case that the length
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    limitLength(max: number, current?: number): Vec2;
    /**
     * Clamps the length of this vector between a min and max value.
     * @param {Number} min The minimum length.
     * @param {Number} max The maximum length.
     * @param {Number} current The current length of this vector. Automatically
     *     calculated, but provided for efficiency in the case that the length
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    clampLength(min: number, max?: number, current?: number): Vec2;
    /**
     * Sets the length of this vector to 1.
     * @param {Number} current The current length of this vector. Automatically
     *     calculated, but provided for efficiency in the case that the length
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    normalize(current?: number): Vec2;
    dot(v: any): number;
    angle(v?: Vec2): number;
    angleTau(v?: Vec2): number;
    distanceSq(v: any): number;
    distance(v: any): number;
    isZero(): boolean;
    isNotZero(): boolean;
    clone(): Vec2;
    copy(v: any): this;
    equals(v: any): boolean;
    toArray(): number[];
    toJson(): string;
    toString(): string;
    /*********************/
    /*********************/
    static fromArray(array: any, offset?: number): Vec2;
    static fromObject(object: any): Vec2;
    static fromJson(string: any): Vec2;
    static fromAngle(radians: any): Vec2;
    static random(length?: number): Vec2;
    static unitX(): Vec2;
    static unitY(): Vec2;
    static zero(): Vec2;
    static one(): Vec2;
    /**************/
    /**************/
    static add(v1: any, v2: any): Vec2;
    static subtract(v1: any, v2: any): Vec2;
    static multiply(v1: any, v2: any): Vec2;
    static divide(v1: any, v2: any): Vec2;
    static multiplyScalar(v: any, s: any): Vec2;
    static divideScalar(v: any, s: any): Vec2;
    static scale(v: any, s: any): Vec2;
    static negate(v: any): Vec2;
    static floor(v: any): Vec2;
    static ceil(v: any): Vec2;
    static round(v: any): Vec2;
    static rotate(v: any, radians: any): Vec2;
    static reflect(v: any, normal: any): Vec2;
    static mirror(v: any, mirror: any): Vec2;
    static lerp(v1: any, v2: any, a: any): Vec2;
    static projection(v1: any, v2: any): Vec2;
    static rejection(v1: any, v2: any): Vec2;
    static normalize(v: any, length?: any): Vec2;
    static normal(v: any): Vec2;
    static unitNormal(v: any, length?: any): Vec2;
    static dot(v1: any, v2: any): number;
    static angle(v1: any, v2?: Vec2): number;
    static angleTau(v1: any, v2?: Vec2): number;
    static distanceSq(v1: any, v2: any): number;
    static distance(v1: any, v2: any): number;
}

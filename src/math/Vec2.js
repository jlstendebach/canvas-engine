export class Vec2 {
    x = 0;
    y = 0;

    // --[ ctor ]---------------------------------------------------------------
	constructor(x = 0, y = 0) {
		this.x = parseFloat(x);
		this.y = parseFloat(y);
	}

    // --[ aliases ]------------------------------------------------------------
    get width() { return this.x; }
    set width(width) { this.x = width; }
    get height() { return this.y; }
    set height(height) { this.y = height; }

    // --[ in-place operations ]------------------------------------------------
    /**
     * Sets the x and y components of this vector.
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Vec2} This vector.
     */
	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

    /********************/
    /* BASIC OPERATIONS */
    /********************/
    /**
     * Adds the given vector to this vector, in-place.
     * @param {Vec2} v The vector to add to this vector.
     * @returns {Vec2} This vector.
     */
    add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

    /**
     * Subtracts the given vector from this vector, in-place.
     * @param {Vec2} v The vector to subtract from this vector.
     * @returns {Vec2} This vector.
     */
	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

    /**
     * Multiplies the components of this vector by the components of the given 
     * vector, in-place.
     * @param {Vec2} v The vector by which to multiply this vector.
     * @returns {Vec2} This vector.
     */
	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}

    /**
     * Multiplies the components of this vector by the given scalar, in-place.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    multiplyScalar(s) {
		this.x *= s;
		this.y *= s;
		return this;
    }

    /**
     * Divides the components of this vector by the components of the given 
     * vector, in-place.
     * @param {Vec2} v The vector by which to divide this vector.
     * @returns {Vec2} This vector.
     */
	divide(v) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}

    /**
     * Divides the components of this vector by the given scalar, in-place.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    /**
     * Multiplies the components of this vector by the given scalar, in-place.
     * Alias of multiplyScalar.
     * @param {Number} s The scalar value.
     * @returns {Vec2} This vector.
     */
    scale(s) {
        return this.multiplyScalar(s);
    }

    /**
     * Negates both components of this vector.
     * @returns {Vec2} This vector.
     */
	negate() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

    /**
     * Rounds each component of this vector down to the nearest integer.
     * @returns {Vec2} This vector.
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Rounds each component of this vector up to the nearest integer.
     * @returns {Vec2} This vector.
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    
    /**
     * Rounds each component of this vector to the nearest integer.
     * @returns {Vec2} This vector.
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /**********************/
    /* COMPLEX OPERATIONS */
    /**********************/
    /**
     * Rotates this vector by the given amount of radians. 
     * @param {Number} radians The amount by which to rotate this vector.
     * @returns {Vec2} This vector.
     */
	rotate(radians) {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
        return this.set(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
	}

    /**
     * Reflect this vector off of a surface whose normal is given, in-place.
     * @param {Vec2} normal The normal of the surface.
     * @returns {Vec2} This vector.
     */
    reflect(normal) {
        const scale = 2*this.dot(normal);
        this.x -= scale*normal.x;
        this.y -= scale*normal.y;
        return this;
    }

    /**
     * Mirror this vector across the given vector, in-place.
     * @param {Vec2} mirror The mirror vector.
     * @returns {Vec2} This vector.
     */
    mirror(mirror) {
        const scale = 2*this.dot(mirror);
        this.x = scale*mirror.x - this.x;
        this.y = scale*mirror.y - this.y;
        return this;
    }

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
    lerp(v, a) {
        // This method is more precise due to floating-point arithmetic error,
        // and ensures that the 
        // Source: https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
        this.x = (1-a)*this.x + a*v.x;
        this.y = (1-a)*this.y + a*v.y;
		return this;
	}

    /**
     * Projects this vector onto the given vector, in-place.
     * @param {Vec2} v The vector on which to project this vector.
     * @returns {Vec2} This vector.
     */
	project(v) {
        const scale = this.dot(v) / v.lengthSq();
        this.x = v.x * scale
        this.y = v.y * scale;
        return this;
	}

    /**
     * Rejects this vector from the given vector, in-place.
     * @param {Vec2} vector The vector from which to reject this vector.
     * @returns {Vec2} This vector.
     */
    reject(v) {
        const scale = this.dot(v) / v.lengthSq();
        this.x -= v.x * scale
        this.y -= v.y * scale;
        return this;
    }

    // --[ length operations ]--------------------------------------------------
    /**
     * @returns {Number} The length of this vector, squared.
     */
    lengthSq() {
        return this.x**2 + this.y**2;
    }

    /**
     * @returns {Number} The length of this vector.
     */
    length() {
		return Math.sqrt(this.lengthSq());
    }

    /**
     * Sets the length of this vector.
     * @param {Number} length The new length.
     * @param {Number} current The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    setLength(length, current = this.length()) {
        const scale = length / current;
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    /**
     * Limits the length of this vector.
     * @param {Number} max The maximum length.
     * @param {Number} length The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
	limitLength(max, length = this.length()) {
        if (length > max) {
            this.setLength(max, length);
        }
		return this;
	}    

    /**
     * Clamps the length of this vector between a min and max value.
     * @param {Number} min The minimum length.
     * @param {Number} max The maximum length.
     * @param {Number} length The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
	clampLength(min, max = Number.MAX_VALUE, length = this.length()) {
        if (length < min) {
            this.setLength(min, length);

        } else if (length > max) {
            this.setLength(max, length);
        }
		return this;
	}    

    /**
     * Sets the length of this vector to 1.
     * @param {Number} length The current length of this vector. Automatically 
     *     calculated, but provided for efficiency in the case that the length 
     *     has been previously computed.
     * @returns {Vec2} This vector.
     */
    normalize(length = this.length()) {
        length = length || 1;
        this.x /= length;
        this.y /= length;
        return this;
	}

    // --[ information operations ]---------------------------------------------
	dot(v) {
		return this.x*v.x + this.y*v.y;
	}

    angle(v = Vec2.unitX()) {
		// u . v = |u|*|v|*cos(angle)
		// angle = acos((u . v) / (|u|*|v|))    
		return Math.acos(
			this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq())
		);
    }

	angleTau(v = Vec2.unitX()) {
		/*
		 * Cross product:
		 * ---------------------
		 * x = u.y*v.z - u.z*v.y
		 * y = u.z*v.x - u.x*v.z
		 * z = u.x*v.y - u.y*v.x
		 * 
		 * z is 0, so...
		 * ---------------------
		 * x = 0
		 * y = 0
		 * z = u.x*v.y - u.y*v.x    
		 *
		 * If z is less than zero, then the angle between u and v is greater 
		 * than pi. Angle in range [0, 2pi) needs to be calculated.
		 */
		const angle = this.angle(v);
        return (this.x * v.y - this.y * v.x < 0) 
            ? 2 * Math.PI - angle
            : angle;
	}

	distanceSq(v) {
		return (this.x - v.x)**2 + (this.y - v.y)**2;
	} 

    distance(v) {
        return Math.sqrt(this.distanceSq(v));
    }

    // --[ helpers ]------------------------------------------------------------
	isZero() {
		return (this.x === 0 && this.y === 0);
	}

	isNotZero() {
		return (this.x !== 0 || this.y !== 0);
	}

    clone() {
		return new Vec2(this.x, this.y);
	}

    copy(v) { 
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y);
    }
    
    toArray() {
        return [this.x, this.y];
    }

    toJson() {
        return JSON.stringify(this);
    }

    toString() {
        return "("+this.x+","+this.y+")";
    }

    // --[ static methods ]-----------------------------------------------------
    /*********************/
    /* FACTORY FUNCTIONS */
    /*********************/
    static fromArray(array, offset = 0) {
        return new Vec2(
            parseFloat(array[offset]) || 0,  // x 
            parseFloat(array[offset+1]) || 0 // y
        );
    }

    static fromObject(object) {
        return new Vec2(
            parseFloat(object.x) || 0, // x
            parseFloat(object.y) || 0  // y
        );
    }

    static fromJson(json) {
        try {
            return Vec2.fromObject(JSON.parse(json));
        } catch {
            return new Vec2();
        }
    }

	static fromAngle(radians) {
		return new Vec2(Math.cos(radians), Math.sin(radians));
	}

	static random(length = 1) {
        const radians = Math.random() * 2 * Math.PI;
		return new Vec2(length*Math.cos(radians), length*Math.sin(radians));
	}

    static unitX() {
        return new Vec2(1, 0);
    }

    static unitY() {
        return new Vec2(0, 1);
    }

    static zero() {
        return new Vec2();
    }

    static one() {
        return new Vec2(1, 1);
    }

    /**************/
    /* OPERATIONS */
    /**************/
    static add(v1, v2) { 
        return new Vec2(v1.x+v2.x, v1.y+v2.y); 
    }

    static subtract(v1, v2) { 
        return new Vec2(v1.x-v2.x, v1.y-v2.y); 
    }	

    static multiply(v1, v2) { 
        return new Vec2(v1.x*v2.x, v1.y*v2.y); 
    }

    static multiplyScalar(v, s) { 
        return new Vec2(v.x*s, v.y*s);
    }

    static divide(v1, v2) { 
        return new Vec2(v1.x/v2.x, v1.y/v2.y);
    }	

    static divideScalar(v, s) { 
        return new Vec2(v.x/s, v.y/s);
    }	

    static scale(v, s) { 
        return new Vec2(v.x*s, v.y*s);
    }

    static negate(v) { 
        return new Vec2(-v.x, -v.y);
    }

    static rotate(v, radians) { 
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
        return new Vec2(
            v.x * cos - v.y * sin,
            v.x * sin + v.y * cos
        );
    }

    static reflect(v, normal) { 
        const scale = 2*v.dot(normal);
        return new Vec2(
            v.x - normal.x * scale,
            v.y - normal.y * scale
        );
    }

    static mirror(v, mirror) { 
        const scale = 2*v.dot(mirror);
        return new Vec2(
            mirror.x * scale - v.x,
            mirror.y * scale - v.y
        );
    }

    static lerp(v1, v2, a) { 
        return new Vec2(
            (1-a)*v1.x + a*v2.x,
            (1-a)*v1.y + a*v2.y
        );
    }

    static projection(v1, v2) { 
        const scale = v1.dot(v2) / v2.lengthSq();
        return new Vec2(
            v2.x * scale, 
            v2.y * scale 
        );
    }

    static rejection(v1, v2) { 
        const scale = v1.dot(v2) / v2.lengthSq();
        return new Vec2(
            v1.x - v2.x * scale,
            v1.y - v2.y * scale
        );
    }

    static normalize(v, length = v.length()) { 
        return new Vec2(
            v.x / length,
            v.y / length
        );
    }

    static normal(v) { 
        return new Vec2(-v.y, v.x);
    }

    static unitNormal(v, length = v.length()) { 
        return new Vec2(
            -v.y/length, 
            v.x/length
        );
    }

    static dot(v1, v2) { return v1.dot(v2); }
    static angle(v1, v2 = Vec2.unitX()) { return v1.angle(v2); }
    static angleTau(v1, v2 = Vec2.unitX()) { return v1.angleTau(v2); }
    static distanceSq(v1, v2) { return v1.distanceSq(v2); }
    static distance(v1, v2) { return v1.distance(v2); }
}

export class Vec2 {
    x = 0;
    y = 0;

    // --[ ctor ]---------------------------------------------------------------
	constructor(x = 0, y = 0) {
		this.x = parseFloat(x);
		this.y = parseFloat(y);
	}

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
     * Adds the other vector to this vector, in-place.
     * @param {Vec2} other The vector to add to this vector.
     * @returns {Vec2} This vector.
     */
    add(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

    /**
     * Subtracts the other vector from this vector, in-place.
     * @param {Vec2} other The vector to subtract from this vector.
     * @returns {Vec2} This vector.
     */
	subtract(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

    /**
     * Multiplies the components of this vector by the components of the other 
     * vector, in-place.
     * @param {Vec2} other The vector by which to multiply this vector.
     * @returns {Vec2} This vector.
     */
	multiply(other) {
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}

    /**
     * Divides the components of this vector by the components of the other 
     * vector, in-place.
     * @param {Vec2} other The vector by which to divide this vector.
     * @returns {Vec2} This vector.
     */
	divide(other) {
		this.x /= other.x;
		this.y /= other.y;
		return this;
	}

    /**
     * Scales the components of this vector by the given scalar. This will 
     * effectively scale this vector's length as well.
     * @param {Number} scalar The number by which to scale this vector.
     * @returns {Vec2} This vector.
     */
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
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
     * Reflect this vector about the given vector, in-place.
     * @param {Vec2} vector The vector about which to reflect this vector.
     * @returns {Vec2} This vector.
     */
    reflect(vector) {
        return this.add(this.rejection(vector).scale(-2));
    }

    /**
     * Linearly interpolates this vector toward the other vector by a certain 
     * amount.
     * @param {Vec2} other The other vector to interpolate this vector toward.
     * @param {Number} a The amount by which to interpolate this vector toward 
     *     the other vector. This value will usually fall between 0 and 1. 
     *     A value of 0 will result in no interpolation toward the other vector. 
     *     A value of 1 will result in this vector being equal to the other.
     *     Values less than 0 will move this vector away from the other vector.
     *     Values more than 1 will move this vector past the other vector.
     * @returns {Vec2} This vector.
     */
    lerp(other, a) {
		this.x += (other.x - this.x) * a;
		this.y += (other.y - this.y) * a;
		return this;
	}

    
    /**
     * Projects this vector onto the other vector, in-place.
     * @param {Vec2} other The vector on which to project this vector.
     * @returns {Vec2} This vector.
     */
	project(other) {
		return other.isZero()
            ? this.set(0, 0)
            : this.scale(this.dot(other) / other.lengthSq());
	}

    /**
     * Rejects this vector from the other vector, in-place.
     * @param {Vec2} other The vector from which to reject this vector.
     * @returns {Vec2} This vector.
     */
    reject(other) {
        return this.subtract(this.projection(other));
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
     * @param {Number} length The length of the vector.
     * @returns {Vec2} This vector.
     */
    setLength(length) {
        return this.scale(length / (this.length() || 1))
    }

    /**
     * Sets the length of this vector to 1.
     * @returns {Vec2} This vector.
     */
	normalize() {
		return this.setLength(1);
	}

    /**
     * Clamps the length of this vector between a min and max value.
     * @param {Number} min The minimum length. Set this to 0 if you only want to 
     *     limit the max length.
     * @param {Number} max The maximum length. Can be null/undefined.
     * @returns {Vec2} This vector.
     */
	clampLength(min, max) {
		let length = this.length();
        if (length < min) {
            this.setLength(min);

        } else if (max != null && length > max) {
            this.setLength(max);
        }
		return this;
	}    

    // --[ out-of-place operations ]--------------------------------------------
    /********************/
    /* BASIC OPERATIONS */
    /********************/
    sum(other) {
        return new Vec2(this.x+other.x, this.y+other.y);
    }

    difference(other) {
        return new Vec2(this.x-other.x, this.y-other.y);
    }

    product(other) {
        return new Vec2(this.x*other.x, this.y*other.y);
    }

    quotient(other) {
        return new Vec2(this.x/other.x, this.y/other.y);
    }

    scaled(s) {
        return new Vec2(this.x*s, this.y*s);
    }

    negated() {
        return new Vec2(-this.x, -this.y);
    }

    /**********************/
    /* COMPLEX OPERATIONS */
    /**********************/
	rotated(radians) {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
        return new Vec2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
	}

    reflected(vector) {
        return this.sum(this.rejection(vector).scale(-2));
    }

    lerped(other, a) {
        return new Vec2(
            this.x + (other.x - this.x) * a,
            this.y + (other.y - this.y) * a
        );
	}

    projection(other) {
        return other.isZero() 
            ? new Vec2(0, 0)
            : this.scaled(this.dot(other) / other.lengthSq());
    }

    rejection(other) {
        return this.difference(this.projection(other));
    }

    normalized() {
        return this.copy().normalize();
    }

    normal() {
        return new Vec2(-this.y, this.x);
    }

    unitNormal() {
        return this.normal().normalize();
    }

    // --[ information operations ]---------------------------------------------
	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

    angle(other = Vec2.i()) {
		// u . v = |u|*|v|*cos(angle)
		// angle = acos((u . v) / (|u|*|v|))    
		return Math.acos(
			this.dot(other) / Math.sqrt((this.lengthSq()) * (other.lengthSq()))
		);

    }

	angleTau(other = Vec2.i()) {
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
		let angle = this.angle(other);
        return (this.x * other.y - this.y * other.x < 0) 
            ? 2 * Math.PI - angle
            : angle;
	}

	distanceSq(other) {
		return (this.x - other.x)**2 + (this.y - other.y)**2;
	} 

    distance(other) {
        return Math.sqrt(this.distanceSq(other));
    }

    // --[ helpers ]------------------------------------------------------------
	isZero() {
		return (this.x === 0 && this.y === 0);
	}

	isNotZero() {
		return (this.x !== 0 || this.y !== 0);
	}

    copy() {
		return new Vec2(this.x, this.y);
	}

    equals(vector) {
        return (this.x === vector.x && this.y === vector.y);
    }
    
    toArray() {
        return [this.x, this.y];
    }

    toJson() {
        return JSON.stringify(this);
    }

    toString() {
        return "<"+this.x+","+this.y+">";
    }

    // --[ static factory methods ]---------------------------------------------
    static fromArray(array, offset = 0) {
        return new Vec2(
            parseFloat(array[offset]) || 0,  // x 
            parseFloat(array[offset+1]) || 0 // y
        )
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

    static i() {
        return new Vec2(1, 0);
    }

    static j() {
        return new Vec2(0, 1);
    }

	static random(length = 1) {
		return Vec2
            .fromAngle(Math.random() * 2 * Math.PI)
			.setLength(length);
	}

    // --[ static operations ]--------------------------------------------------
	static add(u, v) { return u.sum(v); }	
	static subtract(u, v) { return u.difference(v); }	
	static multiply(u, v) { return u.product(v); }	
	static divide(u, v) { return u.quotient(v); }	
    static scale(v, s) { return v.scaled(s); }
    static negate(v) { return v.negated(); }
    static rotate(v, radians) { return v.rotated(radians); }
    static reflect(u, v) { return u.reflected(v); }
    static lerp(u, v, a) { return u.lerped(v, a); }
    static projection(u, v) { return u.projection(v); }
    static rejection(u, v) { return u.rejection(v); }
    static normalize(v) { return v.normalized(); }
    static normal(v) { return v.normal(); }
    static unitNormal(v) { return v.unitNormal(); }

    static dot(u, v) { return u.dot(v); }
    static angle(u, v = Vec2.i()) { return u.angle(v); }
    static angleTau(u, v = Vec2.i()) { return u.angleTau(v); }
    static distanceSq(u, v) { return u.distanceSq(v); }
    static distance(u, v) { return u.distance(v); }
}

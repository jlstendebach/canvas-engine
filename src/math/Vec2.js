export class Vec2 {
	// --[ ctor ]---------------------------------------------------------------
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// --[ static functions ]---------------------------------------------------
	static fromAngle(radians) {
		return new Vec2(Math.cos(radians), Math.sin(radians));
	}
    static fromArray(array, offset=0) {
        return Vec2(array[offset], array[offset+1])
    }


	static add(u, v) { return new Vec2(u.x + v.x, u.y + v.y); }
	static sub(u, v) { return new Vec2(u.x - v.x, u.y - v.y); }
	static mult(v, s) { return new Vec2(v.x * s, v.y * s); }
	static div(v, s) { return new Vec2(v.x / s, v.y / s); }

	static invert(v) { return new Vec2(-v.x, -v.y); }
	static normalize(v) { return v.copy().normalize(); }

	static normal(v) { return new Vec2(-v.y, v.x); }
	static unitNormal(v) { return Vec2.normal(v).normalize(); }

	static lerp(u, v, a) {
		return new Vec2(u.x + (v.x - u.x) * a, u.y + (v.y - u.y) * a);
	}

	static rotate(v, radians) {
		let cos = Math.cos(radians);
		let sin = Math.sin(radians);
		return new Vec2(
			v.x * cos - v.y * sin,
			v.x * sin + v.y * cos
		);
	}

	static dist(u, v) {
		return Math.sqrt((u.x - v.x) ** 2 + (u.y - v.y) ** 2);
	}

	static distSq(u, v) {
		return (u.x - v.x) ** 2 + (u.y - v.y) ** 2;
	}

	static angle(u, v) {
		// u . v = |u|*|v|*cos(angle)
		// angle = acos((u . v) / (|u|*|v|))    
		return Math.acos(
			(u.x*v.x + u.y*v.y) / Math.sqrt((u.x**2 + u.y**2) * (v.x**2 + v.y**2))
		);
	}

	static angleTau(u, v) {
		let angle = Vec2.angle(u, v);

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
		if (u.x * v.y - u.y * v.x < 0) {
			return 2 * Math.PI - angle;
		}

		// If the method gets here, return the original angle.
		return angle;
	}

	static projection(u, v) { // projection of u onto v
		if (v.x !== 0 || v.y !== 0) {
			return Vec2.mult(v, u.dot(v) / (v.x ** 2 + v.y ** 2));
		}
		return new Vec2(0, 0);
	}

	static rejection(u, v) { // rejection of u from v 
		let proj = this.projection(u, v);
		return this.sub(u, proj);
	}

	static random(mag = 1) {
		return new Vec2(1, 0)
			.rotate(Math.random() * 2 * Math.PI)
			.setLength(mag);
	}

	// --[ in-place operations ]--------------------------------------------------
	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	mult(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	div(s) {
		this.x /= s;
		this.y /= s;
		return this;
	}

	invert() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	lerp(v, a) {
		this.x += (v.x - this.x) * a;
		this.y += (v.y - this.y) * a;
		return this;
	}

	normalize() {
		return this.setLength(1);
	}

	rotate(radians) {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
        return this.set(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        )
	}

	limitLength(length) {
		if (this.length() > length) {
			this.setLength(length);
		}
		return this;
	}

	clampLength(min, max) {
		let length = this.length();
        if (length < min) {
            this.setLength(min);

        } else if (length > max) {
            this.setLength(max);
        }
		return this;
	}

    setLength(length) {
        return this.mult(length / (this.length() || 1))
    }

	zero() {
		this.x = 0;
		this.y = 0;
	}

	// --[ information operations ]---------------------------------------------
	copy() {
		return new Vec2(this.x, this.y);
	}

    equals(v) {
        return this.x === v.x && this.y === v.y
    }

    length() {
		return Math.sqrt(this.lengthSq());
    }

    lengthSq() {
		return this.x ** 2 + this.y ** 2;
    }

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	isZero() {
		return (this.x === 0 && this.y === 0);
	}

    toArray() {
        return [this.x, this.y];
    }

}
export class Vec3 {
	// --[ ctor ]---------------------------------------------------------------
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	// --[ static functions ]---------------------------------------------------
	static copy(v) { return new Vec3(v.x, v.y, v.z); }

	static add(u, v) { return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z); }
	static subtract(u, v) { return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z); }
	static multiply(u, v) { return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z); }
	static divide(u, v) { return new Vec3(u.x / v.x, u.y / v.y, u.z / v.z); }

	static scale(v, s) { return new Vec3(v.x * s, v.y * s, v.z * s); }
	static invert(v) { return new Vec3(-v.x, -v.y, -v.z); }
	static normalize(v) { this.copy(v).normalize(); }

	static cross(u, v) {
		return new Vec3(
			u.y * v.z - u.z * v.y,
			u.z * v.x - u.x * v.z,
			u.x * v.y - u.y * v.x
		);
	}

	static interpolate(u, v, a) {
		return new Vec3(
			u.x + (v.x - u.x) * a,
			u.y + (v.y - u.y) * a,
			u.z + (v.z - u.z) * a
		);
	}

	// --[ in-place operations ]------------------------------------------------
	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}

	divide(v) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}

	scale(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}

	invert() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}

	interpolate(v, a) {
		this.x += (v.x - this.x) * a;
		this.y += (v.y - this.y) * a;
		this.z += (v.z - this.z) * a;
		return this;
	}

	normalize() {
		return this.setMag(1);
	}

	// --[ information operations ]---------------------------------------------
	setMag(mag) {
		if (this.x !== 0 || this.y !== 0 || this.z !== 0) {
			this.scale(mag / this.mag());
		}
		return this;
	}

	mag() {
		return Math.sqrt(this.magSquared());
	}

	magSquared() {
		return this.x**2 + this.y**2 + this.z**2;
	}

	dot(v) {
		return Math.sqrt(this.dotSquared(v));
	}

	dotSquared(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	cross(v) {
		return Vec3.cross(this, v);
	}

}
import { Bounds } from "../../math/Bounds.js";
import { Matrix2 } from "../../math/Matrix2.js";
import { Vec2 } from "../../math/Vec2.js";

// The dirty level of the transform is cascaded, meaning that if a transform is 
// dirty at a certain level, it is also dirty at all lower levels. For example, 
// if a transform is dirty at the TRIG level, it is also dirty at the LINEAR and
// TRANSLATION levels.
const CLEAN = 0;
const TRANSLATION = 1;
const LINEAR = 2;
const TRIG = 3;

// Cached value of 2 * Math.PI, which is used for normalizing rotation values.
const TAU = Math.PI * 2;

export class Transform {
    // -------------------------------------------------------------------------
    // MARK: - Authored State
    // -------------------------------------------------------------------------

    #x = 0;
    #y = 0;
    #pivotX = 0;
    #pivotY = 0;
    #scaleX = 1;
    #scaleY = 1;
    #rotation = 0;

    #onInvalidated;

    // -------------------------------------------------------------------------
    // MARK: - Cached Derived State
    // -------------------------------------------------------------------------

    #sin = 0;
    #cos = 1;
    #matrix = new Matrix2();
    #inverseMatrix = new Matrix2();

    // -------------------------------------------------------------------------
    // MARK: - Invalidation
    // -------------------------------------------------------------------------

    #dirtyLevel = CLEAN;
    #isInverseDirty = false;

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    get x() {
        return this.#x;
    }
    set x(value) {
        this.setX(value);
    }

    get y() {
        return this.#y;
    }
    set y(value) {
        this.setY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    get pivotX() {
        return this.#pivotX;
    }
    set pivotX(value) {
        this.setPivotX(value);
    }

    get pivotY() {
        return this.#pivotY;
    }
    set pivotY(value) {
        this.setPivotY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    get scaleX() {
        return this.#scaleX;
    }
    set scaleX(value) {
        this.setScaleX(value);
    }

    get scaleY() {
        return this.#scaleY;
    }
    set scaleY(value) {
        this.setScaleY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    get rotation() {
        return this.#rotation;
    }
    set rotation(value) {
        this.setRotation(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Matrix Accessors
    // -------------------------------------------------------------------------

    get a() {
        return this.#getCleanMatrix().a;
    }
    get b() {
        return this.#getCleanMatrix().b;
    }
    get c() {
        return this.#getCleanMatrix().c;
    }
    get d() {
        return this.#getCleanMatrix().d;
    }
    get tx() {
        return this.#getCleanMatrix().tx;
    }
    get ty() {
        return this.#getCleanMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Matrix Accessors
    // -------------------------------------------------------------------------

    get inverseA() {
        return this.#getCleanInverseMatrix().a;
    }
    get inverseB() {
        return this.#getCleanInverseMatrix().b;
    }
    get inverseC() {
        return this.#getCleanInverseMatrix().c;
    }
    get inverseD() {
        return this.#getCleanInverseMatrix().d;
    }
    get inverseTx() {
        return this.#getCleanInverseMatrix().tx;
    }
    get inverseTy() {
        return this.#getCleanInverseMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    /**
     * Creates a new transform instance.
     *
     * @param {Function|null} [onInvalidated=null] - Optional callback invoked
     *     when the transform is dirtied after previously being up to date.
     */
    constructor(onInvalidated = null) {
        this.#onInvalidated = onInvalidated;
    }

    /**
     * Sets the position, pivot, scale, and rotation of the transform in a
     * single call. The rotation angle is normalized between 0 and 2*PI.
     *
     * @param {number} x - World-space x position.
     * @param {number} y - World-space y position.
     * @param {number} pivotX - x pivot offset in local space.
     * @param {number} pivotY - y pivot offset in local space.
     * @param {number} scaleX - Horizontal scale factor.
     * @param {number} scaleY - Vertical scale factor.
     * @param {number} rotation - Rotation in radians.
     * @returns {Transform} This transform instance.
     */
    set(x, y, pivotX, pivotY, scaleX, scaleY, rotation) {
        const normalizedRotation = this.#normalizedRotation(rotation);

        let dirtyLevel = CLEAN;
        if (this.#rotation !== normalizedRotation) {
            dirtyLevel = TRIG;
        } else if (this.#scaleX !== scaleX || this.#scaleY !== scaleY) {
            dirtyLevel = LINEAR;
        } else if (
            this.#x !== x || this.#y !== y ||
            this.#pivotX !== pivotX || this.#pivotY !== pivotY
        ) {
            dirtyLevel = TRANSLATION;
        }

        this.#x = x;
        this.#y = y;
        this.#pivotX = pivotX;
        this.#pivotY = pivotY;
        this.#scaleX = scaleX;
        this.#scaleY = scaleY;
        this.#rotation = normalizedRotation;
        this.#markDirty(dirtyLevel);

        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Position
    // -------------------------------------------------------------------------

    /**
     * Copies the position coordinates into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The position vector.
     */
    getPosition(out = new Vec2()) {
        return out.set(this.#x, this.#y);
    }

    /**
     * Sets the x position.
     *
     * @param {number} x - New x position.
     * @returns {Transform} This transform instance.
     */
    setX(x) {
        if (this.#x === x) { return this; }
        this.#x = x;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the y position.
     *
     * @param {number} y - New y position.
     * @returns {Transform} This transform instance.
     */
    setY(y) {
        if (this.#y === y) { return this; }
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the position using x and y coordinates.
     *
     * @param {number} x - New x position.
     * @param {number} y - New y position.
     * @returns {Transform} This transform instance.
     */
    setPositionXY(x, y) {
        if (this.#x === x && this.#y === y) { return this; }
        this.#x = x;
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the position from a vector.
     *
     * @param {Vec2} position - Position values.
     * @returns {Transform} This transform instance.
     */
    setPosition(position) {
        return this.setPositionXY(position.x, position.y);
    }

    /**
     * Translates the position by adding x and y offsets.
     *
     * @param {number} dx - Horizontal translation.
     * @param {number} dy - Vertical translation.
     * @returns {Transform} This transform instance.
     */
    translateXY(dx, dy) {
        if (dx === 0 && dy === 0) { return this; }
        this.#x += dx;
        this.#y += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Translates the position by adding a vector delta.
     *
     * @param {Vec2} delta - Translation delta.
     * @returns {Transform} This transform instance.
     */
    translate(delta) {
        return this.translateXY(delta.x, delta.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    /**
     * Copies the pivot offset into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The pivot vector.
     */
    getPivot(out = new Vec2()) {
        return out.set(this.#pivotX, this.#pivotY);
    }

    /**
     * Sets the x pivot offset in local space.
     *
     * @param {number} pivotX - New x pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotX(pivotX) {
        if (this.#pivotX === pivotX) { return this; }
        this.#pivotX = pivotX;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the y pivot offset in local space.
     *
     * @param {number} pivotY - New y pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotY(pivotY) {
        if (this.#pivotY === pivotY) { return this; }
        this.#pivotY = pivotY;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the pivot offset using x and y coordinates in local space.
     *
     * @param {number} pivotX - New x pivot value.
     * @param {number} pivotY - New y pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotXY(pivotX, pivotY) {
        if (this.#pivotX === pivotX && this.#pivotY === pivotY) {
            return this;
        }
        this.#pivotX = pivotX;
        this.#pivotY = pivotY;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the pivot offset from a vector in local space.
     *
     * @param {Vec2} pivot - Pivot values.
     * @returns {Transform} This transform instance.
     */
    setPivot(pivot) {
        return this.setPivotXY(pivot.x, pivot.y);
    }

    /**
     * Translates the pivot offset by adding x and y deltas.
     *
     * @param {number} dx - Horizontal pivot delta.
     * @param {number} dy - Vertical pivot delta.
     * @returns {Transform} This transform instance.
     */
    translatePivotXY(dx, dy) {
        if (dx === 0 && dy === 0) { return this; }
        this.#pivotX += dx;
        this.#pivotY += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Translates the pivot offset by adding a vector delta.
     *
     * @param {Vec2} delta - Pivot delta.
     * @returns {Transform} This transform instance.
     */
    translatePivot(delta) {
        return this.translatePivotXY(delta.x, delta.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    /**
     * Copies the current scale factors into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The current scale vector.
     */
    getScale(out = new Vec2()) {
        return out.set(this.#scaleX, this.#scaleY);
    }

    /**
     * Sets the horizontal scale factor.
     *
     * @param {number} scaleX - New x scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleX(scaleX) {
        if (this.#scaleX === scaleX) { return this; }
        this.#scaleX = scaleX;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Sets the vertical scale factor.
     *
     * @param {number} scaleY - New y scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleY(scaleY) {
        if (this.#scaleY === scaleY) { return this; }
        this.#scaleY = scaleY;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Sets the scale factors using x and y values.
     *
     * @param {number} scaleX - New x scale factor.
     * @param {number} scaleY - New y scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleXY(scaleX, scaleY) {
        if (this.#scaleX === scaleX && this.#scaleY === scaleY) {
            return this;
        }
        this.#scaleX = scaleX;
        this.#scaleY = scaleY;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Sets the scale from a scalar or vector value. A scalar sets both
     * scaleX and scaleY; a vector uses its x and y components.
     *
     * @param {number|Vec2} scaleOrVector - A single factor for both axes, or
     *     a vector whose x/y values set scaleX/scaleY.
     * @returns {Transform} This transform instance.
     */
    setScale(scaleOrVector) {
        return (typeof scaleOrVector === 'number')
            ? this.setScaleXY(scaleOrVector, scaleOrVector)
            : this.setScaleXY(scaleOrVector.x, scaleOrVector.y);
    }

    /**
     * Multiplies the scale by x and y factors.
     *
     * @param {number} factorX - Horizontal scale multiplier.
     * @param {number} factorY - Vertical scale multiplier.
     * @returns {Transform} This transform instance.
     */
    scaleXY(factorX, factorY) {
        if (factorX === 1 && factorY === 1) { return this; }
        this.#scaleX *= factorX;
        this.#scaleY *= factorY;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Multiplies the scale by a scalar or vector value. A scalar multiplies
     * both scaleX and scaleY; a vector multiplies by its x and y components.
     *
     * @param {number|Vec2} factorOrVector - A single multiplier for both
     *     axes, or a vector whose x/y values multiply scaleX/scaleY.
     * @returns {Transform} This transform instance.
     */
    scale(factorOrVector) {
        return (typeof factorOrVector === 'number')
            ? this.scaleXY(factorOrVector, factorOrVector)
            : this.scaleXY(factorOrVector.x, factorOrVector.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation
    // -------------------------------------------------------------------------

    /**
     * Sets the rotation in radians, normalized between 0 and 2*PI.
     *
     * @param {number} radians - Rotation angle in radians.
     * @returns {Transform} This transform instance.
     */
    setRotation(radians) {
        const normalizedRotation = this.#normalizedRotation(radians);
        if (this.#rotation === normalizedRotation) { return this; }
        this.#rotation = normalizedRotation;
        this.#markDirty(TRIG);
        return this;
    }

    /**
     * Adds a delta rotation in radians, normalizing the resulting
     * rotation between 0 and 2*PI.
     *
     * @param {number} deltaRadians - Rotation delta in radians.
     * @returns {Transform} This transform instance.
     */
    rotate(deltaRadians) {
        return this.setRotation(this.#rotation + deltaRadians);
    }

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    /**
     * Transforms a point from local to world space, applying pivot, scale,
     * rotation, and position translation.
     *
     * @param {number} x - Local-space x coordinate.
     * @param {number} y - Local-space y coordinate.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The transformed point.
     */
    transformPointXY(x, y, out = new Vec2()) {
        return this.#getCleanMatrix().transformPointXY(x, y, out);
    }

    /**
     * Transforms a point vector from local to world space, applying pivot,
     * scale, rotation, and position translation.
     *
     * @param {Vec2} point - Local-space point.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The transformed point.
     */
    transformPoint(point, out = new Vec2()) {
        return this.#getCleanMatrix().transformPoint(point, out);
    }

    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param {number} x - Local-space x component.
     * @param {number} y - Local-space y component.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The transformed vector.
     */
    transformVectorXY(x, y, out = new Vec2()) {
        return this.#getCleanMatrix().transformVectorXY(x, y, out);
    }

    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param {Vec2} vector - Local-space vector.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The transformed vector.
     */
    transformVector(vector, out = new Vec2()) {
        return this.#getCleanMatrix().transformVector(vector, out);
    }

    /**
     * Transforms an axis-aligned bounding box from local space to world
     * space.
     *
     * @param {Bounds} bounds - Local-space bounds.
     * @param {Bounds} [out=new Bounds()] - Output bounds.
     * @returns {Bounds} The transformed bounds.
     */
    transformBounds(bounds, out = new Bounds()) {
        return this.#getCleanMatrix().transformBounds(bounds, out);
    }

    /**
     * Applies this transform to an input matrix, combining both
     * transformations into a single matrix.
     *
     * @param {Matrix2} inputMatrix - Matrix to transform.
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The combined matrix.
     */
    transformMatrix(inputMatrix, out = new Matrix2()) {
        return out.copy(inputMatrix).append(this.#getCleanMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    /**
     * Converts a world-space point back to local space by applying inverse
     * translation, rotation, scale, and pivot offsets.
     *
     * @param {number} x - World-space x coordinate.
     * @param {number} y - World-space y coordinate.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The inverse-transformed point.
     */
    inverseTransformPointXY(x, y, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformPointXY(x, y, out);
    }

    /**
     * Converts a world-space point vector back to local space by applying
     * inverse translation, rotation, scale, and pivot offsets.
     *
     * @param {Vec2} point - World-space point.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The inverse-transformed point.
     */
    inverseTransformPoint(point, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformPoint(point, out);
    }

    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param {number} x - World-space x component.
     * @param {number} y - World-space y component.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The inverse-transformed vector.
     */
    inverseTransformVectorXY(x, y, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformVectorXY(x, y, out);
    }

    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param {Vec2} vector - World-space vector.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The inverse-transformed vector.
     */
    inverseTransformVector(vector, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformVector(vector, out);
    }

    /**
     * Transforms an axis-aligned bounding box from world space back to
     * local space.
     *
     * @param {Bounds} bounds - World-space bounds.
     * @param {Bounds} [out=new Bounds()] - Output bounds.
     * @returns {Bounds} The inverse-transformed bounds.
     */
    inverseTransformBounds(bounds, out = new Bounds()) {
        return this.#getCleanInverseMatrix().transformBounds(bounds, out);
    }

    /**
     * Applies the inverse of this transform to an input matrix,
     * combining both transformations into a single matrix.
     *
     * @param {Matrix2} inputMatrix - Matrix to transform.
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The combined matrix.
     */
    inverseTransformMatrix(inputMatrix, out = new Matrix2()) {
        return out.copy(inputMatrix).append(this.#getCleanInverseMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Utilities
    // -------------------------------------------------------------------------

    /**
     * Copies the current 2D affine transform matrix into an output matrix.
     *
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The transform matrix instance.
     */
    getMatrix(out = new Matrix2()) {
        return out.copy(this.#getCleanMatrix());
    }

    /**
     * Returns a direct reference to this Transform's internal clean matrix.
     *
     * WARNING: This is an unsafe escape hatch that exposes internal state:
     * - The returned matrix is owned and internally managed by this Transform.
     * - Mutating the returned object directly affects this Transform and can
     *   invalidate internal state and cached values.
     * - The caller becomes responsible for preserving any documented
     *   invariants.
     * - DO NOT store the returned reference beyond the immediate scope.
     *
     * Prefer `getMatrix(out)` unless you have a strong performance reason to
     * use this method.
     *
     * @returns {Matrix2} Direct reference to the internal clean matrix.
     */
    unsafeGetMatrix() {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    /**
     * Copies the current inverse transform matrix into an output matrix.
     *
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The inverse transform matrix instance.
     */
    getInverseMatrix(out = new Matrix2()) {
        return out.copy(this.#getCleanInverseMatrix());
    }

    /**
     * Returns a direct reference to this Transform's internal clean inverse
     * matrix.
     *
     * WARNING: This is an unsafe escape hatch that exposes internal state:
     * - The returned matrix is owned and internally managed by this Transform.
     * - Mutating the returned object directly affects this Transform and can
     *   invalidate internal state and cached values.
     * - The caller becomes responsible for preserving any documented
     *   invariants.
     * - DO NOT store the returned reference beyond the immediate scope.
     *
     * Prefer `getInverseMatrix(out)` unless you have a strong performance
     * reason to use this method.
     *
     * @returns {Matrix2} Direct reference to the internal clean inverse matrix.
     */
    unsafeGetInverseMatrix() {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
    }

    /**
     * Copies the position, pivot, scale, and rotation values from another
     * transform into this one.
     *
     * @param {Transform} other - Source transform.
     * @returns {Transform} This transform instance.
     */
    copy(other) {
        return this.set(
            other.#x, other.#y,
            other.#pivotX, other.#pivotY,
            other.#scaleX, other.#scaleY,
            other.#rotation
        );
    }

    /**
     * Creates a new transform with the same position, pivot, scale, and
     * rotation values as this transform.
     *
     * @param {Function|null} [onInvalidated=null] - Optional callback
     *     invoked when the transform is dirtied.
     * @returns {Transform} A cloned transform instance.
     */
    clone(onInvalidated = null) {
        return new Transform(onInvalidated).copy(this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    /**
     * Marks the transform dirty at the provided cascade level.
     *
     * @param {number} level - Minimum dirty level to apply.
     */
    #markDirty(level) {
        if (level <= this.#dirtyLevel) { return; }

        const wasClean = this.#dirtyLevel === CLEAN;
        this.#dirtyLevel = level;
        this.#isInverseDirty = true;

        if (wasClean) {
            this.#onInvalidated?.();
        }
    }

    /**
     * Rebuilds the current matrix when it is dirty.
     */
    #updateMatrixIfNeeded() {
        const dirtyLevel = this.#dirtyLevel;
        if (dirtyLevel === CLEAN) { return; }

        if (dirtyLevel >= TRIG) {
            this.#sin = Math.sin(this.#rotation);
            this.#cos = Math.cos(this.#rotation);
        }

        if (dirtyLevel >= LINEAR) {
            this.#matrix.a = this.#cos * this.#scaleX;
            this.#matrix.b = this.#sin * this.#scaleX;
            this.#matrix.c = -this.#sin * this.#scaleY;
            this.#matrix.d = this.#cos * this.#scaleY;
        }

        if (dirtyLevel >= TRANSLATION) {
            this.#matrix.tx = this.#x - this.#pivotX * this.#matrix.a - this.#pivotY * this.#matrix.c;
            this.#matrix.ty = this.#y - this.#pivotX * this.#matrix.b - this.#pivotY * this.#matrix.d;
        }

        this.#dirtyLevel = CLEAN;
    }

    /**
     * Rebuilds the inverse matrix when it is stale.
     */
    #updateInverseMatrixIfNeeded() {
        if (!this.#isInverseDirty) { return; }
        this.#updateMatrixIfNeeded();
        this.#inverseMatrix.copy(this.#matrix).invert();
        this.#isInverseDirty = false;
    }

    /**
     * Returns the current clean matrix, recomputing it if necessary.
     *
     * @returns {Matrix2} The clean matrix.
     */
    #getCleanMatrix() {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    /**
     * Returns the current clean inverse matrix, recomputing it if necessary.
     *
     * @returns {Matrix2} The clean inverse matrix.
     */
    #getCleanInverseMatrix() {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
    }

    /**
     * Normalizes a rotation angle to the range [0, 2*PI).
     *
     * @param {number} radians - Rotation angle in radians.
     * @returns {number} The normalized rotation value.
     */
    #normalizedRotation(radians) {
        let normalizedRadians = radians % TAU;
        if (normalizedRadians < 0) {
            normalizedRadians += TAU;
        }
        return normalizedRadians === 0 ? 0 : normalizedRadians; // Avoid -0 weirdness
    }
}
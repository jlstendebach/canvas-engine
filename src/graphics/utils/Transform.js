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
        return this.unsafeGetMatrix().a;
    }
    get b() {
        return this.unsafeGetMatrix().b;
    }
    get c() {
        return this.unsafeGetMatrix().c;
    }
    get d() {
        return this.unsafeGetMatrix().d;
    }
    get tx() {
        return this.unsafeGetMatrix().tx;
    }
    get ty() {
        return this.unsafeGetMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Matrix Accessors
    // -------------------------------------------------------------------------

    get inverseA() {
        return this.unsafeGetInverseMatrix().a;
    }
    get inverseB() {
        return this.unsafeGetInverseMatrix().b;
    }
    get inverseC() {
        return this.unsafeGetInverseMatrix().c;
    }
    get inverseD() {
        return this.unsafeGetInverseMatrix().d;
    }
    get inverseTx() {
        return this.unsafeGetInverseMatrix().tx;
    }
    get inverseTy() {
        return this.unsafeGetInverseMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    constructor(onInvalidated = null) {
        this.#onInvalidated = onInvalidated;
    }

    set(x, y, pivotX, pivotY, scaleX, scaleY, rotation) {
        const normalizedRotation = this.#normalizedRotation(rotation);

        let dirtyLevel = CLEAN;
        if (this.#rotation !== normalizedRotation) {
            dirtyLevel = TRIG;
        } else if (this.#scaleX !== scaleX || this.#scaleY !== scaleY) {
            dirtyLevel = LINEAR;
        } else if (this.#x !== x || this.#y !== y || this.#pivotX !== pivotX || this.#pivotY !== pivotY) {
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

    getPosition(out = new Vec2()) {
        return out.set(this.#x, this.#y);
    }

    setX(x) {
        if (this.#x === x) { return this; }
        this.#x = x;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setY(y) {
        if (this.#y === y) { return this; }
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setPositionXY(x, y) {
        if (this.#x === x && this.#y === y) { return this; }
        this.#x = x;
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setPosition(position) {
        return this.setPositionXY(position.x, position.y);
    }

    translateXY(dx, dy) {
        if (dx === 0 && dy === 0) { return this; }
        this.#x += dx;
        this.#y += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    translate(delta) {
        return this.translateXY(delta.x, delta.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    getPivot(out = new Vec2()) {
        return out.set(this.#pivotX, this.#pivotY);
    }

    setPivotX(pivotX) {
        if (this.#pivotX === pivotX) { return this; }
        this.#pivotX = pivotX;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setPivotY(pivotY) {
        if (this.#pivotY === pivotY) { return this; }
        this.#pivotY = pivotY;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setPivotXY(pivotX, pivotY) {
        if (this.#pivotX === pivotX && this.#pivotY === pivotY) { return this; }
        this.#pivotX = pivotX;
        this.#pivotY = pivotY;
        this.#markDirty(TRANSLATION);
        return this;
    }

    setPivot(pivot) {
        return this.setPivotXY(pivot.x, pivot.y);
    }

    offsetPivotXY(dx, dy) {
        if (dx === 0 && dy === 0) { return this; }
        this.#pivotX += dx;
        this.#pivotY += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    offsetPivot(offset) {
        return this.offsetPivotXY(offset.x, offset.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    getScale(out = new Vec2()) {
        return out.set(this.#scaleX, this.#scaleY);
    }

    setScaleX(scaleX) {
        if (this.#scaleX === scaleX) { return this; }
        this.#scaleX = scaleX;
        this.#markDirty(LINEAR);
        return this;
    }

    setScaleY(scaleY) {
        if (this.#scaleY === scaleY) { return this; }
        this.#scaleY = scaleY;
        this.#markDirty(LINEAR);
        return this;
    }

    setScale(scaleOrVector) {
        return (typeof scaleOrVector === 'number')
            ? this.setScaleXY(scaleOrVector, scaleOrVector)
            : this.setScaleXY(scaleOrVector.x, scaleOrVector.y);
    }

    setScaleXY(scaleX, scaleY) {
        if (this.#scaleX === scaleX && this.#scaleY === scaleY) { return this; }
        this.#scaleX = scaleX;
        this.#scaleY = scaleY;
        this.#markDirty(LINEAR);
        return this;
    }

    scaleXY(factorX, factorY) {
        if (factorX === 1 && factorY === 1) { return this; }
        this.#scaleX *= factorX;
        this.#scaleY *= factorY;
        this.#markDirty(LINEAR);
        return this;
    }

    scale(factorOrVector) {
        return (typeof factorOrVector === 'number')
            ? this.scaleXY(factorOrVector, factorOrVector)
            : this.scaleXY(factorOrVector.x, factorOrVector.y);
    }

    // MARK: - Rotation
    setRotation(radians) {
        const normalizedRotation = this.#normalizedRotation(radians);
        if (this.#rotation === normalizedRotation) { return this; }
        this.#rotation = normalizedRotation;
        this.#markDirty(TRIG);
        return this;
    }

    rotate(deltaRadians) {
        // Delegate to setRotation() so equivalent full-turn deltas normalize
        // correctly and no-op rotations do not dirty the transform.
        return this.setRotation(this.#rotation + deltaRadians);
    }

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    transformPointXY(x, y, out = new Vec2()) {
        return this.unsafeGetMatrix().transformPointXY(x, y, out);
    }

    transformPoint(point, out = new Vec2()) {
        return this.unsafeGetMatrix().transformPoint(point, out);
    }

    transformVectorXY(x, y, out = new Vec2()) {
        return this.unsafeGetMatrix().transformVectorXY(x, y, out);
    }

    transformVector(vector, out = new Vec2()) {
        return this.unsafeGetMatrix().transformVector(vector, out);
    }

    transformBounds(bounds, out = new Bounds()) {
        return this.unsafeGetMatrix().transformBounds(bounds, out);
    }

    transformMatrix(inputMatrix, out = new Matrix2()) {
        return out.copy(inputMatrix).prepend(this.unsafeGetMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    inverseTransformPointXY(x, y, out = new Vec2()) {
        return this.unsafeGetInverseMatrix().transformPointXY(x, y, out);
    }

    inverseTransformPoint(point, out = new Vec2()) {
        return this.unsafeGetInverseMatrix().transformPoint(point, out);
    }

    inverseTransformVectorXY(x, y, out = new Vec2()) {
        return this.unsafeGetInverseMatrix().transformVectorXY(x, y, out);
    }

    inverseTransformVector(vector, out = new Vec2()) {
        return this.unsafeGetInverseMatrix().transformVector(vector, out);
    }

    inverseTransformBounds(bounds, out = new Bounds()) {
        return this.unsafeGetInverseMatrix().transformBounds(bounds, out);
    }

    inverseTransformMatrix(inputMatrix, out = new Matrix2()) {
        return out.copy(inputMatrix).prepend(this.unsafeGetInverseMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Utilities
    // -------------------------------------------------------------------------

    /**
     * Creates or copies-out a Matrix instance that represents the 
     * transformation defined by this Transform. The returned matrix will be the
     * same reference as the `out` parameter if it was provided, or a new Matrix
     * instance if not.
     * @param {Matrix} out - Optional Matrix instance to store the result. The 
     *     values of the output matrix will be manipulated. If this parameter is
     *     not provided, a new Matrix will be created.
     * @returns {Matrix} A Matrix instance representing the transformation 
     *     defined by this Transform. The returned matrix will be the same 
     *     reference as the `out` parameter if it was provided, or a new Matrix 
     *     instance if not.
     */
    toMatrix(out = new Matrix2()) {
        return out.copy(this.unsafeGetMatrix());
    }

    /**
     * Returns a direct reference to this Transform's internal clean matrix.
     *
     * IMPORTANT: This is a zero-copy escape hatch for performance-critical 
     * code:
     * - The returned matrix is owned by this Transform.
     * - **DO NOT modify** the returned matrix (a, b, c, d, tx, ty).
     * - **DO NOT store** the returned reference beyond the immediate scope.
     * - The matrix may become invalid after any transform change on this object
     *   or its ancestors.
     *
     * Prefer `toMatrix(out)` unless you have a strong performance reason to use
     * this method.
     *
     * @returns {Matrix2} Direct reference to the internal clean matrix.
     */
    unsafeGetMatrix() {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    /**
     * Creates or copies-out a Matrix instance that represents the inverse of 
     * the transformation defined by this Transform. The returned matrix will be 
     * the same reference as the `out` parameter if it was provided, or a new 
     * Matrix instance if not.
     * @param {Matrix2} out - Optional Matrix instance to store the result. The
     *     values of the output matrix will be manipulated. If this parameter is
     *     not provided, a new Matrix will be created.
     * @returns {Matrix2} A Matrix instance representing the inverse of the
     *     transformation defined by this Transform. The returned matrix will be
     *     the same reference as the `out` parameter if it was provided, or a 
     *     new Matrix instance if not.
     */
    toInverseMatrix(out = new Matrix2()) {
        return out.copy(this.unsafeGetInverseMatrix());
    }

    /**
     * Returns a direct reference to this Transform's internal clean inverse 
     * matrix.
     *
     * IMPORTANT: This is a zero-copy escape hatch for performance-critical 
     * code:
     * - The returned matrix is owned by this Transform.
     * - **DO NOT modify** the returned matrix (a, b, c, d, tx, ty).
     * - **DO NOT store** the returned reference beyond the immediate scope.
     * - The matrix may become invalid after any transform change on this object
     *   or its ancestors.
     *
     * Prefer `toInverseMatrix(out)` unless you have a strong performance reason
     * to use this method.
     *
     * @returns {Matrix2} Direct reference to the internal clean inverse matrix.
     */
    unsafeGetInverseMatrix() {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
    }

    /**
     * Copies the values from another Transform instance into this instance.
     * @param {Transform} other - The Transform instance to copy values from.
     * @returns {Transform} This Transform instance.
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
     * Creates a new Transform instance that is an unattached copy of this 
     * transform.
     * @returns {Transform} An unattached copy of this Transform.
     */
    clone() {
        return new Transform().copy(this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #markDirty(level) {
        if (level <= this.#dirtyLevel) { return; }

        const wasClean = this.#dirtyLevel === CLEAN;
        this.#dirtyLevel = level;
        this.#isInverseDirty = true;

        if (wasClean) {
            this.#onInvalidated?.();
        }
    }

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

    #updateInverseMatrixIfNeeded() {
        if (!this.#isInverseDirty) { return; }
        this.#updateMatrixIfNeeded();
        this.#inverseMatrix.copy(this.#matrix).invert();
        this.#isInverseDirty = false;
    }

    #normalizedRotation(radians) {
        let normalizedRadians = radians % TAU;
        if (normalizedRadians < 0) {
            normalizedRadians += TAU;
        }
        return normalizedRadians === 0 ? 0 : normalizedRadians; // Avoids -0 weirdness
    }
}
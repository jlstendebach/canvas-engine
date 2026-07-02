import { Bounds } from "./Bounds.js";
import { Matrix2 } from "./Matrix2.js";
import { Vec2 } from "./Vec2.js";

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

    scaleByXY(factorX, factorY) {
        if (factorX === 1 && factorY === 1) { return this; }
        this.#scaleX *= factorX;
        this.#scaleY *= factorY;
        this.#markDirty(LINEAR);
        return this;
    }

    scaleBy(factorOrVector) {
        return (typeof factorOrVector === 'number')
            ? this.scaleByXY(factorOrVector, factorOrVector)
            : this.scaleByXY(factorOrVector.x, factorOrVector.y);
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
        return this.#getCleanMatrix().transformPointXY(x, y, out);
    }

    transformPoint(point, out = new Vec2()) {
        return this.#getCleanMatrix().transformPoint(point, out);
    }

    transformVectorXY(x, y, out = new Vec2()) {
        return this.#getCleanMatrix().transformVectorXY(x, y, out);
    }

    transformVector(vector, out = new Vec2()) {
        return this.#getCleanMatrix().transformVector(vector, out);
    }

    transformBounds(bounds, out = new Bounds()) {
        return this.#getCleanMatrix().transformBounds(bounds, out);
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    inverseTransformPointXY(x, y, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformPointXY(x, y, out);
    }

    inverseTransformPoint(point, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformPoint(point, out);
    }

    inverseTransformVectorXY(x, y, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformVectorXY(x, y, out);
    }

    inverseTransformVector(vector, out = new Vec2()) {
        return this.#getCleanInverseMatrix().transformVector(vector, out);
    }

    inverseTransformBounds(bounds, out = new Bounds()) {
        return this.#getCleanInverseMatrix().transformBounds(bounds, out);
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
        return out.copy(this.#getCleanMatrix());
    }

    /**
     * Invokes the provided callback with a direct reference to this 
     * `Transform`'s internal clean matrix.
     *
     * The matrix reference is owned by this `Transform` and **must not** be 
     * modified or stored outside the callback. Doing so may break internal 
     * cache invariants and lead to unexpected behavior.
     *
     * Use this as a zero-copy escape hatch when matrix values are needed
     * immediately without allocating or copying into an output matrix.
     *
     * @param {function(Matrix2): void} callback - Invoked synchronously with 
     * the internal clean matrix. The callback **must not** modify or retain the 
     * matrix reference.
     */
    withMatrix(callback) {
        callback(this.#getCleanMatrix());
    }

    /**
     * Creates or copies-out a Matrix instance that represents the inverse of the
     * transformation defined by this Transform. The returned matrix will be the
     * same reference as the `out` parameter if it was provided, or a new Matrix
     * instance if not.
     * @param {Matrix} out - Optional Matrix instance to store the result. The
     *     values of the output matrix will be manipulated. If this parameter is
     *     not provided, a new Matrix will be created.
     * @returns {Matrix} A Matrix instance representing the inverse of the
     *     transformation defined by this Transform. The returned matrix will be
     *     the same reference as the `out` parameter if it was provided, or a new
     *     Matrix instance if not.
     */
    toInverseMatrix(out = new Matrix2()) {
        return out.copy(this.#getCleanInverseMatrix());
    }

    /**
     * Invokes the provided callback with a direct reference to this 
     * `Transform`'s internal clean inverse matrix.
     *
     * The matrix reference is owned by this `Transform` and **must not** be 
     * modified or stored outside the callback. Doing so may break internal 
     * cache invariants and lead to unexpected behavior.
     *
     * Use this as a zero-copy escape hatch when matrix values are needed
     * immediately without allocating or copying into an output matrix.
     *
     * @param {function(Matrix2): void} callback - Invoked synchronously with 
     * the internal clean inverse matrix. The callback **must not** modify or 
     * retain the matrix reference.
     */
    withInverseMatrix(callback) {
        callback(this.#getCleanInverseMatrix());
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

    #getCleanMatrix() {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    #getCleanInverseMatrix() {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
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
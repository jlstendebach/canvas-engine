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

    #x: number = 0;
    #y: number = 0;
    #pivotX: number = 0;
    #pivotY: number = 0;
    #scaleX: number = 1;
    #scaleY: number = 1;
    #rotation: number = 0;

    #onInvalidated?: () => void;

    // -------------------------------------------------------------------------
    // MARK: - Cached Derived State
    // -------------------------------------------------------------------------

    #sin: number = 0;
    #cos: number = 1;
    #matrix: Matrix2 = new Matrix2();
    #inverseMatrix: Matrix2 = new Matrix2();

    // -------------------------------------------------------------------------
    // MARK: - Invalidation
    // -------------------------------------------------------------------------

    #dirtyLevel: number = CLEAN;
    #isInverseDirty: boolean = false;

    // -------------------------------------------------------------------------
    // MARK: - Position Accessors
    // -------------------------------------------------------------------------

    get x(): number {
        return this.#x;
    }
    set x(value: number) {
        this.setX(value);
    }

    get y(): number {
        return this.#y;
    }
    set y(value: number) {
        this.setY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot Accessors
    // -------------------------------------------------------------------------

    get pivotX(): number {
        return this.#pivotX;
    }
    set pivotX(value: number) {
        this.setPivotX(value);
    }

    get pivotY(): number {
        return this.#pivotY;
    }
    set pivotY(value: number) {
        this.setPivotY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale Accessors
    // -------------------------------------------------------------------------

    get scaleX(): number {
        return this.#scaleX;
    }
    set scaleX(value: number) {
        this.setScaleX(value);
    }

    get scaleY(): number {
        return this.#scaleY;
    }
    set scaleY(value: number) {
        this.setScaleY(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Rotation Accessors
    // -------------------------------------------------------------------------

    get rotation(): number {
        return this.#rotation;
    }
    set rotation(value: number) {
        this.setRotation(value);
    }

    // -------------------------------------------------------------------------
    // MARK: - Matrix Accessors
    // -------------------------------------------------------------------------

    get a(): number {
        return this.#getCleanMatrix().a;
    }
    get b(): number {
        return this.#getCleanMatrix().b;
    }
    get c(): number {
        return this.#getCleanMatrix().c;
    }
    get d(): number {
        return this.#getCleanMatrix().d;
    }
    get tx(): number {
        return this.#getCleanMatrix().tx;
    }
    get ty(): number {
        return this.#getCleanMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Matrix Accessors
    // -------------------------------------------------------------------------

    get inverseA(): number {
        return this.#getCleanInverseMatrix().a;
    }
    get inverseB(): number {
        return this.#getCleanInverseMatrix().b;
    }
    get inverseC(): number {
        return this.#getCleanInverseMatrix().c;
    }
    get inverseD(): number {
        return this.#getCleanInverseMatrix().d;
    }
    get inverseTx(): number {
        return this.#getCleanInverseMatrix().tx;
    }
    get inverseTy(): number {
        return this.#getCleanInverseMatrix().ty;
    }

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    /**
     * Creates a new transform instance.
     *
     * @param - Optional callback invoked when the transform is dirtied after 
     *     previously being up to date.
     */
    constructor(onInvalidated?: () => void) {
        this.#onInvalidated = onInvalidated;
    }

    /**
     * Sets the position, pivot, scale, and rotation of the transform in a
     * single call. The rotation angle is normalized between 0 and 2*PI.
     *
     * @param x - World-space x position.
     * @param y - World-space y position.
     * @param pivotX - x pivot offset in local space.
     * @param pivotY - y pivot offset in local space.
     * @param scaleX - Horizontal scale factor.
     * @param scaleY - Vertical scale factor.
     * @param rotation - Rotation in radians.
     * @returns This transform instance.
     */
    set(
        x: number,
        y: number,
        pivotX: number,
        pivotY: number,
        scaleX: number,
        scaleY: number,
        rotation: number
    ): this {
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
     * @param out - Output vector.
     * @returns The position vector.
     */
    getPosition(out: Vec2 = new Vec2()): Vec2 {
        return out.set(this.#x, this.#y);
    }

    /**
     * Sets the x position.
     *
     * @param x - New x position.
     * @returns This transform instance.
     */
    setX(x: number): this {
        if (this.#x === x) { return this; }
        this.#x = x;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the y position.
     *
     * @param y - New y position.
     * @returns This transform instance.
     */
    setY(y: number): this {
        if (this.#y === y) { return this; }
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the position using x and y coordinates.
     *
     * @param x - New x position.
     * @param y - New y position.
     * @returns This transform instance.
     */
    setPositionXY(x: number, y: number): this {
        if (this.#x === x && this.#y === y) { return this; }
        this.#x = x;
        this.#y = y;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the position from a vector.
     *
     * @param position - Position values.
     * @returns This transform instance.
     */
    setPosition(position: Vec2): this {
        return this.setPositionXY(position.x, position.y);
    }

    /**
     * Translates the position by adding x and y offsets.
     *
     * @param dx - Horizontal translation.
     * @param dy - Vertical translation.
     * @returns This transform instance.
     */
    translateXY(dx: number, dy: number): this {
        if (dx === 0 && dy === 0) { return this; }
        this.#x += dx;
        this.#y += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Translates the position by adding a vector delta.
     *
     * @param delta - Translation delta.
     * @returns This transform instance.
     */
    translate(delta: Vec2): this {
        return this.translateXY(delta.x, delta.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Pivot
    // -------------------------------------------------------------------------

    /**
     * Copies the pivot offset into an output vector and returns it.
     *
     * @param out - Output vector.
     * @returns The pivot vector.
     */
    getPivot(out: Vec2 = new Vec2()): Vec2 {
        return out.set(this.#pivotX, this.#pivotY);
    }

    /**
     * Sets the x pivot offset in local space.
     *
     * @param pivotX - New x pivot value.
     * @returns This transform instance.
     */
    setPivotX(pivotX: number): this {
        if (this.#pivotX === pivotX) { return this; }
        this.#pivotX = pivotX;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the y pivot offset in local space.
     *
     * @param pivotY - New y pivot value.
     * @returns This transform instance.
     */
    setPivotY(pivotY: number): this {
        if (this.#pivotY === pivotY) { return this; }
        this.#pivotY = pivotY;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Sets the pivot offset using x and y coordinates in local space.
     *
     * @param pivotX - New x pivot value.
     * @param pivotY - New y pivot value.
     * @returns This transform instance.
     */
    setPivotXY(pivotX: number, pivotY: number): this {
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
     * @param pivot - Pivot values.
     * @returns This transform instance.
     */
    setPivot(pivot: Vec2): this {
        return this.setPivotXY(pivot.x, pivot.y);
    }

    /**
     * Translates the pivot offset by adding x and y deltas.
     *
     * @param dx - Horizontal pivot delta.
     * @param dy - Vertical pivot delta.
     * @returns This transform instance.
     */
    translatePivotXY(dx: number, dy: number): this {
        if (dx === 0 && dy === 0) { return this; }
        this.#pivotX += dx;
        this.#pivotY += dy;
        this.#markDirty(TRANSLATION);
        return this;
    }

    /**
     * Translates the pivot offset by adding a vector delta.
     *
     * @param delta - Pivot delta.
     * @returns This transform instance.
     */
    translatePivot(delta: Vec2): this {
        return this.translatePivotXY(delta.x, delta.y);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scale
    // -------------------------------------------------------------------------

    /**
     * Copies the current scale factors into an output vector and returns it.
     *
     * @param out - Output vector.
     * @returns The current scale vector.
     */
    getScale(out: Vec2 = new Vec2()): Vec2 {
        return out.set(this.#scaleX, this.#scaleY);
    }

    /**
     * Sets the horizontal scale factor.
     *
     * @param scaleX - New x scale factor.
     * @returns This transform instance.
     */
    setScaleX(scaleX: number): this {
        if (this.#scaleX === scaleX) { return this; }
        this.#scaleX = scaleX;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Sets the vertical scale factor.
     *
     * @param scaleY - New y scale factor.
     * @returns This transform instance.
     */
    setScaleY(scaleY: number): this {
        if (this.#scaleY === scaleY) { return this; }
        this.#scaleY = scaleY;
        this.#markDirty(LINEAR);
        return this;
    }

    /**
     * Sets the scale factors using x and y values.
     *
     * @param scaleX - New x scale factor.
     * @param scaleY - New y scale factor.
     * @returns This transform instance.
     */
    setScaleXY(scaleX: number, scaleY: number): this {
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
     * @param scaleOrVector - A single factor for both axes, or a vector whose 
     *     x/y values set scaleX/scaleY.
     * @returns This transform instance.
     */
    setScale(scaleOrVector: number | Vec2): this {
        return (typeof scaleOrVector === 'number')
            ? this.setScaleXY(scaleOrVector, scaleOrVector)
            : this.setScaleXY(scaleOrVector.x, scaleOrVector.y);
    }

    /**
     * Multiplies the scale by x and y factors.
     *
     * @param factorX - Horizontal scale multiplier.
     * @param factorY - Vertical scale multiplier.
     * @returns This transform instance.
     */
    scaleXY(factorX: number, factorY: number): this {
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
     * @param factorOrVector - A single multiplier for both axes, or a vector 
     *     whose x/y values multiply scaleX/scaleY.
     * @returns This transform instance.
     */
    scale(factorOrVector: number | Vec2): this {
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
     * @param radians - Rotation angle in radians.
     * @returns This transform instance.
     */
    setRotation(radians: number): this {
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
     * @param deltaRadians - Rotation delta in radians.
     * @returns This transform instance.
     */
    rotate(deltaRadians: number): this {
        return this.setRotation(this.#rotation + deltaRadians);
    }

    // -------------------------------------------------------------------------
    // MARK: - Transformations
    // -------------------------------------------------------------------------

    /**
     * Transforms a point from local to world space, applying pivot, scale,
     * rotation, and position translation.
     *
     * @param x - Local-space x coordinate.
     * @param y - Local-space y coordinate.
     * @param out - Output point.
     * @returns The transformed point.
     */
    transformPointXY(x: number, y: number, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanMatrix().transformPointXY(x, y, out);
    }

    /**
     * Transforms a point vector from local to world space, applying pivot,
     * scale, rotation, and position translation.
     *
     * @param point - Local-space point.
     * @param out - Output point.
     * @returns The transformed point.
     */
    transformPoint(point: Vec2, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanMatrix().transformPoint(point, out);
    }

    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param x - Local-space x component.
     * @param y - Local-space y component.
     * @param out - Output vector.
     * @returns The transformed vector.
     */
    transformVectorXY(x: number, y: number, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanMatrix().transformVectorXY(x, y, out);
    }

    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param vector - Local-space vector.
     * @param out - Output vector.
     * @returns The transformed vector.
     */
    transformVector(vector: Vec2, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanMatrix().transformVector(vector, out);
    }

    /**
     * Transforms an axis-aligned bounding box from local space to world
     * space.
     *
     * @param bounds - Local-space bounds.
     * @param out - Output bounds.
     * @returns The transformed bounds.
     */
    transformBounds(bounds: Bounds, out: Bounds = new Bounds()): Bounds {
        return this.#getCleanMatrix().transformBounds(bounds, out);
    }

    /**
     * Applies this transform to an input matrix, combining both
     * transformations into a single matrix.
     *
     * @param inputMatrix - Matrix to transform.
     * @param out - Output matrix.
     * @returns The combined matrix.
     */
    transformMatrix(inputMatrix: Matrix2, out: Matrix2 = new Matrix2()): Matrix2 {
        return out.copy(inputMatrix).append(this.#getCleanMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Inverse Transformations
    // -------------------------------------------------------------------------

    /**
     * Converts a world-space point back to local space by applying inverse
     * translation, rotation, scale, and pivot offsets.
     *
     * @param x - World-space x coordinate.
     * @param y - World-space y coordinate.
     * @param out - Output point.
     * @returns The inverse-transformed point.
     */
    inverseTransformPointXY(x: number, y: number, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanInverseMatrix().transformPointXY(x, y, out);
    }

    /**
     * Converts a world-space point vector back to local space by applying
     * inverse translation, rotation, scale, and pivot offsets.
     *
     * @param point - World-space point.
     * @param out - Output point.
     * @returns The inverse-transformed point.
     */
    inverseTransformPoint(point: Vec2, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanInverseMatrix().transformPoint(point, out);
    }

    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param x - World-space x component.
     * @param y - World-space y component.
     * @param out - Output vector.
     * @returns The inverse-transformed vector.
     */
    inverseTransformVectorXY(x: number, y: number, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanInverseMatrix().transformVectorXY(x, y, out);
    }

    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param vector - World-space vector.
     * @param out - Output vector.
     * @returns The inverse-transformed vector.
     */
    inverseTransformVector(vector: Vec2, out: Vec2 = new Vec2()): Vec2 {
        return this.#getCleanInverseMatrix().transformVector(vector, out);
    }

    /**
     * Transforms an axis-aligned bounding box from world space back to
     * local space.
     *
     * @param bounds - World-space bounds.
     * @param out - Output bounds.
     * @returns The inverse-transformed bounds.
     */
    inverseTransformBounds(bounds: Bounds, out: Bounds = new Bounds()): Bounds {
        return this.#getCleanInverseMatrix().transformBounds(bounds, out);
    }

    /**
     * Applies the inverse of this transform to an input matrix,
     * combining both transformations into a single matrix.
     *
     * @param inputMatrix - Matrix to transform.
     * @param out - Output matrix.
     * @returns The combined matrix.
     */
    inverseTransformMatrix(inputMatrix: Matrix2, out: Matrix2 = new Matrix2()): Matrix2 {
        return out.copy(inputMatrix).append(this.#getCleanInverseMatrix());
    }

    // -------------------------------------------------------------------------
    // MARK: - Utilities
    // -------------------------------------------------------------------------

    /**
     * Copies the current 2D affine transform matrix into an output matrix.
     *
     * @param out - Output matrix.
     * @returns The transform matrix instance.
     */
    getMatrix(out: Matrix2 = new Matrix2()): Matrix2 {
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
     * @returns Direct reference to the internal clean matrix.
     */
    unsafeGetMatrix(): Matrix2 {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    /**
     * Copies the current inverse transform matrix into an output matrix.
     *
     * @param out - Output matrix.
     * @returns The inverse transform matrix instance.
     */
    getInverseMatrix(out: Matrix2 = new Matrix2()): Matrix2 {
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
     * @returns Direct reference to the internal clean inverse matrix.
     */
    unsafeGetInverseMatrix(): Readonly<Matrix2> {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
    }

    /**
     * Copies the position, pivot, scale, and rotation values from another
     * transform into this one.
     *
     * @param other - Source transform.
     * @returns This transform instance.
     */
    copy(other: Transform): this {
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
     * @param onInvalidated - Optional callback invoked when the transform is 
     *     dirtied.
     * @returns A cloned transform instance.
     */
    clone(onInvalidated?: () => void): Transform {
        return new Transform(onInvalidated).copy(this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    /**
     * Marks the transform dirty at the provided cascade level.
     *
     * @param level - Minimum dirty level to apply.
     */
    #markDirty(level: number): void {
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
    #updateMatrixIfNeeded(): void {
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
    #updateInverseMatrixIfNeeded(): void {
        if (!this.#isInverseDirty) { return; }
        this.#updateMatrixIfNeeded();
        this.#inverseMatrix.copy(this.#matrix).invert();
        this.#isInverseDirty = false;
    }

    /**
     * Returns the current clean matrix, recomputing it if necessary.
     *
     * @returns The clean matrix.
     */
    #getCleanMatrix(): Matrix2 {
        this.#updateMatrixIfNeeded();
        return this.#matrix;
    }

    /**
     * Returns the current clean inverse matrix, recomputing it if necessary.
     *
     * @returns The clean inverse matrix.
     */
    #getCleanInverseMatrix(): Matrix2 {
        this.#updateInverseMatrixIfNeeded();
        return this.#inverseMatrix;
    }

    /**
     * Normalizes a rotation angle to the range [0, 2*PI).
     *
     * @param radians - Rotation angle in radians.
     * @returns The normalized rotation value.
     */
    #normalizedRotation(radians: number): number {
        let normalizedRadians = radians % TAU;
        if (normalizedRadians < 0) {
            normalizedRadians += TAU;
        }
        return normalizedRadians === 0 ? 0 : normalizedRadians; // Avoid -0 weirdness
    }
}
import { Bounds } from "../../math/Bounds.js";
import { Matrix2 } from "../../math/Matrix2.js";
import { Vec2 } from "../../math/Vec2.js";
export declare class Transform {
    #private;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get rotation(): number;
    set rotation(value: number);
    get a(): any;
    get b(): any;
    get c(): any;
    get d(): any;
    get tx(): any;
    get ty(): any;
    get inverseA(): any;
    get inverseB(): any;
    get inverseC(): any;
    get inverseD(): any;
    get inverseTx(): any;
    get inverseTy(): any;
    /**
     * Creates a new transform instance.
     *
     * @param {Function|null} [onInvalidated=null] - Optional callback invoked
     *     when the transform is dirtied after previously being up to date.
     */
    constructor(onInvalidated?: Function | null);
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
    set(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number): Transform;
    /**
     * Copies the position coordinates into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The position vector.
     */
    getPosition(out?: Vec2): Vec2;
    /**
     * Sets the x position.
     *
     * @param {number} x - New x position.
     * @returns {Transform} This transform instance.
     */
    setX(x: number): Transform;
    /**
     * Sets the y position.
     *
     * @param {number} y - New y position.
     * @returns {Transform} This transform instance.
     */
    setY(y: number): Transform;
    /**
     * Sets the position using x and y coordinates.
     *
     * @param {number} x - New x position.
     * @param {number} y - New y position.
     * @returns {Transform} This transform instance.
     */
    setPositionXY(x: number, y: number): Transform;
    /**
     * Sets the position from a vector.
     *
     * @param {Vec2} position - Position values.
     * @returns {Transform} This transform instance.
     */
    setPosition(position: Vec2): Transform;
    /**
     * Translates the position by adding x and y offsets.
     *
     * @param {number} dx - Horizontal translation.
     * @param {number} dy - Vertical translation.
     * @returns {Transform} This transform instance.
     */
    translateXY(dx: number, dy: number): Transform;
    /**
     * Translates the position by adding a vector delta.
     *
     * @param {Vec2} delta - Translation delta.
     * @returns {Transform} This transform instance.
     */
    translate(delta: Vec2): Transform;
    /**
     * Copies the pivot offset into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The pivot vector.
     */
    getPivot(out?: Vec2): Vec2;
    /**
     * Sets the x pivot offset in local space.
     *
     * @param {number} pivotX - New x pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotX(pivotX: number): Transform;
    /**
     * Sets the y pivot offset in local space.
     *
     * @param {number} pivotY - New y pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotY(pivotY: number): Transform;
    /**
     * Sets the pivot offset using x and y coordinates in local space.
     *
     * @param {number} pivotX - New x pivot value.
     * @param {number} pivotY - New y pivot value.
     * @returns {Transform} This transform instance.
     */
    setPivotXY(pivotX: number, pivotY: number): Transform;
    /**
     * Sets the pivot offset from a vector in local space.
     *
     * @param {Vec2} pivot - Pivot values.
     * @returns {Transform} This transform instance.
     */
    setPivot(pivot: Vec2): Transform;
    /**
     * Translates the pivot offset by adding x and y deltas.
     *
     * @param {number} dx - Horizontal pivot delta.
     * @param {number} dy - Vertical pivot delta.
     * @returns {Transform} This transform instance.
     */
    translatePivotXY(dx: number, dy: number): Transform;
    /**
     * Translates the pivot offset by adding a vector delta.
     *
     * @param {Vec2} delta - Pivot delta.
     * @returns {Transform} This transform instance.
     */
    translatePivot(delta: Vec2): Transform;
    /**
     * Copies the current scale factors into an output vector and returns it.
     *
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The current scale vector.
     */
    getScale(out?: Vec2): Vec2;
    /**
     * Sets the horizontal scale factor.
     *
     * @param {number} scaleX - New x scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleX(scaleX: number): Transform;
    /**
     * Sets the vertical scale factor.
     *
     * @param {number} scaleY - New y scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleY(scaleY: number): Transform;
    /**
     * Sets the scale factors using x and y values.
     *
     * @param {number} scaleX - New x scale factor.
     * @param {number} scaleY - New y scale factor.
     * @returns {Transform} This transform instance.
     */
    setScaleXY(scaleX: number, scaleY: number): Transform;
    /**
     * Sets the scale from a scalar or vector value. A scalar sets both
     * scaleX and scaleY; a vector uses its x and y components.
     *
     * @param {number|Vec2} scaleOrVector - A single factor for both axes, or
     *     a vector whose x/y values set scaleX/scaleY.
     * @returns {Transform} This transform instance.
     */
    setScale(scaleOrVector: number | Vec2): Transform;
    /**
     * Multiplies the scale by x and y factors.
     *
     * @param {number} factorX - Horizontal scale multiplier.
     * @param {number} factorY - Vertical scale multiplier.
     * @returns {Transform} This transform instance.
     */
    scaleXY(factorX: number, factorY: number): Transform;
    /**
     * Multiplies the scale by a scalar or vector value. A scalar multiplies
     * both scaleX and scaleY; a vector multiplies by its x and y components.
     *
     * @param {number|Vec2} factorOrVector - A single multiplier for both
     *     axes, or a vector whose x/y values multiply scaleX/scaleY.
     * @returns {Transform} This transform instance.
     */
    scale(factorOrVector: number | Vec2): Transform;
    /**
     * Sets the rotation in radians, normalized between 0 and 2*PI.
     *
     * @param {number} radians - Rotation angle in radians.
     * @returns {Transform} This transform instance.
     */
    setRotation(radians: number): Transform;
    /**
     * Adds a delta rotation in radians, normalizing the resulting
     * rotation between 0 and 2*PI.
     *
     * @param {number} deltaRadians - Rotation delta in radians.
     * @returns {Transform} This transform instance.
     */
    rotate(deltaRadians: number): Transform;
    /**
     * Transforms a point from local to world space, applying pivot, scale,
     * rotation, and position translation.
     *
     * @param {number} x - Local-space x coordinate.
     * @param {number} y - Local-space y coordinate.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The transformed point.
     */
    transformPointXY(x: number, y: number, out?: Vec2): Vec2;
    /**
     * Transforms a point vector from local to world space, applying pivot,
     * scale, rotation, and position translation.
     *
     * @param {Vec2} point - Local-space point.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The transformed point.
     */
    transformPoint(point: Vec2, out?: Vec2): Vec2;
    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param {number} x - Local-space x component.
     * @param {number} y - Local-space y component.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The transformed vector.
     */
    transformVectorXY(x: number, y: number, out?: Vec2): Vec2;
    /**
     * Transforms a direction vector from local to world space, applying
     * scale and rotation without translation.
     *
     * @param {Vec2} vector - Local-space vector.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The transformed vector.
     */
    transformVector(vector: Vec2, out?: Vec2): Vec2;
    /**
     * Transforms an axis-aligned bounding box from local space to world
     * space.
     *
     * @param {Bounds} bounds - Local-space bounds.
     * @param {Bounds} [out=new Bounds()] - Output bounds.
     * @returns {Bounds} The transformed bounds.
     */
    transformBounds(bounds: Bounds, out?: Bounds): Bounds;
    /**
     * Applies this transform to an input matrix, combining both
     * transformations into a single matrix.
     *
     * @param {Matrix2} inputMatrix - Matrix to transform.
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The combined matrix.
     */
    transformMatrix(inputMatrix: Matrix2, out?: Matrix2): Matrix2;
    /**
     * Converts a world-space point back to local space by applying inverse
     * translation, rotation, scale, and pivot offsets.
     *
     * @param {number} x - World-space x coordinate.
     * @param {number} y - World-space y coordinate.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The inverse-transformed point.
     */
    inverseTransformPointXY(x: number, y: number, out?: Vec2): Vec2;
    /**
     * Converts a world-space point vector back to local space by applying
     * inverse translation, rotation, scale, and pivot offsets.
     *
     * @param {Vec2} point - World-space point.
     * @param {Vec2} [out=new Vec2()] - Output point.
     * @returns {Vec2} The inverse-transformed point.
     */
    inverseTransformPoint(point: Vec2, out?: Vec2): Vec2;
    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param {number} x - World-space x component.
     * @param {number} y - World-space y component.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The inverse-transformed vector.
     */
    inverseTransformVectorXY(x: number, y: number, out?: Vec2): Vec2;
    /**
     * Converts a world-space direction vector back to local space by
     * applying inverse scale and rotation without translation.
     *
     * @param {Vec2} vector - World-space vector.
     * @param {Vec2} [out=new Vec2()] - Output vector.
     * @returns {Vec2} The inverse-transformed vector.
     */
    inverseTransformVector(vector: Vec2, out?: Vec2): Vec2;
    /**
     * Transforms an axis-aligned bounding box from world space back to
     * local space.
     *
     * @param {Bounds} bounds - World-space bounds.
     * @param {Bounds} [out=new Bounds()] - Output bounds.
     * @returns {Bounds} The inverse-transformed bounds.
     */
    inverseTransformBounds(bounds: Bounds, out?: Bounds): Bounds;
    /**
     * Applies the inverse of this transform to an input matrix,
     * combining both transformations into a single matrix.
     *
     * @param {Matrix2} inputMatrix - Matrix to transform.
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The combined matrix.
     */
    inverseTransformMatrix(inputMatrix: Matrix2, out?: Matrix2): Matrix2;
    /**
     * Copies the current 2D affine transform matrix into an output matrix.
     *
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The transform matrix instance.
     */
    getMatrix(out?: Matrix2): Matrix2;
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
    unsafeGetMatrix(): Matrix2;
    /**
     * Copies the current inverse transform matrix into an output matrix.
     *
     * @param {Matrix2} [out=new Matrix2()] - Output matrix.
     * @returns {Matrix2} The inverse transform matrix instance.
     */
    getInverseMatrix(out?: Matrix2): Matrix2;
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
    unsafeGetInverseMatrix(): Matrix2;
    /**
     * Copies the position, pivot, scale, and rotation values from another
     * transform into this one.
     *
     * @param {Transform} other - Source transform.
     * @returns {Transform} This transform instance.
     */
    copy(other: Transform): Transform;
    /**
     * Creates a new transform with the same position, pivot, scale, and
     * rotation values as this transform.
     *
     * @param {Function|null} [onInvalidated=null] - Optional callback
     *     invoked when the transform is dirtied.
     * @returns {Transform} A cloned transform instance.
     */
    clone(onInvalidated?: Function | null): Transform;
}

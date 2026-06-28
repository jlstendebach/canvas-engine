import { Vec2 } from "../../../math/Vec2.js";
import { CoordinateSpace } from "../../utils/CoordinateSpace.js";
import { View } from "../core/View.js";

export class SceneView extends View {
    static #TAU = 2 * Math.PI;
    
    #size = new Vec2();
    #clip = false;
    #scale = 1;
    #translation = new Vec2();
    #rotation = 0;
    
    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.#size.set(
            options.width ?? options.size?.x ?? 0, 
            options.height ?? options.size?.y ?? 0
        );
        this.#clip = options.clip === true;
        this.#scale = options.scale ?? 1;
        if (options.translation instanceof Vec2) {
            this.#translation.copy(options.translation);
        }
        this.#rotation = options.rotation ?? 0;
    }

    // MARK: - Accessors
    set size(size) { 
        this.#assertType("size", size, Vec2);
        if (this.#size.equals(size)) { return; }
        this.#size.copy(size); 
        this.invalidateBounds();
    }    
    get size() { 
        return this.#size; 
    }

    set width(value) { 
        this.#assertFiniteAndPositive("width", value);
        if (this.#size.x === value) { return; }
        this.#size.x = value; 
        this.invalidateBounds();
    }
    get width() { 
        return this.#size.x; 
    }

    set height(value) { 
        this.#assertFiniteAndPositive("height", value);
        if (this.#size.y === value) { return; }
        this.#size.y = value; 
        this.invalidateBounds();
    }
    get height() { 
        return this.#size.y; 
    }

    set clip(clip) { 
        if (typeof clip !== "boolean") { return; }
        if (this.#clip === clip) { return; }
        this.#clip = clip; 
        this.invalidateBounds();
    }
    get clip() { 
        return this.#clip; 
    }

    set scale(scale) { 
        this.#assertFiniteAndPositive("scale", scale);
        this.#scale = scale; 
    }
    get scale() { 
        return this.#scale; 
    }

    set translation(translation) { 
        this.#assertType("translation", translation, Vec2);
        this.#translation.copy(translation); 
    }
    get translation() { 
        return this.#translation; 
    }

    set rotation(rotation) { 
        this.#assertFinite("rotation", rotation);
        this.#rotation = rotation % SceneView.#TAU;
        if (this.#rotation < 0) {
            this.#rotation += SceneView.#TAU;
        }
    }
    get rotation() { 
        return this.#rotation; 
    }

    // MARK: - bounds
    updateBounds(out) {
        if (this.#clip) {
            out.set(0, 0, this.#size.x, this.#size.y);
        } else {
            out.set(-Infinity, -Infinity, Infinity, Infinity);
        }
    }

    /**
     * Checks whether a point in parent space is inside this scene view.
     * If size is zero, the scene is treated as unbounded.
     * @param {Vec2} point - The point in parent space.
     * @returns {boolean} True if the point is in bounds; otherwise false.
     */
    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }

    // MARK: - zoom
    /**
     * Zooms the scene around an anchor point.
     * @param {number} factor - Zoom factor. Values > 1 zoom in, values between 0 and 1 zoom out.
     * @param {Vec2} [anchor=new Vec2()] - Anchor point in local or child space based on coordinateSpace.
     * @param {CoordinateSpace} [coordinateSpace=CoordinateSpace.LOCAL] - The coordinate space of the anchor.
     * @returns {void}
     */
    zoom(factor, anchor = new Vec2(), coordinateSpace = CoordinateSpace.LOCAL) {
        this.#assertFiniteAndPositive("factor", factor);
        this.#assertType("anchor", anchor, Vec2);
        this.#assertCoordinateSpace(coordinateSpace);
        this.#applyTransformWithAnchor(anchor, coordinateSpace, () => {
            this.scale *= factor;
        });      
    }

    // MARK: - rotate
    /**
     * Rotates the scene around an anchor point.
     * @param {number} radians - Rotation amount in radians.
     * @param {Vec2} [anchor=new Vec2()] - Anchor point in local or child space based on coordinateSpace.
     * @param {CoordinateSpace} [coordinateSpace=CoordinateSpace.LOCAL] - The coordinate space of the anchor.
     * @returns {void}
     */
    rotate(radians, anchor = new Vec2(), coordinateSpace = CoordinateSpace.LOCAL) {
        this.#assertFinite("radians", radians);
        this.#assertType("anchor", anchor, Vec2);
        this.#assertCoordinateSpace(coordinateSpace);
        this.#applyTransformWithAnchor(anchor, coordinateSpace, () => {
            this.rotation += radians;
        });      
    }

    // MARK: - translate
    /**
     * Translates the scene by a vector.
     * @param {Vec2} translation - Translation vector in local or child space based on coordinateSpace.
     * @param {CoordinateSpace} [coordinateSpace=CoordinateSpace.LOCAL] - The coordinate space of the translation.
     * @returns {void}
     */
    translate(translation, coordinateSpace = CoordinateSpace.LOCAL) {
        this.#assertType("translation", translation, Vec2);
        this.#assertCoordinateSpace(coordinateSpace);
        if (coordinateSpace === CoordinateSpace.CHILD) {
            this.#translation.add(translation);
            return;
        }
        this.#translation.add(this.#localToChildVector(translation));
    }

    /**
     * Centers the scene so the target point is moved to the view's center.
     * @param {Vec2} target - Target point in local or child space based on coordinateSpace.
     * @param {CoordinateSpace} [coordinateSpace=CoordinateSpace.LOCAL] - The coordinate space of the target.
     * @returns {void}
     */
    centerOn(target, coordinateSpace = CoordinateSpace.LOCAL) {
        this.#assertType("target", target, Vec2);
        this.#assertCoordinateSpace(coordinateSpace);
        const targetLocal = coordinateSpace === CoordinateSpace.CHILD            
            ? this.childToLocal(target)
            : target;
        const translation = this.#size.clone()
            .divideScalar(2)
            .subtract(targetLocal);
        this.translate(translation);
    }

    // MARK: - coordinate conversion
    /**
     * Converts (x, y) from local space to child space. Inputs are assumed to be
     * in local space.
     * @param {Vec2} point - The point in local space to convert.
     * @returns {Vec2} A vector containing the point in child space.
     */
    localToChild(point) {
        this.#assertType("point", point, Vec2);
        return this.#localToChildVector(point).subtract(this.#translation);
    }

    /**
     * Converts (x, y) from child space to local space. Inputs are assumed to be
     * in child space.
     * @param {Vec2} point - The point in child space to convert.
     * @returns {Vec2} A vector containing the point in local space.
     */
    childToLocal(point) {
        this.#assertType("point", point, Vec2);
        return this.#childToLocalVector(point.clone().add(this.#translation));
    }

    // MARK: - drawing
    drawChildren(context) {
        // clipping
        if (this.#clip && !this.#size.isZero()) {

            console.log("clipping to", this.#size.x, this.#size.y);
            context.beginPath();
            context.rect(0, 0, this.#size.x, this.#size.y);
            context.clip();
        }

        // scale, rotate, translate
        if (this.#isScaled()) {
            context.scale(this.#scale, this.#scale);
        }
        if (this.#isRotated()) {
            context.rotate(this.#rotation);
        }
        if (this.#isTranslated()) {
            context.translate(this.#translation.x, this.#translation.y);
        }

        // draw children
        super.drawChildren(context);
    }
    
    // MARK: - helpers
    #applyTransformWithAnchor(anchor, coordinateSpace, transformCallback) {
        let anchorLocal;
        let anchorChild;
        if (coordinateSpace === CoordinateSpace.CHILD) {
            anchorLocal = this.childToLocal(anchor);
            anchorChild = anchor;
        } else {
            anchorLocal = anchor;
            anchorChild = this.localToChild(anchor);
        }
        transformCallback();
        this.#translation = this.#localToChildVector(anchorLocal).subtract(anchorChild);         
    }

    #localToChildVector(vector) {
        const childVector = vector.clone();
        if (this.#isScaled()) {
            childVector.divideScalar(this.#scale);
        }
        if (this.#isRotated()) {
            childVector.rotate(-this.#rotation);
        }
        return childVector;
    }

    #childToLocalVector(vector) {
        const localVector = vector.clone();
        if (this.#isRotated()) {
            localVector.rotate(this.#rotation);
        }
        if (this.#isScaled()) {
            localVector.scale(this.#scale);
        }
        return localVector;
    }

    #isScaled() {
        return this.#scale !== 1;
    }

    #isRotated() {
        return this.#rotation !== 0;
    }

    #isTranslated() {
        return !this.#translation.isZero();
    }

    // MARK: - assertions
    #assertFinite(name, value) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error(`${name} must be a finite number`);
        }
    }
    
    #assertFiniteAndPositive(name, value) {
        if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
            throw new Error(`${name} must be a finite number greater than 0`);
        }
    }

    #assertType(name, value, type) {
        if (!(value instanceof type)) {
            throw new Error(`${name} must be an instance of ${type.name}`);
        }
    }

    #assertCoordinateSpace(coordinateSpace) {
        if (
            coordinateSpace !== CoordinateSpace.LOCAL
            && coordinateSpace !== CoordinateSpace.CHILD
        ) {
            throw new Error("coordinateSpace must be CoordinateSpace.LOCAL or CoordinateSpace.CHILD");
        }
    }

}
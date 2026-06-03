import { View } from "./View.js"
import { Vec2 } from "../../math/index.js"

/**
 * Parent space:
 * - Coordinates relative to the parent view's position.
 * - A point at (0, 0) is the origin of the parent view.
 * - A point at (position.x, position.y) represents the origin of this view.
 * 
 * Local space: 
 * - Coordinates relative to this view's position. 
 * - A point at (0, 0) represents the origin of this view.
 * 
 * Child space:
 * - Coordinates relative to this view's children before any transformations.
 * - If this view has no transformations, then local space and child space are the same.
 * - If this view has transformations (translation, rotation, scale), then child
 *   space is the coordinate space of the children before any transformations 
 *   are applied.
 */
export const CoordinateSpace = Object.freeze({
    LOCAL: 0,
    CHILD: 1,
});

export class SceneView extends View {
    #size = new Vec2();
    #clip = false;
    #scale = 1;
    #translation = new Vec2();
    #rotation = 0;
    
    // MARK: - properties
    set size(size) { 
        this.#assertType("size", size, Vec2);
        this.#size = size.clone(); 
    }
    
    get size() { 
        return this.#size; 
    }

    set clip(clip) { 
        this.#clip = (clip === true); 
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
        this.#translation = translation.clone(); 
    }

    get translation() { 
        return this.#translation; 
    }

    set rotation(rotation) { 
        this.#assertFinite("rotation", rotation);
        const tau = 2 * Math.PI;
        this.#rotation = ((rotation % tau) + tau) % tau;
    }

    get rotation() { 
        return this.#rotation; 
    }

    // MARK: - bounds
    /**
     * Checks whether a point in parent space is inside this scene view.
     * If size is zero, the scene is treated as unbounded.
     * @param {number} x - The x coordinate in parent space.
     * @param {number} y - The y coordinate in parent space.
     * @returns {boolean} True if the point is in bounds; otherwise false.
     */
    isInBounds(x, y) {
        this.#assertFinite("x", x);
        this.#assertFinite("y", y);
        return this.#size.isZero() || (
            x >= this.position.x
            && x < this.position.x + this.#size.x
            && y >= this.position.y
            && y < this.position.y + this.#size.y
        );
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
            ? this.childToLocal(target.x, target.y)
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
     * @param {number} x - The x coordinate in local space.
     * @param {number} y - The y coordinate in local space.
     * @returns {Vec2} A vector containing the point in child space.
     */
    localToChild(x, y) {
        this.#assertFinite("x", x);
        this.#assertFinite("y", y);
        return this.#localToChildVector(new Vec2(x, y)).subtract(this.#translation);
    }

    /**
     * Converts (x, y) from child space to local space. Inputs are assumed to be
     * in child space.
     * @param {number} x - The x coordinate in child space.
     * @param {number} y - The y coordinate in child space.
     * @returns {Vec2} A vector containing the point in local space.
     */
    childToLocal(x, y) {
        this.#assertFinite("x", x);
        this.#assertFinite("y", y);
        let localPoint = new Vec2(x, y);
        localPoint.add(this.#translation);
        if (this.#isRotated()) {
            localPoint.rotate(this.#rotation);
        }
        if (this.#isScaled()) {
            localPoint.scale(this.#scale);
        }
        return localPoint;
    }

    // MARK: - drawing
    drawChildren(context) {
        // clipping
        if (this.#clip && !this.#size.isZero()) {
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
        let anchorChildBefore;
        if (coordinateSpace === CoordinateSpace.CHILD) {
            anchorLocal = this.childToLocal(anchor.x, anchor.y);
            anchorChildBefore = anchor;
        } else {
            anchorLocal = anchor;
            anchorChildBefore = this.localToChild(anchor.x, anchor.y);
        }
        transformCallback();
        const anchorChildAfter = this.localToChild(anchorLocal.x, anchorLocal.y);
        this.translate(anchorChildAfter.subtract(anchorChildBefore), CoordinateSpace.CHILD);          
    }

    #localToChildVector(vector) {
        const childVector = vector.clone();
        if (this.#isRotated()) {
            childVector.rotate(-this.#rotation);
        }
        if (this.#isScaled()) {
            childVector.divideScalar(this.#scale);
        }
        return childVector;
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
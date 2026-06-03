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

/*
What do I want from this view?
- I want this view to represent a scene that can be panned, zoomed, and rotated.
- Should be able to center on a specific point in the scene. Methods should be 
  available to center on a point in child space or local space.
- Should be able to zoom in and out of the scene, with the zoom centered on a 
  specific point. Methods should be available to zoom relative to a point in 
  child space or local space.
- Should be able to rotate the scene around a specific point. Methods should be
  available to rotate around a point in child space or local space.
- Should be able to convert coordinates between local space and child space.
- I need a set of functions that will operate in local space
- I need a set of functions that will operate in child space
- The distinction between the two should be clear and intuitive.
*/

export class SceneView extends View {
    #size = new Vec2();
    #clip = false;
    #scale = 1;
    #translation = new Vec2();
    #rotation = 0;
    
    // MARK: - properties
    set size(size) { 
        if (!(size instanceof Vec2)) {
            throw new Error("size must be an instance of Vec2");
        }
        this.#size = size; 
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
        if (typeof scale !== "number" || isNaN(scale)) {
            throw new Error("scale must be a valid number");
        }
        this.#scale = scale; 
    }
    
    get scale() { 
        return this.#scale; 
    }

    set translation(translation) { 
        if (!(translation instanceof Vec2)) {
            throw new Error("translation must be an instance of Vec2");
        }
        this.#translation = translation; 
    }

    get translation() { 
        return this.#translation; 
    }

    set rotation(rotation) { 
        if (typeof rotation !== "number" || isNaN(rotation)) {
            throw new Error("rotation must be a valid number");
        }
        this.#rotation = rotation % (2 * Math.PI); 
    }

    get rotation() { 
        return this.#rotation; 
    }


    // MARK: - bounds
    isInBounds(x, y) {
        return this.#size.isZero() || (
            x >= this.position.x
            && x < this.position.x + this.#size.x
            && y >= this.position.y
            && y < this.position.y + this.#size.y
        );
    }

    // MARK: - transformations
    zoom(factor, anchor = new Vec2(), isLocalSpace = true) {
        const anchorInLocalSpace = isLocalSpace
            ? anchor
            : this.childToLocal(anchor.x, anchor.y);
        const anchorInLocalSpaceRotated = anchorInLocalSpace.clone().rotate(-this.#rotation); // Undo the rotation
        this.#translation.subtract(anchorInLocalSpaceRotated.clone().divideScalar(this.#scale));
        this.#scale *= factor;
        this.#translation.add(anchorInLocalSpaceRotated.clone().divideScalar(this.#scale));
    }   


    rotate(radians, anchor = new Vec2(), isLocalSpace = true) {
        const anchorInLocalSpace = isLocalSpace 
            ? anchor 
            : this.childToLocal(anchor.x, anchor.y);
        this.translate(anchorInLocalSpace.clone().negate());
        this.#rotation += radians;
        this.translate(anchorInLocalSpace.clone());
    }

    translate(translation, isLocalSpace = true) {
        if (!(translation instanceof Vec2)) {
            throw new Error("translation must be an instance of Vec2");
        }
        if (!isLocalSpace) {
            this.#translation.add(translation);
            return;
        }
        const adjustedTranslation = translation.clone()
            .rotate(-this.#rotation) // Undo the rotation
            .divideScalar(this.#scale); // Undo the scale
        this.#translation.add(adjustedTranslation);
    }

    /**
     * Adjust the translation to put (x, y) at the center of the scene. Both x and
     * y are expected to be in child space.
     * @param {Number} x - The x coordinate in child space.
     * @param {Number} y - The y coordinate in child space.
     * @return {void} - Nothing
     */
    centerOn(x, y) {
        this.#translation.set(-x, -y);
        this.#translation.rotate(this.#rotation);
        this.#translation.x += this.#size.x / (2 * this.#scale);
        this.#translation.y += this.#size.y / (2 * this.#scale);
    }



    // --[ coordinate conversion ]------------------------------------------------
    /**
     * Converts (x, y) from local space to child space. Inputs are assumed to be
     * in local space.
     * @param {Number} x - The x coordinate in local space.
     * @param {Number} y - The y coordinate in local space.
     * @return {Vec2} - A vector containing the point in child space.
     */
    localToChild(x, y) {
        return new Vec2(x, y)
            .scale(1/this.#scale)
            .rotate(-this.#rotation)
            .subtract(this.#translation);
   }

    /**
     * Converts (x, y) from child space to local space. Inputs are assumed to be
     * in child space.
     * @param {Number} x - The x coordinate in local space.
     * @param {Number} y - The y coordinate in local space.
     * @return {Vec2} - A vector containing the point in local space.
     */
    childToLocal(x, y) {
        return new Vec2(x, y)
            .add(this.#translation)
            .rotate(this.#rotation)
            .scale(this.#scale);
    }


    // --[ drawing ]--------------------------------------------------------------
    drawChildren(context) {
        // clipping
        if (this.#clip && !this.#size.isZero()) {
            context.beginPath();
            context.rect(0, 0, this.#size.x, this.#size.y);
            context.clip();
        }

        // scale, rotate, translate
        if (this.#scale != 1) {
            context.scale(this.#scale, this.#scale);
        }
        if (this.#rotation != 0) {
            context.rotate(this.#rotation);
        }
        if (!this.#translation.isZero()) {
            context.translate(this.#translation.x, this.#translation.y);
        }

        // draw children
        super.drawChildren(context);
    }

}
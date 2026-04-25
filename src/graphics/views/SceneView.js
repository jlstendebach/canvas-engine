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

export class SceneView extends View {
    constructor() {
        super();
        this.size = new Vec2();

        this.scale = 1;
        this.translation = new Vec2();
        this.rotation = 0;

        this.clip = false;
    }


    // --[ bounds ]---------------------------------------------------------------
    isInBounds(x, y) {
        return this.size.isZero() || (
            x >= this.position.x
            && x < this.position.x + this.size.x
            && y >= this.position.y
            && y < this.position.y + this.size.y
        );
    }

    /********/
    /* size */
    /********/
    setWidth(w) { this.size.x = w; }
    getWidth() { return this.size.x; }

    setHeight(h) { this.size.y = h; }
    getHeight() { return this.size.y; }

    setSize(s) { this.size = s; }
    getSize() { return this.size; }


    // --[ scale ]----------------------------------------------------------------
    setScale(s) { this.scale = s; }
    getScale() { return this.scale; }

    getScaledWidth() { return this.size.x / this.scale; }
    getScaledHeight() { return this.size.y / this.scale; }
    getScaledSize() { return Vec2.scale(this.size, 1/this.scale); }

    zoom(x, y, factor) {
        this.translation.x += x/this.scale;
        this.translation.y += y/this.scale;
        this.scale *= factor;
        this.translation.x -= x/this.scale;
        this.translation.y -= y/this.scale;
    }   


    // --[ translation ]----------------------------------------------------------
    setTranslation(t) { this.translation = t; }
    getTranslation() { return this.translation; }

    translate(x, y, scaled = false) {
        if (scaled) {
            this.translation.x += x / this.scale;
            this.translation.y += y / this.scale;
        } else {
            this.translation.x += x;
            this.translation.y += y;
        }
    }

    /**
     * Adjust the translation to put (x, y) at the center of the scene. Both x and
     * y are expected to be in child space.
     * @param {Number} x - The x coordinate in child space.
     * @param {Number} y - The y coordinate in child space.
     * @return {void} - Nothing
     */
    centerOn(x, y) {
        this.translation.set(x, y);
        this.translation.rotate(this.rotation);
        this.translation.x -= this.size.x / (2 * this.scale);
        this.translation.y -= this.size.y / (2 * this.scale);
    }


    // --[ rotation ]-------------------------------------------------------------
    setRotation(r) { this.rotation = r % (2 * Math.PI); }
    getRotation() { return this.rotation; }

    rotate(r) {
        this.setRotation(this.rotation + r);
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
            .scale(1/this.scale)
            .add(this.translation)
            .rotate(-this.rotation);
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
            .rotate(this.rotation)
            .subtract(this.translation)
            .scale(this.scale);
    }


    // --[ drawing ]--------------------------------------------------------------
    drawChildren(context) {
        context.save();

        // clipping
        if (this.clip && !this.size.isZero()) {
            context.rect(0, 0, this.size.x, this.size.y);
            context.clip();
        }

        // translate, scale, rotate
        context.scale(this.scale, this.scale);
        context.translate(-this.translation.x, -this.translation.y);
        context.rotate(this.rotation);

        // draw children
        super.drawChildren(context);

        context.restore();
    }

}
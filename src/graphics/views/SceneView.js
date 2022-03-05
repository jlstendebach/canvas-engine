import { View } from "./View.js"
import { Vec2 } from "../../math/Math.js"

/**
 * Definitions:
 * - Child space:
 *   - The (x, y) space of the child views before being scaled, translated, and 
 *     rotated.
 * - Local space: 
 *   - (0, 0) is the top-left of the view, (width, height) is the bottom-right 
 *     of the view.
 * - Parent space:
 *   - (x, y) is the top-left of the view, (x+width, y+height) is the
 *     bottom-right of the view.
 */

export class SceneView extends View {
    constructor() {
        super();
        this.position = new Vec2();
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

    /************/
    /* position */
    /************/
    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    setPosition(p) { this.position = p; }
    getPosition() { return this.position; }

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
    getScaledSize() { return Vec2.div(this.size, this.scale); }


    // --[ translation ]----------------------------------------------------------
    setTranslation(t) { this.translation = t; }
    getTranslation() { return this.translation; }

    translate(x, y) {
        this.translation.x += x;
        this.translation.y += y;
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
        let point = new Vec2(x, y);
        point.div(this.scale);
        point.add(this.translation);
        point.rotate(-this.rotation);
        return point;
    }

    /**
     * Converts (x, y) from child space to local space. Inputs are assumed to be
     * in child space.
     * @param {Number} x - The x coordinate in local space.
     * @param {Number} y - The y coordinate in local space.
     * @return {Vec2} - A vector containing the point in local space.
     */
    childToLocal(x, y) {
        let point = new Vec2(x, y);
        point.rotate(this.rotation);
        point.sub(this.translation);
        point.mult(this.scale);
        return point
    }


    // --[ view ]-----------------------------------------------------------------
    pickView(x, y) {
        let p = this.localToChild(x, y);
        return super.pickView(p.x, p.y);
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
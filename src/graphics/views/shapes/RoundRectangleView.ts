import { RectangleView } from "./RectangleView.js";

export class RoundRectangleView extends RectangleView {
    #cornerRadii = [
        0, // top-left
        0, // top-right
        0, // bottom-right
        0  // bottom-left
    ]; 

    // MARK: - Accessors
    get cornerRadius() {
        return this.#cornerRadii[0];
    }
    set cornerRadius(value) {
        this.setCornerRadius(value);
    }

    get topLeftRadius() {
        return this.#cornerRadii[0];
    }
    set topLeftRadius(value) {
        this.setTopLeftRadius(value);
    }

    get topRightRadius() {
        return this.#cornerRadii[1];
    }
    set topRightRadius(value) {
        this.setTopRightRadius(value);
    }

    get bottomRightRadius() {
        return this.#cornerRadii[2];
    }
    set bottomRightRadius(value) {
        this.setBottomRightRadius(value);
    }

    get bottomLeftRadius() {
        return this.#cornerRadii[3];
    }
    set bottomLeftRadius(value) {
        this.setBottomLeftRadius(value);
    }

    // MARK: - Initialization
    constructor(width = 10, height = 10, cornerRadius = 0) {
        super(width, height);
        this.setCornerRadius(cornerRadius);
    }

    // MARK: - Corner Radius
    getCornerRadii(out = []) {
        out[0] = this.#cornerRadii[0];
        out[1] = this.#cornerRadii[1];
        out[2] = this.#cornerRadii[2];
        out[3] = this.#cornerRadii[3];
        return out;
    }

    setCornerRadii(topLeft, topRight, bottomRight, bottomLeft) {
        this.#cornerRadii[0] = topLeft;
        this.#cornerRadii[1] = topRight;
        this.#cornerRadii[2] = bottomRight;
        this.#cornerRadii[3] = bottomLeft;
        return this;
    }

    setCornerRadius(cornerRadius) {
        this.#cornerRadii.fill(cornerRadius);
        return this;
    }

    setTopLeftRadius(value) {
        this.#cornerRadii[0] = value;
        return this;
    }

    setTopRightRadius(value) {
        this.#cornerRadii[1] = value;
        return this;
    }

    setBottomRightRadius(value) {
        this.#cornerRadii[2] = value;
        return this;
    }

    setBottomLeftRadius(value) {
        this.#cornerRadii[3] = value;
        return this;
    }

    // MARK: - Hit Testing
    containsPoint(point) {
        if (!this.bounds.containsPoint(point)) { return false; }

        const [tl, tr, br, bl] = this.#cornerRadii;

        // Check top-left corner
        if (point.x < tl && point.y < tl) {
            const dx = point.x - tl;
            const dy = point.y - tl;
            return (dx * dx + dy * dy) <= (tl * tl);
        }

        // Check top-right corner
        if (point.x > this.width - tr && point.y < tr) {
            const dx = point.x - (this.width - tr);
            const dy = point.y - tr;
            return (dx * dx + dy * dy) <= (tr * tr);
        }

        // Check bottom-right corner
        if (point.x > this.width - br && point.y > this.height - br) {
            const dx = point.x - (this.width - br);
            const dy = point.y - (this.height - br);
            return (dx * dx + dy * dy) <= (br * br);
        }

        // Check bottom-left corner
        if (point.x < bl && point.y > this.height - bl) {
            const dx = point.x - bl;
            const dy = point.y - (this.height - bl);
            return (dx * dx + dy * dy) <= (bl * bl);
        }

        return true;
    }

    // MARK: - Drawing
    path(context) {
        context.roundRect(0, 0, this.width, this.height, this.#cornerRadii);
    }

}
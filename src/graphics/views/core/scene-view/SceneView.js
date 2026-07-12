import { CoordinateSpace } from "../../../utils/CoordinateSpace.js";
import { Size } from "../../../utils/Size.js";
import { View } from "../View.js";
import { SceneContentView } from "./SceneContentView.js";

export class SceneView extends View {
    #width = 0;
    #height = 0;

    #contentView = new SceneContentView(this);
    
    // MARK: - Initialization
    constructor(width = 100, height = 100, options = {}) {
        super(options);
        this.#width = width;
        this.#height = height;
    }

    // MARK: - Accessors
    get width() { 
        return this.#width; 
    }
    set width(value) { 
        this.setWidth(value);
    }

    get height() { 
        return this.#height; 
    }
    set height(value) { 
        this.setHeight(value);
    }

    // MARK: - Size
    getSize(out = new Size()) { 
        return out.set(this.#width, this.#height);
    }

    setSizeWH(width, height) { 
        if (this.#width === width && this.#height === height) { return this; }
        this.#width = width;
        this.#height = height;
        this.invalidateBounds();
        return this;
    }

    setSize(size) {
        return this.setSizeWH(size.width, size.height);
    }

    setWidth(width) {
        if (this.#width === width) { return this; }
        this.#width = width;
        this.invalidateBounds();
        return this;
    }

    setHeight(height) {
        if (this.#height === height) { return this; }
        this.#height = height;
        this.invalidateBounds();
        return this;
    }

    // MARK: - Children
    addView(view) {
        this.#contentView.addView(view);
        return this;
    }

    removeView(view) {
        this.#contentView.removeView(view);
        return this;
    }

    removeAllViews() {
        this.#contentView.removeAllViews();
        return this;
    }

    getViews() {
        return this.#contentView.getViews();
    }

    getViewCount() {
        return this.#contentView.getViewCount();
    }

    pickView(point) {
        if (this.isVisible === false || this.isPickable === false) {
            return null;
        }

        const localPoint = this.parentToLocalPoint(point);
        if (!this.containsPoint(localPoint)) { return null; }

        const view = this.#contentView.pickView(localPoint);
        return view !== null ? view : this;
    }    


    // MARK: - bounds
    updateBounds(out) {
        out.set(0, 0, this.#width, this.#height);
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }


    // MARK: - Child Transformations
    centerOn(x, y, coordinateSpace = CoordinateSpace.LOCAL) {
        return this;
    }

    zoomOn(factor, x, y, coordinateSpace = CoordinateSpace.LOCAL) {
        return this;
    }

    rotateAround(radians, x, y, coordinateSpace = CoordinateSpace.LOCAL) {
        return this;
    }

    // MARK: - Drawing
    onDraw(context) {
        context.beginPath();
        context.rect(0, 0, this.#width, this.#height);
        context.clip();
    }

    drawChildren(context) {
        this.#contentView.draw(context);
    }
    
}
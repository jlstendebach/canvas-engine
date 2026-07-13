import { Bounds } from "../../../../math/Bounds.js";
import { Vec2 } from "../../../../math/Vec2.js";
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

    get content() {
        return this.#contentView;
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


    // -------------------------------------------------------------------------
    // MARK: - Child Transformations
    // -------------------------------------------------------------------------    

    translateContent(dx, dy) {
        this.#contentView.translateXY(dx, dy);
        return this;
    }        

    centerOn(x, y, coordinateSpace = CoordinateSpace.LOCAL) {
        this.#contentView.setPositionXY(this.#width/2, this.#height/2);

        const contentPoint = new Vec2(x, y);
        if (coordinateSpace === CoordinateSpace.LOCAL) {
            this.localToContentPoint(contentPoint, contentPoint);
        }

        this.#contentView.setPivot(contentPoint);
        return this;
    }

    zoomOn(factor, anchorX, anchorY) {
        const dx = this.#contentView.transform.x - anchorX;
        const dy = this.#contentView.transform.y - anchorY;

        this.#contentView.transform.setPositionXY(
            anchorX + (dx * factor),
            anchorY + (dy * factor)
        );
        this.#contentView.transform.scaleBy(factor);

        return this;
    }

    rotateAround(radians, pivotX, pivotY) {
        const dx = this.#contentView.transform.x - pivotX;
        const dy = this.#contentView.transform.y - pivotY;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        this.#contentView.transform.setPositionXY(
            pivotX + (dx * cos) - (dy * sin),
            pivotY + (dx * sin) + (dy * cos)
        );
        this.#contentView.transform.rotate(radians);

        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Child Conversions
    // -------------------------------------------------------------------------    

    contentToLocalPointXY(x, y, out = new Vec2()) {
        return this.#contentView.localToParentPointXY(x, y, out);
    }

    contentToLocalPoint(point, out = new Vec2()) {
        return this.#contentView.localToParentPoint(point, out);
    }

    contentToLocalVectorXY(x, y, out = new Vec2()) {
        return this.#contentView.localToParentVectorXY(x, y, out);
    }

    contentToLocalVector(vector, out = new Vec2()) {
        return this.#contentView.localToParentVector(vector, out);
    }

    contentToLocalBounds(bounds, out = new Bounds()) {
        return this.#contentView.localToParentBounds(bounds, out);
    }

    localToContentPointXY(x, y, out = new Vec2()) {
        return this.#contentView.parentToLocalPointXY(x, y, out);
    }

    localToContentPoint(point, out = new Vec2()) {
        return this.#contentView.parentToLocalPoint(point, out);
    }

    localToContentVectorXY(x, y, out = new Vec2()) {
        return this.#contentView.parentToLocalVectorXY(x, y, out);
    }

    localToContentVector(vector, out = new Vec2()) {
        return this.#contentView.parentToLocalVector(vector, out);
    }

    localToContentBounds(bounds, out = new Bounds()) {
        return this.#contentView.parentToLocalBounds(bounds, out);
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing
    // -------------------------------------------------------------------------

    onDraw(context) {
        context.beginPath();
        context.rect(0, 0, this.#width, this.#height);
        context.clip();
    }

    drawChildren(context) {
        this.#contentView.draw(context);
    }

}
import { Vec2 } from "../../../../math/Vec2.js";
import { CoordinateSpace } from "../../../utils/CoordinateSpace.js";
import { Size } from "../../../utils/Size.js";
import { View } from "../View.js";
import { SceneContentView } from "./SceneContentView.js";

export class SceneView extends View {
    #width = 0;
    #height = 0;

    #contentView = new SceneContentView(this);

    // -------------------------------------------------------------------------
    // MARK: - Initialization
    // -------------------------------------------------------------------------

    constructor(width = 100, height = 100) {
        super();
        this.#width = width;
        this.#height = height;
    }

    // -------------------------------------------------------------------------
    // MARK: - Accessors
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Size
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Children
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // MARK: - Child Transformations
    // -------------------------------------------------------------------------    

    translateContent(dx, dy, coordinateSpace = CoordinateSpace.LOCAL) {
        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const localDelta = this.#contentView.localToParentVectorXY(dx, dy);
            this.#contentView.translate(localDelta);

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            this.#contentView.translateXY(dx, dy);
        }

        return this;
    }

    scaleContent(factorOrVector) {
        this.#contentView.scale(factorOrVector);
        return this;
    }

    scaleAround(factor, anchorX, anchorY, coordinateSpace = CoordinateSpace.LOCAL) {
        let dx = this.#contentView.transform.x;
        let dy = this.#contentView.transform.y;

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const anchor = this.#contentView.localToParentPointXY(anchorX, anchorY);
            dx -= anchor.x;
            dy -= anchor.y;
            this.#contentView.transform.setPositionXY(
                anchor.x + (dx * factor),
                anchor.y + (dy * factor)
            );

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            dx -= anchorX;
            dy -= anchorY;
            this.#contentView.transform.setPositionXY(
                anchorX + (dx * factor),
                anchorY + (dy * factor)
            );
        }

        this.#contentView.transform.scale(factor);

        return this;
    }

    rotateAround(radians, pivotX, pivotY, coordinateSpace = CoordinateSpace.LOCAL) {
        let dx = this.#contentView.transform.x;
        let dy = this.#contentView.transform.y;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const localPivot = this.#contentView.localToParentPointXY(pivotX, pivotY);
            dx -= localPivot.x;
            dy -= localPivot.y;
            this.#contentView.transform.setPositionXY(
                localPivot.x + (dx * cos) - (dy * sin),
                localPivot.y + (dx * sin) + (dy * cos)
            );

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            dx -= pivotX;
            dy -= pivotY;
            this.#contentView.transform.setPositionXY(
                pivotX + (dx * cos) - (dy * sin),
                pivotY + (dx * sin) + (dy * cos)
            );
        }

        this.#contentView.transform.rotate(radians);

        return this;
    }

    centerOn(x, y, coordinateSpace = CoordinateSpace.LOCAL) {
        this.#contentView.setPositionXY(this.#width / 2, this.#height / 2);

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            this.#contentView.setPivotXY(x, y);

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            const contentPoint = new Vec2(x, y);
            this.#contentView.parentToLocalPoint(contentPoint, contentPoint);
            this.#contentView.setPivot(contentPoint);
        }

        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds
    // -------------------------------------------------------------------------

    updateBounds(out) {
        out.set(0, 0, this.#width, this.#height);
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
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
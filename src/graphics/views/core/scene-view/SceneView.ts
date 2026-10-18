import type { Bounds } from "../../../../math/Bounds.js";
import { Vec2 } from "../../../../math/Vec2.js";
import { CoordinateSpace } from "../../../utils/CoordinateSpace.js";
import { Size } from "../../../utils/Size.js";
import { View } from "../View.js";
import { SceneContentView } from "./SceneContentView.js";


export class SceneView extends View {
    #width: number;
    #height: number;

    #contentView: SceneContentView;

    // -------------------------------------------------------------------------
    // MARK: - Initialization
    // -------------------------------------------------------------------------

    constructor(width: number = 100, height: number = 100) {
        super();
        this.#width = width;
        this.#height = height;
        this.#contentView = new SceneContentView(this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Accessors
    // -------------------------------------------------------------------------

    get width(): number {
        return this.#width;
    }
    set width(value: number) {
        this.setWidth(value);
    }

    get height(): number {
        return this.#height;
    }
    set height(value: number) {
        this.setHeight(value);
    }

    get content(): SceneContentView {
        return this.#contentView;
    }

    // -------------------------------------------------------------------------
    // MARK: - Size
    // -------------------------------------------------------------------------

    getSize(out: Size = new Size()): Size {
        return out.set(this.#width, this.#height);
    }

    setSizeWH(width: number, height: number): this {
        if (this.#width === width && this.#height === height) { return this; }
        this.#width = width;
        this.#height = height;
        this.invalidateBounds();
        return this;
    }

    setSize(size: Size): this {
        return this.setSizeWH(size.width, size.height);
    }

    setWidth(width: number): this {
        if (this.#width === width) { return this; }
        this.#width = width;
        this.invalidateBounds();
        return this;
    }

    setHeight(height: number): this {
        if (this.#height === height) { return this; }
        this.#height = height;
        this.invalidateBounds();
        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Children
    // -------------------------------------------------------------------------

    override addView(view: View): this {
        this.#contentView.addView(view);
        return this;
    }

    override removeView(view: View): this {
        this.#contentView.removeView(view);
        return this;
    }

    override removeAllViews(): this {
        this.#contentView.removeAllViews();
        return this;
    }

    override getViews(): View[] {
        return this.#contentView.getViews();
    }

    override getViewCount(): number {
        return this.#contentView.getViewCount();
    }

    override pickView(point: Vec2): View | null {
        if (this.isVisible === false || this.isPickable === false) {
            return null;
        }

        const localPoint = this.toLocalPoint(point, this.parent);
        if (!this.containsPoint(localPoint)) { return null; }

        const view = this.#contentView.pickView(localPoint);
        return view !== null ? view : this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Child Transformations
    // -------------------------------------------------------------------------    

    translateContent(
        dx: number,
        dy: number,
        coordinateSpace: CoordinateSpace = CoordinateSpace.LOCAL
    ): this {
        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const localDelta = this.toLocalVectorXY(dx, dy, this.#contentView);
            this.#contentView.translate(localDelta);

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            this.#contentView.translateXY(dx, dy);
        }

        return this;
    }

    scaleContent(factorOrVector: number | Vec2): this {
        this.#contentView.scale(factorOrVector);
        return this;
    }

    scaleAround(
        factor: number,
        anchorX: number,
        anchorY: number,
        coordinateSpace: CoordinateSpace = CoordinateSpace.LOCAL
    ): this {
        let dx = this.#contentView.transform.x;
        let dy = this.#contentView.transform.y;

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const anchor = this.toLocalPointXY(anchorX, anchorY, this.#contentView);
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

    rotateAround(
        radians: number,
        pivotX: number,
        pivotY: number,
        coordinateSpace: CoordinateSpace = CoordinateSpace.LOCAL
    ): this {
        let dx = this.#contentView.transform.x;
        let dy = this.#contentView.transform.y;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            const localPivot = this.toLocalPointXY(pivotX, pivotY, this.#contentView);
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

    centerOn(
        x: number,
        y: number,
        coordinateSpace: CoordinateSpace = CoordinateSpace.LOCAL
    ): this {
        this.#contentView.setPositionXY(this.#width / 2, this.#height / 2);

        if (coordinateSpace === CoordinateSpace.CONTENT) {
            this.#contentView.setPivotXY(x, y);

        } else if (coordinateSpace === CoordinateSpace.LOCAL) {
            const contentPoint = new Vec2(x, y);
            this.#contentView.toLocalPoint(contentPoint, this, contentPoint);
            this.#contentView.setPivot(contentPoint);
        }

        return this;
    }

    // -------------------------------------------------------------------------
    // MARK: - Bounds
    // -------------------------------------------------------------------------

    override updateBounds(out: Bounds): void {
        out.set(0, 0, this.#width, this.#height);
    }

    override containsPoint(point: Vec2): boolean {
        return this.bounds.containsPoint(point);
    }

    // -------------------------------------------------------------------------
    // MARK: - Drawing
    // -------------------------------------------------------------------------

    override onDraw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(0, 0, this.#width, this.#height);
        context.clip();
    }

    override drawChildren(context: CanvasRenderingContext2D): void {
        this.#contentView.draw(context);
    }

}
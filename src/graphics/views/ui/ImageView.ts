import type { Bounds } from "../../../math/Bounds.js";
import { Vec2 } from "../../../math/Vec2.js";
import { Size } from "../../utils/Size.js";
import { View } from "../core/View.js";

export class ImageView extends View {
    #image: HTMLImageElement | null = null;
    #sourceX: number = 0;
    #sourceY: number = 0;
    #sourceWidth: number = 0;
    #sourceHeight: number = 0;
    #opacity: number = 1;

    // MARK: - Accessors
    get width(): number {
        return this.#sourceWidth;
    }

    get height(): number {
        return this.#sourceHeight;
    }

    get sourceX(): number {
        return this.#sourceX;
    }
    set sourceX(value: number) {
        this.setSourceX(value);
    }

    get sourceY(): number {
        return this.#sourceY;
    }
    set sourceY(value: number) {
        this.setSourceY(value);
    }

    get sourceWidth(): number {
        return this.#sourceWidth;
    }
    set sourceWidth(value: number) {
        this.setSourceWidth(value);
    }

    get sourceHeight(): number {
        return this.#sourceHeight;
    }
    set sourceHeight(value: number) {
        this.setSourceHeight(value);
    }

    get opacity(): number {
        return this.#opacity;
    }
    set opacity(value: number) {
        this.setOpacity(value);
    }

    // MARK: - Initialization
    constructor(image: HTMLImageElement | null) {
        super();
        this.setImage(image);
    }

    // MARK: - Image
    setImage(image: HTMLImageElement | null, resetSourceRect: boolean = true): this {
        this.#image = image;
        if (resetSourceRect) {
            this.setSourcePositionXY(0, 0);
            this.setSourceSizeWH(
                image?.naturalWidth ?? 0,
                image?.naturalHeight ?? 0
            );
        }
        return this;
    }

    // MARK: - Size
    getSize(out: Size = new Size()): Size {
        return out.set(this.width, this.height);
    }

    // MARK: - Source Position
    getSourcePosition(out: Vec2 = new Vec2()): Vec2 {
        return out.set(this.#sourceX, this.#sourceY);
    }

    setSourcePositionXY(x: number, y: number): this {
        this.#sourceX = x;
        this.#sourceY = y;
        return this;
    }

    setSourcePosition(point: Vec2): this {
        return this.setSourcePositionXY(point.x, point.y);
    }

    setSourceX(x: number): this {
        this.#sourceX = x;
        return this;
    }

    setSourceY(y: number): this {
        this.#sourceY = y;
        return this;
    }

    // MARK: - Source Size
    getSourceSize(out: Size = new Size()): Size {
        return out.set(this.#sourceWidth, this.#sourceHeight);
    }

    setSourceSizeWH(width: number, height: number): this {
        if (width === this.#sourceWidth && height === this.#sourceHeight) {
            return this;
        }
        this.#sourceWidth = width;
        this.#sourceHeight = height;
        this.invalidateBounds();
        return this;
    }

    setSourceSize(size: Size): this {
        return this.setSourceSizeWH(size.width, size.height);
    }

    setSourceWidth(width: number): this {
        if (width === this.#sourceWidth) { return this; }
        this.#sourceWidth = width;
        this.invalidateBounds();
        return this;
    }

    setSourceHeight(height: number): this {
        if (height === this.#sourceHeight) { return this; }
        this.#sourceHeight = height;
        this.invalidateBounds();
        return this;
    }

    // MARK: - Opacity
    setOpacity(opacity: number): this {
        if (!Number.isFinite(opacity)) { return this; }
        this.#opacity = Math.max(0, Math.min(1, opacity));
        return this;
    }

    // MARK: - Bounds
    override updateBounds(out: Bounds): void {
        out.set(0, 0, this.width, this.height);
    }

    override containsPoint(point: Vec2): boolean {
        return this.bounds.containsPoint(point);
    }

    // MARK: - Drawing
    override onDraw(context: CanvasRenderingContext2D): void {
        if (!this.#image) { return; }
        context.globalAlpha *= this.#opacity;
        context.drawImage(
            this.#image,
            this.#sourceX,
            this.#sourceY,
            this.#sourceWidth,
            this.#sourceHeight,
            0,          // destination x
            0,          // destination y
            this.width, // destination width
            this.height // destination height
        );
    }

}
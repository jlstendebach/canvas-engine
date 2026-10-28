import { CachedColor } from "../../utils/CachedColor.js";
import { Color } from "../../utils/Color.js";
import type { ReadonlyColor } from "../../utils/ReadonlyColor.js";
import { View } from "../core/View.js";

export abstract class ShapeView extends View {
    #fillStyle: CachedColor | null = new CachedColor(new Color(255, 255, 255));
    #strokeStyle: CachedColor | null = new CachedColor(new Color(0, 0, 0));
    #strokeWidth: number = 1;
    #strokeDash: number[] = [];
    #strokeDashOffset: number = 0;

    // MARK: - Accessors
    set fillStyle(style: ReadonlyColor | null) {
        this.setFillStyle(style);
    }
    get fillStyle(): Color | null {
        return this.#fillStyle?.color ?? null;
    }

    set strokeStyle(style: ReadonlyColor | null) {
        this.setStrokeStyle(style);
    }
    get strokeStyle(): Color | null {
        return this.#strokeStyle?.color ?? null;
    }

    set strokeWidth(width: number) {
        this.setStrokeWidth(width);
    }
    get strokeWidth(): number {
        return this.#strokeWidth;
    }

    set strokeDash(dash: number[]) {
        this.setStrokeDash(dash);
    }
    get strokeDash(): number[] {
        return this.#strokeDash;
    }

    set strokeDashOffset(offset: number) {
        this.setStrokeDashOffset(offset);
    }
    get strokeDashOffset(): number {
        return this.#strokeDashOffset;
    }

    // MARK: - Fill Style
    setFillStyle(style: ReadonlyColor | null): this {
        this.#fillStyle = CachedColor.assign(this.#fillStyle, style);
        return this;
    }

    isFillEnabled(): boolean {
        return this.#fillStyle != null;
    }

    // MARK: - Stroke Style
    setStrokeStyle(style: ReadonlyColor | null): this {
        this.#strokeStyle = CachedColor.assign(this.#strokeStyle, style);
        return this;
    }

    setStrokeWidth(width: number): this {
        this.#strokeWidth = width;
        return this;
    }

    setStrokeDash(dash: number[]): this {
        this.#strokeDash = dash;
        return this;
    }

    setStrokeDashOffset(offset: number): this {
        this.#strokeDashOffset = offset;
        return this;
    }

    isStrokeEnabled(): boolean {
        return this.#strokeStyle != null && this.#strokeWidth > 0;
    }

    // MARK: - Drawing
    abstract path(context: CanvasRenderingContext2D): void;

    fill(context: CanvasRenderingContext2D): void {
        const fillStyle = this.#fillStyle;
        if (!fillStyle) {
            return;
        }
        context.fillStyle = fillStyle.colorString;
        context.fill();
    }

    stroke(context: CanvasRenderingContext2D): void {
        const strokeStyle = this.#strokeStyle;
        if (!strokeStyle || this.#strokeWidth <= 0) {
            return;
        }
        context.lineWidth = this.#strokeWidth;
        context.strokeStyle = strokeStyle.colorString;
        context.setLineDash(this.#strokeDash);
        context.lineDashOffset = this.#strokeDashOffset;
        context.stroke();
    }

    override onDraw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        this.path(context);
        this.fill(context);
        this.stroke(context);
    }

}
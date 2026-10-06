import { CachedColor } from "../../utils/CachedColor.js";
import { Color } from "../../utils/Color.js";
import { View } from "../core/View.js";

export class ShapeView extends View {
    #fillStyle: CachedColor = new CachedColor(new Color(255, 255, 255));
    #strokeStyle: CachedColor = new CachedColor(new Color(0, 0, 0));
    #strokeWidth: number = 1;
    #strokeDash: number[] = [];
    #strokeDashOffset: number = 0;

    // MARK: - Accessors
    set fillStyle(style: Color) {
        this.setFillStyle(style);
    }
    get fillStyle(): Color | null {
        return this.#fillStyle.color;
    }

    set strokeStyle(style: Color) {
        this.setStrokeStyle(style);
    }
    get strokeStyle(): Color | null {
        return this.#strokeStyle.color;
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

    // MARK: - Style
    setFillStyle(style: Color): this {
        this.#fillStyle.color = style;
        return this;
    }

    setStrokeStyle(style: Color): this {
        this.#strokeStyle.color = style;
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

    // MARK: - Drawing
    path(context: CanvasRenderingContext2D): void {
        // To be implemented by subclasses.
        void context;
    }

    fill(context: CanvasRenderingContext2D): void {
        if (!this.isFillEnabled()) {
            return;
        }
        context.fillStyle = this.#fillStyle.colorString ?? "";
        context.fill();
    }

    stroke(context: CanvasRenderingContext2D): void {
        if (!this.isStrokeEnabled()) {
            return;
        }
        context.lineWidth = this.#strokeWidth;
        context.strokeStyle = this.#strokeStyle.colorString ?? "";
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

    // MARK: - Helpers
    isStrokeEnabled(): boolean {
        return this.#strokeStyle.colorString != null && this.#strokeWidth > 0;
    }

    isFillEnabled(): boolean {
        return this.#fillStyle.colorString != null;
    }
}
import { CachedColor } from "../../utils/CachedColor.js";
import { Color } from "../../utils/Color.js";
import type { ReadonlyColor } from "../../utils/ReadonlyColor.js";
import { View } from "../core/View.js";

export abstract class ShapeView extends View {
    #fillStyle: CachedColor = new CachedColor(new Color(255, 255, 255));
    #isFillEnabled: boolean = true;

    #strokeStyle: CachedColor = new CachedColor(new Color(0, 0, 0));
    #strokeWidth: number = 1;
    #strokeDash: number[] = [];
    #strokeDashOffset: number = 0;
    #isStrokeEnabled: boolean = true;

    // MARK: - Accessors
    get fillStyle(): Color {
        return this.#fillStyle.color;
    }
    set fillStyle(style: ReadonlyColor) {
        this.setFillStyle(style);
    }

    get isFillEnabled(): boolean {
        return this.#isFillEnabled;
    }
    set isFillEnabled(enabled: boolean) {
        this.setFillEnabled(enabled);
    }

    get strokeStyle(): Color {
        return this.#strokeStyle.color;
    }
    set strokeStyle(style: ReadonlyColor) {
        this.setStrokeStyle(style);
    }

    get strokeWidth(): number {
        return this.#strokeWidth;
    }
    set strokeWidth(width: number) {
        this.setStrokeWidth(width);
    }

    get strokeDash(): number[] {
        return this.#strokeDash;
    }
    set strokeDash(dash: number[]) {
        this.setStrokeDash(dash);
    }

    get strokeDashOffset(): number {
        return this.#strokeDashOffset;
    }
    set strokeDashOffset(offset: number) {
        this.setStrokeDashOffset(offset);
    }

    get isStrokeEnabled(): boolean {
        return this.#isStrokeEnabled;
    }
    set isStrokeEnabled(enabled: boolean) {
        this.setStrokeEnabled(enabled);
    }

    // MARK: - Fill Style
    setFillStyle(style: ReadonlyColor): this {
        this.#fillStyle.color = style;
        return this;
    }

    setFillEnabled(enabled: boolean): this {
        this.#isFillEnabled = enabled;
        return this;
    }

    // MARK: - Stroke Style
    setStrokeStyle(style: ReadonlyColor): this {
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

    setStrokeEnabled(enabled: boolean): this {
        this.#isStrokeEnabled = enabled;
        return this;
    }

    // MARK: - Drawing
    abstract path(context: CanvasRenderingContext2D): void;

    fill(context: CanvasRenderingContext2D): void {
        if (!this.#isFillEnabled) {
            return;
        }
        context.fillStyle = this.#fillStyle.colorString;
        context.fill();
    }

    stroke(context: CanvasRenderingContext2D): void {
        if (!this.#isStrokeEnabled || this.#strokeWidth <= 0) {
            return;
        }
        context.lineWidth = this.#strokeWidth;
        context.strokeStyle = this.#strokeStyle.colorString;
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
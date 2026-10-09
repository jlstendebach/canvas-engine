import type { Vec2 } from "../../../math/Vec2.js";
import { RectangleView } from "./RectangleView.js";

export class RoundRectangleView extends RectangleView {
    #cornerRadii: number[] = [
        0, // top-left
        0, // top-right
        0, // bottom-right
        0  // bottom-left
    ];

    // MARK: - Accessors
    get cornerRadius(): number {
        return this.#cornerRadii[0];
    }
    set cornerRadius(value: number) {
        this.setCornerRadius(value);
    }

    get topLeftRadius(): number {
        return this.#cornerRadii[0];
    }
    set topLeftRadius(value: number) {
        this.setTopLeftRadius(value);
    }

    get topRightRadius(): number {
        return this.#cornerRadii[1];
    }
    set topRightRadius(value: number) {
        this.setTopRightRadius(value);
    }

    get bottomRightRadius(): number {
        return this.#cornerRadii[2];
    }
    set bottomRightRadius(value: number) {
        this.setBottomRightRadius(value);
    }

    get bottomLeftRadius(): number {
        return this.#cornerRadii[3];
    }
    set bottomLeftRadius(value: number) {
        this.setBottomLeftRadius(value);
    }

    // MARK: - Initialization
    constructor(
        width: number = 10,
        height: number = 10,
        cornerRadius: number = 0
    ) {
        super(width, height);
        this.setCornerRadius(cornerRadius);
    }

    // MARK: - Corner Radius
    getCornerRadii(out: number[] = []): number[] {
        out[0] = this.#cornerRadii[0];
        out[1] = this.#cornerRadii[1];
        out[2] = this.#cornerRadii[2];
        out[3] = this.#cornerRadii[3];
        return out;
    }

    setCornerRadii(
        topLeft: number,
        topRight: number,
        bottomRight: number,
        bottomLeft: number
    ): this {
        this.#cornerRadii[0] = topLeft;
        this.#cornerRadii[1] = topRight;
        this.#cornerRadii[2] = bottomRight;
        this.#cornerRadii[3] = bottomLeft;
        return this;
    }

    setCornerRadius(cornerRadius: number): this {
        this.#cornerRadii.fill(cornerRadius);
        return this;
    }

    setTopLeftRadius(value: number): this {
        this.#cornerRadii[0] = value;
        return this;
    }

    setTopRightRadius(value: number): this {
        this.#cornerRadii[1] = value;
        return this;
    }

    setBottomRightRadius(value: number): this {
        this.#cornerRadii[2] = value;
        return this;
    }

    setBottomLeftRadius(value: number): this {
        this.#cornerRadii[3] = value;
        return this;
    }

    // MARK: - Hit Testing
    override containsPoint(point: Vec2): boolean {
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
    override path(context: CanvasRenderingContext2D): void {
        context.roundRect(0, 0, this.width, this.height, this.#cornerRadii);
    }

}
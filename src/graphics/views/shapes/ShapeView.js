import { CachedColor } from "../../utils/CachedColor.js";
import { Color } from "../../utils/Color.js";
import { View } from "../core/View.js";

export class ShapeView extends View {
    #fillStyle = new CachedColor();
    #strokeStyle = new CachedColor();
    #strokeWidth;
    #strokeDash;
    #strokeDashOffset;

    // MARK: - Accessors
    set fillStyle(style) { 
        this.#fillStyle.color = style; 
    }
    get fillStyle() { 
        return this.#fillStyle.color; 
    }

    set strokeStyle(style) { 
        this.#strokeStyle.color = style; 
    }
    get strokeStyle() { 
        return this.#strokeStyle.color; 
    }

    set strokeWidth(width) { 
        this.#strokeWidth = width; 
    }
    get strokeWidth() { 
        return this.#strokeWidth; 
    }

    set strokeDash(dash) { 
        this.#strokeDash = dash; 
    }
    get strokeDash() { 
        return this.#strokeDash; 
    }

    set strokeDashOffset(offset) { 
        this.#strokeDashOffset = offset; 
    }
    get strokeDashOffset() { 
        return this.#strokeDashOffset; 
    }

    // MARK: - Initialization
    constructor(options = {}) {
        super(options);
        this.fillStyle = options.fillStyle ?? new Color(255, 255, 255);
        this.strokeStyle = options.strokeStyle ?? new Color(0, 0, 0);
        this.strokeWidth = options.strokeWidth ?? 1;
        this.strokeDash = options.strokeDash ?? [];
        this.strokeDashOffset = options.strokeDashOffset ?? 0;
    }

    // MARK: - Drawing
    path(context) { 
        // To be implemented by subclasses.
        void context;
    }

    fill(context) {
        if (!this.isFillEnabled()) {
            return;
        }
        context.fillStyle = this.#fillStyle.colorString;
        context.fill();
    }

    stroke(context) {
        if (!this.isStrokeEnabled()) {
            return;
        }
        context.lineWidth = this.#strokeWidth;
        context.strokeStyle = this.#strokeStyle.colorString;
        context.setLineDash(this.#strokeDash);
        context.lineDashOffset = this.#strokeDashOffset;
        context.stroke();
    }

    drawSelf(context) {
        context.beginPath();
        this.path(context);
        this.fill(context);
        this.stroke(context);
    }

    // MARK: - Helpers
    isStrokeEnabled() {
        return this.#strokeStyle.colorString != null && this.#strokeWidth > 0;
    }

    isFillEnabled() {
        return this.#fillStyle.colorString != null;
    }
}
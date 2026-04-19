import { View } from "../View.js"
import { CachedColor } from "../../utils/CachedColor.js";

export class ShapeView extends View {
    #fillStyle = new CachedColor();
    #strokeStyle = new CachedColor();
    #strokeWidth = 1;
    #strokeDash = [];

    constructor() {
        super();
    }

    // MARK: - Hit Testing -----------------------------------------------------
    isInBounds(x, y) {
        // To be implemented by subclasses.
        return false;
    }

    // MARK: - Style -----------------------------------------------------------
    setFillStyle(style) { 
        this.#fillStyle.color = style; 
        return this; 
    }

    getFillStyle() { 
        return this.#fillStyle.color; 
    }

    setStrokeStyle(style) { 
        this.#strokeStyle.color = style; 
        return this; 
    }
    
    getStrokeStyle() { 
        return this.#strokeStyle.color; 
    }

    setStrokeWidth(width) { 
        this.#strokeWidth = width; 
        return this; 
    }
    
    getStrokeWidth() { 
        return this.#strokeWidth; 
    }

    setStrokeDash(dash) { 
        this.#strokeDash = dash; 
        return this; 
    }
    
    getStrokeDash() { 
        return this.#strokeDash; 
    }


    // --[ drawing ]------------------------------------------------------------
    path(context) { }

    fill(context) {
        let fillStyle = this.getFillStyle();
        if (this.isFillEnabled()) {
            context.fillStyle = this.#fillStyle.colorString;
            context.fill();
        }
    }

    stroke(context) {
        if (this.isStrokeEnabled()) {
            context.lineWidth = this.#strokeWidth;
            context.strokeStyle = this.#strokeStyle.colorString;
            context.setLineDash(this.#strokeDash);
            context.stroke();
        }
    }

    drawSelf(context) {
        context.beginPath();
        if (this.isStrokeEnabled()) {
            context.translate(0.5, 0.5);
            this.path(context);
            context.translate(-0.5, -0.5);    
        } else {
            this.path(context);
        }
        this.fill(context);
        this.stroke(context);
    }

    // --[ helpers ]------------------------------------------------------------
    isStrokeEnabled() {
        return this.#strokeStyle.colorString != null && this.#strokeWidth > 0;
    }

    isFillEnabled() {
        return this.#fillStyle.colorString != null;
    }
}
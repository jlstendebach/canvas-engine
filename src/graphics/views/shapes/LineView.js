import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";

export class LineView extends ShapeView {
    vertex1;
    vertex2;

    constructor(options = {}) {
        super(options);
        this.vertex1 = options.vertex1 ?? new Vec2(0, 0);
        this.vertex2 = options.vertex2 ?? new Vec2(100, 100);
    }

    isInBounds(point) { 
        return false; 
    }

    path(context) {
        context.moveTo(this.vertex1.x, this.vertex1.y);
        context.lineTo(this.vertex2.x, this.vertex2.y);
    }

}
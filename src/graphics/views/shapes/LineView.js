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
        const lineVec = this.vertex2.clone().subtract(this.vertex1);
        const pointVec = point.clone().subtract(this.position).subtract(this.vertex1);

        // If the dot is negative, the point is before the start of the line.
        const dot = pointVec.dot(lineVec);
        if (dot < 0) {
            return false;
        }

        // If the projection is longer than the line, the point is past the end 
        // of the line.
        const scale = dot / lineVec.lengthSq();
        const projection = Vec2.scale(lineVec, scale);
        if (projection.length() > lineVec.length()) {
            return false;
        }

        // If the rejection is longer than half the stroke width, the point is 
        // too far from the line.
        const rejection = Vec2.subtract(pointVec, projection);
        const halfWidth = this.strokeWidth / 2;
        if (rejection.length() > halfWidth) {
            return false;
        }

        return true;        
    }

    path(context) {
        context.moveTo(this.vertex1.x, this.vertex1.y);
        context.lineTo(this.vertex2.x, this.vertex2.y);
    }

}
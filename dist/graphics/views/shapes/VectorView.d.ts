export class VectorView extends ShapeView {
    constructor(vectorX?: number, vectorY?: number);
    set vectorX(value: number);
    get vectorX(): number;
    set vectorY(value: number);
    get vectorY(): number;
    set arrowWidth(value: number);
    get arrowWidth(): number;
    set arrowHeight(value: number);
    get arrowHeight(): number;
    getVector(out?: Vec2): Vec2;
    setVectorXY(x: any, y: any): this;
    setVectorX(x: any): this;
    setVectorY(y: any): this;
    setVector(vector: any): this;
    setVectorLength(length: any): this;
    setArrowWidth(width: any): this;
    setArrowHeight(height: any): this;
    containsPoint(point: any): boolean;
    #private;
}
import { ShapeView } from "./ShapeView.js";
import { Vec2 } from "../../../math/Vec2.js";
//# sourceMappingURL=VectorView.d.ts.map
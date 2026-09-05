import { Vec2 } from "../../../math/Vec2.js";
import { ShapeView } from "./ShapeView.js";
export declare class VectorView extends ShapeView {
    #private;
    get vectorX(): number;
    set vectorX(value: number);
    get vectorY(): number;
    set vectorY(value: number);
    get arrowWidth(): number;
    set arrowWidth(value: number);
    get arrowHeight(): number;
    set arrowHeight(value: number);
    constructor(vectorX?: number, vectorY?: number);
    getVector(out?: Vec2): Vec2;
    setVectorXY(x: any, y: any): this;
    setVectorX(x: any): this;
    setVectorY(y: any): this;
    setVector(vector: any): this;
    setVectorLength(length: any): this;
    setArrowWidth(width: any): this;
    setArrowHeight(height: any): this;
    updateBounds(out: any): void;
    containsPoint(point: any): boolean;
    path(context: any): void;
}

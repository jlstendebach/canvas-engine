import { Vec2 } from "../../../math/Vec2.js";
import { Point } from "../../utils/Point.js";
import { ShapeView } from "./ShapeView.js";
export declare class LineView extends ShapeView {
    #private;
    getPointCount(): number;
    getPoint(index: any, out?: Point): Vec2;
    getPointX(index: any): any;
    getPointY(index: any): any;
    setPointXY(index: any, x: any, y: any): this;
    setPointX(index: any, x: any): this;
    setPointY(index: any, y: any): this;
    setPoint(index: any, point: any): this;
    setPointsXY(points: any): this;
    setPoints(points: any): this;
    addPointXY(x: any, y: any): this;
    addPoint(point: any): this;
    insertPointXY(index: any, x: any, y: any): this;
    insertPoint(index: any, point: any): this;
    removePoint(index: any): this;
    clearPoints(): this;
    updateBounds(out: any): void;
    containsPoint(point: any): boolean;
    path(context: any): void;
    fill(context: any): void;
}

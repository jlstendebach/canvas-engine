export class PolygonView extends ShapeView {
    getPointCount(): number;
    getPoint(index: any, out?: Vec2): Vec2;
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
    containsPoint(point: any): boolean;
    #private;
}
import { ShapeView } from "./ShapeView.js";
import { Vec2 } from "../../../math/Vec2.js";
//# sourceMappingURL=PolygonView.d.ts.map
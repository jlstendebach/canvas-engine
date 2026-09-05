import { Point } from "./Point.js";
export declare class PointList {
    #private;
    constructor(onChange?: any);
    getPointCount(): number;
    getPoint(index: any, out?: Point): import("../../index.js").Vec2;
    getPointX(index: any): any;
    getPointY(index: any): any;
    setPointXY(index: any, x: any, y: any): void;
    setPointX(index: any, x: any): void;
    setPointY(index: any, y: any): void;
    setPoint(index: any, point: any): void;
    setPointsXY(points: any): void;
    setPoints(points: any): void;
    addPointXY(x: any, y: any): void;
    addPoint(point: any): void;
    insertPointXY(index: any, x: any, y: any): void;
    insertPoint(index: any, point: any): void;
    removePoint(index: any): void;
    clearPoints(): void;
    /**
     * WARNING: For performance reasons, this returns the raw underlying array.
     * Treat this as READ-ONLY. Do not push, pop, or mutate the points.
     * @returns {readonly number[]}
     */
    unsafeGetPoints(): readonly number[];
}

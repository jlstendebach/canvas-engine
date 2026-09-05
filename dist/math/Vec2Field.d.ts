import { Vec2 } from "./Vec2.js";
export declare class Vec2Field {
    field: any[][];
    w: any;
    h: any;
    constructor(w: any, h: any);
    getWidth(): any;
    getHeight(): any;
    getInterpolated(x: any, y: any): Vec2;
    setVector(x: any, y: any, vec: any): void;
    getVector(x: any, y: any): any;
    fill(vec: any): void;
}

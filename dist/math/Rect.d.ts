export declare class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    overlapsRect(rect: any): boolean;
    containsPoint(x: any, y: any): boolean;
}

export declare class Bounds {
    minX: any;
    maxX: any;
    minY: any;
    maxY: any;
    set x(value: any);
    get x(): any;
    set y(value: any);
    get y(): any;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    get centerX(): number;
    get centerY(): number;
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    set(minX: any, minY: any, maxX: any, maxY: any): this;
    reset(): this;
    addPointXY(x: any, y: any): this;
    addPoint(point: any): this;
    addBounds(bounds: any): this;
    containsPointXY(x: any, y: any): boolean;
    containsPoint(point: any): boolean;
    intersects(other: any): boolean;
    equals(other: any): boolean;
    isEmpty(): boolean;
    clone(): Bounds;
    copy(other: any): this;
}

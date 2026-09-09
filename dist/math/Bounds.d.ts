export class Bounds {
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    get centerX(): number;
    get centerY(): number;
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
//# sourceMappingURL=Bounds.d.ts.map
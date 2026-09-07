import { ShapeView } from "./ShapeView.js";
export declare class CircleView extends ShapeView {
    #private;
    get radius(): any;
    set radius(value: any);
    constructor(radius?: number);
    setRadius(radius: any): this;
    updateBounds(out: any): void;
    containsPoint(point: any): boolean;
    path(context: any): void;
}

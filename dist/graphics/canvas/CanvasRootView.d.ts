import { View } from "../views/core/View.js";
export declare class CanvasRootView extends View {
    #private;
    get canvas(): any;
    constructor(canvas: any);
    updateBounds(out: any): void;
    containsPoint(point: any): boolean;
}

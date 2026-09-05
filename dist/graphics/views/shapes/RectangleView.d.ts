import { Size } from "../../utils/Size.js";
import { ShapeView } from "./ShapeView.js";
export declare class RectangleView extends ShapeView {
    #private;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    constructor(width?: number, height?: number);
    getSize(out?: Size): import("../../../index.js").Vec2;
    setSizeWH(width: any, height: any): this;
    setSize(size: any): this;
    setWidth(width: any): this;
    setHeight(height: any): this;
    updateBounds(out: any): void;
    containsPoint(point: any): boolean;
    path(context: any): void;
    onSizeChanged(): void;
}

export class RectangleView extends ShapeView {
    constructor(width?: number, height?: number);
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    getSize(out?: Size): import("../../../index.js").Vec2;
    setSizeWH(width: any, height: any): this;
    setSize(size: any): this;
    setWidth(width: any): this;
    setHeight(height: any): this;
    containsPoint(point: any): boolean;
    onSizeChanged(): void;
    #private;
}
import { ShapeView } from "./ShapeView.js";
import { Size } from "../../utils/Size.js";
//# sourceMappingURL=RectangleView.d.ts.map
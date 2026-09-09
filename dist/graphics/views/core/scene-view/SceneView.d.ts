export class SceneView extends View {
    constructor(width?: number, height?: number);
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    get content(): SceneContentView;
    getSize(out?: Size): Vec2;
    setSizeWH(width: any, height: any): this;
    setSize(size: any): this;
    setWidth(width: any): this;
    setHeight(height: any): this;
    addView(view: any): this;
    removeView(view: any): this;
    removeAllViews(): this;
    translateContent(dx: any, dy: any, coordinateSpace?: 0): this;
    scaleContent(factorOrVector: any): this;
    scaleAround(factor: any, anchorX: any, anchorY: any, coordinateSpace?: 0): this;
    rotateAround(radians: any, pivotX: any, pivotY: any, coordinateSpace?: 0): this;
    centerOn(x: any, y: any, coordinateSpace?: 0): this;
    containsPoint(point: any): boolean;
    onDraw(context: any): void;
    drawChildren(context: any): void;
    #private;
}
import { View } from "../View.js";
import { SceneContentView } from "./SceneContentView.js";
import { Size } from "../../../utils/Size.js";
import { Vec2 } from "../../../../math/Vec2.js";
//# sourceMappingURL=SceneView.d.ts.map
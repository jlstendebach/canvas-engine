export class ImageView extends View {
    constructor(image: any);
    get width(): number;
    get height(): number;
    set sourceX(value: number);
    get sourceX(): number;
    set sourceY(value: number);
    get sourceY(): number;
    set sourceWidth(value: number);
    get sourceWidth(): number;
    set sourceHeight(value: number);
    get sourceHeight(): number;
    set opacity(value: number);
    get opacity(): number;
    setImage(image: any, resetSourceRect?: boolean): this;
    getSize(out?: Size): Vec2;
    getSourcePosition(out?: Vec2): Vec2;
    setSourcePositionXY(x: any, y: any): this;
    setSourcePosition(point: any): this;
    setSourceX(x: any): this;
    setSourceY(y: any): this;
    getSourceSize(out?: Size): Vec2;
    setSourceSizeWH(width: any, height: any): this;
    setSourceSize(size: any): this;
    setSourceWidth(width: any): this;
    setSourceHeight(height: any): this;
    setOpacity(opacity: any): this;
    containsPoint(point: any): boolean;
    onDraw(context: any): void;
    #private;
}
import { View } from "../core/View.js";
import { Size } from "../../utils/Size.js";
import { Vec2 } from "../../../math/Vec2.js";
//# sourceMappingURL=ImageView.d.ts.map
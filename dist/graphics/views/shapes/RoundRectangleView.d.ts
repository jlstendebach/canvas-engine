export class RoundRectangleView extends RectangleView {
    constructor(width?: number, height?: number, cornerRadius?: number);
    set cornerRadius(value: number);
    get cornerRadius(): number;
    set topLeftRadius(value: number);
    get topLeftRadius(): number;
    set topRightRadius(value: number);
    get topRightRadius(): number;
    set bottomRightRadius(value: number);
    get bottomRightRadius(): number;
    set bottomLeftRadius(value: number);
    get bottomLeftRadius(): number;
    getCornerRadii(out?: any[]): any[];
    setCornerRadii(topLeft: any, topRight: any, bottomRight: any, bottomLeft: any): this;
    setCornerRadius(cornerRadius: any): this;
    setTopLeftRadius(value: any): this;
    setTopRightRadius(value: any): this;
    setBottomRightRadius(value: any): this;
    setBottomLeftRadius(value: any): this;
    #private;
}
import { RectangleView } from "./RectangleView.js";
//# sourceMappingURL=RoundRectangleView.d.ts.map
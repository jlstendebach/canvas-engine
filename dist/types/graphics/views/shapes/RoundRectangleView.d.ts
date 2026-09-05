import { RectangleView } from "./RectangleView.js";
export declare class RoundRectangleView extends RectangleView {
    #private;
    get cornerRadius(): number;
    set cornerRadius(value: number);
    get topLeftRadius(): number;
    set topLeftRadius(value: number);
    get topRightRadius(): number;
    set topRightRadius(value: number);
    get bottomRightRadius(): number;
    set bottomRightRadius(value: number);
    get bottomLeftRadius(): number;
    set bottomLeftRadius(value: number);
    constructor(width?: number, height?: number, cornerRadius?: number);
    getCornerRadii(out?: any[]): any[];
    setCornerRadii(topLeft: any, topRight: any, bottomRight: any, bottomLeft: any): this;
    setCornerRadius(cornerRadius: any): this;
    setTopLeftRadius(value: any): this;
    setTopRightRadius(value: any): this;
    setBottomRightRadius(value: any): this;
    setBottomLeftRadius(value: any): this;
    containsPoint(point: any): boolean;
    path(context: any): void;
}

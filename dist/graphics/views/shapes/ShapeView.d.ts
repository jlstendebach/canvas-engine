import { View } from "../core/View.js";
export declare class ShapeView extends View {
    #private;
    set fillStyle(style: any);
    get fillStyle(): any;
    set strokeStyle(style: any);
    get strokeStyle(): any;
    set strokeWidth(width: number);
    get strokeWidth(): number;
    set strokeDash(dash: any[]);
    get strokeDash(): any[];
    set strokeDashOffset(offset: number);
    get strokeDashOffset(): number;
    setFillStyle(style: any): this;
    setStrokeStyle(style: any): this;
    setStrokeWidth(width: any): this;
    setStrokeDash(dash: any): this;
    setStrokeDashOffset(offset: any): this;
    path(context: any): void;
    fill(context: any): void;
    stroke(context: any): void;
    onDraw(context: any): void;
    isStrokeEnabled(): boolean;
    isFillEnabled(): boolean;
}

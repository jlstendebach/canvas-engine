export class ShapeView extends View {
    set fillStyle(style: null);
    get fillStyle(): null;
    set strokeStyle(style: null);
    get strokeStyle(): null;
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
    #private;
}
import { View } from "../core/View.js";
//# sourceMappingURL=ShapeView.d.ts.map
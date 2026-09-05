import { LabelView } from "../ui/LabelView.js";
import { RectangleView } from "../shapes/RectangleView.js";
import { View } from "../core/View.js";
export declare class PieChartSlice {
    name: string;
    value: number;
    color: any;
    sAngle: number;
    eAngle: number;
    constructor(name?: string, value?: number, color?: any);
}
export declare class PieChartTooltip extends RectangleView {
    padding: number;
    topLabel: LabelView;
    bottomLabel: LabelView;
    constructor(w: any, h: any);
    initSelf(): void;
    initTopLabel(): void;
    initBottomLabel(): void;
    getPadding(): number;
    setPadding(padding: any): void;
    onDraw(context: any): void;
    layout(context: any): void;
}
export declare class PieChartView extends View {
    radius: number;
    startAngle: number;
    slices: any[];
    selectedSlice: any;
    defaultColors: string[];
    tooltip: PieChartTooltip;
    constructor();
    initTooltip(w: any, h: any): PieChartTooltip;
    getX(): number;
    getY(): number;
    setRadius(radius: any): void;
    getRadius(): number;
    containsPoint(point: any): boolean;
    addData(name: any, value: any, color?: any): void;
    removeAllData(): void;
    sortDataByValueAsc(): void;
    sortDataByValueDesc(): void;
    fillSlices(context: any): void;
    strokeSlices(context: any): void;
    drawLabels(context: any): void;
    drawSurroundLegend(context: any): void;
    drawVerticalLegend(context: any, x: any, y: any): void;
    onDraw(context: any): void;
    onMouseMove(event: any): void;
    onMouseExit(event: any): void;
    onMouseDrag(event: any): void;
    clampAngle(radians: any): number;
    calcTotal(): number;
    setSelectedSlice(slice: any): void;
    updateSlices(): void;
    pickSlice(x: any, y: any): any;
    getColorForSlice(index: any): any;
}

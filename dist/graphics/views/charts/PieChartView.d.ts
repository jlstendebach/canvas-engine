export class PieChartSlice {
    constructor(name?: string, value?: number, color?: null);
    name: string;
    value: number;
    color: any;
    sAngle: number;
    eAngle: number;
}
export class PieChartTooltip extends RectangleView {
    constructor(w: any, h: any);
    padding: number;
    topLabel: LabelView;
    bottomLabel: LabelView;
    initSelf(): void;
    initTopLabel(): void;
    initBottomLabel(): void;
    getPadding(): number;
    setPadding(padding: any): void;
    layout(context: any): void;
}
export class PieChartView extends View {
    radius: number;
    startAngle: number;
    slices: any[];
    selectedSlice: any;
    defaultColors: string[];
    tooltip: PieChartTooltip;
    initTooltip(w: any, h: any): PieChartTooltip;
    getX(): number;
    getY(): number;
    setRadius(radius: any): void;
    getRadius(): number;
    containsPoint(point: any): boolean;
    addData(name: any, value: any, color?: null): void;
    removeAllData(): void;
    sortDataByValueAsc(): void;
    sortDataByValueDesc(): void;
    fillSlices(context: any): void;
    strokeSlices(context: any): void;
    drawLabels(context: any): void;
    drawSurroundLegend(context: any): void;
    drawVerticalLegend(context: any, x: any, y: any): void;
    onDraw(context: any): void;
    clampAngle(radians: any): number;
    calcTotal(): number;
    setSelectedSlice(slice: any): void;
    updateSlices(): void;
    pickSlice(x: any, y: any): any;
    getColorForSlice(index: any): any;
}
import { RectangleView } from "../shapes/RectangleView.js";
import { LabelView } from "../ui/LabelView.js";
import { View } from "../core/View.js";
//# sourceMappingURL=PieChartView.d.ts.map
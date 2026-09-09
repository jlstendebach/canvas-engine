export class BarChartTooltip extends RectangleView {
    constructor(w: any, h: any);
    padding: number;
    topLabel: LabelView;
    bottomLabel: LabelView;
    desiredWidth: any;
    initSelf(): void;
    initTopLabel(): void;
    initBottomLabel(): void;
    getPadding(): number;
    setPadding(padding: any): void;
    layout(context: any): void;
}
export class BarChartDataSource {
    data: any[];
    max: number;
    add(name: any, value: any, color: any): void;
    remove(i: any): any;
    get(i: any): any;
    count(): number;
    clear(): void;
    calcMax(): void;
    considerForMax(value: any): number;
}
export class BarChartView extends View {
    constructor(w: any, h: any);
    size: Vec2;
    barData: BarChartDataSource;
    barViews: any[];
    selectedBar: {
        index: any;
        data: any;
        view: any;
    } | null;
    leftLabels: any[];
    bottomLabels: any[];
    graphArea: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    padding: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    tooltip: BarChartTooltip;
    initTooltip(w: any, h: any): BarChartTooltip;
    getX(): number;
    getY(): number;
    setWidth(w: any): void;
    getWidth(): number;
    setHeight(h: any): void;
    getHeight(): number;
    containsPoint(point: any): boolean;
    setData(data: any): void;
    getBar(i: any): {
        index: any;
        data: any;
        view: any;
    };
    sortDataByValueDesc(): void;
    layout(context: any): void;
    createAndMeasureLeftLabels(context: any): void;
    layoutBottomLabels(context: any): void;
    layoutBars(): void;
    layoutLeftLabels(context: any): void;
    drawLeftLabels(context: any): void;
    drawBottomLabels(context: any): void;
    drawBars(context: any): void;
    drawAxes(context: any): void;
    onDraw(context: any): void;
    pickBar(x: any, y: any): {
        index: any;
        data: any;
        view: any;
    } | null;
}
import { RectangleView } from "../shapes/RectangleView.js";
import { LabelView } from "../ui/LabelView.js";
import { View } from "../core/View.js";
import { Vec2 } from "../../../math/Vec2.js";
//# sourceMappingURL=BarChartView.d.ts.map
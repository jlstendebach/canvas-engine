import { Vec2 } from "../../../math/Vec2.js";
import { LabelView } from "../ui/LabelView.js";
import { RectangleView } from "../shapes/RectangleView.js";
import { View } from "../core/View.js";
export declare class BarChartTooltip extends RectangleView {
    padding: number;
    topLabel: LabelView;
    bottomLabel: LabelView;
    desiredWidth: any;
    constructor(w: any, h: any);
    initSelf(): void;
    initTopLabel(): void;
    initBottomLabel(): void;
    getPadding(): number;
    setPadding(padding: any): void;
    onDraw(context: any): void;
    layout(context: any): void;
}
export declare class BarChartDataSource {
    data: any[];
    max: number;
    constructor();
    add(name: any, value: any, color: any): void;
    remove(i: any): any;
    get(i: any): any;
    count(): number;
    clear(): void;
    calcMax(): void;
    considerForMax(value: any): number;
}
export declare class BarChartView extends View {
    size: Vec2;
    barData: BarChartDataSource;
    barViews: any[];
    selectedBar: {
        index: any;
        data: any;
        view: any;
    };
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
    constructor(w: any, h: any);
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
    onMouseMove(event: any): void;
    onMouseExit(event: any): void;
    onMouseDrag(event: any): void;
    pickBar(x: any, y: any): {
        index: any;
        data: any;
        view: any;
    };
}

export declare class CanvasEvent {
    canvas: any;
    constructor(canvas: any);
}
export declare class CanvasResizeEvent extends CanvasEvent {
    oldWidth: any;
    oldHeight: any;
    width: any;
    height: any;
    constructor(canvas: any, oldWidth: any, oldHeight: any, width: any, height: any);
}

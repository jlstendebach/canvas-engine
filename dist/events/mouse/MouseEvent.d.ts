export class MouseEvent {
    static get DOWN(): string;
    static get UP(): string;
    static get MOVE(): string;
    static get DRAG(): string;
    static get ENTER(): string;
    static get EXIT(): string;
    static get WHEEL(): string;
    type: null;
    canvasX: number;
    canvasY: number;
    canvasMovementX: number;
    canvasMovementY: number;
    parentX: number;
    parentY: number;
    parentMovementX: number;
    parentMovementY: number;
    x: number;
    y: number;
    movementX: number;
    movementY: number;
    wheelX: number;
    wheelY: number;
    wheelZ: number;
    button: number;
    buttons: number;
    target: null;
    related: null;
    clone(): MouseEvent;
    copy(other: any): this;
    isPressed(button: any): boolean;
}
//# sourceMappingURL=MouseEvent.d.ts.map
export const MouseEventType = Object.freeze({
    DOWN: "MouseDownEvent",
    UP: "MouseUpEvent",
    MOVE: "MouseMoveEvent",
    DRAG: "MouseDragEvent",
    ENTER: "MouseEnterEvent",
    EXIT: "MouseExitEvent",
    WHEEL: "MouseWheelEvent"
} as const);

export type MouseEventType = (typeof MouseEventType)[keyof typeof MouseEventType];
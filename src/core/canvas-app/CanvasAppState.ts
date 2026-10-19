export const CanvasAppState = Object.freeze({
    STOPPED: 0,
    RUNNING: 1,
    DESTROYING: 2,
    DESTROYED: 3
} as const);

export type CanvasAppState = (typeof CanvasAppState)[keyof typeof CanvasAppState];
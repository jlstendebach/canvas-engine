// This feature is scheduled for a different story:
// - https://github.com/jlstendebach/canvas-engine/issues/42
// However, I have decided to implement this enum now as I feel like I might 
// forget these names. Subject to change.
export const CanvasAppUpdateType = Object.freeze({
    CONTINUOUS: 1,
    EVENT_DRIVEN: 2,
    ONE_TIME: 3
});
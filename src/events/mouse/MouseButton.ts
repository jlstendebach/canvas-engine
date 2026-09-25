// https://www.w3schools.com/jsref/event_buttons.asp    
const BUTTONS = {
    LEFT: 1,
    MOUSE1: 1,
    RIGHT: 2,
    MOUSE2: 2,
    MIDDLE: 4,
    MOUSE3: 4,
    MOUSE4: 8,
    MOUSE5: 16
} as const;

export const MouseButton = Object.freeze({
    ...BUTTONS,

    // https://www.w3schools.com/jsref/event_button.asp
    fromIndex(index: number): MouseButton | null {
        switch (index) {
            case 0: return MouseButton.LEFT;
            case 1: return MouseButton.MIDDLE;
            case 2: return MouseButton.RIGHT;
            case 3: return MouseButton.MOUSE4;
            case 4: return MouseButton.MOUSE5;
            default: return null;
        }
    }
} as const);

export type MouseButton = (typeof BUTTONS)[keyof typeof BUTTONS];

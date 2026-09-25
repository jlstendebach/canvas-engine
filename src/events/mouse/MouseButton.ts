// export class MouseButton {
//     // https://www.w3schools.com/jsref/event_buttons.asp
//     static get LEFT(): number   { return 1; }
//     static get MOUSE1(): number { return 1; }
//     static get RIGHT(): number  { return 2; }
//     static get MOUSE2(): number { return 2; }
//     static get MIDDLE(): number { return 4; }
//     static get MOUSE3(): number { return 4; }
//     static get MOUSE4(): number { return 8; }
//     static get MOUSE5(): number { return 16; }

//     static fromIndex(index: number): number | null {
//         // https://www.w3schools.com/jsref/event_button.asp
//         switch (index) {
//             case 0: return MouseButton.LEFT;
//             case 1: return MouseButton.MIDDLE;
//             case 2: return MouseButton.RIGHT;
//             case 3: return MouseButton.MOUSE4;
//             case 4: return MouseButton.MOUSE5;
//             default: return null;
//         }
//     }
// }

export const MouseButton = Object.freeze({
    // https://www.w3schools.com/jsref/event_buttons.asp    
    LEFT: 1,
    MOUSE1: 1,
    RIGHT: 2,
    MOUSE2: 2,
    MIDDLE: 4,
    MOUSE3: 4,
    MOUSE4: 8,
    MOUSE5: 16,

    // https://www.w3schools.com/jsref/event_button.asp
    fromIndex(index: number): number | null {
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

export type MouseButton = (
    typeof MouseButton.LEFT |
    typeof MouseButton.MOUSE1 |
    typeof MouseButton.RIGHT |
    typeof MouseButton.MOUSE2 |
    typeof MouseButton.MIDDLE |
    typeof MouseButton.MOUSE3 |
    typeof MouseButton.MOUSE4 |
    typeof MouseButton.MOUSE5
);

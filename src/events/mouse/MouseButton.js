export class MouseButton {
    // https://www.w3schools.com/jsref/event_buttons.asp
    static LEFT = 1;
    static RIGHT = 2;
    static MIDDLE = 4;
    static MOUSE4 = 8;
    static MOUSE5 = 16;

    static fromIndex(index) {
        // https://www.w3schools.com/jsref/event_button.asp
        switch (index) {
            case 0: return MouseButton.LEFT;
            case 1: return MouseButton.MIDDLE;
            case 2: return MouseButton.RIGHT;
            case 3: return MouseButton.MOUSE4;
            case 4: return MouseButton.MOUSE5;
            default: return null;
        }
    }
}
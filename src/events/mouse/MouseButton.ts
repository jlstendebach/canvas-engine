export class MouseButton {
    // https://www.w3schools.com/jsref/event_buttons.asp
    static get LEFT()   { return 1; }
    static get MOUSE1() { return 1; }
    static get RIGHT()  { return 2; }
    static get MOUSE2() { return 2; }
    static get MIDDLE() { return 4; }
    static get MOUSE3() { return 4; }
    static get MOUSE4() { return 8; }
    static get MOUSE5() { return 16; }

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
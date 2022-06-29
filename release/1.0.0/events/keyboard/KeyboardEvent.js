export class KeyboardEvent {
    static DOWN   = "KeyboardEventDown";
    static REPEAT = "KeyboardEventRepeat";
    static UP     = "KeyboardEventUp";

    type = null;
    key = "";
    code = "";

    constructor(type, key, code) {
        this.type = type;
        this.key = key;
        this.code = code;
    }
}
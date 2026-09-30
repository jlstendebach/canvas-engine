export class KeyboardEvent {
    type = null;
    key = "";
    code = "";

    constructor(type, key, code) {
        this.type = type;
        this.key = key;
        this.code = code;
    }
}
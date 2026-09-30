import type { KeyboardEventType } from "./KeyboardEventType.js";

export class KeyboardEvent {
    type: KeyboardEventType | null = null;
    key: string = "";
    code: string = "";

    constructor(type: KeyboardEventType | null, key: string, code: string) {
        this.type = type;
        this.key = key;
        this.code = code;
    }
}
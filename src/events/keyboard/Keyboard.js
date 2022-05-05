import { EventEmitter } from "../EventEmitter.js"

export class Keyboard {
    static DOWN = "KeyDownEvent";
    static UP = "KeyUpEvent";

    static #eventEmitter = null;
    static #down = {};

    // -------------------------------------------------------------------------
    static init() {
        if (!Keyboard.isInit()) {
            Keyboard.#eventEmitter = new EventEmitter();
            document.addEventListener("keydown", Keyboard.onKeyDown);
            document.addEventListener("keyup", Keyboard.onKeyUp);
        }
    }

    static isInit() {
        return Keyboard.#eventEmitter != null;
    }

    // --[ polling ]------------------------------------------------------------
    static isKeyDown(key) {
        return Keyboard.#down[key] != null;
    }

    // --[ events ]-------------------------------------------------------------
    static onKeyDown(event) {
        if (!Keyboard.isKeyDown(event.code)) {
            Keyboard.#down[event.key] = true;
            Keyboard.#down[event.code] = true;
            Keyboard.#eventEmitter.emit(this.DOWN, event);
        }
    }

    static onKeyUp(event) {
        delete Keyboard.#down[event.key];
        delete Keyboard.#down[event.code];
        Keyboard.#eventEmitter.emit(this.UP, event);
    }

    static addEventListener(type, callback, owner = null) {
        if (type === this.DOWN || type === this.UP) {
            Keyboard.#eventEmitter.add(type, callback, owner);
        }
    }

    static removeEventListener(type, callback, owner = null) {
        if (type === this.DOWN || type === this.UP) {
            Keyboard.#eventEmitter.remove(type, callback, owner);
        }
    }
}
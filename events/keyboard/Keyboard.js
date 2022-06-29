import { EventEmitter } from "../EventEmitter.js"
import { KeyboardEvent } from "./KeyboardEvent.js"

export class Keyboard {
    static #down = {};
    static #capsLock = false
    static #numLock = false
    static #scrollLock = false
    static #eventEmitter = Keyboard.#createEventEmitter();

    // --[ polling ]------------------------------------------------------------
    static isKeyDown(key) {
        return Keyboard.#down[key] != null;
    }

    static isCapsLock() { return Keyboard.#capsLock; }
    static isNumLock() { return Keyboard.#numLock; }
    static isScrollLock() { return Keyboard.#scrollLock; }

    // --[ events ]-------------------------------------------------------------
    static onKeyDown(event) {
        Keyboard.updateModifiers(event);

        if (Keyboard.isKeyDown(event.code)) {
            /**********/
            /* REPEAT */
            /**********/
            Keyboard.#eventEmitter.emit(
                KeyboardEvent.REPEAT, 
                new KeyboardEvent(KeyboardEvent.REPEAT, event.key, event.code)
            );

        } else {
            Keyboard.#down[event.key] = true;
            Keyboard.#down[event.code] = true;

            /********/
            /* DOWN */
            /********/
            Keyboard.#eventEmitter.emit(
                KeyboardEvent.DOWN, 
                new KeyboardEvent(KeyboardEvent.DOWN, event.key, event.code)
            );
        }
    }

    static onKeyUp(event) {
        Keyboard.updateModifiers(event);
        delete Keyboard.#down[event.key];
        delete Keyboard.#down[event.code];

        /******/
        /* UP */        
        /******/
        Keyboard.#eventEmitter.emit(
            KeyboardEvent.UP, 
            new KeyboardEvent(KeyboardEvent.UP, event.key, event.code)
        );
}

    static addEventListener(type, callback, owner = null) {
        if (Keyboard.isValidType(type)) {
            Keyboard.#eventEmitter.add(type, callback, owner);
        }
    }

    static removeEventListener(type, callback, owner = null) {
        if (Keyboard.isValidType(type)) {
            Keyboard.#eventEmitter.remove(type, callback, owner);
        }
    }

    // --[ helpers ]------------------------------------------------------------
    static #createEventEmitter() {
        document.addEventListener("keydown", Keyboard.onKeyDown);
        document.addEventListener("keyup", Keyboard.onKeyUp);
        return new EventEmitter();
    }

    static isValidType(type) {
        switch (type) {
            case KeyboardEvent.DOWN:
            case KeyboardEvent.REPEAT:
            case KeyboardEvent.UP:
                return true;

            default: 
                return false;
        }
    }

    static updateModifiers(event) {
        Keyboard.#capsLock = event.getModifierState("CapsLock");
        Keyboard.#numLock = event.getModifierState("NumLock");
        Keyboard.#scrollLock = event.getModifierState("ScrollLock");
    }

}
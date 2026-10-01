import { EventEmitter } from "../EventEmitter.js"
import { KeyboardEvent } from "./KeyboardEvent.js"
import { KeyboardEventType } from "./KeyboardEventType.js"

type DomKeyboardEvent = globalThis.KeyboardEvent;

export class Keyboard {
    static #down: Record<string, boolean> = {};
    static #capsLock: boolean = false
    static #numLock: boolean = false
    static #scrollLock: boolean = false
    static #eventEmitter: EventEmitter = Keyboard.#createEventEmitter();

    static get events(): EventEmitter {
        return this.#eventEmitter;
    }

    // --[ polling ]------------------------------------------------------------
    static isKeyDown(key: string): boolean {
        return Keyboard.#down[key] != null;
    }

    static isCapsLock(): boolean {
        return Keyboard.#capsLock;
    }

    static isNumLock(): boolean {
        return Keyboard.#numLock;
    }

    static isScrollLock(): boolean {
        return Keyboard.#scrollLock;
    }

    // --[ events ]-------------------------------------------------------------
    static onKeyDown(event: DomKeyboardEvent): void {
        Keyboard.#updateModifiers(event);

        if (Keyboard.isKeyDown(event.code)) {
            /**********/
            /* REPEAT */
            /**********/
            Keyboard.#eventEmitter.emit(
                KeyboardEventType.REPEAT,
                new KeyboardEvent(KeyboardEventType.REPEAT, event.key, event.code)
            );

        } else {
            Keyboard.#down[event.key] = true;
            Keyboard.#down[event.code] = true;

            /********/
            /* DOWN */
            /********/
            Keyboard.#eventEmitter.emit(
                KeyboardEventType.DOWN,
                new KeyboardEvent(KeyboardEventType.DOWN, event.key, event.code)
            );
        }
    }

    static onKeyUp(event: DomKeyboardEvent): void {
        Keyboard.#updateModifiers(event);
        delete Keyboard.#down[event.key];
        delete Keyboard.#down[event.code];

        /******/
        /* UP */
        /******/
        Keyboard.#eventEmitter.emit(
            KeyboardEventType.UP,
            new KeyboardEvent(KeyboardEventType.UP, event.key, event.code)
        );
    }

    // --[ helpers ]------------------------------------------------------------
    static #createEventEmitter(): EventEmitter {
        document.addEventListener("keydown", Keyboard.onKeyDown);
        document.addEventListener("keyup", Keyboard.onKeyUp);
        return new EventEmitter();
    }

    static #updateModifiers(event: DomKeyboardEvent): void {
        Keyboard.#capsLock = event.getModifierState("CapsLock");
        Keyboard.#numLock = event.getModifierState("NumLock");
        Keyboard.#scrollLock = event.getModifierState("ScrollLock");
    }

}
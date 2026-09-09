export class Keyboard {
    static #down: {};
    static #capsLock: boolean;
    static #numLock: boolean;
    static #scrollLock: boolean;
    static #eventEmitter: EventEmitter;
    static get events(): EventEmitter;
    static isKeyDown(key: any): boolean;
    static isCapsLock(): boolean;
    static isNumLock(): boolean;
    static isScrollLock(): boolean;
    static onKeyDown(event: any): void;
    static onKeyUp(event: any): void;
    static addEventListener(type: any, callback: any, owner?: null): void;
    static removeEventListener(type: any, callback: any, owner?: null): void;
    static #createEventEmitter(): EventEmitter;
    static isValidType(type: any): boolean;
    static updateModifiers(event: any): void;
}
import { EventEmitter } from "../EventEmitter.js";
//# sourceMappingURL=Keyboard.d.ts.map
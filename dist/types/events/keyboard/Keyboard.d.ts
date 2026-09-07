import { EventEmitter } from "../EventEmitter.js";
export declare class Keyboard {
    #private;
    static get events(): EventEmitter;
    static isKeyDown(key: any): boolean;
    static isCapsLock(): boolean;
    static isNumLock(): boolean;
    static isScrollLock(): boolean;
    static onKeyDown(event: any): void;
    static onKeyUp(event: any): void;
    static addEventListener(type: any, callback: any, owner?: any): void;
    static removeEventListener(type: any, callback: any, owner?: any): void;
    static isValidType(type: any): boolean;
    static updateModifiers(event: any): void;
}

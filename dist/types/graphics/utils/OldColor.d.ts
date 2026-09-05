export declare class Color {
    #private;
    constructor(r?: number, g?: number, b?: number, a?: number);
    static fromHexString(hex: any): Color;
    static fromString(rgba: any): Color;
    static copy(other: any): Color;
    static hexString(r: any, g: any, b: any, a?: number): string;
    setRGBA(r: any, g: any, b: any, a: any): void;
    setRGB(r: any, g: any, b: any): void;
    /*******/
    /*******/
    set r(r: number);
    get r(): number;
    /*********/
    /*********/
    set g(g: number);
    get g(): number;
    /********/
    /********/
    set b(b: number);
    get b(): number;
    /*********/
    /*********/
    set a(a: number);
    get a(): number;
    add(c: any): this;
    /**
     * This method is preferred over toHexString, as toString's execution is
     * nearly twice as fast
     */
    toString(): string;
    /**
     * This method exists for convenience only. Method toString is prefered, as
     * its execution is nearly twice as fast.
     */
    toHexString(): string;
}

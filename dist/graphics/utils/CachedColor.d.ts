/**
 * A simple wrapper for a color that caches the string representation of the
 * color. This is useful for performance reasons, as it avoids having to call
 * toRgba() on the color every time it is used. The tradeoff is that it
 * uses more memory, as it stores both the color and the string representation
 * of the color.
 */
export declare class CachedColor {
    #private;
    constructor(color: any);
    set color(newColor: any);
    get color(): any;
    get colorString(): any;
}

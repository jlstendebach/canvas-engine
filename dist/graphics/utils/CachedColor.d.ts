/**
 * A simple wrapper for a color that caches the string representation of the
 * color. This is useful for performance reasons, as it avoids having to call
 * toRgba() on the color every time it is used. The tradeoff is that it
 * uses more memory, as it stores both the color and the string representation
 * of the color.
 */
export class CachedColor {
    constructor(color: any);
    set color(newColor: null);
    get color(): null;
    get colorString(): null;
    #private;
}
//# sourceMappingURL=CachedColor.d.ts.map
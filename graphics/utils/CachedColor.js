/**
 * A simple wrapper for a color that caches the string representation of the 
 * color. This is useful for performance reasons, as it avoids having to call 
 * toRgbaString() on the color every time it is used. The tradeoff is that it 
 * uses more memory, as it stores both the color and the string representation 
 * of the color.
 */
export class CachedColor {
    #color = null;
    #colorString = null;

    constructor(color = null) {
        this.color = color;
    }

    // MARK: - Properties ------------------------------------------------------
    set color(color) {
        this.#color = color;
        this.#colorString = this.#color == null ? null : this.#color.toRgbaString();
    }

    get color() {
        return this.#color;
    }

    get colorString() {
        return this.#colorString;
    }
}
import { Color } from "./Color.js";

/**
 * A simple wrapper for a color that caches the string representation of the 
 * color. This is useful for performance reasons, as it avoids having to call 
 * toRgba() on the color every time it is used. The tradeoff is that it 
 * uses more memory, as it stores both the color and the string representation 
 * of the color.
 */
export class CachedColor {
    #color: Color;
    #snapshot: Color;
    #colorString: string;

    constructor(color: Color = new Color()) {
        this.#color = color;
        this.#snapshot = this.#color.clone();
        this.#colorString = this.#color.toRgba();
    }

    // MARK: - Accessors
    set color(value: Color) {
        this.#color = value;
    }

    get color(): Color {
        return this.#color;
    }

    get colorString(): string {
        if (!this.#color.equals(this.#snapshot)) {
            this.#colorString = this.#color.toRgba();
            this.#snapshot.copy(this.#color);
        }
        return this.#colorString;
    }
}
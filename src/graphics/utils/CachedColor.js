import { Color } from "./Color.js";

/**
 * A simple wrapper for a color that caches the string representation of the 
 * color. This is useful for performance reasons, as it avoids having to call 
 * toRgba() on the color every time it is used. The tradeoff is that it 
 * uses more memory, as it stores both the color and the string representation 
 * of the color.
 */
export class CachedColor {
    #rawColor = null;
    #colorProxy = null;
    #colorString = null;

    constructor(color = null) {
        this.color = color;
    }

    // MARK: - Properties
    set color(newColor) {
        if (newColor === null) {
            this.#rawColor = null;
            this.#colorProxy = null;
            this.#colorString = null;
            return;
        }
        if (!(newColor instanceof Color)) {
            throw new TypeError("color must be an instance of Color or null");
        }
        if (this.#rawColor === null) {
            this.#rawColor = newColor.clone();
            this.#updateColorProxy();
        } else {
            this.#rawColor.copy(newColor);
        }

        this.#updateColorString();
    }

    get color() {
        return this.#colorProxy;
    }

    get colorString() {
        return this.#colorString;
    }

    // MARK: - Helpers
    #updateColorString() {
        if (this.#rawColor !== null) {
            this.#colorString = this.#rawColor.toRgba();
        } else {
            this.#colorString = null;
        }
    }

    #updateColorProxy() {
        this.#colorProxy = new Proxy(this.#rawColor, {
            set: (target, prop, value) => {
                target[prop] = value;
                if (prop === "r" || prop === "g" || prop === "b" || prop === "a") {
                    this.#updateColorString();
                }
                return true;
            }
        });
    }
}
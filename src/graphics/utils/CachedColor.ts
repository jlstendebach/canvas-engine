import { Color } from "./Color.js";
import type { ReadonlyColor } from "./ReadonlyColor.js";

/**
 * Wraps a color and caches its `rgba()` string, so hot paths like
 * `fillStyle` assignment don't rebuild the string every frame.
 *
 * The string is rebuilt lazily: `colorString` compares the color against a
 * snapshot taken at the last rebuild and only regenerates on a change. The
 * tradeoff is memory, since each instance holds two colors and a string.
 */
export class CachedColor {
    #color: Color;
    #snapshot: Color;
    #colorString: string;

    // MARK: - Accessors
    /** Copies the given color's components into this instance. */
    set color(value: ReadonlyColor) {
        this.#color.copy(value);
    }

    /**
     * The current color, as a live reference. Mutate it in place to change the
     * color; `colorString` picks up the change on its next read. Clone it to
     * keep a fixed value.
     */
    get color(): Color {
        return this.#color;
    }

    /**
     * The color as an `rgba()` string. Rebuilt only when the color has changed 
     * since the last read.
     */
    get colorString(): string {
        if (!this.#color.equals(this.#snapshot)) {
            this.#colorString = this.#color.toRgba();
            this.#snapshot.copy(this.#color);
        }
        return this.#colorString;
    }

    // MARK: - Initialization
    /**
     * Creates a new CachedColor.
     * @param color - The initial color, copied. Defaults to opaque black.
     */
    constructor(color?: ReadonlyColor) {
        this.#color = color ? color.clone() : new Color();
        this.#snapshot = this.#color.clone();
        this.#colorString = this.#color.toRgba();
    }

    // MARK: - Static Methods
    /**
     * Assigns a color to an optional CachedColor, reusing the existing instance
     * when possible.
     * @param target - The current CachedColor, or null.
     * @param color - The color to assign, or null to clear.
     * @returns `null` if `color` is null; otherwise `target` updated in place,
     * or a new CachedColor if `target` was null.
     */
    static assign(
        target: CachedColor | null,
        color: ReadonlyColor | null
    ): CachedColor | null {
        if (!color) {
            return null;
        }
        if (!target) {
            return new CachedColor(color);
        }
        target.color = color;
        return target;
    }
}
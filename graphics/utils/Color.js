/**
 * Represents a color with red, green, blue, and alpha components.
 * Values are clamped to valid ranges (r/g/b: 0-255, a: 0-1).
 */
export class Color {
    #r = 0;
    #g = 0;
    #b = 0;
    #a = 1.0;

    constructor(r = 0, g = 0, b = 0, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    // MARK: - Factory Methods 
    /**
     * Creates a Color from a hex string (e.g., "#FF0000" or "F00").
     * Supports 3, 4, 6, or 8 hex digits with optional #.
     * @param {string} hexString - The hex color string.
     * @returns {Color|null} A new Color instance or null if invalid.
     */
    static fromHexString(hexString) {
        if (typeof hexString !== "string") {
            return null;
        }

        // Simple validation: 3, 4, 6, or 8 hex digits (optional #)
        // - #? -> Optional leading '#'
        // - [a-f\d] -> a-f or 0-9 (\d is a digit)
        // - {3,4} -> 3 or 4 characters
        // - {6} -> 6 characters
        // - {8} -> 8 characters
        // - i -> case-insensitive
        const isValid = /^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(hexString);
        if (!isValid) {
            return null;
        }

        // Remove '#' and expand shorthand (e.g. #f53 -> ff5533)
        let cleanHex = hexString.replace('#', '');
        if (cleanHex.length <= 4) {
            cleanHex = cleanHex.split('').map(char => char + char).join('');
        }

        // Parse components using substring and parseInt
        return new Color(
            parseInt(cleanHex.substring(0, 2), 16),
            parseInt(cleanHex.substring(2, 4), 16),
            parseInt(cleanHex.substring(4, 6), 16),
            (cleanHex.length === 8) ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1.0
        );
    }

    /**
     * Creates a Color from an RGBA/RGB string (e.g., "rgba(255,0,0,1)" or "rgb(255,0,0)").
     * @param {string} rgbaString - The RGBA/RGB string.
     * @returns {Color|null} A new Color instance or null if invalid.
     */
    static fromRgbaString(rgbaString) {
        if (typeof rgbaString !== "string") {
            return null;
        }

        // Regex to match rgba() or rgb() format
        // - rgba? -> "rgb" followed by optional "a"
        // - \s* -> Optional whitespace (* means zero or more)
        // - (\d+) -> Capture group for red, green, blue (+ means one or more)
        // - (?:,\s*(\d*\.?\d+)\s*)? -> Optional alpha component (non-capturing group)
        // - i -> case-insensitive
        const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)/i;
        const match = rgbaString.match(regex);
        if (!match) {
            return null;
        }

        return new Color(
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
            match[4] ? parseFloat(match[4]) : 1.0
        );
    }

    /**
     * Creates a copy of the given Color.
     * @param {Color} other - The Color to copy.
     * @returns {Color} A new Color instance with the same values.
     */
    static copy(other) {
        return new Color(other.#r, other.#g, other.#b, other.#a);
    }

    // MARK: - Properties
    set r(value) {
        this.#r = Math.max(0, Math.min(255, value));
    }

    get r() {
        return this.#r;
    }

    set g(value) {
        this.#g = Math.max(0, Math.min(255, value));
    }

    get g() {
        return this.#g;
    }

    set b(value) {
        this.#b = Math.max(0, Math.min(255, value));
    }

    get b() {
        return this.#b;
    }

    set a(value) {
        this.#a = Math.max(0, Math.min(1, value));
    }

    get a() {
        return this.#a;
    }

    // MARK: - Helpers
    /**
     * Converts the Color to an RGBA string in the format "rgba(r, g, b, a)".
     * @returns {string} The RGBA string representation of the color.
     */
    toRgbaString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    /**
     * Converts the Color to a hex string in the format "#RRGGBBAA".
     * @returns {string} The hex string representation of the color.
     */
    toHexString() {
        const rHex = this.r.toString(16).padStart(2, '0');
        const gHex = this.g.toString(16).padStart(2, '0');
        const bHex = this.b.toString(16).padStart(2, '0');
        const aHex = Math.round(this.a * 255).toString(16).padStart(2, '0');
        return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    /**
     * Checks if this color equals another.
     * @param {Color} other - The other Color to compare.
     * @returns {boolean} True if equal.
     */
    equals(other) {
        return other instanceof Color &&
            this.r === other.r &&
            this.g === other.g &&
            this.b === other.b &&
            this.a === other.a;
    }
}
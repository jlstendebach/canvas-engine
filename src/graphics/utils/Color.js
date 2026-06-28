/**
 * Represents a color with red, green, blue, and alpha components.
 */
export class Color {
    r; g; b; a;

    // MARK: - Initialization
    constructor(r = 0, g = 0, b = 0, a = 1.0) {
        this.set(r, g, b, a);
    }

    // MARK: - Factory Methods 
    /**
     * Creates a Color from a hex string (e.g., "#FF0000" or "F00").
     * Supports 3, 4, 6, or 8 hex digits with optional #.
     * @param {string} hexString - The hex color string.
     * @returns {Color|null} A new Color instance or null if invalid.
     */
    static fromHex(hexString) {
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
    static fromRgba(rgbaString) {
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
     * Linearly interpolates between two colors.
     * @param {Color} colorA - The starting color.
     * @param {Color} colorB - The ending color.
     * @param {number} t - The interpolation factor (0.0 to 1.0).
     * @returns {Color} The interpolated color.
     */
    static lerp(colorA, colorB, t) {
        const u = 1 - t;
        return new Color(
            colorA.r * u + colorB.r * t,
            colorA.g * u + colorB.g * t,
            colorA.b * u + colorB.b * t,
            colorA.a * u + colorB.a * t
        );
    }

    // MARK: - Conversions
    /**
     * Converts the Color to an RGBA string in the format "rgba(r, g, b, a)".
     * @returns {string} The RGBA string representation of the color.
     */
    toRgba() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    /**
     * Converts the Color to a hex string in the format "#RRGGBBAA".
     * @returns {string} The hex string representation of the color.
     */
    toHex() {
        const rHex = this.r.toString(16).padStart(2, '0');
        const gHex = this.g.toString(16).padStart(2, '0');
        const bHex = this.b.toString(16).padStart(2, '0');
        const aHex = Math.round(this.a * 255).toString(16).padStart(2, '0');
        return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    // MARK: - Utilities
    /**
     * Sets the color components.
     * @param {number} r - Red component
     * @param {number} g - Green component
     * @param {number} b - Blue component
     * @param {number} a - Alpha component
     * @returns {Color} The current Color instance.
     */
    set(r, g, b, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
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

    /**
     * Creates a clone of this Color instance.
     * @returns {Color} A new Color instance with the same values.
     */
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Copies the values from another Color instance.
     * @param {Color} other - The Color to copy from.
     * @returns {Color} The current Color instance.
     */
    copy(other) {
        return this.set(other.r, other.g, other.b, other.a);
    }
}
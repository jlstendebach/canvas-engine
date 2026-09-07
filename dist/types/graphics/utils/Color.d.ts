/**
 * Represents a color with red, green, blue, and alpha components.
 */
export declare class Color {
    r: any;
    g: any;
    b: any;
    a: any;
    constructor(r?: number, g?: number, b?: number, a?: number);
    /**
     * Creates a Color from a hex string (e.g., "#FF0000" or "F00").
     * Supports 3, 4, 6, or 8 hex digits with optional #.
     * @param {string} hexString - The hex color string.
     * @returns {Color|null} A new Color instance or null if invalid.
     */
    static fromHex(hexString: string): Color | null;
    /**
     * Creates a Color from an RGBA/RGB string (e.g., "rgba(255,0,0,1)" or "rgb(255,0,0)").
     * @param {string} rgbaString - The RGBA/RGB string.
     * @returns {Color|null} A new Color instance or null if invalid.
     */
    static fromRgba(rgbaString: string): Color | null;
    /**
     * Linearly interpolates between two colors.
     * @param {Color} colorA - The starting color.
     * @param {Color} colorB - The ending color.
     * @param {number} t - The interpolation factor (0.0 to 1.0).
     * @returns {Color} The interpolated color.
     */
    static lerp(colorA: Color, colorB: Color, t: number): Color;
    /**
     * Converts the Color to an RGBA string in the format "rgba(r, g, b, a)".
     * @returns {string} The RGBA string representation of the color.
     */
    toRgba(): string;
    /**
     * Converts the Color to a hex string in the format "#RRGGBBAA".
     * @returns {string} The hex string representation of the color.
     */
    toHex(): string;
    /**
     * Sets the color components.
     * @param {number} r - Red component
     * @param {number} g - Green component
     * @param {number} b - Blue component
     * @param {number} a - Alpha component
     * @returns {Color} The current Color instance.
     */
    set(r: number, g: number, b: number, a?: number): Color;
    /**
     * Checks if this color equals another.
     * @param {Color} other - The other Color to compare.
     * @returns {boolean} True if equal.
     */
    equals(other: Color): boolean;
    /**
     * Creates a clone of this Color instance.
     * @returns {Color} A new Color instance with the same values.
     */
    clone(): Color;
    /**
     * Copies the values from another Color instance.
     * @param {Color} other - The Color to copy from.
     * @returns {Color} The current Color instance.
     */
    copy(other: Color): Color;
}

import type { ReadonlyColor } from "./ReadonlyColor.js";

/**
 * Represents a color with red, green, blue, and alpha components.
 *
 * RGB components range from 0 to 255 and alpha ranges from 0 to 1.
 * Components may be fractional (e.g., after `lerp`) and are not
 * clamped on assignment.
 */
export class Color implements ReadonlyColor {
    /** Red component, from 0 to 255. */
    r: number;
    /** Green component, from 0 to 255. */
    g: number;
    /** Blue component, from 0 to 255. */
    b: number;
    /** Alpha component, from 0 (transparent) to 1 (opaque). */
    a: number;

    // MARK: - Initialization
    /**
     * Creates a new Color. Defaults to opaque black.
     * @param r - Red component, from 0 to 255.
     * @param g - Green component, from 0 to 255.
     * @param b - Blue component, from 0 to 255.
     * @param a - Alpha component, from 0 to 1.
     */
    constructor(
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 1.0
    ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    // MARK: - Static Methods 
    /**
     * Creates a Color from a hex string (e.g., "#FF0000" or "F00").
     * 
     * Supports 3, 4, 6, or 8 hex digits with optional #.
     * @param hexString - The hex color string.
     * @returns A new Color instance or null if invalid.
     */
    static fromHex(hexString: string): Color | null {
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
            cleanHex = cleanHex
                .split('')
                .map((char) => char + char)
                .join('');
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
     * 
     * @param rgbaString - The RGBA/RGB string.
     * @returns A new Color instance or null if invalid.
     */
    static fromRgba(rgbaString: string): Color | null {
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
     * 
     * @param colorA - The starting color.
     * @param colorB - The ending color.
     * @param t - The interpolation factor (0.0 to 1.0).
     * @returns The interpolated color.
     */
    static lerp(
        colorA: ReadonlyColor,
        colorB: ReadonlyColor,
        t: number,
        out: Color = new Color()
    ): Color {
        const u = 1 - t;
        return out.set(
            colorA.r * u + colorB.r * t,
            colorA.g * u + colorB.g * t,
            colorA.b * u + colorB.b * t,
            colorA.a * u + colorB.a * t
        );
    }

    // MARK: - Conversions
    /**
     * Converts the Color to an RGBA string in the format "rgba(r, g, b, a)".
     * 
     * @returns The RGBA string representation of the color.
     */
    toRgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    /**
     * Converts the Color to a hex string in the format "#RRGGBBAA". Components 
     * are rounded and clamped to the valid range.
     * 
     * @returns The hex string representation of the color.
     */
    toHex(): string {
        const rHex = toHexByte(this.r);
        const gHex = toHexByte(this.g);
        const bHex = toHexByte(this.b);
        const aHex = toHexByte(this.a * 255);
        return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    // MARK: - Utilities
    /**
     * Sets the color components.
     * @param r - Red component
     * @param g - Green component
     * @param b - Blue component
     * @param a - Alpha component
     * @returns The current Color instance.
     */
    set(r: number, g: number, b: number, a: number = 1.0): this {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }

    /**
     * Checks if this color equals another.
     * @param other - The other Color to compare.
     * @returns True if equal.
     */
    equals(other: ReadonlyColor): boolean {
        return this.r === other.r &&
            this.g === other.g &&
            this.b === other.b &&
            this.a === other.a;
    }

    /**
     * Creates a clone of this Color instance.
     * 
     * @returns A new Color instance with the same values.
     */
    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Copies the values from another color.
     * 
     * @param other - The color to copy from.
     * @returns The current Color instance.
     */
    copy(other: ReadonlyColor): this {
        return this.set(other.r, other.g, other.b, other.a);
    }
}

// MARK: - toHexByte
function toHexByte(value: number): string {
    return Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0');
}

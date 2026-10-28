import type { Color } from "./Color.js";

/**
 * A read-only view of a {@link Color}.
 *
 * Restricts access through this reference only. It does not make the color 
 * immutable: changes made through another reference are visible here.
 */
export interface ReadonlyColor {
    /** Red component, from 0 to 255. */
    readonly r: number;
    /** Green component, from 0 to 255. */
    readonly g: number;
    /** Blue component, from 0 to 255. */
    readonly b: number;
    /** Alpha component, from 0 (transparent) to 1 (opaque). */
    readonly a: number;

    toRgba(): string;
    toHex(): string;
    equals(other: ReadonlyColor): boolean;
    clone(): Color;
}
import { CachedColor, Color } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("CachedColor", () => {
    // MARK: - constructor
    describe("constructor", () => {
        test.each([
            new CachedColor(),
            new CachedColor(null),
            new CachedColor(undefined),
        ])("initializes with default color", (cachedColor) => {
            expect(cachedColor.color.equals(new Color(0, 0, 0, 1))).toBe(true);
        });

        test.each([
            new Color(255, 0, 0),
            new Color(0, 255, 0),
            new Color(0, 0, 255),
            new Color(255, 255, 0, 0.5),            
        ])("initializes with provided color", (color) => {
            const cachedColor = new CachedColor(color);
            expect(cachedColor.color.equals(color)).toBe(true);
        });
    });

    // MARK: - color property
    describe("color property", () => {
        test("setting color updates colorString", () => {
            const cachedColor = new CachedColor();
            cachedColor.color = new Color(255, 0, 0, 0.5);
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });

        test("modifying color updates colorString", () => {
            const cachedColor = new CachedColor(new Color(0, 0, 0, 0));
            cachedColor.color.r = 100;
            expect(cachedColor.colorString).toBe("rgba(100, 0, 0, 0)");
            cachedColor.color.g = 100;
            expect(cachedColor.colorString).toBe("rgba(100, 100, 0, 0)");
            cachedColor.color.b = 100;
            expect(cachedColor.colorString).toBe("rgba(100, 100, 100, 0)");
            cachedColor.color.a = 1.0;
            expect(cachedColor.colorString).toBe("rgba(100, 100, 100, 1)");
        });

        test("setting color to null clears colorString", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            cachedColor.color = null;
            expect(cachedColor.colorString).toBe(null);
        });

        test("setting color to non-Color throws error", () => {
            const cachedColor = new CachedColor();
            expect(() => {
                cachedColor.color = "not a color";
            }).toThrow(TypeError);
        });

        test("setting random property does not update colorString", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
            cachedColor.color.randomProp = "test";
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });
    });

});
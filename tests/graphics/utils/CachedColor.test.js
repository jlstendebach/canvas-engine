import { CachedColor, Color } from "@canvas-engine";
import { describe, expect, jest, test } from "@jest/globals";

describe("CachedColor", () => {
    // MARK: - constructor
    describe("constructor", () => {
        test("defaults to opaque black", () => {
            const black = new Color(0, 0, 0, 1);
            expect(new CachedColor().color.equals(black)).toBe(true);
            expect(new CachedColor(undefined).color.equals(black)).toBe(true);
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

        test("builds colorString from the provided color", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });

        test("copies the provided color", () => {
            const source = new Color(255, 0, 0, 0.5);
            const cachedColor = new CachedColor(source);
            source.r = 0;
            expect(cachedColor.color.r).toBe(255);
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });
    });

    // MARK: - color property
    describe("color property", () => {
        test("setting color updates colorString", () => {
            const cachedColor = new CachedColor();
            cachedColor.color = new Color(255, 0, 0, 0.5);
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });

        test("setting color copies the value", () => {
            const cachedColor = new CachedColor();
            const source = new Color(255, 0, 0, 0.5);
            cachedColor.color = source;
            source.r = 0;
            expect(cachedColor.color.r).toBe(255);
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });

        test("getter returns the same live instance", () => {
            const cachedColor = new CachedColor();
            expect(cachedColor.color).toBe(cachedColor.color);
        });

        test("mutating color through the getter updates colorString", () => {
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

        test("mutating color through set() updates colorString", () => {
            const cachedColor = new CachedColor();
            cachedColor.color.set(0, 255, 0, 0.5);
            expect(cachedColor.colorString).toBe("rgba(0, 255, 0, 0.5)");
        });

        test("mutating a held reference updates colorString", () => {
            const cachedColor = new CachedColor();
            const color = cachedColor.color;
            color.r = 123;
            expect(cachedColor.colorString).toBe("rgba(123, 0, 0, 1)");
        });
    });

    // MARK: - colorString caching
    describe("colorString caching", () => {
        test("does not rebuild the string when the color is unchanged", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            const spy = jest.spyOn(cachedColor.color, "toRgba");
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
            expect(spy).not.toHaveBeenCalled();
        });

        test("rebuilds the string once after the color changes", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            const spy = jest.spyOn(cachedColor.color, "toRgba");
            cachedColor.color = new Color(0, 255, 0, 1);
            expect(cachedColor.colorString).toBe("rgba(0, 255, 0, 1)");
            expect(cachedColor.colorString).toBe("rgba(0, 255, 0, 1)");
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("does not rebuild when set to an equal color", () => {
            const cachedColor = new CachedColor(new Color(255, 0, 0, 0.5));
            const spy = jest.spyOn(cachedColor.color, "toRgba");
            cachedColor.color = new Color(255, 0, 0, 0.5);
            expect(cachedColor.colorString).toBe("rgba(255, 0, 0, 0.5)");
            expect(spy).not.toHaveBeenCalled();
        });
    });

    // MARK: - assign
    describe("assign", () => {
        test("returns null when color is null", () => {
            const target = new CachedColor(new Color(255, 0, 0));
            expect(CachedColor.assign(target, null)).toBe(null);
            expect(CachedColor.assign(null, null)).toBe(null);
        });

        test("creates a new instance when target is null", () => {
            const color = new Color(255, 0, 0, 0.5);
            const result = CachedColor.assign(null, color);
            expect(result).toBeInstanceOf(CachedColor);
            expect(result.color.equals(color)).toBe(true);
            expect(result.colorString).toBe("rgba(255, 0, 0, 0.5)");
        });

        test("reuses and updates an existing target", () => {
            const target = new CachedColor(new Color(255, 0, 0));
            const result = CachedColor.assign(target, new Color(0, 255, 0, 0.5));
            expect(result).toBe(target);
            expect(target.colorString).toBe("rgba(0, 255, 0, 0.5)");
        });

        test("copies the provided color", () => {
            const source = new Color(255, 0, 0, 0.5);
            const result = CachedColor.assign(null, source);
            source.r = 0;
            expect(result.color.r).toBe(255);
        });
    });
});
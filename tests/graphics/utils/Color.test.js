import { Color } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("Color", () => {
    // MARK: - constructor
    describe("constructor", () => {
        test("initializes with default values", () => {
            const c = new Color();
            expect(c.r).toBe(0);
            expect(c.g).toBe(0);
            expect(c.b).toBe(0);
            expect(c.a).toBe(1.0);
        });

        test("initializes with custom values", () => {
            const c = new Color(255, 128, 64, 0.5);
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(0.5);
        });
    });

    // MARK: - fromHex()
    describe("fromHex()", () => {
        test("8-character hex string - opaque", () => {
            const c = Color.fromHex("#FF8040FF");
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(1.0);
        });

        test("8-character hex string - translucent", () => {
            const c = Color.fromHex("#FF8040AA");
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            // Alpha: 0xAA = 170, 170/255 ≈ 0.667
            expect(c.a).toBeCloseTo(0.667, 2);
        });

        test("8-character hex string - transparent", () => {
            const c = Color.fromHex("#FF804000");
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(0);
        });

        test("8-character hex string - all letters", () => {
            const c = Color.fromHex("#AaBbCcDd");
            expect(c.r).toBe(170);
            expect(c.g).toBe(187);
            expect(c.b).toBe(204);
            expect(c.a).toBeCloseTo(0.867, 2);
        });

        test("8-character hex string - all numbers", () => {
            const c = Color.fromHex("#12345678");
            expect(c.r).toBe(18);
            expect(c.g).toBe(52);
            expect(c.b).toBe(86);
            expect(c.a).toBeCloseTo(0.471, 2);
        });

        test("8-character hex string - mixed numbers and letters", () => {
            const c = Color.fromHex("#1a2b3c4a");
            expect(c.r).toBe(26);
            expect(c.g).toBe(43);
            expect(c.b).toBe(60);
            expect(c.a).toBeCloseTo(0.294, 2);
        });

        test("6-character hex string", () => {
            const c = Color.fromHex("#FF8040");
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(1.0);
        });

        test("4-character hex string", () => {
            const c = Color.fromHex("#F84A");
            expect(c.r).toBe(255);
            expect(c.g).toBe(136);
            expect(c.b).toBe(68);
            // Alpha: 0xAA = 170, 170/255 ≈ 0.667
            expect(c.a).toBeCloseTo(0.667, 2);
        });

        test("3-character hex string", () => {
            const c = Color.fromHex("#F84");
            expect(c.r).toBe(255);
            expect(c.g).toBe(136);
            expect(c.b).toBe(68);
            expect(c.a).toBe(1.0);
        });

        test.each([
            "F", "#F", "FF", "#FF", "#12345",
            "#GGGGG", "ZZZ", "*-*//-**", 
            "rgba(255, 128, 64, 0.5)", 
            "", null, undefined, {}, [], 0.0
        ])("Invalid hex string returns null", (invalidString) => {
            const c = Color.fromHex(invalidString);
            expect(c).toBe(null);
        });
    });

    // MARK: - fromRgba()
    describe("fromRgba()", () => {
        test("rgba string with alpha", () => {
            const c = Color.fromRgba("rgba(200, 128, 64, 0.5)");
            expect(c.r).toBe(200);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(0.5);
        });

        test("rgba string without alpha", () => {
            const c = Color.fromRgba("rgba(200, 128, 64)");
            expect(c.r).toBe(200);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(1.0);
        });

        test("rgb string with alpha", () => {
            const c = Color.fromRgba("rgb(200, 128, 64, 0.5)");
            expect(c.r).toBe(200);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(0.5);
        });

        test("rgb string without alpha", () => {
            const c = Color.fromRgba("rgb(200, 128, 64)");
            expect(c.r).toBe(200);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(1.0);
        });

        /*
        test.each([
            "rgba(256, 256, 256, 1.1)",
            "rgba(256, 256, 256, 0.5)",
            "rgba(256, 256, 128, 1.1)",
            "rgba(256, 256, 128, 0.5)",
            "rgba(256, 128, 256, 1.1)",
            "rgba(256, 128, 256, 0.5)",
            "rgba(256, 128, 128, 1.1)",
            "rgba(256, 128, 128, 0.5)",
            "rgba(128, 256, 256, 1.1)",
            "rgba(128, 256, 256, 0.5)",
            "rgba(128, 256, 128, 1.1)",
            "rgba(128, 256, 128, 0.5)",
            "rgba(128, 128, 256, 1.1)",
            "rgba(128, 128, 256, 0.5)",
            "rgba(128, 128, 128, 1.1)",
            "rgba(128, 128, 128, 0.5)",
        ])("Clamping in rgba string", (rgbaString) => {
            const c = Color.fromRgba(rgbaString);
            expect(c.r).toBeGreaterThanOrEqual(0);
            expect(c.r).toBeLessThanOrEqual(255);
            expect(c.g).toBeGreaterThanOrEqual(0);
            expect(c.g).toBeLessThanOrEqual(255);
            expect(c.b).toBeGreaterThanOrEqual(0);
            expect(c.b).toBeLessThanOrEqual(255);
            expect(c.a).toBeGreaterThanOrEqual(0);
            expect(c.a).toBeLessThanOrEqual(1);
        });
        */

        test.each([
            "rgba(255, 128, 64, 0.5",
            "rgba(255, 128, 64,)",
            "rgba(255, 128, 64",
            "rgba(255, 128,)",
            "rgba(255, 128",
            "rgba(255,)",
            "rgba(255",
            "rgba(",
            "rgb(255, 128, 64, 0.5",
            "rgb(255, 128, 64,)",
            "rgb(255, 128, 64",
            "rgb(255, 128",
            "rgb(255",
            "rgb(",
            "awefawefawef",
            "red",
            "#FF8040FF",        
            "",
            null,
            undefined,
            {},
            [],
            0.0
        ])("Invalid rgba string returns null", (invalidString) => {
            const c = Color.fromRgba(invalidString);
            expect(c).toBe(null);
        });
    });

    // MARK: - toRgba()
    describe("toRgba()", () => {
        test("with opaque color", () => {
            const c = new Color(255, 128, 64, 1);
            expect(c.toRgba()).toBe("rgba(255, 128, 64, 1)");
        });

        test("with transparent color", () => {
            const c = new Color(100, 150, 200, 0.5);
            expect(c.toRgba()).toBe("rgba(100, 150, 200, 0.5)");
        });

        test("with fully transparent color", () => {
            const c = new Color(50, 75, 100, 0);
            expect(c.toRgba()).toBe("rgba(50, 75, 100, 0)");
        });

        test("after modification", () => {
            const c = new Color(255, 0, 0, 1);
            c.r = 0;
            c.g = 255;
            c.b = 0;
            c.a = 0.7;
            expect(c.toRgba()).toBe("rgba(0, 255, 0, 0.7)");
        });
    });

    // MARK: - toHex()
    describe("toHex()", () => {
        test("with opaque color", () => {
            const c = new Color(255, 128, 64, 1);
            expect(c.toHex()).toBe("#ff8040ff");
        });

        test("with transparent color", () => {
            const c = new Color(100, 150, 200, 0.5);
            expect(c.toHex()).toBe("#6496c880");
        });

        test("with fully transparent color", () => {
            const c = new Color(50, 75, 100, 0);
            expect(c.toHex()).toBe("#324b6400");
        });

        test("after modification", () => {
            const c = new Color(255, 0, 0, 1);
            c.r = 0;
            c.g = 255;
            c.b = 0;
            c.a = 0.7;
            expect(c.toHex()).toBe("#00ff00b3");
        });
    });

    // MARK: - set()
    describe("set()", () => {
        test("correctly sets values", () => {
            const c = new Color();
            c.set(255, 128, 64, 0.5);
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(0.5);
        });

        test("correctly sets default alpha", () => {
            const c = new Color();
            c.set(255, 128, 64);
            expect(c.r).toBe(255);
            expect(c.g).toBe(128);
            expect(c.b).toBe(64);
            expect(c.a).toBe(1.0);
        });

        test("allows unclamped values", () => {
            const c = new Color();
            c.set(300, -20, 128, 1.5);
            expect(c.r).toBe(300);
            expect(c.g).toBe(-20);
            expect(c.b).toBe(128);
            expect(c.a).toBe(1.5);
        });
    });

    // MARK: - equals()
    describe("equals()", () => {
        test("returns true for identical colors", () => {
            const c1 = new Color(255, 128, 64, 0.5);
            const c2 = new Color(255, 128, 64, 0.5);
            expect(c1.equals(c2)).toBe(true);
        });

        test("returns false for colors with different red values", () => {
            const c1 = new Color(255, 64, 32, 0.5);
            const c2 = new Color(128, 64, 32, 0.5);
            expect(c1.equals(c2)).toBe(false);
        });

        test("returns false for colors with different green values", () => {
            const c1 = new Color(255, 64, 32, 0.5);
            const c2 = new Color(255, 128, 32, 0.5);
            expect(c1.equals(c2)).toBe(false);
        });

        test("returns false for colors with different blue values", () => {
            const c1 = new Color(255, 64, 32, 0.5);
            const c2 = new Color(255, 64, 128, 0.5);
            expect(c1.equals(c2)).toBe(false);
        });

        test("returns false for colors with different alpha", () => {
            const c1 = new Color(255, 128, 64, 0.5);
            const c2 = new Color(255, 128, 64, 0.6);
            expect(c1.equals(c2)).toBe(false);
        });
    });

    // MARK: - clone()
    describe("clone()", () => {
        test("creates an identical color", () => {
            const original = new Color(255, 128, 64, 0.5);
            const clone = original.clone();
            expect(original.equals(clone)).toBe(true);
        });

        test("creates a different instance", () => {
            const original = new Color(255, 128, 64, 0.5);
            const clone = original.clone();
            expect(clone).not.toBe(original);
        });

       test("preserves all values", () => {
            const original = new Color(100, 150, 200, 0.5);
            const clone = original.clone();
            expect(clone.r).toBe(original.r);
            expect(clone.g).toBe(original.g);
            expect(clone.b).toBe(original.b);
            expect(clone.a).toBe(original.a);
        });

        test("is independent from original", () => {
            const original = new Color(100, 150, 200, 0.5);
            const clone = original.clone();
            clone.r = 255;
            clone.g = 0;
            clone.b = 0;
            clone.a = 1.0;
            expect(original.r).toBe(100);
            expect(original.g).toBe(150);
            expect(original.b).toBe(200);
            expect(original.a).toBe(0.5);
        });
    });

    // MARK: - copy()
    describe("copy()", () => {
        test("copies values from another color", () => {
            const source = new Color(255, 128, 64, 0.5);
            const target = new Color();
            target.copy(source);
            expect(target.equals(source)).toBe(true);
        });

        test("returns the current instance", () => {
            const source = new Color(255, 128, 64, 0.5);
            const target = new Color();
            const result = target.copy(source);
            expect(result).toBe(target);
            expect(result).not.toBe(source);
        });
        
        test("is independent from source", () => {
            const source = new Color(100, 150, 200, 0.5);
            const target = new Color();
            target.copy(source);
            target.r = 255;
            target.g = 0;
            target.b = 0;
            target.a = 1.0;
            expect(source.r).toBe(100);
            expect(source.g).toBe(150);
            expect(source.b).toBe(200);
            expect(source.a).toBe(0.5);
        });
    });

});
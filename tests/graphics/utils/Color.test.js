import { Color } from "../../../src/graphics/utils/Color.js";

// MARK: - Constructor Tests
describe("Color Constructor", () => {
    test("Color()", () => {
        const c = new Color();
        expect(c.r).toBe(0);
        expect(c.g).toBe(0);
        expect(c.b).toBe(0);
        expect(c.a).toBe(1.0);
    });

    test("Color(r, g, b)", () => {
        const c = new Color(255, 128, 64);
        expect(c.r).toBe(255);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(1.0);
    });

    test("Color(r, g, b, a)", () => {
        const c = new Color(100, 150, 200, 0.5);
        expect(c.r).toBe(100);
        expect(c.g).toBe(150);
        expect(c.b).toBe(200);
        expect(c.a).toBe(0.5);
    });
});

// MARK: - fromHexString()
describe("Color.fromHexString()", () => {
    test("8-character hex string - opaque", () => {
        const c = Color.fromHexString("#FF8040FF");
        expect(c.r).toBe(255);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(1.0);
    });

    test("8-character hex string - translucent", () => {
        const c = Color.fromHexString("#FF8040AA");
        expect(c.r).toBe(255);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        // Alpha: 0xAA = 170, 170/255 ≈ 0.667
        expect(c.a).toBeCloseTo(0.667, 2);
    });

    test("8-character hex string - transparent", () => {
        const c = Color.fromHexString("#FF804000");
        expect(c.r).toBe(255);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(0);
    });

    test("8-character hex string - all letters", () => {
        const c = Color.fromHexString("#AaBbCcDd");
        expect(c.r).toBe(170);
        expect(c.g).toBe(187);
        expect(c.b).toBe(204);
        expect(c.a).toBeCloseTo(0.867, 2);
    });

    test("8-character hex string - all numbers", () => {
        const c = Color.fromHexString("#12345678");
        expect(c.r).toBe(18);
        expect(c.g).toBe(52);
        expect(c.b).toBe(86);
        expect(c.a).toBeCloseTo(0.471, 2);
    });

    test("8-character hex string - mixed numbers and letters", () => {
        const c = Color.fromHexString("#1a2b3c4a");
        expect(c.r).toBe(26);
        expect(c.g).toBe(43);
        expect(c.b).toBe(60);
        expect(c.a).toBeCloseTo(0.294, 2);
    });

    test("6-character hex string", () => {
        const c = Color.fromHexString("#FF8040");
        expect(c.r).toBe(255);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(1.0);
    });

    test("4-character hex string", () => {
        const c = Color.fromHexString("#F84A");
        expect(c.r).toBe(255);
        expect(c.g).toBe(136);
        expect(c.b).toBe(68);
        // Alpha: 0xAA = 170, 170/255 ≈ 0.667
        expect(c.a).toBeCloseTo(0.667, 2);
    });

    test("3-character hex string", () => {
        const c = Color.fromHexString("#F84");
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
    ])("Invalid hex string returns default black", (invalidString) => {
        console.log(">>>> Testing invalid hex string:", invalidString);
        const c = Color.fromHexString(invalidString);
        expect(c).toBe(null);
    });

});

// MARK: - fromRgbaString()
describe("Color.fromRgbaString()", () => {
    test("rgba string with alpha", () => {
        const c = Color.fromRgbaString("rgba(200, 128, 64, 0.5)");
        expect(c.r).toBe(200);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(0.5);
    });

    test("rgba string without alpha", () => {
        const c = Color.fromRgbaString("rgba(200, 128, 64)");
        expect(c.r).toBe(200);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(1.0);
    });

    test("rgb string with alpha", () => {
        const c = Color.fromRgbaString("rgb(200, 128, 64, 0.5)");
        expect(c.r).toBe(200);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(0.5);
    });

    test("rgb string without alpha", () => {
        const c = Color.fromRgbaString("rgb(200, 128, 64)");
        expect(c.r).toBe(200);
        expect(c.g).toBe(128);
        expect(c.b).toBe(64);
        expect(c.a).toBe(1.0);
    });

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
        const c = Color.fromRgbaString(rgbaString);
        expect(c.r).toBeGreaterThanOrEqual(0);
        expect(c.r).toBeLessThanOrEqual(255);
        expect(c.g).toBeGreaterThanOrEqual(0);
        expect(c.g).toBeLessThanOrEqual(255);
        expect(c.b).toBeGreaterThanOrEqual(0);
        expect(c.b).toBeLessThanOrEqual(255);
        expect(c.a).toBeGreaterThanOrEqual(0);
        expect(c.a).toBeLessThanOrEqual(1);
    });

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
        const c = Color.fromRgbaString(invalidString);
        expect(c).toBe(null);
    });
});


// MARK: - copy()
describe("Color.copy()", () => {
    test("Copy creates a new instance", () => {
        const original = new Color(100, 150, 200, 0.5);
        const copy = Color.copy(original);
        expect(copy).not.toBe(original);
    });

    test("Copy preserves all RGBA values", () => {
        const original = new Color(100, 150, 200, 0.5);
        const copy = Color.copy(original);
        expect(copy.r).toBe(original.r);
        expect(copy.g).toBe(original.g);
        expect(copy.b).toBe(original.b);
        expect(copy.a).toBe(original.a);
    });

    test("Copy is independent from original", () => {
        const original = new Color(100, 150, 200, 0.5);
        const copy = Color.copy(original);
        copy.r = 255;
        copy.g = 0;
        copy.b = 0;
        copy.a = 1.0;
        expect(original.r).toBe(100);
        expect(original.g).toBe(150);
        expect(original.b).toBe(200);
        expect(original.a).toBe(0.5);
    });

    test("Copy of black color", () => {
        const original = new Color(0, 0, 0, 0);
        const copy = Color.copy(original);
        expect(copy.r).toBe(0);
        expect(copy.g).toBe(0);
        expect(copy.b).toBe(0);
        expect(copy.a).toBe(0);
    });

    test("Copy of white color", () => {
        const original = new Color(255, 255, 255, 1);
        const copy = Color.copy(original);
        expect(copy.r).toBe(255);
        expect(copy.g).toBe(255);
        expect(copy.b).toBe(255);
        expect(copy.a).toBe(1);
    });
});

// MARK: - Property Setter Tests
describe("Color Property Setters", () => {
    test("Set r within range", () => {
        const c = new Color();
        c.r = 100;
        expect(c.r).toBe(100);
    });

    test("Set g within range", () => {
        const c = new Color();
        c.g = 150;
        expect(c.g).toBe(150);
    });

    test("Set b within range", () => {
        const c = new Color();
        c.b = 200;
        expect(c.b).toBe(200);
    });

    test("Set a within range", () => {
        const c = new Color();
        c.a = 0.75;
        expect(c.a).toBe(0.75);
    });
});

// MARK: - Clamping Tests
describe("Color Clamping", () => {
    test("Clamp r below 0", () => {
        const c = new Color();
        c.r = -10;
        expect(c.r).toBe(0);
    });

    test("Clamp r above 255", () => {
        const c = new Color();
        c.r = 300;
        expect(c.r).toBe(255);
    });

    test("Clamp g below 0", () => {
        const c = new Color();
        c.g = -50;
        expect(c.g).toBe(0);
    });

    test("Clamp g above 255", () => {
        const c = new Color();
        c.g = 500;
        expect(c.g).toBe(255);
    });

    test("Clamp b below 0", () => {
        const c = new Color();
        c.b = -1;
        expect(c.b).toBe(0);
    });

    test("Clamp b above 255", () => {
        const c = new Color();
        c.b = 256;
        expect(c.b).toBe(255);
    });

    test("Clamp a below 0", () => {
        const c = new Color();
        c.a = -0.5;
        expect(c.a).toBe(0);
    });

    test("Clamp a above 1", () => {
        const c = new Color();
        c.a = 1.5;
        expect(c.a).toBe(1);
    });

    test("Clamp constructor values above bounds", () => {
        const c = new Color(300, 300, 256, 1.5);
        expect(c.r).toBe(255);
        expect(c.g).toBe(255);
        expect(c.b).toBe(255);
        expect(c.a).toBe(1);
    });

    test("Clamp constructor values below bounds", () => {
        const c = new Color(-10, -20, -30, -0.5);
        expect(c.r).toBe(0);
        expect(c.g).toBe(0);
        expect(c.b).toBe(0);
        expect(c.a).toBe(0);
    });
});

// MARK: - Property Independence Tests
describe("Color Independence", () => {
    test("Setting r does not affect other properties", () => {
        const c = new Color(10, 20, 30, 0.5);
        c.r = 200;
        expect(c.r).toBe(200);
        expect(c.g).toBe(20);
        expect(c.b).toBe(30);
        expect(c.a).toBe(0.5);
    });

    test("Setting g does not affect other properties", () => {
        const c = new Color(10, 20, 30, 0.5);
        c.g = 150;
        expect(c.r).toBe(10);
        expect(c.g).toBe(150);
        expect(c.b).toBe(30);
        expect(c.a).toBe(0.5);
    });

    test("Setting b does not affect other properties", () => {
        const c = new Color(10, 20, 30, 0.5);
        c.b = 100;
        expect(c.r).toBe(10);
        expect(c.g).toBe(20);
        expect(c.b).toBe(100);
        expect(c.a).toBe(0.5);
    });

    test("Setting a does not affect RGB", () => {
        const c = new Color(100, 150, 200, 1);
        c.a = 0.25;
        expect(c.r).toBe(100);
        expect(c.g).toBe(150);
        expect(c.b).toBe(200);
        expect(c.a).toBe(0.25);
    });
});

// MARK: - String Conversion Tests
describe("Color String Conversion", () => {
    test("toRgbaString() with opaque color", () => {
        const c = new Color(255, 128, 64, 1);
        expect(c.toRgbaString()).toBe("rgba(255, 128, 64, 1)");
    });

    test("toRgbaString() with transparent color", () => {
        const c = new Color(100, 150, 200, 0.5);
        expect(c.toRgbaString()).toBe("rgba(100, 150, 200, 0.5)");
    });

    test("toRgbaString() with fully transparent color", () => {
        const c = new Color(50, 75, 100, 0);
        expect(c.toRgbaString()).toBe("rgba(50, 75, 100, 0)");
    });

    test("toRgbaString() after modification", () => {
        const c = new Color(255, 0, 0, 1);
        c.r = 0;
        c.g = 255;
        c.b = 0;
        c.a = 0.7;
        expect(c.toRgbaString()).toBe("rgba(0, 255, 0, 0.7)");
    });
});

// MARK: - toHexString() Tests
describe("Color toHexString()", () => {
    test("toHexString() with opaque color", () => {
        const c = new Color(255, 128, 64, 1);
        expect(c.toHexString()).toBe("#ff8040ff");
    });

    test("toHexString() with transparent color", () => {
        const c = new Color(100, 150, 200, 0.5);
        expect(c.toHexString()).toBe("#6496c880");
    });

    test("toHexString() with fully transparent color", () => {
        const c = new Color(50, 75, 100, 0);
        expect(c.toHexString()).toBe("#324b6400");
    });

    test("toHexString() after modification", () => {
        const c = new Color(255, 0, 0, 1);
        c.r = 0;
        c.g = 255;
        c.b = 0;
        c.a = 0.7;
        expect(c.toHexString()).toBe("#00ff00b3");
    });
});

// MARK: - equals() Tests
describe("Color equals()", () => {
    test("equals() with identical colors", () => {
        const c1 = new Color(100, 150, 200, 0.5);
        const c2 = new Color(100, 150, 200, 0.5);
        expect(c1.equals(c2)).toBe(true);
    });

    test("equals() with different colors", () => {
        const c1 = new Color(100, 150, 200, 0.5);
        const c2 = new Color(101, 150, 200, 0.5);
        expect(c1.equals(c2)).toBe(false);
    });

    test("equals() with different types", () => {
        const c = new Color(100, 150, 200, 0.5);
        expect(c.equals("not a color")).toBe(false);
    });
});
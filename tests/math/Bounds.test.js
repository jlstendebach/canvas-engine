import { Bounds, Vec2 } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("Bounds", () => {
    // MARK: - Constructor tests
    describe("constructor", () => {
        test("should initialize with default values", () => {
            const bounds = new Bounds();
            expect(bounds.minX).toBe(Infinity);
            expect(bounds.minY).toBe(Infinity);
            expect(bounds.maxX).toBe(-Infinity);
            expect(bounds.maxY).toBe(-Infinity);
        });

        test("should initialize with provided values", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            expect(bounds.minX).toBe(1);
            expect(bounds.minY).toBe(2);
            expect(bounds.maxX).toBe(3);
            expect(bounds.maxY).toBe(4);
        });
    });

    // MARK: - Property tests
    describe("x and y", () => {
        test("should get and set x correctly", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            expect(bounds.x).toBe(1);
            bounds.x = 5;
            expect(bounds.x).toBe(5);
            expect(bounds.x).toBe(bounds.minX);
        });

        test("should maintain width when setting x", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const originalWidth = bounds.width;
            bounds.x = 5;
            expect(bounds.width).toBe(originalWidth);
        });

        test("should get and set y correctly", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            expect(bounds.y).toBe(2);
            bounds.y = 6;
            expect(bounds.y).toBe(6);
            expect(bounds.y).toBe(bounds.minY);
        });

        test("should maintain height when setting y", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const originalHeight = bounds.height;
            bounds.y = 6;
            expect(bounds.height).toBe(originalHeight);
        });
    });

    describe("width and height", () => {
        test("should get and set width correctly", () => {
            const bounds = new Bounds(1, 2, 10, 10);
            expect(bounds.width).toBe(9);
            bounds.width = 20;
            expect(bounds.width).toBe(20);
            expect(bounds.maxX).toBe(bounds.minX + 20);
        });

        test("should get and set height correctly", () => {
            const bounds = new Bounds(1, 2, 10, 10);
            expect(bounds.height).toBe(8);
            bounds.height = 20;
            expect(bounds.height).toBe(20);
            expect(bounds.maxY).toBe(bounds.minY + 20);
        });
    });

    // MARK: - set tests
    describe("set", () => {
        test("should set bounds correctly", () => {
            const bounds = new Bounds();
            bounds.set(1, 2, 3, 4);
            expect(bounds.minX).toBe(1);
            expect(bounds.minY).toBe(2);
            expect(bounds.maxX).toBe(3);
            expect(bounds.maxY).toBe(4);
        });

        test("should return this for chaining", () => {
            const bounds = new Bounds();
            const result = bounds.set(1, 2, 3, 4);
            expect(result).toBe(bounds);
        });
    });

    // MARK: - reset tests
    describe("reset", () => {
        test("should reset bounds to default values", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            bounds.reset();
            expect(bounds.minX).toBe(Infinity);
            expect(bounds.minY).toBe(Infinity);
            expect(bounds.maxX).toBe(-Infinity);
            expect(bounds.maxY).toBe(-Infinity);
        });

        test("should return this for chaining", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const result = bounds.reset();
            expect(result).toBe(bounds);
        });
    });

    // MARK: - addXY and addPoint tests
    describe("addXY and addPoint", () => {
        test.each([
            { 
                initial: new Bounds(), 
                point: new Vec2(0, 0), 
                expected: new Bounds(0, 0, 0, 0) 
            },
            { 
                initial: new Bounds(0, 0, 0, 0), 
                point: new Vec2(-5, 0), 
                expected: new Bounds(-5, 0, 0, 0) 
            },
            { 
                initial: new Bounds(0, 0, 0, 0),
                point: new Vec2(0, -5),
                expected: new Bounds(0, -5, 0, 0)
            },
            {
                initial: new Bounds(0, 0, 0, 0),
                point: new Vec2(5, 0),
                expected: new Bounds(0, 0, 5, 0)
            },
            {
                initial: new Bounds(0, 0, 0, 0),
                point: new Vec2(0, 5),
                expected: new Bounds(0, 0, 0, 5)
            },
            {
                initial: new Bounds(-5, -5, 10, 10),
                point: new Vec2(-Infinity, Infinity),
                expected: new Bounds(-Infinity, -5, 10, Infinity)
            }
        ])("should expand bounds correctly", ({ initial, point, expected }) => {
            const boundsXY = initial.clone();
            boundsXY.addXY(point.x, point.y);
            expect(boundsXY.equals(expected)).toBe(true);

            const boundsPoint = initial.clone();
            boundsPoint.addPoint(point);
            expect(boundsPoint.equals(expected)).toBe(true);
        });

        test("should return this for chaining", () => {
            const bounds = new Bounds();
            const resultXY = bounds.addXY(1, 2);
            expect(resultXY).toBe(bounds);

            const resultPoint = bounds.addPoint(new Vec2(3, 4));
            expect(resultPoint).toBe(bounds);
        });
    });

    // MARK: - addBounds tests
    describe("addBounds", () => {
        test.each([
            { 
                initial: new Bounds(), 
                other: new Bounds(0, 0, 0, 0), 
                expected: new Bounds(0, 0, 0, 0) 
            },
            { 
                initial: new Bounds(0, 0, 0, 0), 
                other: new Bounds(-5, 0, 0, 0),
                expected: new Bounds(-5, 0, 0, 0)
            },
            { 
                initial: new Bounds(0, 0, 0, 0),
                other: new Bounds(0, -5, 0, 0),
                expected: new Bounds(0, -5, 0, 0)
            },
            {
                initial: new Bounds(0, 0, 0, 0),
                other: new Bounds(0, 0, 5, 0),
                expected: new Bounds(0, 0, 5, 0)
            },
            {
                initial: new Bounds(0, 0, 0, 0),
                other: new Bounds(0, 0, 0, 5),
                expected: new Bounds(0, 0, 0, 5)
            },
            {
                initial: new Bounds(-5, -5, 10, 10),
                other: new Bounds(-Infinity, Infinity, Infinity, -Infinity),
                expected: new Bounds(-Infinity, -5, Infinity, 10)
            }
        ])("should expand bounds correctly", ({ initial, other, expected }) => {
            const result = initial.addBounds(other);
            expect(result.equals(expected)).toBe(true);
        });

        test("should return this for chaining", () => {
            const bounds = new Bounds();
            const other = new Bounds(1, 2, 3, 4);
            const result = bounds.addBounds(other);
            expect(result).toBe(bounds);
        });
    });

    // MARK: - containsXY and containPoint tests
    describe("containsXY and containPoint", () => {
        test.each([
            { bounds: new Bounds(0, 0, 0, 0), point: new Vec2(0, 0), expected: true },
            { bounds: new Bounds(0, 0, 10, 10), point: new Vec2(5, 5), expected: true },
            { bounds: new Bounds(0, 0, 10, 10), point: new Vec2(-1, 5), expected: false },
            { bounds: new Bounds(0, 0, 10, 10), point: new Vec2(5, -1), expected: false },
            { bounds: new Bounds(0, 0, 10, 10), point: new Vec2(11, 5), expected: false },
            { bounds: new Bounds(0, 0, 10, 10), point: new Vec2(5, 11), expected: false },
            { bounds: new Bounds(), point: new Vec2(0, 0), expected: false },
        ])("should correctly determine if a point is contained", ({ bounds, point, expected }) => {
            expect(bounds.containsXY(point.x, point.y)).toBe(expected);
            expect(bounds.containPoint(point)).toBe(expected);
        });
    });

    // MARK: - intersects tests
    describe("intersects", () => {
        test.each([
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(5, 5, 15, 15), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(-5, 5, 5, 15), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(-5, -5, 5, 5), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(5, -5, 15, 5), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(10, 10, 20, 20), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(11, 11, 20, 20), expected: false },
            { a: new Bounds(), b: new Bounds(0, 0, 10, 10), expected: false },
        ])("should correctly determine if bounds intersect", ({ a, b, expected }) => {
            expect(a.intersects(b)).toBe(expected);
            expect(b.intersects(a)).toBe(expected);
        });
    });

    // MARK: - equals tests
    describe("equals", () => {
        test.each([
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(0, 0, 10, 10), expected: true },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(1, 0, 10, 10), expected: false },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(0, 1, 10, 10), expected: false },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(0, 0, 11, 10), expected: false },
            { a: new Bounds(0, 0, 10, 10), b: new Bounds(0, 0, 10, 11), expected: false },
            { a: new Bounds(), b: new Bounds(), expected: true },
        ])("should correctly determine if bounds are equal", ({ a, b, expected }) => {
            expect(a.equals(b)).toBe(expected);
            expect(b.equals(a)).toBe(expected);
        });
    });

    // MARK: - isEmpty tests
    describe("isEmpty", () => {
        test.each([
            { bounds: new Bounds(0, 0, 10, 10), expected: false },
            { bounds: new Bounds(-10, -10, 0, 0), expected: false },
            { bounds: new Bounds(-10, -10, 10, 10), expected: false },
            { bounds: new Bounds(0, 0, 0, 0), expected: true },
            { bounds: new Bounds(10, 10, 0, 0), expected: true },
            { bounds: new Bounds(), expected: true },
        ])("should correctly determine if bounds are empty", ({ bounds, expected }) => {
            expect(bounds.isEmpty()).toBe(expected);
        });
    });

    // MARK: - clone tests
    describe("clone", () => {
        test("should create a new instance with the same values", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const clone = bounds.clone();
            expect(clone.equals(bounds)).toBe(true);
            expect(clone).not.toBe(bounds); // Ensure it's a different instance
        });
    });

    // MARK: - copy tests
    describe("copy", () => {
        test("should copy values from another bounds instance", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const other = new Bounds(5, 6, 7, 8);
            bounds.copy(other);
            expect(bounds.equals(other)).toBe(true);
        });

        test("should return this for chaining", () => {
            const bounds = new Bounds(1, 2, 3, 4);
            const other = new Bounds(5, 6, 7, 8);
            const result = bounds.copy(other);
            expect(result).toBe(bounds);
        });
    });
    
});
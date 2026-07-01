import { Vec2, View } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("View", () => {
    describe("constructor", () => {
        test("initializes with default options", () => {
            const view = new View();
            expect(view.x).toEqual(0);
            expect(view.y).toEqual(0);
            expect(view.isVisible).toBe(true);
            expect(view.isPickable).toBe(true);
        });

        test("initializes with custom options", () => {
            const view = new View({
                position: new Vec2(10, 20),
                isVisible: false,
                isPickable: false,
            });
            expect(view.x).toEqual(10);
            expect(view.y).toEqual(20);
            expect(view.isVisible).toBe(false);
            expect(view.isPickable).toBe(false);
        });
    });
});
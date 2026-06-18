import { describe, expect, test } from "@jest/globals";
import { View, Vec2  } from "../../../src/index.js";


describe("View", () => {
    describe("constructor", () => {
        test("initializes with default options", () => {
            const view = new View();
            expect(view.position).toEqual(new Vec2());
            expect(view.isVisible).toBe(true);
            expect(view.isPickable).toBe(true);
        });

        test("initializes with custom options", () => {
            const view = new View({
                position: new Vec2(10, 20),
                isVisible: false,
                isPickable: false,
            });
            expect(view.position).toEqual(new Vec2(10, 20));
            expect(view.isVisible).toBe(false);
            expect(view.isPickable).toBe(false);
        });
    });
});
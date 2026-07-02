import { CircleView, Color, Vec2 } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("CircleView", () => {
    describe("constructor", () => {
        test("initializes with default options", () => {
            const view = new CircleView();
            expect(view.x).toEqual(0);
            expect(view.y).toEqual(0);
            expect(view.isVisible).toBe(true);
            expect(view.isPickable).toBe(true);
            expect(view.fillStyle).toEqual(new Color(255, 255, 255));
            expect(view.strokeStyle).toEqual(new Color(0, 0, 0));
            expect(view.strokeWidth).toBe(1);
            expect(view.strokeDash).toEqual([]);
            expect(view.radius).toBe(10);
        });

        test("initializes with custom options", () => {
            const view = new CircleView({
                position: new Vec2(10, 20),
                isVisible: false,
                isPickable: false,
                fillStyle: new Color(128, 128, 128),
                strokeStyle: new Color(64, 64, 64),
                strokeWidth: 2,
                strokeDash: [5, 5],
                radius: 20
            });
            expect(view.x).toEqual(10);
            expect(view.y).toEqual(20);
            expect(view.isVisible).toBe(false);
            expect(view.isPickable).toBe(false);
            expect(view.fillStyle).toEqual(new Color(128, 128, 128));
            expect(view.strokeStyle).toEqual(new Color(64, 64, 64));
            expect(view.strokeWidth).toBe(2);
            expect(view.strokeDash).toEqual([5, 5]);
            expect(view.radius).toBe(20);
        });
    });
});
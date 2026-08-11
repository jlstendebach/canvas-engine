/**
 * @jest-environment jsdom
 */

import { ImageView, View } from "@canvas-engine";
import { describe, expect, jest, test } from "@jest/globals";

// MARK: - ImageView tests
describe("ImageView", () => {
    const canvasElement = document.createElement("canvas");
    const context = canvasElement.getContext("2d");
    document.body.appendChild(canvasElement);

    // -------------------------------------------------------------------------
    // MARK: - Accessors
    // -------------------------------------------------------------------------

    describe("opacity", () => {
        test("gets the current opacity", () => {
            const imageView = new ImageView();
            for (let opacity = 0; opacity <= 1; opacity += 0.1) {
                imageView.setOpacity(opacity);
                expect(imageView.opacity).toBe(opacity);
            }
        });

        test("sets the opacity by deferring to setOpacity", () => {
            const imageView = new ImageView();
            const setOpacitySpy = jest.spyOn(imageView, "setOpacity");
            let callCount = 0;

            for (let opacity = 0; opacity <= 1; opacity += 0.1) {
                imageView.opacity = opacity;
                expect(imageView.opacity).toBe(opacity);
                callCount++;
                expect(setOpacitySpy).toHaveBeenNthCalledWith(callCount, opacity);
            }
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Constructor
    // -------------------------------------------------------------------------

    describe("constructor(image)", () => {
        test("defaults opacity to 1", () => {
            const imageView = new ImageView();
            expect(imageView.opacity).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Opacity
    // -------------------------------------------------------------------------

    describe("setOpacity(opacity)", () => {
        test("sets the opacity", () => {
            const imageView = new ImageView();

            for (let opacity = 0; opacity <= 1; opacity += 0.1) {
                imageView.setOpacity(opacity);
                expect(imageView.opacity).toBe(opacity);
            }
        });

        test("clamps the opacity between 0 and 1", () => {
            const imageView = new ImageView();

            for (let opacity = -1; opacity <= 2; opacity += 0.1) {
                imageView.setOpacity(opacity);
                const clampedOpacity = Math.max(0, Math.min(1, opacity));
                expect(imageView.opacity).toBe(clampedOpacity);
            }
        });

        test("returns this for chaining", () => {
            const imageView = new ImageView();

            // Valid opacity
            expect(imageView.setOpacity(0.5)).toBe(imageView);

            // Invalid opacity
            expect(imageView.setOpacity(null)).toBe(imageView);
            expect(imageView.setOpacity(undefined)).toBe(imageView);
            expect(imageView.setOpacity(NaN)).toBe(imageView);
            expect(imageView.setOpacity("string")).toBe(imageView);
        });

        test("is no-op if opacity is invalid", () => {
            const imageView = new ImageView();
            const initialOpacity = imageView.opacity;
            const invalidOpacities = [
                null, undefined, Infinity, -Infinity, NaN, "string"
            ];

            for (const invalidOpacity of invalidOpacities) {
                imageView.setOpacity(invalidOpacity);
                expect(imageView.opacity).toBe(initialOpacity);
            }
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Draw 
    // -------------------------------------------------------------------------

    describe("draw(context)", () => {
        test("applies the opacity multiplicatively", () => {
            const imageView = new ImageView(new Image());
            const initialAlpha = 0.75;
            imageView.addView(new MockChildView((context) => {
                expect(context.globalAlpha).toBe(initialAlpha * imageView.opacity);
            }));

            for (let opacity = 0; opacity <= 1; opacity += 0.1) {
                context.globalAlpha = initialAlpha;
                imageView.opacity = opacity;
                imageView.draw(context);
                expect(context.globalAlpha).toBe(initialAlpha);
            }
        });
    });

});

// MARK: - MockChildView
class MockChildView extends View {
    testOnDraw = null;

    constructor(testOnDraw) {
        super();
        this.testOnDraw = testOnDraw;
    }

    onDraw(context) {
        this.testOnDraw?.(context);
    }
}
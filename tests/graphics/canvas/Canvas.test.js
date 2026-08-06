import { Canvas, View } from "@canvas-engine";
import { jest, describe, expect, test } from "@jest/globals";

describe("Canvas", () => {
    const canvasElement = document.createElement("canvas");
    canvasElement.id = "test-canvas";
    document.body.appendChild(canvasElement);

    // -------------------------------------------------------------------------
    // MARK: - Child Management
    // -------------------------------------------------------------------------

    describe("addView(view)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewAddViewSpy = jest.spyOn(canvas.rootView, "addView");
            canvas.addView(view);
            expect(rootViewAddViewSpy).toHaveBeenCalledWith(view);
        });

        test("returns this for chaining", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            expect(canvas.addView(view)).toBe(canvas);
        });
    });

    describe("addViewAt(view, index)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewAddViewAtSpy = jest.spyOn(canvas.rootView, "addViewAt");
            canvas.addViewAt(view, 0);
            expect(rootViewAddViewAtSpy).toHaveBeenCalledWith(view, 0);
        });

        test("returns this for chaining", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            expect(canvas.addViewAt(view, 0)).toBe(canvas);
        });
    });

    describe("removeView(view)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewRemoveViewSpy = jest.spyOn(canvas.rootView, "removeView");
            canvas.addView(view);
            canvas.removeView(view);
            expect(rootViewRemoveViewSpy).toHaveBeenCalledWith(view);
        });

        test("returns this for chaining", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.removeView(view)).toBe(canvas);
        });
    });

    describe("removeViewAt(index)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewRemoveViewAtSpy = jest.spyOn(canvas.rootView, "removeViewAt");
            canvas.addView(view);
            canvas.removeViewAt(0);
            expect(rootViewRemoveViewAtSpy).toHaveBeenCalledWith(0);
        });

        test("returns this for chaining", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.removeViewAt(0)).toBe(canvas);
        });
    });

    describe("removeAllViews()", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewRemoveAllViewsSpy = jest.spyOn(canvas.rootView, "removeAllViews");
            canvas.addView(view);
            canvas.removeAllViews();
            expect(rootViewRemoveAllViewsSpy).toHaveBeenCalled();
        });

        test("returns this for chaining", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.removeAllViews()).toBe(canvas);
        });
    });

    describe("getViews()", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewGetViewsSpy = jest.spyOn(canvas.rootView, "getViews");
            canvas.addView(view);
            canvas.getViews();
            expect(rootViewGetViewsSpy).toHaveBeenCalled();
        });

        test("returns the views from rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.getViews()).toEqual(canvas.rootView.getViews());
        });
    });

    describe("getViewAt(index)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewGetViewAtSpy = jest.spyOn(canvas.rootView, "getViewAt");
            canvas.addView(view);
            canvas.getViewAt(0);
            expect(rootViewGetViewAtSpy).toHaveBeenCalledWith(0);
        });

        test("returns the view from rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.getViewAt(0)).toEqual(canvas.rootView.getViewAt(0));
        });
    });

    describe("getViewCount()", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewGetViewCountSpy = jest.spyOn(canvas.rootView, "getViewCount");
            canvas.addView(view);
            canvas.getViewCount();
            expect(rootViewGetViewCountSpy).toHaveBeenCalled();
        });

        test("returns the view count from rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.getViewCount()).toEqual(canvas.rootView.getViewCount());
        });
    });

    describe("getViewIndex(view)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewGetViewIndexSpy = jest.spyOn(canvas.rootView, "getViewIndex");
            canvas.addView(view);
            canvas.getViewIndex(view);
            expect(rootViewGetViewIndexSpy).toHaveBeenCalledWith(view);
        });

        test("returns the view index from rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.getViewIndex(view)).toEqual(canvas.rootView.getViewIndex(view));
        });
    });

    describe("setViewIndex(view, index)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewSetViewIndexSpy = jest.spyOn(canvas.rootView, "setViewIndex");
            canvas.addView(view);
            canvas.setViewIndex(view, 0);
            expect(rootViewSetViewIndexSpy).toHaveBeenCalledWith(view, 0);
        });

        test("sets the view index on rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            canvas.setViewIndex(view, 0);
            expect(canvas.rootView.getViewIndex(view)).toBe(0);
        });
    });

    describe("hasView(view)", () => {
        test("delegates to rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            const rootViewHasViewSpy = jest.spyOn(canvas.rootView, "hasView");
            canvas.addView(view);
            canvas.hasView(view);
            expect(rootViewHasViewSpy).toHaveBeenCalledWith(view);
        });

        test("returns the result from rootView", () => {
            const canvas = new Canvas(canvasElement);
            const view = new View();
            canvas.addView(view);
            expect(canvas.hasView(view)).toEqual(canvas.rootView.hasView(view));
        });
    });

});
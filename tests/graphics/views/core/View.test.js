import { View } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("View", () => {

    // -------------------------------------------------------------------------
    // MARK: - Parent Management 
    // -------------------------------------------------------------------------

    describe("addToParent(parent)", () => {
        test("adds view to parent and sets parent property", () => {
            const parent = new View();
            const view = new View();

            view.addToParent(parent);
            expect(view.parent).toBe(parent);
            expect(parent.hasView(view)).toBe(true);
        });

        test("is no-op if parent is null or undefined", () => {
            const view = new View();
            view.addToParent(null);
            expect(view.parent).toBeNull();

            view.addToParent(undefined);
            expect(view.parent).toBeNull();
        });

        test("is no-op if parent is already added to parent", () => {
            const parent = new View();
            const view = new View();

            view.addToParent(parent);
            expect(view.parent).toBe(parent);
            expect(parent.getViewIndex(view)).toBe(0);

            // Ensure the view isn't removed then added again, changing 
            // its index.
            parent.addView(new View());
            parent.addView(new View());
            view.addToParent(parent);
            expect(view.parent).toBe(parent);
            expect(parent.getViewIndex(view)).toBe(0);
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // No parent
            expect(view.addToParent(parent)).toBe(view);

            // Same parent
            expect(view.addToParent(parent)).toBe(view);

            // Different parent
            const newParent = new View();
            expect(view.addToParent(newParent)).toBe(view);
        });
    });

    describe("removeFromParent()", () => {
        test("removes view from parent and sets parent property to null", () => {
            const parent = new View();
            const view = new View();

            view.addToParent(parent);
            expect(view.parent).toBe(parent);
            expect(parent.hasView(view)).toBe(true);

            view.removeFromParent();
            expect(view.parent).toBeNull();
            expect(parent.hasView(view)).toBe(false);
        });

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(view.parent).toBeNull();

            view.removeFromParent();
            expect(view.parent).toBeNull();
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // No parent
            expect(view.removeFromParent()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.removeFromParent()).toBe(view);
        });
    });

    describe("sendToBack()", () => {
        test("sends view to back of the z-order", () => {
            const parent = new View();
            const view1 = new View().addToParent(parent);
            const view2 = new View().addToParent(parent);
            const view3 = new View().addToParent(parent);

            view1.sendToBack();
            expect(parent.getViews()).toEqual([view1, view2, view3]);

            view3.sendToBack();
            expect(parent.getViews()).toEqual([view3, view1, view2]);
        });

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(() => view.sendToBack()).not.toThrow();
            expect(view.parent).toBeNull();
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View()

            // No parent
            expect(view.sendToBack()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.sendToBack()).toBe(view);
        });

    });

    describe("bringToFront()", () => {
        test("brings view to front of the z-order", () => {
            const parent = new View();
            const view1 = new View().addToParent(parent);
            const view2 = new View().addToParent(parent);
            const view3 = new View().addToParent(parent);

            view1.bringToFront();
            expect(parent.getViews()).toEqual([view2, view3, view1]);

            view3.bringToFront();
            expect(parent.getViews()).toEqual([view2, view1, view3]);
        });

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(() => view.bringToFront()).not.toThrow();
            expect(view.parent).toBeNull();
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View()

            // No parent
            expect(view.bringToFront()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.bringToFront()).toBe(view);
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Child Management 
    // -------------------------------------------------------------------------

    describe("addView(view)", () => {
    });

    describe("addViewAt(view, index)", () => {
    });

    describe("removeView(view)", () => {
    });

    describe("removeViewAt(index)", () => {
    });

    describe("removeAllViews()", () => {
    });

    describe("getViews()", () => {
    });

    describe("getViewAt(index)", () => {
    });

    describe("getViewCount()", () => {
    });

    describe("getViewIndex(view)", () => {
    });

    describe("setViewIndex(view, index)", () => {
    });

    describe("hasView(view)", () => {
    });

    // -------------------------------------------------------------------------
    // MARK: - Hierarchy Queries
    // -------------------------------------------------------------------------

    describe("isDescendantOf(view)", () => {
    });

    describe("isAncestorOf(view)", () => {
    });

});
import { View } from "@canvas-engine";
import { describe, expect, test } from "@jest/globals";

describe("View", () => {

    // -------------------------------------------------------------------------
    // MARK: - Parent Management 
    // -------------------------------------------------------------------------

    describe("addToParent(parent)", () => {

        // -- Normal cases --

        test("adds view to parent and sets parent property", () => {
            const parent = new View();
            const view = new View();

            view.addToParent(parent);
            expect(view.parent).toBe(parent);
            expect(parent.hasView(view)).toBe(true);
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

        // -- Edge cases --

        test("throws if parent is null or undefined", () => {
            const view = new View();
            expect(() => view.addToParent(null)).toThrow(
                "Parent view cannot be null or undefined."
            );
            expect(view.parent).toBeNull();

            expect(() => view.addToParent(undefined)).toThrow(
                "Parent view cannot be null or undefined."
            );
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
    });

    describe("removeFromParent()", () => {

        // -- Normal cases --

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

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // No parent
            expect(view.removeFromParent()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.removeFromParent()).toBe(view);
        });

        // -- Edge cases --

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(view.parent).toBeNull();

            view.removeFromParent();
            expect(view.parent).toBeNull();
        });
    });

    describe("sendToBack()", () => {

        // -- Normal cases --

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

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View()

            // No parent
            expect(view.sendToBack()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.sendToBack()).toBe(view);
        });

        // -- Edge cases --

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(() => view.sendToBack()).not.toThrow();
            expect(view.parent).toBeNull();
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

        // -- Normal behaviors --

        test("adds view to the end of the child views", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();
            const view3 = new View();

            parent.addView(view1);
            expect(parent.getViews()).toEqual([view1]);
            expect(view1.parent).toBe(parent);

            parent.addView(view2);
            expect(parent.getViews()).toEqual([view1, view2]);
            expect(view2.parent).toBe(parent);

            parent.addView(view3);
            expect(parent.getViews()).toEqual([view1, view2, view3]);
            expect(view3.parent).toBe(parent);
        });

        test("removes view from previous parent if it has one", () => {
            const parent1 = new View();
            const parent2 = new View();
            const view = new View();

            parent1.addView(view);
            expect(parent1.getViews()).toEqual([view]);
            expect(parent2.getViews()).toEqual([]);
            expect(view.parent).toBe(parent1);

            parent2.addView(view);
            expect(parent1.getViews()).toEqual([]);
            expect(parent2.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent2);
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            expect(parent.addView(view)).toBe(parent);
        });

        // -- Edge cases --

        test("throws if view is null or undefined", () => {
            const parent = new View();

            expect(() => parent.addView(null)).toThrow(
                "Cannot add null or undefined view"
            );
            expect(() => parent.addView(undefined)).toThrow(
                "Cannot add null or undefined view"
            );
            expect(parent.getViews()).toEqual([]);
        });

        test("throws if view is this view", () => {
            const parent = new View();

            expect(() => parent.addView(parent)).toThrow(
                "Cannot add a view to itself"
            );
            expect(parent.getViews()).toEqual([]);
        });

        test("is no-op if view is already a child of this view", () => {
            const parent = new View();
            const view = new View();

            parent.addView(view);
            expect(parent.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent);

            parent.addView(view);
            expect(parent.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent);
        });

        test("throws if view is an ancestor of this view", () => {
            const grandparent = new View();
            const parent = new View().addToParent(grandparent);
            const child = new View().addToParent(parent);

            expect(() => child.addView(grandparent)).toThrow(
                "Cannot add an ancestor view as a child"
            );
            expect(grandparent.getViews()).toEqual([parent]);
            expect(parent.getViews()).toEqual([child]);
            expect(child.getViews()).toEqual([]);
        });

        test("throws if cannot remove view from previous parent", () => {
            const parent = new View();
            const view = new MockViewWithFixedParent();

            expect(() => parent.addView(view)).toThrow(
                "Failed to remove view from its current parent"
            );
            expect(parent.getViews()).toEqual([]);
            expect(view.parent).not.toBe(parent);
        });

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

// MARK: - MockViewWithFixedParent
class MockViewWithFixedParent extends View {
    #parent = new View();

    get parent() {
        return this.#parent;
    }
}
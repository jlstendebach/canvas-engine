import { View } from "@canvas-engine";
import { jest, describe, expect, test } from "@jest/globals";

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

        // -- Normal cases --

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

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View()

            // No parent
            expect(view.bringToFront()).toBe(view);

            // Has parent
            view.addToParent(parent);
            expect(view.bringToFront()).toBe(view);
        });

        // -- Edge cases --

        test("is no-op if view has no parent", () => {
            const view = new View();
            expect(() => view.bringToFront()).not.toThrow();
            expect(view.parent).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // MARK: - Child Management 
    // -------------------------------------------------------------------------

    describe("addView(view)", () => {
        test("adds view to end of children", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();

            parent.addView(view1);
            expect(parent.getViews()).toEqual([view1]);
            expect(view1.parent).toBe(parent);

            parent.addView(view2);
            expect(parent.getViews()).toEqual([view1, view2]);
            expect(view2.parent).toBe(parent);
        });

        test("calls addViewAt(view, Infinity)", () => {
            const parent = new View();
            const view = new View();

            // Spy on addViewAt
            const addViewAtSpy = jest.spyOn(parent, "addViewAt");
            parent.addView(view);
            expect(addViewAtSpy).toHaveBeenCalledWith(view, Infinity);
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            expect(parent.addView(view)).toBe(parent);
        });
    });

    describe("addViewAt(view, index)", () => {

        // -- Normal cases --

        test("adds view at specified index", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();
            const view3 = new View();
            const view4 = new View();
            const view5 = new View();
            const view6 = new View();

            parent.addViewAt(view1, 0);
            expect(parent.getViews()).toEqual([view1]);
            expect(view1.parent).toBe(parent);

            parent.addViewAt(view2, 1);
            expect(parent.getViews()).toEqual([view1, view2]);
            expect(view2.parent).toBe(parent);

            parent.addViewAt(view3, 1);
            expect(parent.getViews()).toEqual([view1, view3, view2]);
            expect(view3.parent).toBe(parent);

            parent.addViewAt(view4, 0);
            expect(parent.getViews()).toEqual([view4, view1, view3, view2]);
            expect(view4.parent).toBe(parent);

            parent.addViewAt(view5, Infinity);
            expect(parent.getViews()).toEqual([view4, view1, view3, view2, view5]);
            expect(view5.parent).toBe(parent);

            parent.addViewAt(view6, -1);
            expect(parent.getViews()).toEqual([view4, view1, view3, view2, view6, view5]);
            expect(view6.parent).toBe(parent);
        });

        test("removes view from previous parent if it has one", () => {
            const parent1 = new View();
            const parent2 = new View();
            const view = new View();

            parent1.addViewAt(view, 0);
            expect(parent1.getViews()).toEqual([view]);
            expect(parent2.getViews()).toEqual([]);
            expect(view.parent).toBe(parent1);

            parent2.addViewAt(view, 0);
            expect(parent1.getViews()).toEqual([]);
            expect(parent2.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent2);
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // No parent
            expect(parent.addViewAt(view, 0)).toBe(parent);

            // Same parent
            expect(parent.addViewAt(view, 0)).toBe(parent);

            // Different parent
            const newParent = new View();
            expect(newParent.addViewAt(view, 0)).toBe(newParent);
        });

        // -- Edge cases --

        test("throws if view is null or undefined", () => {
            const parent = new View();

            expect(() => parent.addViewAt(null, 0)).toThrow(
                "Cannot add null or undefined view"
            );
            expect(() => parent.addViewAt(undefined, 0)).toThrow(
                "Cannot add null or undefined view"
            );
            expect(parent.getViews()).toEqual([]);
        });

        test("throws if view is this view", () => {
            const parent = new View();

            expect(() => parent.addViewAt(parent, 0)).toThrow(
                "Cannot add a view to itself"
            );
            expect(parent.getViews()).toEqual([]);
        });

        test("is no-op if view is already a child of this view", () => {
            const parent = new View();
            const view = new View();

            parent.addViewAt(view, 0);
            expect(parent.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent);

            parent.addViewAt(view, 0);
            expect(parent.getViews()).toEqual([view]);
            expect(view.parent).toBe(parent);
        });

        test("throws if view is an ancestor of this view", () => {
            const grandparent = new View();
            const parent = new View().addToParent(grandparent);
            const child = new View().addToParent(parent);

            expect(() => child.addViewAt(grandparent, 0)).toThrow(
                "Cannot add an ancestor view as a child"
            );
            expect(grandparent.getViews()).toEqual([parent]);
            expect(parent.getViews()).toEqual([child]);
            expect(child.getViews()).toEqual([]);
        });

        test("throws if cannot remove view from previous parent", () => {
            const parent = new View();
            const view = new MockViewWithFixedParent();

            expect(() => parent.addViewAt(view, 0)).toThrow(
                "Failed to remove view from its current parent"
            );
            expect(parent.getViews()).toEqual([]);
            expect(view.parent).not.toBe(parent);
        });

    });

    describe("removeView(view)", () => {

        // -- Normal cases --

        test("removes view by reference by calling removeViewAt(index)", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();
            const view3 = new View();
            const view4 = new View();
            const removeViewAtSpy = jest.spyOn(parent, "removeViewAt");

            parent.addView(view1);
            parent.addView(view2);
            parent.addView(view3);
            parent.addView(view4);
            expect(parent.getViews()).toEqual([view1, view2, view3, view4]);

            parent.removeView(view2);
            expect(parent.getViews()).toEqual([view1, view3, view4]);
            expect(view2.parent).toBeNull();
            expect(removeViewAtSpy).toHaveBeenCalledWith(1);

            parent.removeView(view4);
            expect(parent.getViews()).toEqual([view1, view3]);
            expect(view4.parent).toBeNull();
            expect(removeViewAtSpy).toHaveBeenCalledWith(2);

            parent.removeView(view1);
            expect(parent.getViews()).toEqual([view3]);
            expect(view1.parent).toBeNull();
            expect(removeViewAtSpy).toHaveBeenCalledWith(0);

            parent.removeView(view3);
            expect(parent.getViews()).toEqual([]);
            expect(view3.parent).toBeNull();
            expect(removeViewAtSpy).toHaveBeenCalledWith(0);
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // Parent is this view
            parent.addView(view);
            expect(parent.removeView(view)).toBe(parent);

            // Parent is not this view
            expect(view.parent).toBeNull();
            expect(parent.removeView(view)).toBe(parent);

            // Null or undefined
            expect(parent.removeView(null)).toBe(parent);
            expect(parent.removeView(undefined)).toBe(parent);

            // Self
            expect(parent.removeView(parent)).toBe(parent);
        });

        // -- Edge cases --

        test("is no-op if view is null or undefined", () => {
            const parent = new View();
            const removeViewAtSpy = jest.spyOn(parent, "removeViewAt");

            parent.removeView(null);
            parent.removeView(undefined);
            expect(removeViewAtSpy).not.toHaveBeenCalled();
        });

        test("is no-op if view is this view", () => {
            const parent = new View();
            const removeViewAtSpy = jest.spyOn(parent, "removeViewAt");

            parent.removeView(parent);
            expect(removeViewAtSpy).not.toHaveBeenCalled();
        });

        test("is no-op if view is not a child of this view", () => {
            const parent1 = new View();
            const parent2 = new View();
            const view = new View();
            const removeViewAtSpy1 = jest.spyOn(parent1, "removeViewAt");
            const removeViewAtSpy2 = jest.spyOn(parent2, "removeViewAt");

            parent1.addView(view);
            parent2.removeView(view);
            expect(removeViewAtSpy1).not.toHaveBeenCalled();
            expect(removeViewAtSpy2).not.toHaveBeenCalled();
        });

        test("clears parent reference if child lookup fails despite parent match", () => {
            const parent = new View();
            const view = new View();
            const removeViewAtSpy = jest.spyOn(parent, "removeViewAt");

            // Simulate a corrupted state: child reports this parent, but parent
            // never actually contains child in its internal child list.
            Object.defineProperty(view, "parent", {
                get: () => parent,
                configurable: true,
            });

            parent.removeView(view);

            // Remove shadowed getter so we can observe real private parent 
            // state.
            delete view.parent;

            expect(view.parent).toBeNull();
            expect(parent.getViews()).toEqual([]);
            expect(removeViewAtSpy).not.toHaveBeenCalled();
        });
    });

    describe("removeViewAt(index)", () => {
        test("removes view at specified index", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();
            const view3 = new View();
            const view4 = new View();

            parent.addView(view1);
            parent.addView(view2);
            parent.addView(view3);
            parent.addView(view4);
            expect(parent.getViews()).toEqual([view1, view2, view3, view4]);

            parent.removeViewAt(1);
            expect(parent.getViews()).toEqual([view1, view3, view4]);
            expect(view2.parent).toBeNull();

            parent.removeViewAt(2);
            expect(parent.getViews()).toEqual([view1, view3]);
            expect(view4.parent).toBeNull();

            parent.removeViewAt(0);
            expect(parent.getViews()).toEqual([view3]);
            expect(view1.parent).toBeNull();

            parent.removeViewAt(0);
            expect(parent.getViews()).toEqual([]);
            expect(view3.parent).toBeNull();
        });

        test("returns this for chaining", () => {
            const parent = new View();
            const view = new View();

            // Valid index
            parent.addView(view);
            expect(parent.removeViewAt(0)).toBe(parent);

            // Invalid index
            expect(parent.removeViewAt(0)).toBe(parent);
        });
    });

    describe("removeAllViews()", () => {
        const parent = new View();
        const view1 = new View();
        const view2 = new View();
        const view3 = new View();

        parent.addView(view1);
        parent.addView(view2);
        parent.addView(view3);
        expect(parent.getViews()).toEqual([view1, view2, view3]);

        parent.removeAllViews();
        expect(parent.getViews()).toEqual([]);
        expect(view1.parent).toBeNull();
        expect(view2.parent).toBeNull();
        expect(view3.parent).toBeNull();
    });

    describe("getViews()", () => {
        test("returns a copy of the internal views array", () => {
            const parent = new View();
            const view1 = new View();
            const view2 = new View();
            const view3 = new View();

            parent.addView(view1);
            parent.addView(view2);
            parent.addView(view3);

            const views = parent.getViews();
            expect(views).toEqual([view1, view2, view3]);

            views.pop();
            expect(parent.getViews()).toEqual([view1, view2, view3]);
        });

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
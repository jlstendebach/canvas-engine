import { EventListener } from "../../src/events/EventListener.js";
import { expect, jest } from "@jest/globals";

describe("EventListener", () => {
	describe("constructor(callback, owner, once)", () => {
		test("throws when callback is not a function", () => {
			expect(() => new EventListener(null)).toThrow(TypeError);
			expect(() => new EventListener(123)).toThrow(TypeError);
			expect(() => new EventListener({})).toThrow(TypeError);
		});

		test("stores once as true only when explicitly true", () => {
			expect(new EventListener(() => {}, null, true).once).toBe(true);
			expect(new EventListener(() => {}, null, false).once).toBe(false);
			expect(new EventListener(() => {}, null, 1).once).toBe(false);
			expect(new EventListener(() => {}, null, "true").once).toBe(false);
		});
	});

	describe("onEvent(type, event)", () => {
		test("invokes callback with type and event", () => {
			const callback = jest.fn();
			const listener = new EventListener(callback);
			const event = { delta: 3 };

			listener.onEvent("move", event);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith("move", event);
		});

		test("binds callback to owner", () => {
			const owner = { value: 7 };
			const results = [];
			const callback = function (type, event) {
				results.push(`${type}:${event.delta}:${this.value}`);
			};
			const listener = new EventListener(callback, owner);

			listener.onEvent("move", { delta: 3 });

			expect(results).toEqual(["move:3:7"]);
		});
	});

	describe("matches(callback, owner)", () => {
		test("returns true for the same callback and owner", () => {
			const callback = jest.fn();
			const owner = { id: 1 };
			const listener = new EventListener(callback, owner);

			expect(listener.matches(callback, owner)).toBe(true);
		});

		test("returns false when callback differs", () => {
			const owner = { id: 1 };
			const listener = new EventListener(() => {}, owner);

			expect(listener.matches(() => {}, owner)).toBe(false);
		});

		test("returns false when owner differs", () => {
			const callback = jest.fn();
			const ownerA = { id: "a" };
			const ownerB = { id: "b" };
			const listener = new EventListener(callback, ownerA);

			expect(listener.matches(callback, ownerB)).toBe(false);
			expect(listener.matches(callback, null)).toBe(false);
		});

		test("supports null owner matching", () => {
			const callback = jest.fn();
			const listener = new EventListener(callback);

			expect(listener.matches(callback, null)).toBe(true);
		});
	});
});
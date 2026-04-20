import { EventEmitter } from "../../src/events/EventEmitter.js";
import { expect, jest } from "@jest/globals";

describe("EventEmitter", () => {
	describe("addListener(type, callback, owner, once)", () => {
		test("throws when callback is not a function", () => {
			const emitter = new EventEmitter();

			expect(() => emitter.addListener("tick", null)).toThrow(TypeError);
			expect(() => emitter.addListener("tick", 42)).toThrow(TypeError);
		});

		test("adds listener and returns true", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();

			expect(emitter.addListener("tick", callback)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(true);
			expect(emitter.getListenerCount("tick")).toBe(1);
		});

        test("adds multiple listeners for the same event type", () => {
            const emitter = new EventEmitter();
            const callbackA = jest.fn();
            const callbackB = jest.fn();
            const callbackC = jest.fn();

            expect(emitter.addListener("tick", callbackA)).toBe(true);
            expect(emitter.addListener("tick", callbackB)).toBe(true);
            expect(emitter.addListener("tick", callbackC)).toBe(true);
            expect(emitter.hasListener("tick", callbackA)).toBe(true);
            expect(emitter.hasListener("tick", callbackB)).toBe(true);
            expect(emitter.hasListener("tick", callbackC)).toBe(true);
            expect(emitter.getListenerCount("tick")).toBe(3);
        });

		test("does not add duplicate listener with same callback and owner", () => {
			const emitter = new EventEmitter();
			const owner = { id: 1 };
			const callback = jest.fn();

			expect(emitter.addListener("tick", callback, null)).toBe(true);
			expect(emitter.addListener("tick", callback, null)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(1);

            expect(emitter.addListener("tick", callback, owner)).toBe(true);
			expect(emitter.addListener("tick", callback, owner)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(2);
		});

		test("allows same callback for different owners", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const ownerA = { id: "a" };
			const ownerB = { id: "b" };

			expect(emitter.addListener("tick", callback, ownerA)).toBe(true);
			expect(emitter.addListener("tick", callback, ownerB)).toBe(true);
			expect(emitter.getListenerCount("tick")).toBe(2);
		});

        test("allows same listener for different event types", () => {
            const emitter = new EventEmitter();
            const callback = jest.fn();
            expect(emitter.addListener("tick", callback)).toBe(true);
            expect(emitter.addListener("move", callback)).toBe(true);
            expect(emitter.getListenerCount("tick")).toBe(1);
            expect(emitter.getListenerCount("move")).toBe(1);
        });
	});

	describe("removeListener(type, callback, owner)", () => {
        test("returns false when event type has no listeners", () => {
            const emitter = new EventEmitter();
            const callback = jest.fn();
            expect(emitter.removeListener("tick", callback)).toBe(false);
        });

		test("returns false when listener is not found", () => {
			const emitter = new EventEmitter();
            const callbackA = jest.fn();
            const callbackB = jest.fn();

            emitter.addListener("tick", callbackA);
			expect(emitter.removeListener("tick", callbackB)).toBe(false);
		});


		test("removes matching listener and returns true", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();

			emitter.addListener("tick", callback);

			expect(emitter.removeListener("tick", callback)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(0);
		});


		test("removes only listener matching callback and owner", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const ownerA = { id: "a" };
			const ownerB = { id: "b" };

			emitter.addListener("tick", callback);
			emitter.addListener("tick", callback, ownerA);
			emitter.addListener("tick", callback, ownerB);

			expect(emitter.removeListener("tick", callback, ownerB)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(true);
            expect(emitter.hasListener("tick", callback, ownerA)).toBe(true);
			expect(emitter.hasListener("tick", callback, ownerB)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(2);

            expect(emitter.removeListener("tick", callback)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(false);
            expect(emitter.hasListener("tick", callback, ownerA)).toBe(true);
			expect(emitter.hasListener("tick", callback, ownerB)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(1);

            expect(emitter.removeListener("tick", callback, ownerA)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(false);
            expect(emitter.hasListener("tick", callback, ownerA)).toBe(false);
			expect(emitter.hasListener("tick", callback, ownerB)).toBe(false);
			expect(emitter.getListenerCount("tick")).toBe(0);
		});

        test("removes event type when last listener is removed", () => {
            const emitter = new EventEmitter();
            const callback = jest.fn();
            emitter.addListener("tick", callback);
            expect(emitter.getListenerTypes()).toEqual(["tick"]);
            emitter.removeListener("tick", callback);
            expect(emitter.getListenerTypes()).toEqual([]);
        });
	});

	describe("removeAllListeners(type)", () => {
		test("clears all event types when type is omitted", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();

			emitter.addListener("tick", callback);
			emitter.addListener("move", callback);

			expect(emitter.removeAllListeners()).toBe(true);
			expect(emitter.getListenerCount("tick")).toBe(0);
			expect(emitter.getListenerCount("move")).toBe(0);
			expect(emitter.getListenerTypes()).toEqual([]);
		});

		test("clears listeners for a specific type", () => {
			const emitter = new EventEmitter();
			const callbackA = jest.fn();
			const callbackB = jest.fn();

			emitter.addListener("tick", callbackA);
			emitter.addListener("tick", callbackB);
			emitter.addListener("move", callbackA);

			expect(emitter.removeAllListeners("tick")).toBe(true);
			expect(emitter.getListenerCount("tick")).toBe(0);
			expect(emitter.getListenerCount("move")).toBe(1);
		});

		test("returns false when specific type does not exist", () => {
			const emitter = new EventEmitter();
			expect(emitter.removeAllListeners("missing")).toBe(false);
		});
	});

	describe("hasListener(type, callback, owner)", () => {
		test("returns true only for exact callback-owner match", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const owner = { id: 1 };

			emitter.addListener("tick", callback, owner);

			expect(emitter.hasListener("tick", callback, owner)).toBe(true);
			expect(emitter.hasListener("tick", callback)).toBe(false);
			expect(emitter.hasListener("move", callback, owner)).toBe(false);
		});
	});

	describe("getListenerCount(type)", () => {
		test("returns zero for unknown event type", () => {
			const emitter = new EventEmitter();

			expect(emitter.getListenerCount("tick")).toBe(0);
		});

		test("returns number of listeners for the event type", () => {
			const emitter = new EventEmitter();

			emitter.addListener("tick", jest.fn());
			emitter.addListener("tick", jest.fn());

			expect(emitter.getListenerCount("tick")).toBe(2);
		});
	});

	describe("getListenerTypes()", () => {
		test("returns all event types that currently have listeners", () => {
			const emitter = new EventEmitter();

			emitter.addListener("tick", jest.fn());
			emitter.addListener("move", jest.fn());

			expect(emitter.getListenerTypes().sort()).toEqual(["move", "tick"]);
		});

		test("removes type after last listener is removed", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();

			emitter.addListener("tick", callback);
			emitter.removeListener("tick", callback);

			expect(emitter.getListenerTypes()).toEqual([]);
		});
	});

	describe("on(type, event, owner)", () => {
		test("calls addListener with once=false", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const owner = { id: 1 };
			const spy = jest.spyOn(emitter, "addListener");

			emitter.on("tick", callback, owner);
			expect(spy).toHaveBeenCalledWith("tick", callback, owner, false);
			emitter.on("tick", callback);
			expect(spy).toHaveBeenCalledWith("tick", callback, null, false);
		});
    });

    describe("once(type, event, owner)", () => {
		test("calls addListener with once=true", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const owner = { id: 1 };
			const spy = jest.spyOn(emitter, "addListener");

			emitter.once("tick", callback, owner);
			expect(spy).toHaveBeenCalledWith("tick", callback, owner, true);
			emitter.once("tick", callback);
			expect(spy).toHaveBeenCalledWith("tick", callback, null, true);
		});
    });

    describe("off(type, event, owner)", () => {
		test("calls removeListener", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const owner = { id: 1 };
			const spy = jest.spyOn(emitter, "removeListener");

			emitter.off("tick", callback, owner);
			expect(spy).toHaveBeenCalledWith("tick", callback, owner);
			emitter.off("tick", callback);
			expect(spy).toHaveBeenCalledWith("tick", callback, null);

		});
	});

	describe("emit(type, event)", () => {
		test("returns silently when event type has no listeners", () => {
			const emitter = new EventEmitter();
			expect(() => emitter.emit("missing", {})).not.toThrow();
		});

		test("invokes listeners with type and event", () => {
			const emitter = new EventEmitter();
			const callback = jest.fn();
			const event = { value: 123 };

			emitter.addListener("tick", callback);
			emitter.emit("tick", event);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith("tick", event);
		});

		test("binds callback to owner", () => {
			const emitter = new EventEmitter();
			const owner = { count: 0 };
			const callback = function () {
				this.count += 1;
			};

			emitter.addListener("tick", callback, owner);
			emitter.emit("tick", {});

			expect(owner.count).toBe(1);
		});

		test("removes once listeners after first emit", () => {
			const emitter = new EventEmitter();
            const callback = jest.fn();

			emitter.once("tick", callback);

			emitter.emit("tick", {});
			emitter.emit("tick", {});

			expect(callback).toHaveBeenCalledTimes(1);
			expect(emitter.getListenerCount("tick")).toBe(0);
		});

		test("keeps emitting snapshot once-listeners even if they were already removed from the live list", () => {
			const emitter = new EventEmitter();
			const calls = [];

			const second = () => {
				calls.push("second");
			};

			const first = () => {
				calls.push("first");
				emitter.removeListener("tick", second);
			};

			emitter.once("tick", first);
			emitter.once("tick", second);

			emitter.emit("tick", {});

			expect(calls).toEqual(["first", "second"]);
			expect(emitter.getListenerCount("tick")).toBe(0);
		});

		test("supports safe mutation during emit using snapshot", () => {
			const emitter = new EventEmitter();
			let calls = [];

			const first = () => {
				calls.push("first");
				emitter.addListener("tick", addedDuringEmit);
			};

			const second = () => {
				calls.push("second");
				emitter.removeListener("tick", second);
			};

			const addedDuringEmit = () => {
				calls.push("addedDuringEmit");
                emitter.addListener("tick", second);
			};

            emitter.addListener("tick", first);
			emitter.addListener("tick", second);

			emitter.emit("tick", {});
			expect(calls).toEqual(["first", "second"]);

            calls = []; // Reset calls
			emitter.emit("tick", {});
			expect(calls).toEqual(["first", "addedDuringEmit"]);

            calls = []; // Reset calls
			emitter.emit("tick", {});
			expect(calls).toEqual(["first", "addedDuringEmit", "second"]);

            calls = []; // Reset calls
			emitter.emit("tick", {});
			expect(calls).toEqual(["first", "addedDuringEmit"]);
		});

	});
});


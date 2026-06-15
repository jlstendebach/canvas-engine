/**
 * @jest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { CanvasApp } from "../../../src/core/canvas-app/CanvasApp.js";
import { CanvasAppState } from "../../../src/core/canvas-app/CanvasAppState.js";
import { View } from "../../../src/graphics/views/View.js";

// MARK: - CanvasApp tests
describe("CanvasApp", () => {
    const canvasElement = document.createElement("canvas");
    canvasElement.id = "test-canvas";
    document.body.appendChild(canvasElement);
    let app;

    // MARK: - setup and teardown
    const destroyApp = () => {
        if (app) {
            app.destroy();
            app = null;
        }
    };

    beforeEach(() => {
        jest.useFakeTimers();
        app = new CanvasApp(canvasElement);
    });

    afterEach(() => {
        destroyApp();
        jest.useRealTimers();
    });

    // MARK: - constructor tests
    describe("constructor", () => {
        test("initializes canvas correctly from element", () => {
            destroyApp();
            app = new CanvasApp(canvasElement);
            expect(app.canvas.element).toBe(canvasElement);
        });

        test("initializes canvas correctly from selector", () => {
            destroyApp();
            app = new CanvasApp("#test-canvas");
            expect(app.canvas.element).toBe(canvasElement);
        });

        test("initializes state correctly", () => {
            expect(app.state).toBe(CanvasAppState.STOPPED);
            expect(app.isStopped()).toBe(true);
            expect(app.isRunning()).toBe(false);
            expect(app.isPaused()).toBe(false);
            expect(app.isDestroying()).toBe(false);
            expect(app.isDestroyed()).toBe(false);
        });

        test("throws error for invalid canvas element", () => {
            expect(() => new CanvasApp(null)).toThrow(TypeError);
            expect(() => new CanvasApp({})).toThrow(TypeError);
            expect(() => new CanvasApp("!@#$%^&*()_+")).toThrow(/is not a valid selector/);
            expect(() => new CanvasApp("#hello")).toThrow("No canvas element found for selector: #hello");
        });
    });

    // MARK: - start() tests
    describe("start()", () => {
        test("transitions from STOPPED to RUNNING", () => {
            expect(app.state).toBe(CanvasAppState.STOPPED);
            app.start();
            expect(app.state).toBe(CanvasAppState.RUNNING);
        });

        test("can be restarted after being stopped", () => {
            jest.spyOn(app, "onStart");

            for (let i = 1; i <= 3; i++) {
                app.stop();
                expect(app.state).toBe(CanvasAppState.STOPPED);
                app.start();
                expect(app.state).toBe(CanvasAppState.RUNNING);
                expect(app.onStart).toHaveBeenCalledTimes(i);
            }
        });

        test("schedules updates after starting", () => {
            jest.spyOn(app, "onUpdate");
            app.start();
            for (let i = 1; i <= 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(i);
            }
        });

        test("is no-op when not stopped", () => {
            jest.spyOn(app, "onStart");

            // stopped -> should start
            app.start();
            expect(app.state).toBe(CanvasAppState.RUNNING);
            expect(app.onStart).toHaveBeenCalledTimes(1);

            // already running -> should be no-op
            app.start();
            expect(app.state).toBe(CanvasAppState.RUNNING);
            expect(app.onStart).toHaveBeenCalledTimes(1);

            // destroyed -> should be no-op
            app.destroy();
            app.start();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
            expect(app.onStart).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - stop() tests
    describe("stop()", () => {
        test("transitions from RUNNING to STOPPED", () => {
            app.start();
            expect(app.state).toBe(CanvasAppState.RUNNING);
            app.stop();
            expect(app.state).toBe(CanvasAppState.STOPPED);
        });

        test("halts updates after stopping", () => {
            jest.spyOn(app, "onUpdate");

            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            app.stop();
            for (let i = 1; i <= 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }
        });

        test("is no-op when not running", () => {
            jest.spyOn(app, "onStop");

            // already stopped -> should be no-op
            app.stop();
            expect(app.state).toBe(CanvasAppState.STOPPED);
            expect(app.onStop).toHaveBeenCalledTimes(0);

            // running -> should stop
            app.start();
            app.stop();
            expect(app.state).toBe(CanvasAppState.STOPPED);
            expect(app.onStop).toHaveBeenCalledTimes(1);

            // already stopped -> should be no-op
            app.stop();
            expect(app.state).toBe(CanvasAppState.STOPPED);
            expect(app.onStop).toHaveBeenCalledTimes(1);

            // destroyed -> should be no-op
            app.destroy();
            app.stop();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
            expect(app.onStop).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - pause() tests
    describe("pause()", () => {
        test("pauses the app", () => {
            app.start();
            expect(app.isPaused()).toBe(false);
            app.pause();
            expect(app.isPaused()).toBe(true);
        });

        test("can be paused and resumed multiple times", () => {
            jest.spyOn(app, "onPause");
            app.start();

            for (let i = 1; i <= 3; i++) {
                app.resume();
                expect(app.isPaused()).toBe(false);
                app.pause();
                expect(app.isPaused()).toBe(true);
                expect(app.onPause).toHaveBeenCalledTimes(i);
            }
        });

        test("is no-op when not running or already paused", () => {
            jest.spyOn(app, "onPause");

            // stopped -> should be no-op
            app.pause();
            expect(app.isPaused()).toBe(false);
            expect(app.onPause).toHaveBeenCalledTimes(0);

            // running -> should pause
            app.start();
            app.pause();
            expect(app.isPaused()).toBe(true);
            expect(app.onPause).toHaveBeenCalledTimes(1);

            // already paused -> should be no-op
            app.pause();
            expect(app.isPaused()).toBe(true);
            expect(app.onPause).toHaveBeenCalledTimes(1);

            // destroyed -> should be no-op
            app.destroy();
            app.pause();
            expect(app.isPaused()).toBe(false);
            expect(app.onPause).toHaveBeenCalledTimes(1);
        });

        test("update is not called while paused", () => {
            jest.spyOn(app, "onUpdate");

            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            app.pause();
            for (let i = 1; i <= 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }
        });
    });

    // MARK: - resume() tests
    describe("resume()", () => {
        test("resumes the app from paused state", () => {
            app.start();
            app.pause();
            expect(app.isPaused()).toBe(true);
            app.resume();
            expect(app.isPaused()).toBe(false);
        });

        test("can be paused and resumed multiple times", () => {
            jest.spyOn(app, "onResume");
            app.start();

            for (let i = 1; i <= 3; i++) {
                app.pause();
                expect(app.isPaused()).toBe(true);
                app.resume();
                expect(app.isPaused()).toBe(false);
                expect(app.onResume).toHaveBeenCalledTimes(i);
            }
        });

        test("is no-op when not running or not paused", () => {
            jest.spyOn(app, "onResume");

            // stopped -> should be no-op
            app.resume();
            expect(app.isPaused()).toBe(false);
            expect(app.onResume).toHaveBeenCalledTimes(0);

            // running -> should be no-op
            app.start();
            app.resume();
            expect(app.isPaused()).toBe(false);
            expect(app.onResume).toHaveBeenCalledTimes(0);

            // paused -> should resume            
            app.pause();
            app.resume();
            expect(app.isPaused()).toBe(false);
            expect(app.onResume).toHaveBeenCalledTimes(1);

            // destroyed -> should be no-op
            app.destroy();
            app.resume();
            expect(app.isPaused()).toBe(false);
            expect(app.onResume).toHaveBeenCalledTimes(1);
        });


        test("update is called when resumed", () => {
            jest.spyOn(app, "onUpdate");

            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            app.pause();
            for (let i = 1; i <= 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }

            app.resume();
            for (let i = 2; i <= 11; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(i);
            }
        });

    });

    // MARK: - refresh() tests
    describe("refresh()", () => {
        test("schedules a single frame update", () => {
            jest.spyOn(app, "onUpdate");

            // No calls directly after refresh
            app.refresh();
            expect(app.onUpdate).toHaveBeenCalledTimes(0);

            // One call after multiple frame durations
            for (let i = 0; i < 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }
        });

        test("does not schedule multiple frames if refresh is called multiple times", () => {
            jest.spyOn(app, "onUpdate");

            // Call refresh multiple times
            app.refresh();
            app.refresh();
            app.refresh();
            expect(app.onUpdate).toHaveBeenCalledTimes(0);

            // One call after multiple frame durations
            for (let i = 0; i < 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }
        });
    });

    // MARK: - destroy() tests
    describe("destroy()", () => {
        test("transitions to DESTROYED state", () => {
            app.destroy();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
        });

        test("halts updates after destroying", () => {
            jest.spyOn(app, "onUpdate");

            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            app.destroy();
            for (let i = 1; i <= 10; i++) {
                jest.advanceTimersToNextFrame();
                expect(app.onUpdate).toHaveBeenCalledTimes(1);
            }
        });

        test("is no-op when destroyed", () => {
            jest.spyOn(app, "onDestroy");

            // stopped -> should destroy
            app.destroy();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
            expect(app.onDestroy).toHaveBeenCalledTimes(1);

            // already destroyed -> should be no-op
            app.destroy();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
            expect(app.onDestroy).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - state query tests
    describe("state queries", () => {
        test("isStopped() returns true when stopped", () => {
            expect(app.isStopped()).toBe(true);
            app.start();
            expect(app.isStopped()).toBe(false);
            app.stop();
            expect(app.isStopped()).toBe(true);
            app.destroy();
            expect(app.isStopped()).toBe(false);
        });

        test("isRunning() returns true when running", () => {
            expect(app.isRunning()).toBe(false);
            app.start();
            expect(app.isRunning()).toBe(true);
            app.stop();
            expect(app.isRunning()).toBe(false);
            app.destroy();
            expect(app.isRunning()).toBe(false);
        });

        test("isPaused() returns true when paused", () => {
            expect(app.isPaused()).toBe(false);
            app.start();
            expect(app.isPaused()).toBe(false);
            app.pause();
            expect(app.isPaused()).toBe(true);
            app.stop();
            expect(app.isPaused()).toBe(false);
            app.destroy();
            expect(app.isPaused()).toBe(false);
        });

        test("isDestroying() returns true when destroying", () => {
            jest.spyOn(app, "onDestroy").mockImplementation(() => {
                expect(app.isDestroying()).toBe(true);
            });

            expect(app.isDestroying()).toBe(false);
            app.start();
            expect(app.isDestroying()).toBe(false);
            app.destroy();
            expect(app.isDestroying()).toBe(false);
        });

        test("isDestroyed() returns true when destroyed", () => {
            expect(app.isDestroyed()).toBe(false);
            app.start();
            expect(app.isDestroyed()).toBe(false);
            app.destroy();
            expect(app.isDestroyed()).toBe(true);
        });
    });

    // MARK: - onStart() tests
    describe("onStart()", () => {
        test("called when starting", () => {
            jest.spyOn(app, "onStart");

            app.start();
            expect(app.onStart).toHaveBeenCalledTimes(1);

            app.start();
            expect(app.onStart).toHaveBeenCalledTimes(1);
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onStart").mockImplementation(() => {
                throw new Error("Test error in onStart");
            });
            expect(() => app.start()).not.toThrow();
            expect(app.state).toBe(CanvasAppState.RUNNING);
            expect(app.onStart).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - onStop() tests
    describe("onStop()", () => {
        test("called when stopping", () => {
            jest.spyOn(app, "onStop");

            app.stop();
            expect(app.onStop).toHaveBeenCalledTimes(0);

            app.start();
            app.stop();
            expect(app.onStop).toHaveBeenCalledTimes(1);

            app.stop();
            expect(app.onStop).toHaveBeenCalledTimes(1);
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onStop").mockImplementation(() => {
                throw new Error("Test error in onStop");
            });
            app.start();
            expect(() => app.stop()).not.toThrow();
            expect(app.state).toBe(CanvasAppState.STOPPED);
            expect(app.onStop).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - onPause() tests
    describe("onPause()", () => {
        test("called when pausing", () => {
            jest.spyOn(app, "onPause");

            app.pause();
            expect(app.onPause).toHaveBeenCalledTimes(0);

            app.start();
            app.pause();
            expect(app.onPause).toHaveBeenCalledTimes(1);

            app.pause();
            expect(app.onPause).toHaveBeenCalledTimes(1);
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onPause").mockImplementation(() => {
                throw new Error("Test error in onPause");
            });
            app.start();
            expect(() => app.pause()).not.toThrow();
            expect(app.isPaused()).toBe(true);
            expect(app.onPause).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - onResume() tests
    describe("onResume()", () => {
        test("onResume() is called when resuming", () => {
            jest.spyOn(app, "onResume");

            app.resume();
            expect(app.onResume).toHaveBeenCalledTimes(0);

            app.start();
            app.resume();
            expect(app.onResume).toHaveBeenCalledTimes(0);

            app.pause();
            app.resume();
            expect(app.onResume).toHaveBeenCalledTimes(1);

            app.resume();
            expect(app.onResume).toHaveBeenCalledTimes(1);
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onResume").mockImplementation(() => {
                throw new Error("Test error in onResume");
            });
            app.start();
            app.pause();
            expect(() => app.resume()).not.toThrow();
            expect(app.isPaused()).toBe(false);
            expect(app.onResume).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - onDestroy() tests
    describe("onDestroy()", () => {
        test("called when destroying", () => {
            jest.spyOn(app, "onDestroy");

            app.destroy();
            expect(app.onDestroy).toHaveBeenCalledTimes(1);

            app.destroy();
            expect(app.onDestroy).toHaveBeenCalledTimes(1);
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onDestroy").mockImplementation(() => {
                throw new Error("Test error in onDestroy");
            });
            expect(() => app.destroy()).not.toThrow();
            expect(app.state).toBe(CanvasAppState.DESTROYED);
            expect(app.onDestroy).toHaveBeenCalledTimes(1);
        });
    });

    // MARK: - onUpdate() tests
    describe("onUpdate()", () => {
        test("called with timestamp and deltaTime", () => {
            jest.spyOn(app, "onUpdate");
            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);
            const [timestamp, deltaTime] = app.onUpdate.mock.calls[0];
            expect(typeof timestamp).toBe("number");
            expect(typeof deltaTime).toBe("number");
        });

        test("thrown errors are handled", () => {
            jest.spyOn(app, "onUpdate").mockImplementation(() => {
                throw new Error("Test error in onUpdate");
            });
            app.start();
            expect(() => jest.advanceTimersToNextFrame()).not.toThrow();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);
            expect(app.state).toBe(CanvasAppState.STOPPED);
        });
    });

    // MARK: - other tests
    describe("other", () => {
        test("destroying during update does not throw and completes teardown", () => {
            class DestroyOnUpdateCanvasApp extends CanvasApp {
                onUpdate() {
                    this.destroy();
                }
            }

            destroyApp();
            app = new DestroyOnUpdateCanvasApp(canvasElement);
            app.start();

            expect(() => jest.advanceTimersToNextFrame()).not.toThrow();
            expect(app.isDestroyed()).toBe(true);
        });

        test("errors thrown during drawing are handled", () => {
            class ThrowOnDrawView extends View {
                drawSelf() {
                    throw new Error("Test error during drawing");
                }
            }

            app.canvas.addView(new ThrowOnDrawView());
            app.start();
            
            expect(() => jest.advanceTimersToNextFrame()).not.toThrow();
            expect(app.state).toBe(CanvasAppState.STOPPED);
        });

        test("updates stop when document hides and resumes when visible", () => {
            jest.spyOn(app, "onUpdate");

            app.start();
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            document.hidden = true;
            document.dispatchEvent(new Event("visibilitychange"));
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(1);

            document.hidden = false;
            document.dispatchEvent(new Event("visibilitychange"));
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(2);
        });

        test("visibility change has no effect when app is stopped", () => {
            jest.spyOn(app, "onUpdate");

            document.hidden = true;
            document.dispatchEvent(new Event("visibilitychange"));
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(0);

            document.hidden = false;
            document.dispatchEvent(new Event("visibilitychange"));
            jest.advanceTimersToNextFrame();
            expect(app.onUpdate).toHaveBeenCalledTimes(0);
        });
    });

});


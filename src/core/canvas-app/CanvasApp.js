import { EventEmitter } from "../../events/EventEmitter.js";
import { Canvas } from "../../graphics/Canvas.js";
import {
    CanvasAppPauseEvent,
    CanvasAppResumeEvent,
    CanvasAppStartEvent,
    CanvasAppStopEvent
} from "./CanvasAppEvent.js";

export class CanvasApp {
    #canvas = null;
    #eventEmitter = new EventEmitter();

    #isPaused = false;
    #isRunning = false;

    #lastFrameTime = null;
    #frameId = null;
    #boundTick = null;
    #boundVisibilityHandler = null;

    // MARK: - properties
    get canvas() {
        return this.#canvas;
    }

    // MARK: - initialization
    constructor(canvasSelectorOrElement) {
        this.#canvas = new Canvas(canvasSelectorOrElement);
        this.#boundTick = this.#tick.bind(this);
        this.#boundVisibilityHandler = this.#onVisibilityChange.bind(this);
    }

    // MARK: - app control
    start() {
        if (this.#isRunning) {
            return;
        }
        this.#isRunning = true;
        this.#isPaused = false;
        this.#attachListeners();

        this.#lastFrameTime = performance.now();
        this.#dispatchStart();
        this.#requestNextFrame();
    }

    stop() {
        if (!this.#isRunning) {
            return;
        }
        this.#isRunning = false;
        this.#isPaused = false;
        this.#detachListeners();

        this.#cancelCurrentFrame();
        this.#dispatchStop();
    }

    pause() { 
        if (this.#isPaused || !this.#isRunning) {
            return;
        }
        this.#isPaused = true; 
        this.#dispatchPause();
    }

    resume() {
        if (!this.#isPaused || !this.#isRunning) {
            return;
        }
        this.#isPaused = false; 
        this.#dispatchResume();
    }

    isRunning() {
        return this.#isRunning;
    }

    isPaused() {
        return this.#isPaused;
    }    

    // MARK: - lifecycle 
    #tick(timestamp) {
        const deltaTime = timestamp - this.#lastFrameTime;
        this.#lastFrameTime = timestamp;

        if (!document.hidden) {
            if (!this.isPaused()) {
                this.onUpdate(deltaTime);
            }
            this.onDraw();
        }

        this.#requestNextFrame();
    }

    // MARK: - subclass hooks
    onStart() {}
    onStop() {}
    onPause() {}
    onResume() {}

    onUpdate(deltaTime) {}
    onDraw() {
        if (this.#canvas) {
            this.#canvas.draw();
        }
    }

    // MARK: - events 
    addEventListener(type, callback, owner=null, once=false) {
        this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner=null) {
        this.#eventEmitter.removeListener(type, callback, owner);
    }

    // MARK: - event emitters
    #dispatchStart() {
        this.onStart();
        this.#eventEmitter.emit(CanvasAppStartEvent, new CanvasAppStartEvent(this));
    }

    #dispatchStop() {
        this.onStop();
        this.#eventEmitter.emit(CanvasAppStopEvent, new CanvasAppStopEvent(this));
    }

    #dispatchPause() {
        this.onPause();
        this.#eventEmitter.emit(CanvasAppPauseEvent, new CanvasAppPauseEvent(this));
    }

    #dispatchResume() {
        this.onResume();
        this.#eventEmitter.emit(CanvasAppResumeEvent, new CanvasAppResumeEvent(this));
    }

    // MARK: - event handlers
    #onVisibilityChange() {
        if (!document.hidden) { 
            this.#lastFrameTime = performance.now();
        }
    }

    // MARK: - helpers
    #attachListeners() {
        document.addEventListener("visibilitychange", this.#boundVisibilityHandler);
    }

    #detachListeners() {
        document.removeEventListener("visibilitychange", this.#boundVisibilityHandler);
    }

    #requestNextFrame() {
        if (this.isRunning()) {
            this.#frameId = requestAnimationFrame(this.#boundTick);
        }
    }

    #cancelCurrentFrame() {
        cancelAnimationFrame(this.#frameId);
        this.#frameId = null;
    }
}
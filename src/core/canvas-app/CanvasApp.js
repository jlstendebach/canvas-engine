import { EventEmitter } from "../../events/EventEmitter.js";
import { CanvasAppPauseEvent } from "./CanvasAppPauseEvent.js";
import { Canvas } from "../../graphics/Canvas.js";

export class CanvasApp {
    #canvas = null;
    #eventEmitter = new EventEmitter();

    #isPaused = false;
    #isRunning = false;

    #lastFrameTime = null;
    #frameId = null;
    #boundTick = null;
    #boundVisibilityHandler = null;

    // MARK: - Properties
    get canvas() {
        return this.#canvas;
    }

    // MARK: - Initialization
    constructor(canvasSelectorOrElement) {
        this.#canvas = new Canvas(canvasSelectorOrElement);
        this.#boundTick = this.#tick.bind(this);
        this.#boundVisibilityHandler = this.#onVisibilityChange.bind(this);
    }

    // MARK: - App Control
    start() {
        if (this.#isRunning) {
            return;
        }
        this.#isRunning = true;

        document.addEventListener("visibilitychange", this.#boundVisibilityHandler);

        this.#lastFrameTime = null;
        this.#frameId = requestAnimationFrame(this.#boundTick);
    }

    stop() {
        if (!this.#isRunning) {
            return;
        }
        this.#isRunning = false;

        document.removeEventListener("visibilitychange", this.#boundVisibilityHandler);

        cancelAnimationFrame(this.#frameId);
        this.#frameId = null;
    }

    isRunning() {
        return this.#isRunning;
    }

    pause() { 
        if (this.#isPaused) {
            return;
        }
        this.#isPaused = true; 
        this.#emitPauseEvent();
    }

    resume() {
        if (!this.#isPaused) {
            return;
        }
        this.#isPaused = false; 
        this.#emitPauseEvent();
    }

    isPaused() {
        return this.#isPaused;
    }    

    // MARK: - Lifecycle 
    #tick(timestamp) {
        const deltaTime = timestamp - (this.#lastFrameTime ?? timestamp);
        this.#lastFrameTime = timestamp;

        if (!document.hidden) {
            if (!this.isPaused()) {
                this.update(deltaTime);
            }
            this.draw();
        }

        if (this.isRunning()) {
            this.#frameId = requestAnimationFrame(this.#boundTick);
        }
    }

    update(deltaTime) {
        // To be overridden by subclass. Now receives fixed deltaTime.
    }

    draw() {
        if (this.#canvas) {
            this.#canvas.draw();
        }
    }

    // MARK: - Events 
    addEventListener(type, callback, owner=null, once=false) {
        this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner=null) {
        this.#eventEmitter.removeListener(type, callback, owner);
    }

    #emitPauseEvent() {
        this.#eventEmitter.emit(
            CanvasAppPauseEvent.name, 
            new CanvasAppPauseEvent(this, this.#isPaused)
        );
    }

    #onVisibilityChange() {
        if (document.hidden) { 
            return;
        }
        this.#lastFrameTime = null;
    }
}
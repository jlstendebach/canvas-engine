import { EventEmitter } from "../../events/EventEmitter.js";
import { Profiler } from "../../utils/Profiler.js";
import { CanvasAppPauseEvent } from "./CanvasAppPauseEvent.js";

export class CanvasApp {
    canvases = [];

    #isPaused = false;
    #isRunning = false;
    #lastTime = null;
    #frameId = null;
    #boundTick = null;

    #eventEmitter = new EventEmitter();

    // MARK: - Initialization
    constructor() {
        this.#boundTick = this.#tick.bind(this);
    }

    // MARK: - App Control
    start() {
        if (this.#isRunning) {
            return;
        }
        this.#isRunning = true;
        this.#frameId = requestAnimationFrame(this.#boundTick);
    }

    stop() {
        if (!this.#isRunning) {
            return;
        }
        this.#isRunning = false;
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
        if (this.#lastTime === null) {
            this.#lastTime = timestamp;
        }
        const deltaTime = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        if (this.isPaused() === false) {
            this.update(deltaTime);
        }

        this.draw();

        if (this.#isRunning) {
            this.#frameId = requestAnimationFrame(this.#boundTick);
        }
    }

    update(deltaTime) {
        // To be overridden by subclass. Now receives fixed deltaTime.
    }

    draw() {
        // To be overridden by subclass.
        for (let canvas of this.canvases) {
            canvas.draw();
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

}
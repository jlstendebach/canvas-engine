import { EventEmitter } from "../../events/EventEmitter.js";
import { Profiler } from "../../utils/Profiler.js";
import { CanvasAppPauseEvent } from "./CanvasAppPauseEvent.js";

export class CanvasApp {
    canvases = [];
    #isPaused = false;
    #lastTime = null;
    #profilerUpdate = new Profiler(10);
    #profilerDraw = new Profiler(10);
    #eventEmitter = new EventEmitter();

    #isRunning = false;
    #frameId = null;
    #boundLoop = null;

    // MARK: - Initialization
    constructor() {
        this.#boundLoop = this.#loop.bind(this);
    }

    // MARK: - App Control
    start() {
        if (this.#isRunning) {
            return;
        }
        this.#isRunning = true;
        this.#frameId = requestAnimationFrame(this.#boundLoop);
    }

    stop() {
        if (!this.#isRunning) {
            return;
        }
        this.#isRunning = false;
        cancelAnimationFrame(this.#frameId);
        this.#frameId = null;
    }

    setPaused(paused) { 
        if (this.#isPaused !== paused) {
            this.#isPaused = paused; 
            this.#eventEmitter.emit(
                CanvasAppPauseEvent.name, 
                new CanvasAppPauseEvent(this, this.#isPaused)
            );
        }
    }

    isPaused() { 
        return this.#isPaused; 
    }

    // MARK: - Profilers 
    getUpdateTime() {
        return this.#profilerUpdate.getTime();
    }

    getDrawTime() {
        return this.#profilerDraw.getTime();
    }

    // MARK: - Lifecycle 
    #loop(timestamp) {
        if (this.#lastTime === null) {
            this.#lastTime = timestamp;
        }
        const deltaTime = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        // Update
        if (this.isPaused() === false) {
            this.#profilerUpdate.start();
            this.update(deltaTime);
            this.#profilerUpdate.mark();
        }

        // Draw
        this.#profilerDraw.start();
        this.draw();
        this.#profilerDraw.mark();

        // Go again
        if (this.#isRunning) {
            this.#frameId = requestAnimationFrame(this.#boundLoop);
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

}
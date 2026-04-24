import { AppPauseEvent, EventEmitter } from "../events/index.js"
import { Profiler } from "./Profiler.js"

export class App {
    canvases = [];
    #isPaused = false;
    #lastTime = null;
    #profilerUpdate = new Profiler(10);
    #profilerDraw = new Profiler(10);
    #eventEmitter = new EventEmitter();

    // MARK: - Initalizers -----------------------------------------------------
    constructor() {}

    // MARK: - App Control -----------------------------------------------------
    start() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    setPaused(paused) { 
        if (this.#isPaused !== paused) {
            this.#isPaused = paused; 
            this.#eventEmitter.emit(
                AppPauseEvent.name, 
                new AppPauseEvent(this, this.#isPaused)
            );
        }
    }

    isPaused() { 
        return this.#isPaused; 
    }

    // MARK: - Profilers -------------------------------------------------------
    getUpdateTime() {
        return this.#profilerUpdate.getTime();
    }

    getDrawTime() {
        return this.#profilerDraw.getTime();
    }

    // MARK: - Lifecycle -------------------------------------------------------
    loop(timestamp) {
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
        window.requestAnimationFrame(this.loop.bind(this));
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

    // MARK: - Events ----------------------------------------------------------
    addEventListener(type, callback, owner=null, once=false) {
        this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner=null) {
        this.#eventEmitter.removeListener(type, callback, owner);
    }

}
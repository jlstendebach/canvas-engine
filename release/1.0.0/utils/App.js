import { AppPauseEvent } from "../events/index.js"
import { Canvas } from "../graphics/index.js"
import { Profiler } from "./Profiler.js"
import { Timer } from "./Timer.js"

export class App {
    canvas; // Canvas
    #isPaused; // Bool
    #profilerUpdate; // Profiler
    #profilerDraw; // Profiler
    #loopTimer; // Timer

    // --[ initalizers ]--------------------------------------------------------
    constructor(canvasId) {
        this.canvas = new Canvas(canvasId);
        this.#isPaused = false;
        this.#profilerUpdate = new Profiler(10);
        this.#profilerDraw = new Profiler(10);
        this.#loopTimer = new Timer();
    }

    // --[ app control ]--------------------------------------------------------
    start() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    setPaused(paused) { 
        if (this.#isPaused !== paused) {
            this.#isPaused = paused; 
            this.emitEvent(
                AppPauseEvent.name, 
                new AppPauseEvent(this, this.#isPaused)
            );
        }
    }
    isPaused() { 
        return this.#isPaused; 
    }


    // --[ profilers ]----------------------------------------------------------
    getUpdateTime() {
        return this.#profilerUpdate.getTime();
    }

    getDrawTime() {
        return this.#profilerDraw.getTime();
    }

    // -------------------------------------------------------------------------
    update(dtime) {
    }

    draw() {
        this.canvas.draw();
    }

    loop() {
        let dtime = this.#loopTimer.getTime();
        this.#loopTimer.start();

        // Update
        this.#profilerUpdate.start();
        if (!this.isPaused()) {
            this.update(dtime);
        }
        this.#profilerUpdate.mark();

        // Draw
        this.#profilerDraw.start();
        this.draw();
        this.#profilerDraw.mark();

        window.requestAnimationFrame(this.loop.bind(this));
    }

    // --[ events ]-------------------------------------------------------------
    addEventListener(type, callback, owner=null) {
        this.canvas.addEventListener(type, callback, owner);
    }

    removeEventListener(type, callback, owner=null) {
        this.canvas.removeEventListener(type, callback, owner);
    }

    emitEvent(type, event) {
        this.canvas.emitEvent(type, event);
    }

}
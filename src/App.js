import { Canvas } from "./graphics/Graphics.js"
import { Profiler } from "./utils/Utils.js"

export class App {
    constructor(canvasId) {
        this.interval = null;
        this.canvas = new Canvas(canvasId);
        this.paused = false;

        this.profilerUpdate = new Profiler(10);
        this.profilerDraw = new Profiler(10);
    }

    // --[ initalizers ]--------------------------------------------------------

    // --[ app control ]--------------------------------------------------------
    start(interval) {
        const self = this;
        const callback = function () { self.loop(); };
        this.interval = window.setInterval(callback, interval);
    }

    stop() {
        window.clearInterval(this.interval);
    }

    setPaused(p) { this.paused = p; }
    isPaused() { return this.paused; }


    // --[ profilers ]----------------------------------------------------------
    getUpdateTime() {
        return this.profilerUpdate.getTime();
    }

    getDrawTime() {
        return this.profilerDraw.getTime();
    }

    // -------------------------------------------------------------------------
    update() {

    }

    draw() {
        this.canvas.draw();
    }

    loop() {
        // Update
        this.profilerUpdate.start();
        if (!this.isPaused()) {
            this.update();
        }
        this.profilerUpdate.mark();

        // Draw
        this.profilerDraw.start();
        this.draw();
        this.profilerDraw.mark();
    }

}
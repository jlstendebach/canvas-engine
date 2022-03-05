import { Canvas } from "./graphics/Graphics.js"
import { Profiler, Timer } from "./utils/Utils.js"

export class App {
    constructor(canvasId) {
        this.canvas = new Canvas(canvasId);
        this.profilerUpdate = new Profiler(10);
        this.profilerDraw = new Profiler(10);
        this.loopTimer = new Timer();
    }

    // --[ initalizers ]--------------------------------------------------------

    // --[ app control ]--------------------------------------------------------
    start() {
        window.requestAnimationFrame(this.loop.bind(this));
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
    update(dtime) {
    }

    draw() {
        this.canvas.draw();
    }

    loop() {
        let dtime = this.loopTimer.getTime();
        this.loopTimer.start();

        // Update
        this.profilerUpdate.start();
        if (!this.isPaused()) {
            this.update(dtime);
        }
        this.profilerUpdate.mark();

        // Draw
        this.profilerDraw.start();
        this.draw();
        this.profilerDraw.mark();

        window.requestAnimationFrame(this.loop.bind(this));
    }

}
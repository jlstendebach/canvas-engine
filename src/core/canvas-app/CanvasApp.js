import { Canvas } from "../../graphics/Canvas.js";

const CanvasAppState = Object.freeze({
    STOPPED: 0,
    RUNNING: 1,
    DESTROYING: 2,
    DESTROYED: 3
});

export class CanvasApp {
    #canvas = null;

    #lastFrameTime = null;
    #frameId = null;

    #state = CanvasAppState.STOPPED;
    #isPaused = false;

    #domAbortController = null;

    // MARK: - properties
    get canvas() {
        return this.#canvas;
    }

    // MARK: - initialization
    constructor(canvasSelectorOrElement) {
        this.#canvas = new Canvas(canvasSelectorOrElement);
        this.#attachDomEvents();
    }

    // MARK: - lifecycle
    start() {
        if (!this.isStopped()) {
            return;
        }
        this.#state = CanvasAppState.RUNNING;
        this.#isPaused = false;
        this.#lastFrameTime = performance.now();

        this.#safeCall(() => this.onStart());
        this.#requestFrame();
    }

    stop() {
        if (!this.isRunning()) {
            return;
        }
        this.#state = CanvasAppState.STOPPED;
        this.#isPaused = false;

        this.#cancelFrame();
        this.#safeCall(() => this.onStop());
    }

    pause() { 
        if (!this.isRunning() || this.isPaused()) {
            return;
        }
        this.#isPaused = true;
        this.#safeCall(() => this.onPause());
    }

    resume() {
        if (!this.isRunning() || !this.isPaused()) {
            return;
        }
        this.#isPaused = false;
        this.#safeCall(() => this.onResume());
    }

    destroy() {
        if (this.isDestroying() || this.isDestroyed()) {
            return;
        }
        this.#state = CanvasAppState.DESTROYING;

        try {
            this.#isPaused = false;
            this.#cancelFrame();
            this.#detachDomEvents();
            this.#safeCall(() => this.onDestroy());

        } catch (error) {
            this.#reportError(error);

        } finally {
            this.#canvas.destroy();
            this.#canvas = null;
            this.#state = CanvasAppState.DESTROYED;
        }

    }

    // MARK: - main loop
    #tick = (timestamp) => {
        try {
            const deltaTime = timestamp - this.#lastFrameTime;
            this.#lastFrameTime = timestamp;

            if (!document.hidden) {
                this.#update(timestamp, deltaTime);
                this.#draw();
            }
            
        } catch (error) {
            this.#handleFrameError(error, "tick");

        } finally {
            this.#requestFrame();
        }
    }

    #update(timestamp, deltaTime) {
        if (this.isPaused()) {
            return;
        }

        try {
            this.onUpdate(timestamp, deltaTime);
        } catch (error) {
            this.#handleFrameError(error, "onUpdate");
        }
    }

    #draw() {
        if (!this.#canvas) { 
            return; 
        }

        try {
            this.#canvas.draw();
        } catch (error) {
            this.#handleFrameError(error, "draw");
        }
    }

    // MARK: - state queries
    isStopped() {
        return this.#state === CanvasAppState.STOPPED;
    }

    isRunning() {
        return this.#state === CanvasAppState.RUNNING;
    }

    isPaused() {
        return this.#isPaused;
    }

    isDestroying() {
        return this.#state === CanvasAppState.DESTROYING;
    }

    isDestroyed() {
        return this.#state === CanvasAppState.DESTROYED;
    }

    // MARK: - lifecycle hooks
    onStart() {}
    onStop() {}
    onPause() {}
    onResume() {}
    onUpdate(timestamp, deltaTime) { void timestamp; void deltaTime; }
    onDestroy() {}

    // MARK: - event handlers
    #onVisibilityChange() {
        if (!document.hidden) { 
            this.#lastFrameTime = performance.now();
        }
    }

    // MARK: - helpers
    #safeCall(callback) {
        try {
            callback();
        } catch (error) {
            this.#reportError(error);
        }
    }

    #attachDomEvents() {
        if (this.#domAbortController) {
            return;
        }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };
        document.addEventListener(
            "visibilitychange", 
            () => this.#onVisibilityChange(), 
            options
        );
    }

    #detachDomEvents() {
        if (!this.#domAbortController) {
            return;
        }
        this.#domAbortController.abort();
        this.#domAbortController = null;
    }

    #requestFrame() {
        if (this.isRunning()) {
            this.#frameId = requestAnimationFrame(this.#tick);
        }
    }

    #cancelFrame() {
        cancelAnimationFrame(this.#frameId);
        this.#frameId = null;
    }

    #reportError(error) {
        console.error(error);
    }

    #handleFrameError(error, source) {
        this.#reportError({ source, error });
        this.stop();
    }
}
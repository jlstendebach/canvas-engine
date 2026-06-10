import { Canvas } from "../../graphics/Canvas.js";

// MARK: - CanvasApp
export class CanvasApp {
    #canvas = null;

    #lastFrameTime = null;
    #animationFrameId = null;

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

    refresh() {
        const isNotStopped = !this.isStopped();
        const isFrameRequested = this.#isFrameRequested();
        const isDocumentHidden = document.hidden;

        if (isNotStopped || isFrameRequested || isDocumentHidden) {
            return;
        }

        this.#lastFrameTime = performance.now();
        this.#animationFrameId = requestAnimationFrame(this.#tick);
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
        // Clearing this here allows another frame to be requested from 
        // anywhere, even from DOM events like our 'visibilitychange' handler. 
        // JavaScript ensures that the current tick will finish before 
        // processing new frames.
        this.#animationFrameId = null;

        try {
            const deltaTime = timestamp - this.#lastFrameTime;
            this.#lastFrameTime = timestamp;

            this.#update(timestamp, deltaTime);
            this.#draw();
            
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

    isDestroying() {
        return this.#state === CanvasAppState.DESTROYING;
    }

    isDestroyed() {
        return this.#state === CanvasAppState.DESTROYED;
    }

    isPaused() {
        return this.#isPaused;
    }

    // MARK: - lifecycle hooks
    onStart() {}
    onStop() {}
    onPause() {}
    onResume() {}
    onUpdate(timestamp, deltaTime) { void timestamp; void deltaTime; }
    onDestroy() {}

    // MARK: - events
    #onDocumentHidden() {
        this.#cancelFrame();
    }

    #onDocumentVisible() {
        if (!this.isRunning()) {
            return;
        }
        this.#lastFrameTime = performance.now();
        this.#requestFrame();
    }

    #attachDomEvents() {
        if (this.#domAbortController) {
            return;
        }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };
        const listener = () => {
            if (document.hidden) {
                this.#onDocumentHidden();
            } else {
                this.#onDocumentVisible();
            }
        };
        document.addEventListener("visibilitychange", listener, options);
    }

    #detachDomEvents() {
        if (!this.#domAbortController) {
            return;
        }
        this.#domAbortController.abort();
        this.#domAbortController = null;
    }

    // MARK: - frame management
    #isFrameRequested() {
        return this.#animationFrameId !== null;
    }

    #requestFrame() {
        const isNotRunning = !this.isRunning();
        const isFrameRequested = this.#isFrameRequested();
        const isDocumentHidden = document.hidden;

        if (isNotRunning || isFrameRequested || isDocumentHidden) {
            return;
        }

        this.#animationFrameId = requestAnimationFrame(this.#tick);
    }

    #cancelFrame() {
        cancelAnimationFrame(this.#animationFrameId);
        this.#animationFrameId = null;
    }

    // MARK: - helpers
    #safeCall(callback) {
        try {
            callback();
        } catch (error) {
            this.#reportError(error);
        }
    }

    // MARK: - error helpers
    #reportError(error) {
        console.error(error);
    }

    #handleFrameError(error, source) {
        this.#reportError({ source, error });
        this.stop();
    }
}

// MARK: - CanvasAppState
const CanvasAppState = Object.freeze({
    STOPPED: 0,
    RUNNING: 1,
    DESTROYING: 2,
    DESTROYED: 3
});

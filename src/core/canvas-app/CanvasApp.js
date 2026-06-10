import { Canvas } from "../../graphics/Canvas.js";
import { CanvasAppState } from "./CanvasAppState.js";

/**
 * A lifecycle manager for canvas-based applications that handles both
 * continuous frame loops and event-driven rendering. It is used as a base
 * class to coordinate application states, update logic, and render cycles
 * while synchronizing with browser paint and visibility events.
 */
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

    get state() {
        return this.#state;
    }

    // MARK: - initialization
    /**
     * Initializes the `CanvasApp` with a canvas element or selector.
     * @param {string | HTMLCanvasElement} canvasSelectorOrElement - A CSS selector string or an HTMLCanvasElement to be used for rendering.
     */
    constructor(canvasSelectorOrElement) {
        this.#canvas = new Canvas(canvasSelectorOrElement);
        this.#attachDomEvents();
    }

    // MARK: - lifecycle
    /**
     * Starts the `CanvasApp`, transitioning it to a `RUNNING` state and 
     * initiating the main loop. If the app is already running, is destroyed, or
     * is being destroyed, this method has no effect.
     * @returns {void}
     */
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

    /**
     * Stops the `CanvasApp`, transitioning it to a `STOPPED` state and
     * preventing more frames from being requested. Will not interrupt a frame 
     * that is currently being processed. If the app is not running, is 
     * destroyed, or is being destroyed, this method has no effect.
     * @returns {void}
     */
    stop() {
        if (!this.isRunning()) {
            return;
        }
        this.#state = CanvasAppState.STOPPED;
        this.#isPaused = false;

        this.#cancelFrame();
        this.#safeCall(() => this.onStop());
    }

    /**
     * Pauses the `CanvasApp`, halting updates but still rendering frames. If 
     * the app is not running, is already paused, is destroyed, or is being 
     * destroyed, this method has no effect.
     * @returns {void}
     */
    pause() { 
        if (!this.isRunning() || this.isPaused()) {
            return;
        }
        this.#isPaused = true;
        this.#safeCall(() => this.onPause());
    }

    /**
     * Resumes the `CanvasApp` from a paused state, allowing updates to 
     * continue. If the app is not running, is not paused, is destroyed, or is 
     * being destroyed, this method has no effect.
     * @returns {void}
     */
    resume() {
        if (!this.isRunning() || !this.isPaused()) {
            return;
        }
        this.#isPaused = false;
        this.#safeCall(() => this.onResume());
    }

    /**
     * Refreshes the `CanvasApp` by requesting a single frame. This can only be 
     * used when the app is stopped, as running apps automatically request 
     * frames. If the app is running, is destroyed, or is being destroyed, this 
     * method has no effect. If a frame is already requested or the document is
     * hidden, this method also has no effect.
     * @returns {void}
     */
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

    /**
     * Destroys the `CanvasApp`, transitioning it to the `DESTROYED` state and 
     * cleaning up all resources. If the app is already destroyed or is being 
     * destroyed, it has no effect. After calling this method, the `CanvasApp` 
     * instance becomes inoperable and should be discarded.
     * 
     * **WARNING**: This method is irreversible and will permanently disable the
     * `CanvasApp` instance. Use with caution.
     * @returns {void}
     */
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

    // MARK: - state queries
    /**
     * Checks if the `CanvasApp` is currently stopped.
     * @returns {boolean} True if the app is stopped, false otherwise.
     */
    isStopped() {
        return this.#state === CanvasAppState.STOPPED;
    }

    /**
     * Checks if the `CanvasApp` is currently running.
     * @returns {boolean} True if the app is running, false otherwise.
     */
    isRunning() {
        return this.#state === CanvasAppState.RUNNING;
    }

    /**
     * Checks if the `CanvasApp` is currently being destroyed.
     * @returns {boolean} True if the app is being destroyed, false otherwise.
     */
    isDestroying() {
        return this.#state === CanvasAppState.DESTROYING;
    }

    /**
     * Checks if the `CanvasApp` is currently destroyed.
     * @returns {boolean} True if the app is destroyed, false otherwise.
     */
    isDestroyed() {
        return this.#state === CanvasAppState.DESTROYED;
    }

    /**
     * Checks if the `CanvasApp` is currently paused.
     * @returns {boolean} True if the app is paused, false otherwise.
     */
    isPaused() {
        return this.#isPaused;
    }

    // MARK: - lifecycle hooks
    /**
     * Lifecycle hook called when `CanvasApp` starts. Will be called just after 
     * the app's state is set to `RUNNING` and just before the first frame is 
     * requested. Override this method to implement custom startup logic.
     * 
     * Errors thrown from this method will be caught and reported, but will not 
     * prevent the app from starting.
     * @returns {void}
     */
    onStart() {}
    
    /**
     * Lifecycle hook called when the `CanvasApp` stops. Will be called after 
     * the app's state is set to `STOPPED` and after we have requested the 
     * cancellation of the current frame, if any. Override this method to 
     * implement custom stop logic.
     * 
     * Errors thrown from this method will be caught and reported, but will not 
     * prevent the app from stopping.
     *
     * **NOTE**: If a frame is currently being processed when {@link CanvasApp.prototype.onStop onStop()} 
     * is called, that frame will still complete its execution, including any 
     * calls to {@link CanvasApp.prototype.onUpdate onUpdate()}.
     * @returns {void}
     */
    onStop() {}
    
    /**
     * Lifecycle hook called when the `CanvasApp` is paused. Will be called just 
     * after the app's paused state is set to `true`. Override this method to 
     * implement custom pause logic.
     * 
     * Errors thrown from this method will be caught and reported, but will not 
     * prevent the app from pausing.
     * @returns {void}
     */
    onPause() {}
    
    /**
     * Lifecycle hook called when the `CanvasApp` is resumed from a paused 
     * state. Will be called just after the app's paused state is set to 
     * `false`. Override this method to implement custom resume logic.
     * 
     * Errors thrown from this method will be caught and reported, but will not 
     * prevent the app from resuming.
     * @returns {void}
     */
    onResume() {}
    
    /**
     * Lifecycle hook called on each frame update. Override this method to 
     * implement custom update logic.
     * 
     * Errors thrown from this method will be caught and reported, and the app
     * will attempt to stop gracefully by calling {@link CanvasApp.prototype.stop stop()}.
     * @param {number} timestamp - The current timestamp in milliseconds.
     * @param {number} deltaTime - The time elapsed since the last frame in milliseconds.
     * @returns {void}
     */
    onUpdate(timestamp, deltaTime) { void timestamp; void deltaTime; }
    
    /**
     * Lifecycle hook called when the `CanvasApp` is being destroyed. 
     * Will be called just after the app's state is set to `DESTROYING`. 
     * Override this method to implement custom destroy logic.
     * 
     * Errors thrown from this method will be caught and reported, but will not 
     * prevent the app from being destroyed.
     * @returns {void}
     */
    onDestroy() {}

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
            this.#handleErrorAndStop(error, "tick");

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
            this.#handleErrorAndStop(error, "onUpdate");
        }
    }

    #draw() {
        if (!this.#canvas) { 
            return; 
        }

        try {
            this.#canvas.draw();
        } catch (error) {
            this.#handleErrorAndStop(error, "draw");
        }
    }

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

    // MARK: - error helpers
    #safeCall(callback) {
        try {
            callback();
        } catch (error) {
            this.#reportError(error);
        }
    }

    #reportError(error) {
        console.error(error);
    }

    #handleErrorAndStop(error, source) {
        this.#reportError({ source, error });
        this.stop();
    }
}

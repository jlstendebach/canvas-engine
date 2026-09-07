/**
 * A lifecycle manager for canvas-based applications that handles both
 * continuous frame loops and event-driven rendering. It is used as a base
 * class to coordinate application states, update logic, and render cycles
 * while synchronizing with browser paint and visibility events.
 */
export declare class CanvasApp {
    #private;
    get canvas(): any;
    get state(): 0;
    /**
     * Initializes the `CanvasApp` with a canvas element or selector.
     * @param {string | HTMLCanvasElement} canvasSelectorOrElement - A CSS selector string or an HTMLCanvasElement to be used for rendering.
     */
    constructor(canvasSelectorOrElement: string | HTMLCanvasElement);
    /**
     * Starts the `CanvasApp`, transitioning it to a `RUNNING` state and
     * initiating the main loop. If the app is already running, is destroyed, or
     * is being destroyed, this method has no effect.
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the `CanvasApp`, transitioning it to a `STOPPED` state and
     * preventing more frames from being requested. Will not interrupt a frame
     * that is currently being processed. If the app is not running, is
     * destroyed, or is being destroyed, this method has no effect.
     * @returns {void}
     */
    stop(): void;
    /**
     * Pauses the `CanvasApp`, halting updates but still rendering frames. If
     * the app is not running, is already paused, is destroyed, or is being
     * destroyed, this method has no effect.
     * @returns {void}
     */
    pause(): void;
    /**
     * Resumes the `CanvasApp` from a paused state, allowing updates to
     * continue. If the app is not running, is not paused, is destroyed, or is
     * being destroyed, this method has no effect.
     * @returns {void}
     */
    resume(): void;
    /**
     * Refreshes the `CanvasApp` by requesting a single frame. This can only be
     * used when the app is stopped, as running apps automatically request
     * frames. If the app is running, is destroyed, or is being destroyed, this
     * method has no effect. If a frame is already requested or the document is
     * hidden, this method also has no effect.
     * @returns {void}
     */
    refresh(): void;
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
    destroy(): void;
    /**
     * Checks if the `CanvasApp` is currently stopped.
     * @returns {boolean} True if the app is stopped, false otherwise.
     */
    isStopped(): boolean;
    /**
     * Checks if the `CanvasApp` is currently running.
     * @returns {boolean} True if the app is running, false otherwise.
     */
    isRunning(): boolean;
    /**
     * Checks if the `CanvasApp` is currently paused.
     * @returns {boolean} True if the app is paused, false otherwise.
     */
    isPaused(): boolean;
    /**
     * Checks if the `CanvasApp` is currently being destroyed.
     * @returns {boolean} True if the app is being destroyed, false otherwise.
     */
    isDestroying(): boolean;
    /**
     * Checks if the `CanvasApp` is currently destroyed.
     * @returns {boolean} True if the app is destroyed, false otherwise.
     */
    isDestroyed(): boolean;
    /**
     * Lifecycle hook called when `CanvasApp` starts. Will be called just after
     * the app's state is set to `RUNNING` and just before the first frame is
     * requested. Override this method to implement custom startup logic.
     *
     * Errors thrown from this method will be caught and reported, but will not
     * prevent the app from starting.
     * @returns {void}
     */
    onStart(): void;
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
    onStop(): void;
    /**
     * Lifecycle hook called when the `CanvasApp` is paused. Will be called just
     * after the app's paused state is set to `true`. Override this method to
     * implement custom pause logic.
     *
     * Errors thrown from this method will be caught and reported, but will not
     * prevent the app from pausing.
     * @returns {void}
     */
    onPause(): void;
    /**
     * Lifecycle hook called when the `CanvasApp` is resumed from a paused
     * state. Will be called just after the app's paused state is set to
     * `false`. Override this method to implement custom resume logic.
     *
     * Errors thrown from this method will be caught and reported, but will not
     * prevent the app from resuming.
     * @returns {void}
     */
    onResume(): void;
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
    onUpdate(timestamp: number, deltaTime: number): void;
    /**
     * Lifecycle hook called when the `CanvasApp` is being destroyed.
     * Will be called just after the app's state is set to `DESTROYING`.
     * Override this method to implement custom destroy logic.
     *
     * Errors thrown from this method will be caught and reported, but will not
     * prevent the app from being destroyed.
     * @returns {void}
     */
    onDestroy(): void;
}

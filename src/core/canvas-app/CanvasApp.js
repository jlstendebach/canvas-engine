import { EventEmitter } from "../../events/EventEmitter.js";
import { Canvas } from "../../graphics/Canvas.js";
import {
    CanvasAppDestroyEvent,
    CanvasAppPauseEvent,
    CanvasAppResumeEvent,
    CanvasAppStartEvent,
    CanvasAppStopEvent,
    CanvasAppUpdateEvent
} from "./CanvasAppEvent.js";

export class CanvasApp {
    #canvas = null;
    #eventEmitter = new EventEmitter();

    #lastFrameTime = null;
    #frameId = null;
    #boundTick = null;

    #domAbortController = null;

    #isPaused = false;
    #isRunning = false;
    #isDestroying = false;

    // MARK: - properties
    get canvas() {
        return this.#canvas;
    }

    // MARK: - initialization
    constructor(canvasSelectorOrElement) {
        this.#canvas = new Canvas(canvasSelectorOrElement);
        this.#boundTick = this.#tick.bind(this);
        this.#attachDomEvents();
    }

    // MARK: - lifecycle
    start() {
        this.#assertNotDestroyed();
        if (this.isRunning() || this.isDestroying()) {
            return;
        }

        this.#isRunning = true;
        this.#isPaused = false;

        this.#lastFrameTime = performance.now();
        this.#dispatchStartEvent();
        this.#requestNextFrame();
    }

    stop() {
        this.#assertNotDestroyed();
        if (!this.isRunning()) {
            return;
        }
        this.#isRunning = false;
        this.#isPaused = false;

        this.#cancelCurrentFrame();
        this.#dispatchStopEvent();
    }

    pause() { 
        this.#assertNotDestroyed();
        if (this.isPaused() || !this.isRunning()) {
            return;
        }
        this.#isPaused = true; 
        this.#dispatchPauseEvent();
    }

    resume() {
        this.#assertNotDestroyed();
        if (!this.isPaused() || !this.isRunning()) {
            return;
        }
        this.#isPaused = false; 
        this.#dispatchResumeEvent();
    }

    destroy() {
        if (this.isDestroying() || this.isDestroyed()) {
            return;
        }
        this.#isDestroying = true;

        try {
            this.stop();
            this.#detachDomEvents();
            this.#dispatchDestroyEvent();
            this.removeAllEventListeners();
            this.#canvas.destroy();

        } catch (error) {
            this.#reportError(error);

        } finally {
            this.#canvas = null;
            this.#isDestroying = false;
        }

    }

    // MARK: - lifecycle hooks
    onStart() {}
    onStop() {}
    onPause() {}
    onResume() {}
    onUpdate(timestamp, deltaTime) {
        void timestamp;
        void deltaTime;
    }
    onDestroy() {}

    // MARK: - state queries
    isRunning() {
        return this.#isRunning;
    }

    isPaused() {
        return this.#isPaused;
    }

    isDestroying() {
        return this.#isDestroying;
    }

    isDestroyed() {
        return this.#canvas === null;
    }

    // MARK: - events 
    addEventListener(type, callback, owner=null, once=false) {
        return this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner=null) {
        return this.#eventEmitter.removeListener(type, callback, owner);
    }

    removeAllEventListeners() {
        this.#eventEmitter.removeAllListeners();
    }

    // MARK: - main loop
    #tick(timestamp) {
        try {
            const deltaTime = timestamp - this.#lastFrameTime;
            this.#lastFrameTime = timestamp;

            if (!document.hidden) {
                this.#update(timestamp, deltaTime);
                this.#draw();
            }
            
        } catch (error) {
            this.#reportError(error);

        } finally {
            this.#requestNextFrame();
        }
    }

    #update(timestamp, deltaTime) {
        if (this.isPaused()) {
            return;
        }

        try {
            this.onUpdate(timestamp, deltaTime);
        } catch (error) {
            this.#reportError(error);
        }

        try {
            this.#eventEmitter.emit(
                CanvasAppUpdateEvent, 
                new CanvasAppUpdateEvent(this, timestamp, deltaTime)
            );
        } catch (error) {
            this.#reportError(error);
        }
    }

    #draw() {
        if (!this.#canvas) { 
            return; 
        }

        try {
            this.#canvas.draw();
        } catch (error) {
            this.#reportError(error);
        }
    }

    // MARK: - event dispatching
    #safeDispatchLifecycleEvent(hook, type, event) {
        try {
            hook();
        } catch (error) {
            this.#reportError(error);
        }
        
        try {
            this.#eventEmitter.emit(type, event);
        } catch (error) {
            this.#reportError(error);
        }        
    }

    #dispatchStartEvent() {
        this.#safeDispatchLifecycleEvent( 
            () => this.onStart(),
            CanvasAppStartEvent, 
            new CanvasAppStartEvent(this)
        );
    }

    #dispatchStopEvent() {
        this.#safeDispatchLifecycleEvent( 
            () => this.onStop(),
            CanvasAppStopEvent, 
            new CanvasAppStopEvent(this)
        );
    }

    #dispatchPauseEvent() {
        this.#safeDispatchLifecycleEvent( 
            () => this.onPause(),
            CanvasAppPauseEvent, 
            new CanvasAppPauseEvent(this)
        );
    }

    #dispatchResumeEvent() {
        this.#safeDispatchLifecycleEvent( 
            () => this.onResume(),
            CanvasAppResumeEvent, 
            new CanvasAppResumeEvent(this)
        );
    }

    #dispatchDestroyEvent() {
        this.#safeDispatchLifecycleEvent( 
            () => this.onDestroy(),
            CanvasAppDestroyEvent, 
            new CanvasAppDestroyEvent(this)
        );
    }

    // MARK: - event handlers
    #onVisibilityChange() {
        if (!document.hidden) { 
            this.#lastFrameTime = performance.now();
        }
    }

    // MARK: - helpers
    #attachDomEvents() {
        if (this.#domAbortController) {
            return;
        }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };
        document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this), options);
    }

    #detachDomEvents() {
        if (!this.#domAbortController) {
            return;
        }
        this.#domAbortController.abort();
        this.#domAbortController = null;
    }

    #requestNextFrame() {
        if (this.isRunning()) {
            this.#frameId = requestAnimationFrame(this.#boundTick);
        }
    }

    #cancelCurrentFrame() {
        cancelAnimationFrame(this.#frameId);
        this.#frameId = null;
    }

    #assertNotDestroyed() {
        if (this.isDestroyed()) {
            throw new Error("This CanvasApp has been destroyed and can no longer be used.");
        }   
    }

    #reportError(error) {
        console.error(error);
    }
}
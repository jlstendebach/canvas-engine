import { EventEmitter } from "../../events/EventEmitter.js";
import { CanvasApp } from "./CanvasApp.js";
import {
    CanvasAppDestroyEvent,
    CanvasAppPauseEvent,
    CanvasAppResumeEvent,
    CanvasAppStartEvent,
    CanvasAppStopEvent,
    CanvasAppUpdateEvent
} from "./CanvasAppEvent.js";

export class ObservableCanvasApp extends CanvasApp {
    #eventEmitter = new EventEmitter();

    // MARK: - events
    addEventListener(type, callback, owner = null, once = false) {
        return this.#eventEmitter.addListener(type, callback, owner, once);
    }

    removeEventListener(type, callback, owner = null) {
        return this.#eventEmitter.removeListener(type, callback, owner);
    }

    removeAllEventListeners(type = null) {
        this.#eventEmitter.removeAllListeners(type);
    }

    // MARK: - lifecycle events
    onStart() {
        this.#eventEmitter.emit(
            CanvasAppStartEvent, 
            new CanvasAppStartEvent(this)
        );
    }

    onStop() {
        this.#eventEmitter.emit(
            CanvasAppStopEvent, 
            new CanvasAppStopEvent(this)
        );
    }

    onPause() {
        this.#eventEmitter.emit(
            CanvasAppPauseEvent, 
            new CanvasAppPauseEvent(this)
        );
    }

    onResume() {
        this.#eventEmitter.emit(
            CanvasAppResumeEvent, 
            new CanvasAppResumeEvent(this)
        );
    }

    onUpdate(timestamp, deltaTime) { 
        this.#eventEmitter.emit(
            CanvasAppUpdateEvent, 
            new CanvasAppUpdateEvent(this, timestamp, deltaTime)
        );
    }

    onDestroy() {
        try {
            this.#eventEmitter.emit(
                CanvasAppDestroyEvent, 
                new CanvasAppDestroyEvent(this)
            );
        } catch (error) {
            this.#reportError(error);
        } finally {
            this.removeAllEventListeners();
        }
    }

    // MARK: - helpers
    #reportError(error) {
        console.error(error);
    }
}

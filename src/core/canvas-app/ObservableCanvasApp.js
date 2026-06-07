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

    removeAllEventListeners() {
        this.#eventEmitter.removeAllListeners();
    }

    // MARK: - internal event extension points
    onStart() {
        this.#safeEmit(CanvasAppStartEvent, new CanvasAppStartEvent(this));
    }

    onStop() {
        this.#safeEmit(CanvasAppStopEvent, new CanvasAppStopEvent(this));
    }

    onPause() {
        this.#safeEmit(CanvasAppPauseEvent, new CanvasAppPauseEvent(this));
    }

    onResume() {
        this.#safeEmit(CanvasAppResumeEvent, new CanvasAppResumeEvent(this));
    }

    onUpdate(timestamp, deltaTime) { 
        this.#safeEmit(CanvasAppUpdateEvent, new CanvasAppUpdateEvent(this, timestamp, deltaTime));
    }

    onDestroy() {
        this.#safeEmit(CanvasAppDestroyEvent, new CanvasAppDestroyEvent(this));
        this.removeAllEventListeners();
    }

    // MARK: - helpers
    #safeEmit(type, event) {
        try {
            this.#eventEmitter.emit(type, event);
        } catch (error) {
            this.#reportError(error);
        }
    }

    #reportError(error) {
        console.error(error);
    }
}

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

    get events() {
        return this.#eventEmitter;
    }

    // MARK: - lifecycle events
    onStart() {
        this.events.emit(
            CanvasAppStartEvent, 
            new CanvasAppStartEvent(this)
        );
    }

    onStop() {
        this.events.emit(
            CanvasAppStopEvent, 
            new CanvasAppStopEvent(this)
        );
    }

    onPause() {
        this.events.emit(
            CanvasAppPauseEvent, 
            new CanvasAppPauseEvent(this)
        );
    }

    onResume() {
        this.events.emit(
            CanvasAppResumeEvent, 
            new CanvasAppResumeEvent(this)
        );
    }

    onUpdate(timestamp, deltaTime) { 
        this.events.emit(
            CanvasAppUpdateEvent, 
            new CanvasAppUpdateEvent(this, timestamp, deltaTime)
        );
    }

    onDestroy() {
        try {
            this.events.emit(
                CanvasAppDestroyEvent, 
                new CanvasAppDestroyEvent(this)
            );
        } catch (error) {
            this.#reportError(error);
        } finally {
            this.events.removeAllListeners();
        }
    }

    // MARK: - helpers
    #reportError(error) {
        console.error(error);
    }
}

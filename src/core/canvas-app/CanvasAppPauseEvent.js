import { CanvasAppEvent } from "./CanvasAppEvent.js";

export class CanvasAppPauseEvent extends CanvasAppEvent {
    constructor(app, isPaused) {
        super(app);
        this.isPaused = isPaused;
    }
}
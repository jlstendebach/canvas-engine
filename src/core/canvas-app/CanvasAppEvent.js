export class CanvasAppEvent {
    constructor(app) {
        this.app = app;
    }
}

export class CanvasAppStartEvent extends CanvasAppEvent {}
export class CanvasAppStopEvent extends CanvasAppEvent {}
export class CanvasAppPauseEvent extends CanvasAppEvent {}
export class CanvasAppResumeEvent extends CanvasAppEvent {}

export class CanvasAppUpdateEvent extends CanvasAppEvent {
    constructor(app, timestamp, deltaTime) {
        super(app);
        this.timestamp = timestamp;
        this.deltaTime = deltaTime;
    }
}

export class CanvasAppDestroyEvent extends CanvasAppEvent {}
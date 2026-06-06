export class CanvasAppEvent {
    constructor(app) {
        this.app = app;
    }
}

export class CanvasAppStartEvent extends CanvasAppEvent {}
export class CanvasAppStopEvent extends CanvasAppEvent {}
export class CanvasAppPauseEvent extends CanvasAppEvent {}
export class CanvasAppResumeEvent extends CanvasAppEvent {}
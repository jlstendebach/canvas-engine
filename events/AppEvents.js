export class AppEvent {
    constructor(app) {
        this.app = app;
    }
}

export class AppPauseEvent extends AppEvent {
    constructor(app, isPaused) {
        super(app);
        this.isPaused = isPaused;
    }
}
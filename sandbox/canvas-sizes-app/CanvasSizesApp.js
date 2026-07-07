import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,
    LineView,
    MouseEvent,
    Vec2
} from "../../src/index.js";

export class CanvasSizesApp extends CanvasApp {
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
    }

    #topLeftBall;
    #topRightBall;
    #bottomLeftBall;
    #bottomRightBall;
    #centerBall;

    #mousePath = new LineView();
    #maxMousePathLength = 100;

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 0);
        this.canvas.events.on(CanvasResizeEvent, this.onCanvasResize.bind(this));
        this.canvas.events.on(MouseEvent.MOVE, this.onCanvasMouseMove.bind(this));

        this.#topLeftBall = this.createBall({color: new Color(100, 0, 0)});
        this.#topRightBall = this.createBall({color: new Color(0, 100, 0)});
        this.#bottomRightBall = this.createBall({color: new Color(0, 0, 100)});
        this.#bottomLeftBall = this.createBall({color: new Color(100, 100, 0)});
        this.#centerBall = this.createBall({color: new Color(100, 0, 100)});

        this.#mousePath = new LineView();
        this.#mousePath.strokeStyle = new Color(200, 200, 200);
        this.#mousePath.strokeWidth = 2;
        this.canvas.addView(this.#mousePath);

        this.updateBallPositions();
    }
    
    // MARK: - event handlers
    onCanvasResize(type, event) {
        void type, event;
        this.updateBallPositions();
    }

    onCanvasMouseMove(type, event) {
        if (this.#mousePath.getPointCount() >= this.#maxMousePathLength) {
            this.#mousePath.removePoint(0);
        }
        this.#mousePath.addPointXY(event.x, event.y);
    }

    // MARK: - helpers
    updateBallPositions() {
        this.#topLeftBall.setPositionXY(50, 50);
        this.#topRightBall.setPositionXY(this.canvas.width - 50, 50);
        this.#bottomRightBall.setPositionXY(this.canvas.width - 50, this.canvas.height - 50);
        this.#bottomLeftBall.setPositionXY(50, this.canvas.height - 50);
        this.#centerBall.setPositionXY(this.canvas.width / 2, this.canvas.height / 2);
    }

    createBall({x = 0, y = 0, radius = 20, color = new Color(0, 0, 200)} = {}) {
        const ball = new CircleView({
            position: new Vec2(x, y),
            radius: radius,
            fillStyle: color,
            strokeStyle: new Color(200, 200, 200),
            strokeWidth: 1,
            isPickable: false
        });
        this.canvas.addView(ball);
        return ball;
    }

}
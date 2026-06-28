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
        this.updateBallPositions();
    }

    onCanvasMouseMove(type, event) {
        if (this.#mousePath.points.length >= this.#maxMousePathLength) {
            this.#mousePath.points.shift();
        }
        this.#mousePath.points.push(new Vec2(event.x, event.y));
    }

    // MARK: - helpers
    updateBallPositions() {
        this.#topLeftBall.position.set(50, 50);
        this.#topRightBall.position.set(this.canvas.size.width - 50, 50);
        this.#bottomRightBall.position.set(this.canvas.size.width - 50, this.canvas.size.height - 50);
        this.#bottomLeftBall.position.set(50, this.canvas.size.height - 50);
        this.#centerBall.position.set(this.canvas.size.width / 2, this.canvas.size.height / 2);
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
import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,
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

    #mouseBalls = [];
    #maxMouseBalls = 200;

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 0);
        this.canvas.addEventListener(CanvasResizeEvent, this.onCanvasResize.bind(this));
        this.canvas.addEventListener(MouseEvent.MOVE, this.onCanvasMouseMove.bind(this));

        this.#topLeftBall = this.createBall({color: new Color(100, 0, 0)});
        this.#topRightBall = this.createBall({color: new Color(0, 100, 0)});
        this.#bottomRightBall = this.createBall({color: new Color(0, 0, 100)});
        this.#bottomLeftBall = this.createBall({color: new Color(100, 100, 0)});
        this.#centerBall = this.createBall({color: new Color(100, 0, 100)});

        this.updateBallPositions();
    }
    
    // MARK: - event handlers
    onCanvasResize(type, event) {
        this.updateBallPositions();
    }

    onCanvasMouseMove(type, event) {
        let ball;
        if (this.#mouseBalls.length >= this.#maxMouseBalls) {
            ball = this.#mouseBalls.shift();
            ball.position = new Vec2(event.x, event.y);
        } else {
            ball = this.createBall({
                x: event.x, 
                y: event.y, 
                radius: 5, 
                color: new Color(200, 200, 200)
            });
        }
        this.#mouseBalls.push(ball);
    }

    // MARK: - helpers
    updateBallPositions() {
        this.#topLeftBall.position = new Vec2(50, 50);
        this.#topRightBall.position = new Vec2(this.canvas.size.width - 50, 50);
        this.#bottomRightBall.position = new Vec2(this.canvas.size.width - 50, this.canvas.size.height - 50);
        this.#bottomLeftBall.position = new Vec2(50, this.canvas.size.height - 50);
        this.#centerBall.position = new Vec2(this.canvas.size.width / 2, this.canvas.size.height / 2);
    }

    createBall({x = 0, y = 0, radius = 20, color = new Color(0, 0, 200)} = {}) {
        const ball = new CircleView(radius);
        ball.fillStyle = color;
        ball.strokeStyle = new Color(200, 200, 200);
        ball.strokeWidth = 1;
        ball.position = new Vec2(x, y);
        ball.isPickable = false;
        this.canvas.addView(ball);
        return ball;
    }

}
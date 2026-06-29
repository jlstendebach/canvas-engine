import { 
    CanvasApp, 
    CircleView, 
    Color, 
    Vec2, 
    MouseEvent,
    MouseButton, 
} from "../../src/index.js";

export class SimpleApp extends CanvasApp {
    #ball;
    #ballVelocity = new Vec2(1, 1).setLength(300); // pixels per second
    #isBallGrabbed = false;

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initBall();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initBall() {
        const ball = new CircleView({
            position: Vec2.divideScalar(this.canvas.size, 2),
            radius: 50,
            fillStyle: new Color(0, 0, 200),
            strokeStyle: new Color(100, 100, 100),
            strokeWidth: 2,
        });
        ball.events.on(MouseEvent.DOWN, this.onBallGrab, this);
        ball.events.on(MouseEvent.DRAG, this.onBallDrag, this);
        ball.events.on(MouseEvent.UP, this.onBallDrop, this);
        this.canvas.addView(ball);
        this.#ball = ball;
    }
    
    // MARK: - Events Handlers
    onBallGrab(type, event) {
        if (event.button === MouseButton.LEFT) {
            this.#isBallGrabbed = true;
            event.target.position = event.getParentXY();
        }
    }

    onBallDrag(type, event) {
        event.target.position = event.getParentXY();
    }

    onBallDrop(type, event) {
        event.target.position = event.getParentXY();
        this.#isBallGrabbed = false;
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        if (!this.#isBallGrabbed) {
            this.#ball.x += this.#ballVelocity.x * deltaTime / 1000;
            this.#ball.y += this.#ballVelocity.y * deltaTime / 1000;
            this.#keepBallInBounds();
        }
    }

    // MARK: - Helpers
    #keepBallInBounds() {
        const size = this.canvas.size;

        if (this.#ball.x - this.#ball.radius < 0) {
            this.#ball.x = this.#ball.radius;
            this.#ballVelocity.x *= -1;
        } else if (this.#ball.x + this.#ball.radius > size.x) {
            this.#ball.x = size.x - this.#ball.radius;
            this.#ballVelocity.x *= -1;
        }

        if (this.#ball.y - this.#ball.radius < 0) {
            this.#ball.y = this.#ball.radius;
            this.#ballVelocity.y *= -1;
        } else if (this.#ball.y + this.#ball.radius > size.y) {
            this.#ball.y = size.y - this.#ball.radius;
            this.#ballVelocity.y *= -1;
        }
    }

}
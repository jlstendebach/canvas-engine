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
        ball.addEventListener(MouseEvent.DOWN, this.onBallGrab, this);
        ball.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        ball.addEventListener(MouseEvent.UP, this.onBallDrop, this);
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
            this.#ball.position.x += this.#ballVelocity.x * deltaTime / 1000;
            this.#ball.position.y += this.#ballVelocity.y * deltaTime / 1000;
            this.#keepBallInBounds();
        }
    }

    // MARK: - Helpers
    #keepBallInBounds() {
        const size = this.canvas.size;

        if (this.#ball.position.x - this.#ball.radius < 0) {
            this.#ball.position.x = this.#ball.radius;
            this.#ballVelocity.x *= -1;
        } else if (this.#ball.position.x + this.#ball.radius > size.x) {
            this.#ball.position.x = size.x - this.#ball.radius;
            this.#ballVelocity.x *= -1;
        }

        if (this.#ball.position.y - this.#ball.radius < 0) {
            this.#ball.position.y = this.#ball.radius;
            this.#ballVelocity.y *= -1;
        } else if (this.#ball.position.y + this.#ball.radius > size.y) {
            this.#ball.position.y = size.y - this.#ball.radius;
            this.#ballVelocity.y *= -1;
        }
    }

}
import { App, Canvas, CircleView, Color, Vec2, MouseEvent, Timer } from "../../src/index.js";

export class BasicApp extends App {
    MAX_THROW_SPEED = 3000;
    MAX_BALL_SPEED = 500;

    mainCanvas = null;
    ball = null;
    ballVelocity = new Vec2(1, 1).setLength(this.MAX_BALL_SPEED);
    ballLastPosition = new Vec2();
    ballTimer = new Timer();
    
    constructor() {
        super();
        this.initCanvas();
        this.initBall();
    }

    initCanvas() {
        this.mainCanvas = new Canvas("main-canvas")
            .setFillStyle(new Color(0, 0, 20));
        this.canvases.push(this.mainCanvas);        
    }

    initBall() {
        const ball = new CircleView(50);
        ball.fillStyle = new Color(0, 0, 200);
        ball.strokeStyle = new Color(100, 100, 100);
        ball.strokeWidth = 2;
        ball.position = new Vec2(100, 100);
        ball.eventEmitter.on(MouseEvent.DOWN, this.onBallGrab, this);
        ball.eventEmitter.on(MouseEvent.DRAG, this.onBallDrag, this);
        ball.eventEmitter.on(MouseEvent.UP, this.onBallDrop, this);
        this.mainCanvas.addView(ball);
        this.ball = ball;
    }
    
    // MARK: - Lifecycle -------------------------------------------------------
    update(dtime) {
        this.ball.position.add(Vec2.scale(this.ballVelocity, dtime/1000.0));
        this.keepBallInBounds();
        this.ballLastPosition = this.ball.position.clone();
        this.ballTimer.start();    
    }

    // MARK: - UI Events -------------------------------------------------------
    onBallGrab(type, event) {
        console.log("Ball grabbed!");
        this.ballVelocity.set(0, 0);
        this.ball.position = event.getParentXY();
    }

    onBallDrag(type, event) {
        this.ball.position = event.getParentXY();
    }

    onBallDrop(type, event) {
        this.ballVelocity = event.getParentXY().clone()
            .subtract(this.ballLastPosition)
            .scale(1000.0/this.ballTimer.getTime())
            .clampLength(0, this.MAX_THROW_SPEED);
        this.ball.position = event.getParentXY();
    }

    // MARK: - Helpers ---------------------------------------------------------
    keepBallInBounds() {
        const scale = this.ballVelocity.length() > this.MAX_BALL_SPEED ? 0.9 : 1;
        if (this.ball.position.x - this.ball.radius < 0) {
            this.ball.position.x = this.ball.radius;
            this.ballVelocity.x *= -1*scale;
        } else if (this.ball.position.x + this.ball.radius > this.mainCanvas.getWidth()) {
            this.ball.position.x = this.mainCanvas.getWidth() - this.ball.radius;
            this.ballVelocity.x *= -1*scale;
        }

        if (this.ball.position.y - this.ball.radius < 0) {
            this.ball.position.y = this.ball.radius;
            this.ballVelocity.y *= -1*scale;
        } else if (this.ball.position.y + this.ball.radius > this.mainCanvas.getHeight()) {
            this.ball.position.y = this.mainCanvas.getHeight() - this.ball.radius;
            this.ballVelocity.y *= -1*scale;
        }
    }

}
import { 
    App, 
    Canvas, 
    CircleView, 
    Color, 
    Vec2, 
    MouseEvent, 
    Timer, 
    SceneView, 
    RectangleView 
} from "../../src/index.js";

// MARK: - BasicApp ------------------------------------------------------------
export class BasicApp extends App {
    MAX_THROW_SPEED = 3000;
    MAX_BALL_SPEED = 500;

    canvas = null;
    scene = null;
    box = null;
    ball = null;
    ballVelocity = new Vec2(1, 1).setLength(this.MAX_BALL_SPEED);
    ballLastPosition = new Vec2();
    ballTimer = new Timer();
    
    // MARK: - Initialization ---------------------------------------------------
    constructor() {
        super();
        this.initCanvas();
        this.initScene();
        this.initBall();
    }

    initCanvas() {
        const canvas = new Canvas("main-canvas");
        canvas.fillStyle = new Color(0, 0, 20);
        this.canvases.push(canvas);       
        this.canvas = canvas; 
    }

    initScene() {
        const scene = new SceneView();
        scene.eventEmitter.on(MouseEvent.WHEEL, this.onSceneZoom, this);
        scene.eventEmitter.on(MouseEvent.DRAG, this.onSceneDragged, this);
        this.canvas.addView(scene);
        this.scene = scene;

        const box = new RectangleView(this.canvas.getWidth(), this.canvas.getHeight());
        box.fillStyle = null;
        box.strokeStyle = new Color(100, 100, 100);
        box.strokeWidth = 2;
        box.isPickable = false;
        this.scene.addView(box);
        this.box = box;
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
        this.scene.addView(ball);
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
    onSceneZoom(type, event) {
        const direction = event.dy / Math.abs(event.dy);
        const factor =  1 - direction / 10;
        this.scene.zoom(event.x, event.y,factor);
    }

    onSceneDragged(type, event) {
        this.scene.translate(-event.dx, -event.dy, true);
    }

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
        const left = this.box.position.x;
        const right = this.box.position.x + this.box.size.width;
        const top = this.box.position.y;
        const bottom = this.box.position.y + this.box.size.height;

        if (this.ball.position.x - this.ball.radius < left) {
            this.ball.position.x = left + this.ball.radius;
            this.ballVelocity.x *= -1*scale;
        } else if (this.ball.position.x + this.ball.radius > right) {
            this.ball.position.x = right - this.ball.radius;
            this.ballVelocity.x *= -1*scale;
        }

        if (this.ball.position.y - this.ball.radius < top) {
            this.ball.position.y = top + this.ball.radius;
            this.ballVelocity.y *= -1*scale;
        } else if (this.ball.position.y + this.ball.radius > bottom) {
            this.ball.position.y = bottom - this.ball.radius;
            this.ballVelocity.y *= -1*scale;
        }
    }

}
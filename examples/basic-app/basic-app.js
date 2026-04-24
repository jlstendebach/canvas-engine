import { 
    App, 
    Canvas, 
    CircleView, 
    Color, 
    Vec2, 
    MouseEvent,
    MouseButton, 
} from "../../src/index.js";

// MARK: - BasicApp ------------------------------------------------------------
export class BasicApp extends App {
    MAX_THROW_SPEED = 3000;
    MAX_BALL_SPEED = 500;

    canvas = null;
    box = null;
    
    // MARK: - Initialization ---------------------------------------------------
    constructor() {
        super();
        this.initCanvas();
    }

    initCanvas() {
        const canvas = new Canvas("main-canvas");
        canvas.fillStyle = new Color(0, 0, 20);
        canvas.addEventListener(MouseEvent.DOWN, this.onCanvasClick, this);
        this.canvases.push(canvas);       
        this.canvas = canvas; 
    }
    
    // MARK: - Lifecycle -------------------------------------------------------
    update(dtime) {
    }

    // MARK: - UI Events -------------------------------------------------------
    onCanvasClick(type, event) {
        if (event.button === MouseButton.LEFT) {
            this.createBall(event.x, event.y);
        }
    }

    onBallGrab(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.position = event.getParentXY();
        } else if (event.button === MouseButton.RIGHT) {
            event.target.removeFromParent();
        }
    }

    onBallDrag(type, event) {
        event.target.position = event.getParentXY();
    }

    onBallDrop(type, event) {
        event.target.position = event.getParentXY();
    }    

    // MARK: - Helpers ---------------------------------------------------------
    createBall(x, y) {
        const ball = new CircleView(20);
        ball.fillStyle = new Color(0, 0, 200);
        ball.strokeStyle = new Color(100, 100, 100);
        ball.strokeWidth = 2;
        ball.position = new Vec2(x, y);
        ball.addEventListener(MouseEvent.DOWN, this.onBallGrab, this);
        ball.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        ball.addEventListener(MouseEvent.UP, this.onBallDrop, this);
        this.canvas.addView(ball);
    }

}
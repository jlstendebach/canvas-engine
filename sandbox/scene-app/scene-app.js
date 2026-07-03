import {
    CanvasApp,
    CircleView,
    Color,
    CoordinateSpace,
    MouseButton,
    MouseEvent,
    RectangleView,
    SceneView,
    Timer,
    Vec2
} from "../../src/index.js";

// MARK: - SceneApp ------------------------------------------------------------
export class SceneApp extends CanvasApp {
    MAX_THROW_SPEED = 3000;
    MAX_BALL_SPEED = 500;
    CORNER_RADIUS = 5;

    scene = null;
    box = null;
    boxCorner1 = null;
    boxCorner2 = null;
    ball = null;
    ballVelocity = new Vec2(1, 1).setLength(this.MAX_BALL_SPEED);
    ballLastPosition = new Vec2();
    ballTimer = new Timer();
    isBallGrabbed = false;
    isFollowingBall = false;
    
    // MARK: - Initialization
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initScene();
        this.initBox();
        this.initBall();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initScene() {
        const scene = new SceneView();
        scene.size.set(this.canvas.width, this.canvas.height);
        scene.events.on(MouseEvent.WHEEL, this.onSceneZoom, this);
        scene.events.on(MouseEvent.DRAG, this.onSceneDragged, this);
        scene.events.on(MouseEvent.DOWN, this.onSceneClicked, this);
        this.scene = this.canvas.addView(scene);
    }

    initBox() {
        const box = new RectangleView({
            position: this.canvas.getSize().scale(0.1),
            size: this.canvas.getSize().scale(0.8),
            fillStyle: new Color(0, 0, 40),
            strokeStyle: new Color(100, 100, 100),
            strokeWidth: 2,
            isPickable: false
        });
        this.box = this.scene.addView(box);

        const boxCorner1 = new CircleView({
            position: this.box.getPosition(),
            radius: this.CORNER_RADIUS,
            fillStyle: new Color(0, 200, 0),
            strokeStyle: new Color(100, 100, 100),
            strokeWidth: 2,
            isPickable: true,
        });
        boxCorner1.events.on(MouseEvent.DRAG, this.onBallDrag, this);
        this.boxCorner1 = this.canvas.addView(boxCorner1);

        const boxCorner2 = new CircleView({
            position: Vec2.add(this.box.getPosition(), this.box.getSize()),
            radius: this.CORNER_RADIUS,
            fillStyle: new Color(0, 200, 0),
            strokeStyle: new Color(100, 100, 100),
            strokeWidth: 2,
            isPickable: true,
        });
        boxCorner2.events.on(MouseEvent.DRAG, this.onBallDrag, this);
        this.boxCorner2 = this.canvas.addView(boxCorner2);        
    }

    initBall() {
        const ball = new CircleView({
            radius: 50,
            fillStyle: new Color(0, 0, 200),
            strokeStyle: new Color(100, 100, 100),
            strokeWidth: 2,
            position: new Vec2(100, 100),
            isPickable: true
        });
        ball.events.on(MouseEvent.DOWN, this.onBallGrab, this);
        ball.events.on(MouseEvent.DRAG, this.onBallDrag, this);
        ball.events.on(MouseEvent.UP, this.onBallDrop, this);
        this.ball = this.scene.addView(ball);
    }
    
    // MARK: - Lifecycle
    onUpdate(timestamp, deltaTime) {
        const timeScale = deltaTime/1000.0;

        if (this.isBallGrabbed == false) {
            const acceleration = new Vec2(0, 2000.0)
                .rotate(-this.scene.rotation)
                .scale(timeScale);
            this.ballVelocity.add(acceleration);
            const velocity = this.ballVelocity.clone()
                .scale(timeScale);
            this.ball.x += velocity.x;
            this.ball.y += velocity.y;
        }       

        this.keepBallInBounds();
        this.ballLastPosition = this.ball.getPosition();
        this.ballTimer.start();    

        if (this.isFollowingBall && this.isBallGrabbed == false) {
            this.scene.centerOn(this.ball.getPosition(), CoordinateSpace.CHILD);
        }

        this.positionBoxCorners();
    }

    // MARK: - UI Events
    onSceneZoom(type, event) {
        if (event.dy === 0) {
            return;
        }
        const direction = event.dy / Math.abs(event.dy);
        const factor =  1 - direction / 20;
        this.scene.zoom(factor, new Vec2(event.x, event.y));
    }

    onSceneDragged(type, event) {
        try {
            if (event.button == MouseButton.LEFT) {
                this.scene.translate(new Vec2(event.dx, event.dy));

            } else if (event.button == MouseButton.RIGHT) {
                const childSpaceAnchor = this.box.getPosition().add(this.box.getSize().divideScalar(2));
                const localSpaceAnchor = this.isFollowingBall
                    ? this.canvas.getSize().divideScalar(2)
                    : this.scene.childToLocal(childSpaceAnchor);

                const lastPosition = new Vec2(event.x - event.dx, event.y - event.dy).subtract(localSpaceAnchor);
                const currentPosition = new Vec2(event.x, event.y).subtract(localSpaceAnchor);
                const rotation = lastPosition.angleTau(currentPosition);

                this.scene.rotate(rotation, localSpaceAnchor);
            }
        } catch (error) {
            console.error("Error handling scene drag:", error);
        }
    }

    onSceneClicked(type, event) {
        if (event.button == MouseButton.MIDDLE) {
            this.isFollowingBall = !this.isFollowingBall;
        }
    }

    onBallGrab(type, event) {
        if (event.target == this.ball) {
            this.ballVelocity.set(0, 0);
            this.isBallGrabbed = true;
        }
        event.target.setPosition(event.getParentXY());
    }

    onBallDrag(type, event) {
        event.target.setPosition(event.getParentXY());

        if (event.target == this.boxCorner1) {
            this.box.setPosition(this.scene.localToChild(this.boxCorner1.getPosition()));
            this.box.setSize(this.scene.localToChild(this.boxCorner2.getPosition()).subtract(this.box.getPosition()));
        } else if (event.target == this.boxCorner2) {
            this.box.setSize(this.scene.localToChild(this.boxCorner2.getPosition()).subtract(this.box.getPosition()));
        }
    }

    onBallDrop(type, event) {
        if (event.target == this.ball) {
            this.ballVelocity = event.getParentXY().clone()
                .subtract(this.ballLastPosition)
                .scale(1000.0/this.ballTimer.getTime())
                .clampLength(0, this.MAX_THROW_SPEED);
            this.isBallGrabbed = false;
        }
        event.target.setPosition(event.getParentXY());
    }

    // MARK: - Helpers
    keepBallInBounds() {
        const scale = 0.90;
        const friction = 0.995;
        const left = this.box.x;
        const right = this.box.x + this.box.width;
        const top = this.box.y;
        const bottom = this.box.y + this.box.height;

        if (this.ball.x - this.ball.radius < left) {
            this.ball.x = left + this.ball.radius;
            this.ballVelocity.x *= -1*scale;
            this.ballVelocity.y *= friction;
        } else if (this.ball.x + this.ball.radius > right) {
            this.ball.x = right - this.ball.radius;
            this.ballVelocity.x *= -1*scale;
            this.ballVelocity.y *= friction;
        }

        if (this.ball.y - this.ball.radius < top) {
            this.ball.y = top + this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1*scale;
        } else if (this.ball.y + this.ball.radius > bottom) {
            this.ball.y = bottom - this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1*scale;
        }
    }

    positionBoxCorners() {
        this.boxCorner1.setPosition(this.scene.childToLocal(this.box.getPosition()));
        this.boxCorner2.setPosition(this.scene.childToLocal(this.box.getPosition().add(this.box.getSize())));
    }

}
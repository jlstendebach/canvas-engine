import {
    Canvas,
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
    
    // MARK: - Initialization ---------------------------------------------------
    onStart() {
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
        //scene.position = new Vec2(50, 50);
        scene.size.set(this.canvas.getWidth(), this.canvas.getHeight());
        //scene.clip = true;
        scene.addEventListener(MouseEvent.WHEEL, this.onSceneZoom, this);
        scene.addEventListener(MouseEvent.DRAG, this.onSceneDragged, this);
        scene.addEventListener(MouseEvent.DOWN, this.onSceneClicked, this);
        this.scene = this.canvas.addView(scene);
    }

    initBox() {
        const box = new RectangleView(this.canvas.getWidth(), this.canvas.getHeight());
        box.fillStyle = new Color(0, 0, 40);
        box.strokeStyle = new Color(100, 100, 100);
        box.strokeWidth = 2;
        box.isPickable = false;
        this.box = this.scene.addView(box);

        const boxCorner1 = new CircleView(this.CORNER_RADIUS);
        boxCorner1.fillStyle = new Color(0, 200, 0);
        boxCorner1.strokeStyle = new Color(100, 100, 100);
        boxCorner1.strokeWidth = 2;
        boxCorner1.position = this.box.position.clone();
        boxCorner1.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        this.boxCorner1 = this.canvas.addView(boxCorner1);

        const boxCorner2 = new CircleView(this.CORNER_RADIUS);
        boxCorner2.fillStyle = new Color(0, 200, 0);
        boxCorner2.strokeStyle = new Color(100, 100, 100);
        boxCorner2.strokeWidth = 2;
        boxCorner2.position = Vec2.add(this.box.position, this.box.size);
        boxCorner2.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        this.boxCorner2 = this.canvas.addView(boxCorner2);        
    }

    initBall() {
        const ball = new CircleView(50);
        ball.fillStyle = new Color(0, 0, 200);
        ball.strokeStyle = new Color(100, 100, 100);
        ball.strokeWidth = 2;
        ball.position = new Vec2(100, 100);
        ball.addEventListener(MouseEvent.DOWN, this.onBallGrab, this);
        ball.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        ball.addEventListener(MouseEvent.UP, this.onBallDrop, this);
        this.ball = this.scene.addView(ball);
    }
    
    // MARK: - Lifecycle -------------------------------------------------------
    onUpdate(dtime) {
        const timeScale = dtime/1000.0;

        if (this.isBallGrabbed == false) {
            const acceleration = new Vec2(0, 2000.0)
                .rotate(-this.scene.rotation)
                .scale(timeScale);
            this.ballVelocity.add(acceleration);
            const velocity = this.ballVelocity.clone()
                .scale(timeScale);
            this.ball.position.add(velocity);
        }       

        this.keepBallInBounds();
        this.ballLastPosition = this.ball.position.clone();
        this.ballTimer.start();    

        if (this.isFollowingBall && this.isBallGrabbed == false) {
            this.scene.centerOn(this.ball.position, CoordinateSpace.CHILD);
        }

        this.positionBoxCorners();
    }

    // MARK: - UI Events -------------------------------------------------------
    onSceneZoom(type, event) {
        const direction = event.dy / Math.abs(event.dy);
        const factor =  1 - direction / 20;
        this.scene.zoom(factor, new Vec2(event.x, event.y));
    }

    onSceneDragged(type, event) {
        try {
            if (event.button == MouseButton.LEFT) {
                this.scene.translate(new Vec2(event.dx, event.dy));

            } else if (event.button == MouseButton.RIGHT) {
                const childSpaceAnchor = this.box.position.clone().add(this.box.size.clone().divideScalar(2));
                const localSpaceAnchor = this.isFollowingBall
                    ? this.canvas.getSize().clone().divideScalar(2)
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
        event.target.position = event.getParentXY();
    }

    onBallDrag(type, event) {
        event.target.position = event.getParentXY();

        if (event.target == this.boxCorner1) {
            this.box.position = this.scene.localToChild(this.boxCorner1.position);
            this.box.size = this.scene.localToChild(this.boxCorner2.position).subtract(this.box.position);
        } else if (event.target == this.boxCorner2) {
            this.box.size = this.scene.localToChild(this.boxCorner2.position).subtract(this.box.position);
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
        event.target.position = event.getParentXY();
    }

    // MARK: - Helpers ---------------------------------------------------------
    keepBallInBounds() {
        const scale = 0.90;
        const friction = 0.995;
        const left = this.box.position.x;
        const right = this.box.position.x + this.box.size.width;
        const top = this.box.position.y;
        const bottom = this.box.position.y + this.box.size.height;

        if (this.ball.position.x - this.ball.radius < left) {
            this.ball.position.x = left + this.ball.radius;
            this.ballVelocity.x *= -1*scale;
            this.ballVelocity.y *= friction;
        } else if (this.ball.position.x + this.ball.radius > right) {
            this.ball.position.x = right - this.ball.radius;
            this.ballVelocity.x *= -1*scale;
            this.ballVelocity.y *= friction;
        }

        if (this.ball.position.y - this.ball.radius < top) {
            this.ball.position.y = top + this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1*scale;
        } else if (this.ball.position.y + this.ball.radius > bottom) {
            this.ball.position.y = bottom - this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1*scale;
        }
    }

    positionBoxCorners() {
        this.boxCorner1.position = this.scene.childToLocal(this.box.position);
        this.boxCorner2.position = this.scene.childToLocal(this.box.position.clone().add(this.box.size));
    }

}
import {
    CanvasApp,
    CanvasResizeEvent,
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

    pivotBall = null;


    // -------------------------------------------------------------------------
    // MARK: - Initialization
    // -------------------------------------------------------------------------

    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initScene();
        this.initBox();
        this.initBall();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
        this.canvas.events.on(CanvasResizeEvent, this.onCanvasResize.bind(this));
    }

    initScene() {
        const scene = new SceneView(this.canvas.width, this.canvas.height)
            .addToParent(this.canvas);
        scene.events.on(MouseEvent.WHEEL, this.onSceneZoom, this);
        scene.events.on(MouseEvent.DRAG, this.onSceneDrag, this);
        scene.events.on(MouseEvent.DOWN, this.onSceneClick, this);

        this.scene = scene;
    }

    initBox() {
        this.box = new RectangleView()
            .setPosition(this.canvas.getSize().scale(0.1))
            .setSize(this.canvas.getSize().scale(0.8))
            .setFillStyle(new Color(0, 0, 40))
            .setStrokeStyle(new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPickable(true)
            .addToParent(this.scene);
        this.box.events.on(MouseEvent.WHEEL, this.onBoxZoom, this);
        this.box.events.on(MouseEvent.DRAG, this.onBoxDrag, this);
        this.box.events.on(MouseEvent.DOWN, this.onBoxClick, this);

        this.boxCorner1 = new CircleView()
            .setPosition(this.box.getPosition())
            .setRadius(this.CORNER_RADIUS)
            .setFillStyle(new Color(0, 200, 0))
            .setStrokeStyle(new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPickable(true)
            .addToParent(this.canvas);
        this.boxCorner1.events.on(MouseEvent.DRAG, this.onBallDrag, this);

        this.boxCorner2 = new CircleView()
            .setPosition(this.box.getPosition().add(this.box.getSize()))
            .setRadius(this.CORNER_RADIUS)
            .setFillStyle(new Color(0, 200, 0))
            .setStrokeStyle(new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPickable(true)
            .addToParent(this.canvas);
        this.boxCorner2.events.on(MouseEvent.DRAG, this.onBallDrag, this);

        this.pivotBall = new CircleView()
            .setRadius(5)
            .setFillStyle(new Color(200, 0, 0))
            .setStrokeStyle(new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPickable(false)
            .addToParent(this.canvas);
    }

    initBall() {
        this.ball = new CircleView()
            .setPositionXY(100, 100)
            .setRadius(50)
            .setFillStyle(new Color(0, 0, 200))
            .setStrokeStyle(new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPickable(true)
            .addToParent(this.scene);
        this.ball.events.on(MouseEvent.DOWN, this.onBallGrab, this);
        this.ball.events.on(MouseEvent.DRAG, this.onBallDrag, this);
        this.ball.events.on(MouseEvent.UP, this.onBallDrop, this);
    }

    // -------------------------------------------------------------------------
    // MARK: - Lifecycle
    // -------------------------------------------------------------------------

    onUpdate(timestamp, deltaTime) {
        const timeScale = deltaTime / 1000.0;

        if (this.isBallGrabbed == false) {
            const acceleration = new Vec2(0, 1);
            this.scene.parentToLocalVector(acceleration, acceleration);
            this.scene.content.parentToLocalVector(acceleration, acceleration);
            acceleration.setLength(2000 * timeScale);

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
            this.scene.centerOn(this.ball.x, this.ball.y, CoordinateSpace.CONTENT);
        }

        this.positionBoxCorners();
        this.positionPivotBall();
    }

    // -------------------------------------------------------------------------
    // MARK: - Canvas Events
    // -------------------------------------------------------------------------

    onCanvasResize(type, event) {
        void type, event;
        this.scene.setSizeWH(this.canvas.width, this.canvas.height);
    }

    // -------------------------------------------------------------------------
    // MARK: - Scene Events
    // -------------------------------------------------------------------------

    onSceneZoom(type, event) {
        if (event.wheelY === 0) { return; }
        const direction = Math.sign(event.wheelY);
        const factor = 1 - direction / 20;
        this.scene.scaleAround(factor, event.x, event.y, CoordinateSpace.LOCAL);
    }

    onSceneDrag(type, event) {
        try {
            if (event.button == MouseButton.LEFT) {
                this.scene.translateContent(event.movementX, event.movementY, CoordinateSpace.LOCAL);

            } else if (event.button == MouseButton.RIGHT) {
                const boxCenter = new Vec2(this.box.bounds.centerX, this.box.bounds.centerY);
                const sceneAnchor = this.isFollowingBall
                    ? this.canvas.getSize().divideScalar(2)
                    : this.box.toAncestorPoint(this.scene, boxCenter, boxCenter);

                const p1 = new Vec2(
                    event.x - event.movementX - sceneAnchor.x,
                    event.y - event.movementY - sceneAnchor.y
                );
                const p2 = new Vec2(
                    event.x - sceneAnchor.x,
                    event.y - sceneAnchor.y
                );
                const rotation = p1.angle(p2);

                this.scene.rotateAround(rotation, sceneAnchor.x, sceneAnchor.y, CoordinateSpace.LOCAL);
            }
        } catch (error) {
            console.error("Error handling scene drag:", error);
        }
    }

    onSceneClick(type, event) {
        if (event.button == MouseButton.MIDDLE) {
            this.isFollowingBall = !this.isFollowingBall;
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Box Events
    // Box events arent necessary, but they are included to demonstrate how to 
    // handle events on child views within the scene.
    // -------------------------------------------------------------------------

    onBoxZoom(type, event) {
        if (event.wheelY === 0) { return; }
        const direction = Math.sign(event.wheelY);
        const factor = 1 - direction / 20;
        this.scene.scaleAround(factor, event.parentX, event.parentY, CoordinateSpace.CONTENT);
    }

    onBoxDrag(type, event) {
        try {
            if (event.button == MouseButton.LEFT) {
                this.scene.translateContent(event.movementX, event.movementY, CoordinateSpace.CONTENT);

            } else if (event.button == MouseButton.RIGHT) {
                const boxCenter = new Vec2(this.box.bounds.centerX, this.box.bounds.centerY);
                const sceneAnchor = this.isFollowingBall
                    ? this.ball.getPosition()
                    : this.box.toAncestorPoint(this.scene.content, boxCenter, boxCenter);

                const p1 = new Vec2(
                    event.parentX - event.parentMovementX - sceneAnchor.x,
                    event.parentY - event.parentMovementY - sceneAnchor.y
                );
                const p2 = new Vec2(
                    event.parentX - sceneAnchor.x,
                    event.parentY - sceneAnchor.y
                );
                const rotation = p1.angle(p2);

                this.scene.rotateAround(rotation, sceneAnchor.x, sceneAnchor.y, CoordinateSpace.CONTENT);
            }

        } catch (error) {
            console.error("Error handling box drag:", error);
        }
    }

    onBoxClick(type, event) {
        if (event.button == MouseButton.MIDDLE) {
            this.isFollowingBall = !this.isFollowingBall;
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Ball Events
    // -------------------------------------------------------------------------

    onBallGrab(type, event) {
        if (event.target == this.ball) {
            this.ballVelocity.set(0, 0);
            this.isBallGrabbed = true;
        }
        event.target.x = event.parentX;
        event.target.y = event.parentY;
    }

    onBallDrag(type, event) {
        event.target.x = event.parentX;
        event.target.y = event.parentY;

        if (event.target == this.boxCorner1) {
            const newPosition = this.scene.content.parentToLocalPoint(this.boxCorner1.getPosition());
            const newSize = this.scene.content.parentToLocalPoint(this.boxCorner2.getPosition()).subtract(newPosition);

            this.box.setPosition(newPosition);
            this.box.setSizeWH(newSize.x, newSize.y);

        } else if (event.target == this.boxCorner2) {
            const newSize = this.scene.content.parentToLocalPoint(this.boxCorner2.getPosition()).subtract(this.box.getPosition());
            this.box.setSizeWH(newSize.x, newSize.y);
        }
    }

    onBallDrop(type, event) {
        if (event.target == this.ball) {
            this.ballVelocity = new Vec2(event.parentX, event.parentY)
                .subtract(this.ballLastPosition)
                .scale(1000.0 / this.ballTimer.getTime())
                .clampLength(0, this.MAX_THROW_SPEED);
            this.isBallGrabbed = false;
        }
        event.target.x = event.parentX;
        event.target.y = event.parentY;
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    keepBallInBounds() {
        const scale = 0.90;
        const friction = 0.995;
        const left = this.box.x;
        const right = this.box.x + this.box.width;
        const top = this.box.y;
        const bottom = this.box.y + this.box.height;

        if (this.ball.x - this.ball.radius < left) {
            this.ball.x = left + this.ball.radius;
            this.ballVelocity.x *= -1 * scale;
            this.ballVelocity.y *= friction;
        } else if (this.ball.x + this.ball.radius > right) {
            this.ball.x = right - this.ball.radius;
            this.ballVelocity.x *= -1 * scale;
            this.ballVelocity.y *= friction;
        }

        if (this.ball.y - this.ball.radius < top) {
            this.ball.y = top + this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1 * scale;
        } else if (this.ball.y + this.ball.radius > bottom) {
            this.ball.y = bottom - this.ball.radius;
            this.ballVelocity.x *= friction;
            this.ballVelocity.y *= -1 * scale;
        }
    }

    positionBoxCorners() {
        const corner1 = this.box.getPosition();
        const corner2 = this.box.getPosition().add(this.box.getSize());

        this.scene.content.toAncestorPoint(this.boxCorner1.parent, corner1, corner1);
        this.scene.content.toAncestorPoint(this.boxCorner2.parent, corner2, corner2);

        this.boxCorner1.setPosition(corner1);
        this.boxCorner2.setPosition(corner2);
    }

    positionPivotBall() {
        const boxCenter = new Vec2(this.box.bounds.centerX, this.box.bounds.centerY);     
        this.box.toAncestorPoint(this.pivotBall.parent, boxCenter, boxCenter);

        const position = this.isFollowingBall
            ? this.canvas.getSize().divideScalar(2)
            : boxCenter;
        this.pivotBall.setPosition(position);        
    }

}
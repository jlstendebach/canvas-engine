import {
    CanvasApp,
    CanvasResizeEvent,
    Color,
    CoordinateSpace,
    ImageManager,
    ImageView,
    Keyboard,
    KeyboardEvent,
    MouseButton,
    MouseEvent,
    RectangleView,
    SceneView,
    Timer,
    Vec2
} from "../../src/index.js";

const Direction = Object.freeze({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
});

export class ImageApp extends CanvasApp {
    #MOVE_SPEED = 200;

    #STRIDE = 64;
    #SOURCE_W = 56;
    #SOURCE_H = 50;
    #START_X = (this.#STRIDE - this.#SOURCE_W) / 2;
    #START_Y = (this.#STRIDE - this.#SOURCE_H) / 2;

    #scene = null;

    #linkView = null;
    #velocity = new Vec2();
    #runTimer = new Timer();
    #isRunning = false;
    #direction = Direction.DOWN;

    #isFollowing = true;

    #spriteSheetView = null;
    #sourceRectView = null;

    #imageManager = new ImageManager();

    // MARK: - Initialization 
    async loadAssets() {
        try {
            await this.#imageManager.loadAll([
                { path: "assets/link-sprites.png", alias: "link" },
            ]);
        } catch (error) {
            console.error("Error loading assets:", error);
        }
    }

    init() {
        this.initCanvas();
        this.initScene();
        this.initLinkView();
        this.initSpriteSheetView();
        this.initKeyboard();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
        this.canvas.events.on(CanvasResizeEvent, this.onCanvasResize, this);
    }

    initScene() {
        this.#scene = new SceneView(this.canvas.width, this.canvas.height)
            .scaleContent(5)
            .addToParent(this.canvas);
        this.#scene.events.on(MouseEvent.DRAG, (type, event) => {
            this.#scene.translateContent(event.movementX, event.movementY);
        });
        this.#scene.events.on(MouseEvent.WHEEL, (type, event) => {
            if (event.wheelY === 0) { return; }
            const direction = Math.sign(event.wheelY);
            const factor = 1 - direction / 20;
            this.#scene.scaleAround(factor, event.x, event.y);
        });
        this.#scene.events.on(MouseEvent.DOWN, (type, event) => {
            if (event.button === MouseButton.MIDDLE) {
                this.#isFollowing = !this.#isFollowing;
            }
        });
    }

    initLinkView() {
        this.#linkView = new ImageView(this.#imageManager.get("link"))
            .setPositionXY(this.#scene.width / 2, this.#scene.height / 2)
            .setSourceSizeWH(this.#SOURCE_W, this.#SOURCE_H)
            .setPickable(false)
            .addToParent(this.#scene);
        this.#linkView.setPivotXY(this.#linkView.width / 2, this.#linkView.height / 2);
    }

    initSpriteSheetView() {
        const image = this.#imageManager.get("link");
        this.#spriteSheetView = new ImageView(image)
            .addToParent(this.canvas);

        this.#sourceRectView = new RectangleView()
            .setFillStyle(null)
            .setStrokeStyle(new Color(255, 0, 0))
            .setStrokeWidth(2)
            .addToParent(this.#spriteSheetView);
    }


    initKeyboard() {
        Keyboard.events.on(KeyboardEvent.DOWN, this.onKeyDown, this);
        Keyboard.events.on(KeyboardEvent.UP, this.onKeyUp, this);
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        const timeScale = deltaTime / 1000;

        if (this.#velocity.isNotZero()) {
            const velocity = this.#velocity.clone().setLength(this.#MOVE_SPEED);
            this.#linkView.x += velocity.x * timeScale;
            this.#linkView.y += velocity.y * timeScale;
        }

        this.updateAnimation();
        this.updateSourceRectView();

        if (this.#isFollowing) {
            this.#scene.centerOn(this.#linkView.x, this.#linkView.y, CoordinateSpace.CONTENT);
        }
    }

    // MARK: - Events
    onKeyDown(type, event) {
        switch (event.code) {
            case "KeyW":
                this.#velocity.y -= 1;
                break;
            case "KeyA":
                this.#velocity.x -= 1;
                break;
            case "KeyS":
                this.#velocity.y += 1;
                break;
            case "KeyD":
                this.#velocity.x += 1;
                break;
        }

        if (!this.#isRunning) {
            this.updateDirection();
        }
        this.updateRunning();
    }

    onKeyUp(type, event) {
        switch (event.code) {
            case "KeyW":
                this.#velocity.y += 1;
                break;
            case "KeyA":
                this.#velocity.x += 1;
                break;
            case "KeyS":
                this.#velocity.y -= 1;
                break;
            case "KeyD":
                this.#velocity.x -= 1;
                break;
        }

        this.updateDirection();
        this.updateRunning();
    }

    onCanvasResize(type, event) {
        this.#scene.setSizeWH(event.width, event.height);
    }

    // MARK: - Helpers
    updateAnimation() {
        const sy = this.#START_Y + this.#STRIDE * this.#direction;

        if (this.#isRunning) {
            const time = this.#runTimer.getTime();
            const index = 1 + Math.floor(time / 100) % 10
            const sx = this.#START_X + this.#STRIDE * index;
            this.#linkView.setSourcePositionXY(sx, sy);

        } else {
            const sx = this.#START_X + this.#STRIDE * 0;
            this.#linkView.setSourcePositionXY(sx, sy);
        }
    }

    updateDirection() {
        if (this.#velocity.y < 0) {
            this.#direction = Direction.UP;

        } else if (this.#velocity.x > 0) {
            this.#direction = Direction.RIGHT;

        } else if (this.#velocity.y > 0) {
            this.#direction = Direction.DOWN;

        } else if (this.#velocity.x < 0) {
            this.#direction = Direction.LEFT;
        }
    }

    updateRunning() {
        const isVelocityZero = this.#velocity.isZero();

        if (isVelocityZero && this.#isRunning) {
            this.#isRunning = false;

        } else if (!isVelocityZero && !this.#isRunning) {
            this.#isRunning = true;
            this.#runTimer.start();
        }
    }

    updateSourceRectView() {
        this.#sourceRectView.setPositionXY(this.#linkView.sourceX, this.#linkView.sourceY);
        this.#sourceRectView.setSizeWH(this.#linkView.sourceWidth, this.#linkView.sourceHeight);
    }
}

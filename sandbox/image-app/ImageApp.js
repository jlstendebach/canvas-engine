import {
    AssetManager,
    CanvasApp,
    Color,
    CoordinateSpace,
    ImageView,
    Keyboard,
    KeyboardEvent,
    MouseButton,
    MouseEvent,
    SceneView,
    Timer,
    Vec2
} from "../../src/index.js";

export class ImageApp extends CanvasApp {
    static MOVE_SPEED = 200;

    static async loadAssets() {
        try {
            await AssetManager.loadImages([
                { path: "assets/link-idle-down.png", alias: "link-idle-down" },
                { path: "assets/link-run-down-01.png", alias: "link-run-down-01" },
                { path: "assets/link-run-down-02.png", alias: "link-run-down-02" },
                { path: "assets/link-run-down-03.png", alias: "link-run-down-03" },
                { path: "assets/link-run-down-04.png", alias: "link-run-down-04" },
                { path: "assets/link-run-down-05.png", alias: "link-run-down-05" },
                { path: "assets/link-run-down-06.png", alias: "link-run-down-06" },
                { path: "assets/link-run-down-07.png", alias: "link-run-down-07" },
                { path: "assets/link-run-down-08.png", alias: "link-run-down-08" },
                { path: "assets/link-run-down-09.png", alias: "link-run-down-09" },
                { path: "assets/link-run-down-10.png", alias: "link-run-down-10" },
            ]);
        } catch (error) {
            console.error("Error loading assets:", error);
        }
    }

    #scene = null;

    #imageView = null;
    #velocity = new Vec2();

    #runTimer = new Timer();
    #isRunning = false;
    #isFollowing = false;

    #runDownFrames = [
        AssetManager.get("link-run-down-01"),
        AssetManager.get("link-run-down-02"),
        AssetManager.get("link-run-down-03"),
        AssetManager.get("link-run-down-04"),
        AssetManager.get("link-run-down-05"),
        AssetManager.get("link-run-down-06"),
        AssetManager.get("link-run-down-07"),
        AssetManager.get("link-run-down-08"),
        AssetManager.get("link-run-down-09"),
        AssetManager.get("link-run-down-10"),
    ];

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initScene();
        this.initImageView();
        this.initKeyboard();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initScene() {
        this.#scene = new SceneView(this.canvas.width, this.canvas.height)
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

    initImageView() {
        this.#imageView = new ImageView(AssetManager.get("link-idle-down"))
            .setPositionXY(this.#scene.width / 2, this.#scene.height / 2)
            .setPickable(false)
            .addToParent(this.#scene);
        this.#imageView.setPivotXY(this.#imageView.width / 2, this.#imageView.height / 2);
    }

    initKeyboard() {
        Keyboard.events.on(KeyboardEvent.DOWN, this.onKeyDown, this);
        Keyboard.events.on(KeyboardEvent.UP, this.onKeyUp, this);
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        const timeScale = deltaTime / 1000;

        if (this.#isRunning) {
            if (this.#velocity.isNotZero()) {
                const velocity = this.#velocity.clone().setLength(ImageApp.MOVE_SPEED);
                this.#imageView.x += velocity.x * timeScale;
                this.#imageView.y += velocity.y * timeScale;
            }

            const time = this.#runTimer.getTime();
            const frameIndex = Math.floor(time / 100) % 10;
            this.#imageView.setImage(this.#runDownFrames[frameIndex]);
        }

        if (this.#isFollowing) {
            this.#scene.centerOn(this.#imageView.x, this.#imageView.y, CoordinateSpace.CONTENT);
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

        if (this.#velocity.isNotZero()) {
            this.#runTimer.start();
            this.#isRunning = true;
        } else {
            this.#isRunning = false;
            this.#imageView.setImage(AssetManager.get("link-idle-down"));
        }
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

        if (this.#velocity.isNotZero()) {
            this.#runTimer.start();
            this.#isRunning = true;
        } else {
            this.#isRunning = false;
            this.#imageView.setImage(AssetManager.get("link-idle-down"));
        }
    }

    // MARK: - Helpers 
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Optional: prevents CORS canvas tainting
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(new Error(`Failed to load image at ${src}`));
            img.src = src;
        });
    }

}

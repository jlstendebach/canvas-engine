import {
    CanvasApp,
    Color,
    ImageView,
} from "../../src/index.js";

export class ImageApp extends CanvasApp {
    #imageView = null;

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initImageView();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
    }

    // MARK: - Image View
    async initImageView() {
        const image = await this.loadImage("assets/link-down.png");
        this.#imageView = new ImageView(image)
            .addToParent(this.canvas);
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

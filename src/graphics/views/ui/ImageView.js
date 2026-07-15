import { View } from "../core/View.js";

export class AssetManager {
    static #images = new Map();
    static #aliases = new Map();

    static async loadImage(path, alias = null) {
        if (AssetManager.#images.has(path)) {
            return AssetManager.#images.get(path);
        }

        const image = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous'; // Optional: prevents CORS canvas tainting
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(new Error(`Failed to load image at ${path}`));
            image.src = path;
        });

        AssetManager.#images.set(path, image);
        if (alias) {
            AssetManager.#aliases.set(alias, path);
        }
    }

    static async loadImages(imagePaths) {
        const loadPromises = imagePaths.map(({ path, alias }) => AssetManager.loadImage(path, alias));
        await Promise.all(loadPromises);
    }

    static get(aliasOrPath) {
        const path = AssetManager.#aliases.get(aliasOrPath) ?? aliasOrPath;
        return AssetManager.#images.get(path);
    }
}

export class ImageView extends View {
    #image = new Image();

    // MARK: - Accessors
    get width() {
        return this.#image.naturalWidth;
    }

    get height() {
        return this.#image.naturalHeight;
    }

    // MARK: - Initialization
    constructor(image, options = {}) {
        super(options);
        this.setImage(image);
    }

    // MARK: - Image
    setImage(image) {
        this.#image = image;
        return this;
    }

    // MARK: - Bounds
    updateBounds(out) {
        out.set(0, 0, this.width, this.height);
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }

    // MARK: - Drawing
    onDraw(context) {
        context.drawImage(
            this.#image, 
            0,
            0
        );
    }

}
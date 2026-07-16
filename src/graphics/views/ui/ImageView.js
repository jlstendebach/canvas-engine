import { View } from "../core/View.js";



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
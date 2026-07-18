import { Point } from "../../utils/Point.js";
import { Size } from "../../utils/Size.js";
import { View } from "../core/View.js";

export class ImageView extends View {
    #image = null;
    #sourceX = 0;
    #sourceY = 0;
    #sourceWidth = 0;
    #sourceHeight = 0;

    // MARK: - Accessors
    get width() {
        return this.#sourceWidth;
    }

    get height() {
        return this.#sourceHeight;
    }

    get sourceX() {
        return this.#sourceX;
    }
    set sourceX(value) {
        this.#sourceX = value;
    }

    get sourceY() {
        return this.#sourceY;
    }
    set sourceY(value) {
        this.#sourceY = value;
    }

    get sourceWidth() {
        return this.#sourceWidth;
    }
    set sourceWidth(value) {
        this.#sourceWidth = value;
    }

    get sourceHeight() {
        return this.#sourceHeight;
    }
    set sourceHeight(value) {
        this.#sourceHeight = value;
    }
    
    // MARK: - Initialization
    constructor(image, options = {}) {
        super(options);
        this.setImage(image);
    }

    // MARK: - Image
    setImage(image, resetSourceRect = true) {
        this.#image = image;
        if (resetSourceRect) {
            this.#sourceX = 0;
            this.#sourceY = 0;
            this.#sourceWidth = image?.naturalWidth ?? 0;
            this.#sourceHeight = image?.naturalHeight ?? 0;
        }
        return this;
    }

    // MARK: - Size
    getSize(out = new Size()) {
        return out.set(this.width, this.height);
    }

    // MARK: - Source Position
    getSourcePosition(out = new Point()) {
        return out.set(this.#sourceX, this.#sourceY);
    }

    setSourcePositionXY(x, y) {
        this.#sourceX = x;
        this.#sourceY = y;
        return this;
    }

    setSourcePosition(point) {
        return this.setSourcePositionXY(point.x, point.y);
    }

    setSourceX(x) {
        this.#sourceX = x;
        return this;
    }

    setSourceY(y) {
        this.#sourceY = y;
        return this;
    }

    // MARK: - Source Size
    getSourceSize(out = new Size()) {
        return out.set(this.#sourceWidth, this.#sourceHeight);
    }

    setSourceSizeWH(width, height) {
        this.#sourceWidth = width;
        this.#sourceHeight = height;
        return this;
    }
    
    setSourceSize(size) {
        return this.setSourceSizeWH(size.width, size.height);
    }

    setSourceWidth(width) {
        this.#sourceWidth = width;
        return this;
    }

    setSourceHeight(height) {
        this.#sourceHeight = height;
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
        if (!this.#image) { return; }
        context.drawImage(
            this.#image,
            this.#sourceX,
            this.#sourceY,
            this.#sourceWidth,
            this.#sourceHeight,
            0,          // destination x
            0,          // destination y
            this.width, // destination width
            this.height // destination height
        );
    }

}
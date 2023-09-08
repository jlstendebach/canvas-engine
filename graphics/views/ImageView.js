import { View } from "./View.js"
import { Vec2 } from "../../math/index.js"

export class ImageView extends View {
    image = new Image();

    sourcePosition = new Vec2();
    sourceSize = new Vec2();

    position = new Vec2();
    size = new Vec2();

    #imageLoadListener = null;
    
    // --[ constructor ]--------------------------------------------------------
    constructor() {
        super();
        this.#imageLoadListener = this.onImageLoad.bind(this);
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return (
            x >= this.position.x &&
            x < this.position.x + this.size.x &&
            y >= this.position.y &&
            y < this.position.y + this.size.y
        );
    }

    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }
    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }
    setPosition(position) { this.position = position; }
    getPosition() { return this.position; }

    setWidth(w) { this.size.x = w; }
    getWidth() { return this.size.x; }
    setHeight(h) { this.size.y = h; }
    getHeight() { return this.size.y; }
    setSize(size) { this.size = size; }
    getSize() { return this.size; }


    // --[ image ]--------------------------------------------------------------
    setImage(image, resize=false) {
        this.image = image;
        
        if (resize) {
            this.resize();
        }
    }

    getImageSize() {
        return new Vec2(this.image.naturalWidth, this.image.naturalHeight);
    }

    resize() {
        this.size = this.getImageSize();   
        if (!this.image.complete) {
            this.image.addEventListener("load", this.#imageLoadListener);
        }
    }

    // --[ events ]-------------------------------------------------------------
    onImageLoad() {
        this.image.removeEventListener("load", this.#imageLoadListener);
        this.size = this.getImageSize();
    }

    // --[ draw ]---------------------------------------------------------------
    drawSelf(context) {
        let imageSize = this.getImageSize();
        let sourceWidth = this.sourceSize.x;
        let sourceHeight = this.sourceSize.y;

        if (sourceWidth <= 0) {
            sourceWidth = imageSize.x - this.sourcePosition.x;
        }

        if (sourceHeight <= 0) {
            sourceHeight = imageSize.y - this.sourcePosition.y;
        }

        context.drawImage(
            this.image, 
            this.sourcePosition.x,
            this.sourcePosition.y,
            sourceWidth,
            sourceHeight,
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        );
    }

}
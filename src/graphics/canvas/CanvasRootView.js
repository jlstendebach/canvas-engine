import { Canvas } from "./Canvas.js";
import { View } from "../views/View.js";

export class CanvasRootView extends View {
    #canvas;

    get canvas() {
        return this.#canvas;
    }

    constructor(canvas) {
        super();
        if (!(canvas instanceof Canvas)) {
            throw new TypeError("CanvasRootView requires an instance of Canvas.");
        }
        this.#canvas = canvas;
    }
}
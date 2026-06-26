import { Canvas } from "./Canvas.js";
import { View } from "../views/core/View.js";
import { Bounds } from "../../math/Bounds.js";

export class CanvasRootView extends View {
    #canvas;

    // MARK: - Properties
    get canvas() {
        return this.#canvas;
    }

    // MARK: - Initialization
    constructor(canvas) {
        super();
        if (!(canvas instanceof Canvas)) {
            throw new TypeError("CanvasRootView requires an instance of Canvas.");
        }
        this.#canvas = canvas;
    }

    // MARK: - Bounds
    calculateBounds() {
        return new Bounds(-Infinity, -Infinity, Infinity, Infinity);
    }

    containsPoint(point) {
        void point;
        return true;
    }
}
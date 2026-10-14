import { Bounds } from "../../math/Bounds.js";
import type { Vec2 } from "../../math/Vec2.js";
import { View } from "../views/core/View.js";
import { Canvas } from "./Canvas.js";

export class CanvasRootView extends View {
    #canvas: Canvas;

    // MARK: - Properties
    get canvas(): Canvas {
        return this.#canvas;
    }

    // MARK: - Initialization
    constructor(canvas: Canvas) {
        super();
        if (!(canvas instanceof Canvas)) {
            throw new TypeError("CanvasRootView requires an instance of Canvas.");
        }
        this.#canvas = canvas;
    }

    // MARK: - Bounds
    override updateBounds(out: Bounds = new Bounds()): void {
        out.set(-Infinity, -Infinity, Infinity, Infinity);
    }

    override containsPoint(point: Vec2): boolean {
        void point;
        return true;
    }

}
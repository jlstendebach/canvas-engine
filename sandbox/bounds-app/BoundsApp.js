import {
    CanvasApp,
    CircleView,
    Color,
    ContainerView,
    MouseEvent
} from "../../src/index.js";

import { BoundsDrawer } from "../common/BoundsDrawer.js";
import { shapeStyles } from "../common/shapeStyles.js";

export class BoundsApp extends CanvasApp {
    #boundsDrawer;
    #container;

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initViews();

        this.#boundsDrawer = new BoundsDrawer(this.#container);
        this.canvas.addView(this.#boundsDrawer);
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initViews() {
        let parent = this.canvas;
        for (let i = 1; i <= 3; i++) {
            const subcontainer = new ContainerView();
            for (let j = 0; j < 5; j++) {
                this.createBall({
                    parent: subcontainer,
                    fillStyle: shapeStyles[i].fillStyle,
                    strokeStyle: shapeStyles[i].strokeStyle,
                    strokeWidth: shapeStyles[i].strokeWidth,
                    margin: 0.1 + (0.1 * i)
                });
            }
            subcontainer.events.on(MouseEvent.DRAG, this.onViewDragged, this);
            parent.addView(subcontainer);
            parent = subcontainer;

            if (this.#container === undefined) {
                this.#container = subcontainer;
            }
        }
    }
    
    // MARK: - Events Handlers
    onViewDragged(type, event) {
        event.target.x += event.parentMovementX;
        event.target.y += event.parentMovementY;
    }

    // MARK: - Helpers
    createBall({ parent, fillStyle, strokeStyle, margin } = {}) {
        margin = margin ?? 0;
        const sizePercent = 1 - margin;
        const width = this.canvas.width * sizePercent;
        const height = this.canvas.height * sizePercent;

        const ball = new CircleView(30)
            .setX(width*margin + Math.random()*width*sizePercent)
            .setY(height*margin + Math.random()*height*sizePercent)
            .setFillStyle(fillStyle ?? new Color(0, 0, 200))
            .setStrokeStyle(strokeStyle ?? new Color(100, 100, 100))
            .setStrokeWidth(2)
            .addToParent(parent);
            
        ball.events.on(MouseEvent.DRAG, this.onViewDragged, this);

        return ball;
    }

}
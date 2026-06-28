import {
    CanvasApp,
    CircleView,
    Color,
    ContainerView,
    MouseButton,
    MouseEvent
} from "../../src/index.js";

import { BoundsDrawer } from "./BoundsDrawer.js";
import { shapeStyles } from "./shapeStyles.js";


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
            subcontainer.addEventListener(MouseEvent.DRAG, this.onViewDragged, this);
            parent.addView(subcontainer);
            parent = subcontainer;

            if (this.#container === undefined) {
                this.#container = subcontainer;
            }
        }
    }
    
    // MARK: - Events Handlers
    onViewDragged(type, event) {
        event.target.x += event.dx;
        event.target.y += event.dy;
    }

    // MARK: - Helpers
    createBall({ parent, fillStyle, strokeStyle, margin } = {}) {
        margin = margin ?? 0;
        const sizePercent = 1 - margin;
        const width = this.canvas.width * sizePercent;
        const height = this.canvas.height * sizePercent;

        const ball = new CircleView({
            x: width*margin + Math.random()*width*sizePercent, 
            y: height*margin + Math.random()*height*sizePercent,
            radius: 30,
            fillStyle: fillStyle ?? new Color(0, 0, 200),
            strokeStyle: strokeStyle ?? new Color(100, 100, 100),
            strokeWidth: 2,
        });
        ball.addEventListener(MouseEvent.DRAG, this.onViewDragged, this);
        parent.addView(ball);

        return ball;
    }

}
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
    #subcontainer;

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
        this.#container = new ContainerView();
        for (let i = 0; i < 5; i++) {
            this.createBall({
                parent: this.#container,
                fillStyle: shapeStyles[0].fillStyle,
                strokeStyle: shapeStyles[0].strokeStyle,
                strokeWidth: shapeStyles[0].strokeWidth
            });
        }
        this.canvas.addView(this.#container);

        this.#subcontainer = new ContainerView();
        for (let i = 0; i < 5; i++) {
            this.createBall({
                parent: this.#subcontainer,
                fillStyle: shapeStyles[1].fillStyle,
                strokeStyle: shapeStyles[1].strokeStyle,
                strokeWidth: shapeStyles[1].strokeWidth
            });
        }
        this.#container.addView(this.#subcontainer);
        
    }
    
    // MARK: - Events Handlers
    onBallGrab(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.position = event.getParentXY();
        }
    }

    onBallDrag(type, event) {
        event.target.position = event.getParentXY();
    }

    onBallDrop(type, event) {
        event.target.position = event.getParentXY();
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        /*
        for (let i = 0; i < this.#boundsDrawer.maxDepth; i++) {
            const color = this.#boundsDrawer.getColorForDepth(i);
            console.log(`Depth ${i}: ${color.toRgba()}`);
        }
            */
    }

    // MARK: - Helpers
    createBall({ parent, fillStyle, strokeStyle } = {}) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        if (parent === this.#container) {
            width = this.canvas.width * 0.8
            height = this.canvas.height * 0.8;
        } else if (parent === this.#subcontainer) {
            width = this.canvas.width * 0.6;
            height = this.canvas.height * 0.6;
        }

        const ball = new CircleView({
            x: Math.random() * width * 0.8 + width * 0.1, 
            y: Math.random() * height * 0.8 + height * 0.1,
            radius: 30,
            fillStyle: fillStyle ?? new Color(0, 0, 200),
            strokeStyle: strokeStyle ?? new Color(100, 100, 100),
            strokeWidth: 2,
        });
        ball.addEventListener(MouseEvent.DOWN, this.onBallGrab, this);
        ball.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        ball.addEventListener(MouseEvent.UP, this.onBallDrop, this);
        parent.addView(ball);
        return ball;
    }

}
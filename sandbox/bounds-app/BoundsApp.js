import {
    CanvasApp,
    CircleView,
    Color,
    ContainerView,
    MouseButton,
    MouseEvent,
    RectangleView
} from "../../src/index.js";

import { BoundsDrawer } from "../common/BoundsDrawer.js";
import { shapeStyles } from "../common/shapeStyles.js";

export class BoundsApp extends CanvasApp {
    #boundsDrawer;
    #container;
    #subcontainers = [];

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initViews();

        this.#boundsDrawer = new BoundsDrawer(this.canvas.rootView);
        this.canvas.addView(this.#boundsDrawer);
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initViews() {
        for (let j = 0; j < 2; j++) {
            this.createBall({
                parent: this.canvas,
                fillStyle: shapeStyles[8].fillStyle,
                strokeStyle: shapeStyles[8].strokeStyle,
                strokeWidth: shapeStyles[8].strokeWidth,
                margin: 0
            });

            this.createRect({
                parent: this.canvas,
                fillStyle: shapeStyles[8].fillStyle,
                strokeStyle: shapeStyles[8].strokeStyle,
                strokeWidth: shapeStyles[8].strokeWidth,
                margin: 0
            });
        }


        let parent = this.canvas;
        for (let i = 1; i <= 1; i++) {
            const subcontainer = new ContainerView();
            for (let j = 0; j < 2; j++) {
                this.createBall({
                    parent: subcontainer,
                    fillStyle: shapeStyles[i].fillStyle,
                    strokeStyle: shapeStyles[i].strokeStyle,
                    strokeWidth: shapeStyles[i].strokeWidth,
                    margin: 0.1 + (0.1 * i)
                });

                this.createRect({
                    parent: subcontainer,
                    fillStyle: shapeStyles[i].fillStyle,
                    strokeStyle: shapeStyles[i].strokeStyle,
                    strokeWidth: shapeStyles[i].strokeWidth,
                    margin: 0.1 + (0.1 * i)
                });
            }

            subcontainer.events.on(MouseEvent.DRAG, this.onViewDragged, this);
            subcontainer.events.on(MouseEvent.WHEEL, this.onViewScrolled, this);

            parent.addView(subcontainer);
            parent = subcontainer;
            this.#subcontainers.push(subcontainer);

            if (this.#container === undefined) {
                this.#container = subcontainer;
            }
        }

        this.#container.setPivotXY(
            this.#container.bounds.centerX, 
            this.#container.bounds.centerY
        );
        this.#container.setPositionXY(
            this.canvas.width/2, 
            this.canvas.height/2
        );

    }
    
    // MARK: - Lifecycle
    onUpdate(timestamp, deltaTime) {
    }

    // MARK: - Events Handlers
    onViewDragged(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.x += event.parentMovementX;
            event.target.y += event.parentMovementY;
        } else if (event.button === MouseButton.RIGHT) {
            event.target.rotation += event.canvasMovementX * 0.01;
        }
    }

    onViewScrolled(type, event) {
        if (event.wheelY === 0) { return; }
        const factor = 1 - Math.sign(event.wheelY) * 0.05;
        event.target.scale(factor);
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
        ball.events.on(MouseEvent.WHEEL, this.onViewScrolled, this);

        return ball;
    }

    createRect({ parent, fillStyle, strokeStyle, margin } = {}) {
        margin = margin ?? 0;
        const sizePercent = 1 - margin;
        const width = this.canvas.width * sizePercent;
        const height = this.canvas.height * sizePercent;

        const rect = new RectangleView(100, 50)
            .setX(width*margin + Math.random()*width*sizePercent)
            .setY(height*margin + Math.random()*height*sizePercent)
            .setFillStyle(fillStyle ?? new Color(0, 0, 200))
            .setStrokeStyle(strokeStyle ?? new Color(100, 100, 100))
            .setStrokeWidth(2)
            .setPivotXY(50, 25)
            .addToParent(parent);

        rect.events.on(MouseEvent.DRAG, this.onViewDragged, this);
        rect.events.on(MouseEvent.WHEEL, this.onViewScrolled, this);

        return rect;
    }

}
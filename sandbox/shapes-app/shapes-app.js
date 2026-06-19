import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,
    MouseButton,
    MouseEvent,
    RectangleView,
    Vec2
} from "../../src/index.js";

import { shapeStyles } from "./shape-styles.js";

export class ShapesApp extends CanvasApp {
    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initShapes();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
        this.canvas.addEventListener(CanvasResizeEvent, this.refresh, this);
    }

    initShapes() {
        this.initCircleView();
        this.initRectangleView();
    }

    initCircleView() {
        const style = this.getNextStyle();
        const circle = new CircleView({
            position: new Vec2(100, 100),
            radius: 50,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.addEventListeners(circle);
        this.canvas.addView(circle);
    }

    initRectangleView() {
        const style = this.getNextStyle();
        const rectangle = new RectangleView({
            position: new Vec2(200, 50),
            size: new Vec2(150, 100),
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.addEventListeners(rectangle);
        this.canvas.addView(rectangle);
    }
    
    // MARK: - Events Handlers
    onMouseDown(type, event) {
        if (event.button === MouseButton.LEFT) {
            this.setShapeCenter(event.target, event.getParentXY());
            event.target.fillStyle.a = 0.5;
        }
        this.refresh();
    }

    onMouseDrag(type, event) {
        this.setShapeCenter(event.target, event.getParentXY());
        this.refresh();
    }

    onMouseUp(type, event) {
        this.setShapeCenter(event.target, event.getParentXY());
        event.target.fillStyle.a = 0.25;
        this.refresh();
    }

    // MARK: - Helpers
    addEventListeners(shape) {
        shape.addEventListener(MouseEvent.DOWN, this.onMouseDown, this);
        shape.addEventListener(MouseEvent.DRAG, this.onMouseDrag, this);
        shape.addEventListener(MouseEvent.UP, this.onMouseUp, this);
    }

    setShapeCenter(shape, center) {
        if (shape instanceof CircleView) {
            shape.position = center;
        } else if (shape instanceof RectangleView) {
            shape.position = new Vec2(
                center.x - shape.size.x / 2,
                center.y - shape.size.y / 2
            );
        }
    }

    getNextStyle() {
        return shapeStyles[this.canvas.getViewCount() % shapeStyles.length];
    }

}
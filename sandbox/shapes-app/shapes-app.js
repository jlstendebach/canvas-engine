import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,
    MouseButton,
    MouseEvent,
    PolygonView,
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
        this.initPolygonTriangleView();
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

    initPolygonTriangleView() {
        const style = this.getNextStyle();
        const triangle = new PolygonView({
            position: new Vec2(450, 100),
            points: [
                new Vec2(0, -50),
                new Vec2(-50, 50),
                new Vec2(50, 50)
            ],
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.addEventListeners(triangle);
        this.canvas.addView(triangle);
    }
    
    // MARK: - Events Handlers
    onMouseDown(type, event) {
        if (event.button === MouseButton.LEFT) {
            this.setShapeCenter(event.target, event.getParentXY());
            event.target.fillStyle.a += 0.1;
        }
        this.refresh();
    }

    onMouseDrag(type, event) {
        this.setShapeCenter(event.target, event.getParentXY());
        this.refresh();
    }

    onMouseUp(type, event) {
        this.setShapeCenter(event.target, event.getParentXY());
        event.target.fillStyle.a -= 0.1;
        this.refresh();
    }

    onMouseEnter(type, event) {
        event.target.fillStyle.a += 0.1;
        this.refresh();
    }

    onMouseExit(type, event) {
        event.target.fillStyle.a -= 0.1;
        this.refresh();
    }

    // MARK: - Helpers
    addEventListeners(shape) {
        shape.addEventListener(MouseEvent.DOWN, this.onMouseDown, this);
        shape.addEventListener(MouseEvent.DRAG, this.onMouseDrag, this);
        shape.addEventListener(MouseEvent.UP, this.onMouseUp, this);
        shape.addEventListener(MouseEvent.ENTER, this.onMouseEnter, this);
        shape.addEventListener(MouseEvent.EXIT, this.onMouseExit, this);
    }

    setShapeCenter(shape, center) {
        if (shape instanceof RectangleView) {
            shape.position = new Vec2(
                center.x - shape.size.x / 2,
                center.y - shape.size.y / 2
            );
        } else {
            shape.position = center;
        }
    }

    getNextStyle() {
        return shapeStyles[this.canvas.getViewCount() % shapeStyles.length];
    }

}
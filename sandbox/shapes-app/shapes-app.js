import {
    CanvasApp,
    CircleView,
    Color,
    MouseButton,
    MouseEvent,
    RectangleView,
    Vec2
} from "../../src/index.js";

export class ShapesApp extends CanvasApp {

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initShapes();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initShapes() {
        this.initCircleView();
        this.initRectangleView();
    }

    initCircleView() {
        const circle = new CircleView({
            position: new Vec2(100, 100),
            radius: 50,
            fillStyle: new Color(0, 180, 216),
            strokeStyle: new Color(0, 240, 255),
            strokeWidth: 2
        });
        this.addEventListeners(circle);
        this.canvas.addView(circle);
    }

    initRectangleView() {
        const rectangle = new RectangleView({
            position: new Vec2(100, 100),
            size: new Vec2(150, 100),
            fillStyle: new Color(0, 180, 216),
            strokeStyle: new Color(0, 240, 255),
            strokeWidth: 2
        });
        this.addEventListeners(rectangle);
        this.canvas.addView(rectangle);
    }
    
    // MARK: - Events Handlers
    onMouseDown(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.position = event.getParentXY();
        }
    }

    onMouseDrag(type, event) {
        event.target.position = event.getParentXY();
    }

    onMouseUp(type, event) {
        event.target.position = event.getParentXY();
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
    }

    // MARK: - Helpers
    addEventListeners(shape) {
        shape.addEventListener(MouseEvent.DOWN, this.onMouseDown, this);
        shape.addEventListener(MouseEvent.DRAG, this.onMouseDrag, this);
        shape.addEventListener(MouseEvent.UP, this.onMouseUp, this);
    }

}
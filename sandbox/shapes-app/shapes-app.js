import { 
    CanvasApp, 
    Color, 
    MouseButton,
    Vec2,
    CircleView
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
    }

    initCircleView() {
        const circle = new CircleView({
            position: new Vec2(100, 100),
            radius: 50,
            fillStyle: new Color(255, 0, 0),
            strokeStyle: new Color(255, 255, 255),
            strokeWidth: 2
        });
        this.addEventListeners(circle);
        this.addView(circle);
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
        shape.addEventListener("mousedown", this.onMouseDown, this);
        shape.addEventListener("mousemove", this.onMouseDrag, this);
        shape.addEventListener("mouseup", this.onMouseUp, this);
    }

}
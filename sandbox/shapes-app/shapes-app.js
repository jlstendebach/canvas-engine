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
    #styles = [
        {
            fillStyle: new Color(0, 234, 255, 0.25),
            strokeStyle: new Color(128, 244, 255, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(255, 102, 125, 0.25),
            strokeStyle: new Color(255, 173, 186, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(166, 84, 248, 0.25),
            strokeStyle: new Color(209, 167, 251, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(250, 201, 5, 0.25),
            strokeStyle: new Color(252, 225, 115, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(18, 211, 140, 0.25),
            strokeStyle: new Color(110, 242, 194, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(90, 103, 246, 0.25),
            strokeStyle: new Color(168, 175, 250, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(249, 112, 21, 0.25),
            strokeStyle: new Color(252, 173, 121, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(241, 65, 159, 0.25),
            strokeStyle: new Color(248, 160, 207, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(142, 220, 24, 0.25),
            strokeStyle: new Color(184, 238, 104, 1),
            strokeWidth: 2
        },
        {
            fillStyle: new Color(239, 67, 67, 0.25),
            strokeStyle: new Color(246, 152, 152, 1),
            strokeWidth: 2
        }
    ]

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
            this.setCenter(event.target, event.getParentXY());
        }
    }

    onMouseDrag(type, event) {
        this.setCenter(event.target, event.getParentXY());
    }

    onMouseUp(type, event) {
        this.setCenter(event.target, event.getParentXY());
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

    setCenter(shape, center) {
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
        return this.#styles[this.canvas.getViewCount() % this.#styles.length];
    }

}
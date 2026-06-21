import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,    
    LineStringView,
    LineView,
    MouseButton,
    MouseEvent,
    PolygonView,
    RectangleView,
    SceneView,
    Vec2
} from "../../src/index.js";

import { shapeStyles } from "./shape-styles.js";

export class ShapesApp extends CanvasApp {
    scene;

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initScene();
        this.initShapes();        
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
        this.canvas.addEventListener(CanvasResizeEvent, this.refresh, this);
    }

    initScene() {
        this.scene = new SceneView();
        this.canvas.addView(this.scene);
    }

    initShapes() {
        this.initCircleView();
        this.initRectangleView();
        this.initPolygonTriangleView();
        this.initPolygonStarView();
        this.initLineStringView();
        this.initLineView();
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
        this.scene.addView(circle);
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
        this.scene.addView(rectangle);
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
        this.scene.addView(triangle);
    }

    initPolygonStarView() {
        const points = [];
        const tau = Math.PI * 2;
        for (let i = 0; i < 10; i++) {
            const angle = tau * i / 10;
            const point = new Vec2(0, 55).rotate(angle);
            if (i % 2 === 0) {
                point.multiplyScalar(0.382);
            }
            points.push(point);
        }
        const style = this.getNextStyle();
        const star = new PolygonView({
            position: new Vec2(100, 250),
            points: points,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.addEventListeners(star);
        this.scene.addView(star);
    }

    initLineStringView() {
        const style = this.getNextStyle();        
        const tau = Math.PI * 2;
        const points = [];
        const pointCount = 150;
        for (let i = 0; i < pointCount; i++) {
            points.push(new Vec2(i, Math.sin(tau*i/pointCount) * 50));
        }
        const lineString = new LineStringView({
            position: new Vec2(200, 250),
            points: points,
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        this.addEventListeners(lineString);
        this.scene.addView(lineString);
    }

    initLineView() {
        const style = this.getNextStyle();
        const line = new LineView({
            position: new Vec2(400, 200),
            vertex1: new Vec2(0, 0),
            vertex2: new Vec2(100, 100),
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        this.addEventListeners(line);
        this.scene.addView(line);
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
        if (event.target instanceof LineView || event.target instanceof LineStringView) {
            event.target.strokeStyle.r -= 100;
            event.target.strokeStyle.g -= 100;
            event.target.strokeStyle.b -= 100;
        }
        event.target.fillStyle.a += 0.1;
        this.refresh();
    }

    onMouseExit(type, event) {
        if (event.target instanceof LineView || event.target instanceof LineStringView) {
            event.target.strokeStyle.r += 100;
            event.target.strokeStyle.g += 100;
            event.target.strokeStyle.b += 100;
        }
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
        } else if (shape instanceof LineView) {
            shape.position = new Vec2(
                center.x - (shape.vertex1.x + shape.vertex2.x) / 2,
                center.y - (shape.vertex1.y + shape.vertex2.y) / 2
            );
        } else {
            shape.position = center;
        }
    }

    getNextStyle() {
        return shapeStyles[this.scene.getViewCount() % shapeStyles.length];
    }

}
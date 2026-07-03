import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,    
    LineView,
    MouseButton,
    MouseEvent,
    PolygonView,
    RectangleView,
    SceneView,
    Vec2,
    VectorView
} from "../../src/index.js";

import { shapeStyles } from "../common/shapeStyles.js";

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
        this.canvas.events.on(CanvasResizeEvent, this.refresh, this);
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
        this.initVectorView();
    }

    initCircleView() {
        const style = this.getNextStyle();
        const circle = new CircleView({
            radius: 50,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setShapeCenter(circle, this.getNextPosition());
        this.addEventListeners(circle);
        this.scene.addView(circle);
    }

    initRectangleView() {
        const style = this.getNextStyle();
        const rectangle = new RectangleView({
            size: new Vec2(150, 100),
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setShapeCenter(rectangle, this.getNextPosition());
        this.addEventListeners(rectangle);
        this.scene.addView(rectangle);
    }

    initPolygonTriangleView() {
        const style = this.getNextStyle();
        const triangle = new PolygonView({
            points: [
                new Vec2(0, -50),
                new Vec2(-50, 50),
                new Vec2(50, 50)
            ],
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setShapeCenter(triangle, this.getNextPosition());
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
            points: points,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setShapeCenter(star, this.getNextPosition());
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
        const lineString = new LineView({
            points: points,
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        this.setShapeCenter(lineString, this.getNextPosition());
        this.addEventListeners(lineString);
        this.scene.addView(lineString);
    }

    initLineView() {
        const style = this.getNextStyle();
        const line = new LineView({
            points: [
                new Vec2(0, 0),
                new Vec2(100, 100)
            ],
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        this.setShapeCenter(line, this.getNextPosition());
        this.addEventListeners(line);
        this.scene.addView(line);
    }

    initVectorView() {
        const style = this.getNextStyle();
        const vector = new VectorView({
            vector: new Vec2(100, 50),
            arrowWidth: 20,
            arrowHeight: 20,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth,
        });
        this.setShapeCenter(vector, this.getNextPosition());
        this.addEventListeners(vector);
        this.scene.addView(vector);
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
        event.target.strokeDash = [10, 5];
        event.target.fillStyle.a += 0.1;
        this.refresh();
    }

    onMouseExit(type, event) {
        event.target.strokeDash = [];
        event.target.fillStyle.a -= 0.1;
        this.refresh();
    }

    // MARK: - Helpers
    addEventListeners(shape) {
        shape.events.on(MouseEvent.DOWN, this.onMouseDown, this);
        shape.events.on(MouseEvent.DRAG, this.onMouseDrag, this);
        shape.events.on(MouseEvent.UP, this.onMouseUp, this);
        shape.events.on(MouseEvent.ENTER, this.onMouseEnter, this);
        shape.events.on(MouseEvent.EXIT, this.onMouseExit, this);
    }

    setShapeCenter(shape, center) {
        if (shape instanceof RectangleView) {
            shape.setPositionXY(
                center.x - shape.width / 2,
                center.y - shape.height / 2
            );
        } else if (shape instanceof LineView || shape instanceof PolygonView) {
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;
            for (const point of shape.points) {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
            }
            shape.setPositionXY(
                center.x - (minX + maxX) / 2,
                center.y - (minY + maxY) / 2
            );
        } else if (shape instanceof VectorView) {
            shape.setPositionXY(
                center.x - shape.vector.x / 2,
                center.y - shape.vector.y / 2
            );
        } else {
            shape.setPosition(center);
        }
    }

    getNextStyle() {
        return shapeStyles[this.scene.getViewCount() % shapeStyles.length];
    }

    getNextPosition() {
        const margin = 100;
        const columns = 3;
        const row = Math.floor(this.scene.getViewCount() / columns);
        const column = this.scene.getViewCount() % columns;

        const x = margin + column * 200;
        const y = margin + row * 150;

        return new Vec2(x, y);
    }

}
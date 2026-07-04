import {
    CanvasApp,
    CircleView,
    Color,
    LineView,
    MouseButton,
    MouseEvent,
    Point,
    PolygonView,
    RectangleView,
    SceneView,
    Vec2,
    VectorView
} from "../../src/index.js";

import { shapeStyles } from "./shapeStyles.js";

export class TransformationsApp extends CanvasApp {
    scene;
    shapes = [];

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initScene();
        this.initShapes();        
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
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
            position: this.getNextPosition(),
            radius: 50,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setPivotToCenter(circle);
        this.addEventListeners(circle);
        this.scene.addView(circle);
        this.shapes.push(circle);
    }

    initRectangleView() {
        const style = this.getNextStyle();
        const rectangle = new RectangleView({
            position: this.getNextPosition(),
            width: 150,
            height: 100,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        this.setPivotToCenter(rectangle);
        this.addEventListeners(rectangle);
        this.scene.addView(rectangle);
        this.shapes.push(rectangle);
    }

    initPolygonTriangleView() {
        const style = this.getNextStyle();
        const triangle = new PolygonView({
            position: this.getNextPosition(),
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });

        const tau = Math.PI * 2;
        triangle
            .addPoint(Point.fromAngle(tau * 0/3).scale(50))
            .addPoint(Point.fromAngle(tau * 1/3).scale(50))
            .addPoint(Point.fromAngle(tau * 2/3).scale(50));

        this.addEventListeners(triangle);
        this.scene.addView(triangle);
        this.shapes.push(triangle);
    }

    initPolygonStarView() {
        const style = this.getNextStyle();
        const star = new PolygonView({
            position: this.getNextPosition(),
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });

        const tau = Math.PI * 2;
        for (let i = 0; i < 10; i++) {
            const angle = tau * i / 10;
            const point = Vec2.fromAngle(angle).scale(55);
            if (i % 2 === 0) {
                point.multiplyScalar(0.382);
            }
            star.addPointXY(point.x, point.y);
        }


        this.addEventListeners(star);
        this.scene.addView(star);
        this.shapes.push(star);
    }

    initLineStringView() {
        const style = this.getNextStyle();        
        const lineString = new LineView({
            position: this.getNextPosition(),
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });

        const tau = Math.PI * 2;
        const pointCount = 150;
        for (let i = 0; i < pointCount; i++) {
            lineString.addPointXY(i, Math.sin(tau*i/pointCount) * 50);
        }

        this.setPivotToCenter(lineString);
        this.addEventListeners(lineString);
        this.scene.addView(lineString);
        this.shapes.push(lineString);
    }

    initLineView() {
        const style = this.getNextStyle();
        const line = new LineView({
            position: this.getNextPosition(),
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });

        line.addPointXY(0, 0).addPointXY(100, 100);

        this.setPivotToCenter(line);
        this.addEventListeners(line);
        this.scene.addView(line);
        this.shapes.push(line);
    }

    initVectorView() {
        const style = this.getNextStyle();
        const vector = new VectorView({
            position: this.getNextPosition(),
            vector: new Vec2(100, 50),
            arrowWidth: 20,
            arrowHeight: 20,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth,
        });
        this.setPivotToCenter(vector);
        this.addEventListeners(vector);
        this.scene.addView(vector);
        this.shapes.push(vector);
    }
    
    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        const rotationSpeed = 2 * Math.PI / 10; // 1 rotation every 10 seconds
        const rotation = rotationSpeed * deltaTime / 1000;
        for (const shape of this.shapes) {
            shape.rotation += rotation;
        }
    }

    // MARK: - Events Handlers
    onMouseDown(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.setPosition(event.getParentXY());
            event.target.fillStyle.a += 0.1;
        }
    }

    onMouseDrag(type, event) {
        event.target.setPosition(event.getParentXY());
    }

    onMouseUp(type, event) {
        event.target.setPosition(event.getParentXY());
        event.target.fillStyle.a -= 0.1;
    }

    onMouseEnter(type, event) {
        event.target.strokeDash = [10, 5];
        event.target.fillStyle.a += 0.1;
    }

    onMouseExit(type, event) {
        event.target.strokeDash = [];
        event.target.fillStyle.a -= 0.1;
    }

    onMouseWheel(type, event) {
        if (event.dy === 0) {
            return;
        }
        const direction = event.dy / Math.abs(event.dy);
        const factor =  1 - direction / 20;
        event.target.scaleX *= factor;
        event.target.scaleY *= factor;
    }    

    // MARK: - Helpers
    addEventListeners(shape) {
        shape.events.on(MouseEvent.DOWN, this.onMouseDown, this);
        shape.events.on(MouseEvent.DRAG, this.onMouseDrag, this);
        shape.events.on(MouseEvent.UP, this.onMouseUp, this);
        shape.events.on(MouseEvent.ENTER, this.onMouseEnter, this);
        shape.events.on(MouseEvent.EXIT, this.onMouseExit, this);
        shape.events.on(MouseEvent.WHEEL, this.onMouseWheel, this);
    }

    setPivotToCenter(shape) {
        shape.pivotX = shape.bounds.centerX;
        shape.pivotY = shape.bounds.centerY;
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
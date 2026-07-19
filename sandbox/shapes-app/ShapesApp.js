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
    RoundRectangleView,
    SceneView,
    Vec2,
    VectorView
} from "../../src/index.js";

import { shapeStyles } from "../common/shapeStyles.js";

export class ShapesApp extends CanvasApp {
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
        this.scene = new SceneView(this.canvas.width, this.canvas.height);
        this.canvas.addView(this.scene);
    }

    initShapes() {
        this.initCircleView();
        this.initRectangleView();
        this.initRoundRectangleView();
        this.initPolygonTriangleView();
        this.initPolygonStarView();
        this.initLineStringView();
        this.initLineView();
        this.initVectorView();
    }

    initCircleView() {
        const style = this.getNextStyle();
        const circle = new CircleView(50)
            .setPosition(this.getNextPosition())
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);
        this.setPivotToCenter(circle);
        this.addEventListeners(circle);
        this.scene.addView(circle);
        this.shapes.push(circle);
    }

    initRectangleView() {
        const style = this.getNextStyle();
        const rectangle = new RectangleView(150, 100)
            .setPosition(this.getNextPosition())
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);
        this.setPivotToCenter(rectangle);
        this.addEventListeners(rectangle);
        this.scene.addView(rectangle);
        this.shapes.push(rectangle);
    }

    initRoundRectangleView() {
        const style = this.getNextStyle();
        const roundRectangle = new RoundRectangleView(150, 100)
            .setPosition(this.getNextPosition())
            .setCornerRadii(10, 20, 30, 40)
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);
        roundRectangle.setPivotXY(roundRectangle.bounds.centerX, roundRectangle.bounds.centerY);
        this.addEventListeners(roundRectangle);
        this.scene.addView(roundRectangle);
        this.shapes.push(roundRectangle);
    }

    initPolygonTriangleView() {
        const style = this.getNextStyle();
        const triangle = new PolygonView()
            .setPosition(this.getNextPosition())
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);

        const tau = Math.PI * 2;
        triangle.setPoints([
            Point.fromAngle(tau * 0/3).scale(50),
            Point.fromAngle(tau * 1/3).scale(50),
            Point.fromAngle(tau * 2/3).scale(50)
        ]);

        this.addEventListeners(triangle);
        this.scene.addView(triangle);
        this.shapes.push(triangle);
    }

    initPolygonStarView() {
        const style = this.getNextStyle();
        const star = new PolygonView()
            .setPosition(this.getNextPosition())
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);

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
        const lineString = new LineView()
            .setPosition(this.getNextPosition())
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(4);

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
        const line = new LineView()
            .setPosition(this.getNextPosition())
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(4);

        line.setPointsXY([
            0, 0,
            100, 100
        ]);

        this.setPivotToCenter(line);
        this.addEventListeners(line);
        this.scene.addView(line);
        this.shapes.push(line);
    }

    initVectorView() {
        const style = this.getNextStyle();
        const vector = new VectorView(100, 50)
            .setPosition(this.getNextPosition())
            .setArrowWidth(20)
            .setArrowHeight(20)
            .setFillStyle(style.fillStyle)
            .setStrokeStyle(style.strokeStyle)
            .setStrokeWidth(style.strokeWidth);
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
            event.target.setPositionXY(event.parentX, event.parentY);
            event.target.fillStyle.a += 0.1;
        }
    }

    onMouseDrag(type, event) {
        event.target.setPositionXY(event.parentX, event.parentY);
    }

    onMouseUp(type, event) {
        event.target.setPositionXY(event.parentX, event.parentY);
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
        if (event.wheelY === 0) { return; }
        const direction = Math.sign(event.wheelY);
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
        if (shape.bounds.isEmpty()) {
            console.warn("Cannot set pivot to center of shape with empty bounds.");
        }
        shape.pivotX = shape.bounds.centerX || 0;
        shape.pivotY = shape.bounds.centerY || 0;
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
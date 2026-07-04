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
    RoundRectangleView,
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
        this.initRoundRectangleView();
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
        circle.setPosition(this.getNextPosition());
        this.addEventListeners(circle);
        this.scene.addView(circle);
    }

    initRectangleView() {
        const style = this.getNextStyle();
        const rectangle = new RectangleView({
            width: 150,
            height: 100,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        rectangle
            .setPosition(this.getNextPosition())
            .setPivotXY(rectangle.bounds.centerX, rectangle.bounds.centerY);
        this.addEventListeners(rectangle);
        this.scene.addView(rectangle);
    }

    initRoundRectangleView() {
        const style = this.getNextStyle();
        const roundRectangle = new RoundRectangleView({
            width: 150,
            height: 100,
            topLeftRadius: 10,
            topRightRadius: 20,
            bottomRightRadius: 30,
            bottomLeftRadius: 40,
            fillStyle: style.fillStyle,
            strokeStyle: style.strokeStyle,
            strokeWidth: style.strokeWidth
        });
        roundRectangle
            .setPosition(this.getNextPosition())
            .setPivotXY(roundRectangle.bounds.centerX, roundRectangle.bounds.centerY);
        this.addEventListeners(roundRectangle);
        this.scene.addView(roundRectangle);
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
        triangle.setPosition(this.getNextPosition());
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
        star.setPosition(this.getNextPosition());
        this.addEventListeners(star);
        this.scene.addView(star);
    }

    initLineStringView() {
        const style = this.getNextStyle();        
        const tau = Math.PI * 2;
        const lineString = new LineView({
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        const pointCount = 150;
        for (let i = 0; i < pointCount; i++) {
            lineString.addPoint(i, Math.sin(tau*i/pointCount) * 50);
        }
        lineString.setPosition(this.getNextPosition())
            .setPivotXY(lineString.bounds.centerX, lineString.bounds.centerY);

        this.addEventListeners(lineString);
        this.scene.addView(lineString);
    }

    initLineView() {
        const style = this.getNextStyle();
        const line = new LineView({
            strokeStyle: style.strokeStyle,
            strokeWidth: 4
        });
        line.setPosition(this.getNextPosition())
            .addPoint(0, 0)
            .addPoint(100, 100)
            .setPivotXY(line.bounds.centerX, line.bounds.centerY);

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
        vector
            .setPosition(this.getNextPosition())
            .setPivotXY(vector.bounds.centerX, vector.bounds.centerY);
        this.addEventListeners(vector);
        this.scene.addView(vector);
    }
    
    // MARK: - Events Handlers
    onMouseDown(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.setPosition(event.getParentXY());
            event.target.fillStyle.a += 0.1;
        }
        this.refresh();
    }

    onMouseDrag(type, event) {
        event.target.setPosition(event.getParentXY());
        this.refresh();
    }

    onMouseUp(type, event) {
        event.target.setPosition(event.getParentXY());
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
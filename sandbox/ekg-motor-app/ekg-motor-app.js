import {
    CanvasApp,
    CanvasResizeEvent,
    CircleView,
    Color,
    LabelView,
    MouseEvent,
    RectangleView,
    Vec2
} from "../../src/index.js";

import { Graph } from "./graph.js";

import { data } from "./data.js";
//const data = [0, 1, 3, 4, 4, 4, 3, 2, 1, -1, -1, -1]

export class EkgMotorApp extends CanvasApp {
    // MARK: - Constants
    DATA_POINTS = 300;
    DATA_SCALE = 100;

    MOTOR_COUNT = 5;

    PADDING = 50;
    GRAPH_HEIGHT = 200;

    // MARK: - Variables
    dataGraph;
    slopeGraph;
    activationGraph;

    motorContainer;
    motors = [];

    accumulatedTime = 0;
    updateEvery = 1000 / 30; // ms

    #activationThreshold1 = 3;
    #activationThreshold2 = 10;
    #samplePoints = 3;

    // MARK: - Properties
    set activationThreshold1(value) {
        this.#activationThreshold1 = value;
        this.activationGraph.data = this.calculateActivationData();
        this.updateMotors();
    }

    get activationThreshold1() {
        return this.#activationThreshold1;
    }

    set activationThreshold2(value) {
        this.#activationThreshold2 = value;
        this.activationGraph.data = this.calculateActivationData();
        this.updateMotors();
    }

    get activationThreshold2() {
        return this.#activationThreshold2;
    }

    set samplePoints(value) {
        this.#samplePoints = value;
        this.slopeGraph.data = this.calculateSlopeData();
        this.slopeGraph.calculateDataRange();
        this.activationGraph.data = this.calculateActivationData();
    }

    get samplePoints() {
        return this.#samplePoints;
    }

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initDataGraph();
        this.initSlopeGraph();
        this.initActivationGraph();
        this.initMotors();
        this.layoutViews();
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
        this.canvas.events.on(CanvasResizeEvent, this.onCanvasResize, this);
    }

    initDataGraph() {
        const scaledData = data.slice(0, this.DATA_POINTS).map(value => value * this.DATA_SCALE);

        this.dataGraph = new Graph({ data: scaledData });
        this.dataGraph.events.on(MouseEvent.MOVE, this.onGraphMouseMove, this);
        this.canvas.addView(this.dataGraph);
    }

    initSlopeGraph() {
        this.slopeGraph = new Graph({
            data: this.calculateSlopeData(),
            isSquareWave: true,
        });
        this.slopeGraph.events.on(MouseEvent.MOVE, this.onGraphMouseMove, this);
        this.canvas.addView(this.slopeGraph);
    }

    initActivationGraph() {
        this.activationGraph = new Graph({
            data: this.calculateActivationData(),
            isSquareWave: true,
        });
        this.activationGraph.setDataRange(-this.MOTOR_COUNT, 0);
        this.activationGraph.events.on(MouseEvent.MOVE, this.onGraphMouseMove, this);
        this.canvas.addView(this.activationGraph);
    }

    initMotors() {
        const padding = 20;
        const radius = 20;
        const spacing = 30;

        this.motorContainer = new RectangleView({
            fillStyle: this.dataGraph.fillStyle,
            strokeStyle: this.dataGraph.strokeStyle,
            strokeWidth: 2,
            size: new Vec2(
                radius * 2 * 3 + spacing * 2 + padding * 2,
                radius * 2 * 2 + spacing * 1 + padding * 2
            ),
        });
        this.canvas.addView(this.motorContainer);

        const motors = [];
        for (let i = 0; i < this.MOTOR_COUNT; i++) {
            const motor = new CircleView({
                radius: radius,
                fillStyle: this.dataGraph.fillStyle,
                strokeStyle: this.dataGraph.strokeStyle,
                strokeWidth: 2,
            });

            motor.addView(this.createLabel({ text: `M${i + 1}` }));

            motors.push(motor);
            this.motorContainer.addView(motor);
        }

        motors[0].x = padding + radius;
        motors[0].y = padding + radius;

        motors[1].x = motors[0].x;
        motors[1].y = motors[0].y + radius * 2 + spacing;

        motors[2].x = motors[0].x + radius * 2 + spacing;
        motors[2].y = motors[0].y;

        motors[3].x = motors[1].x + radius * 2 + spacing;
        motors[3].y = motors[1].y;

        motors[4].x = motors[3].x + radius * 2 + spacing;
        motors[4].y = this.motorContainer.size.y / 2;

        this.motors = motors;
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        this.accumulatedTime += deltaTime;

        while (this.accumulatedTime > this.updateEvery) {
            this.accumulatedTime -= this.updateEvery;

            let newData = this.dataGraph.data.slice();
            let first = newData.shift();
            newData.push(first);
            this.dataGraph.data = newData;

            this.slopeGraph.data = this.calculateSlopeData();
            this.activationGraph.data = this.calculateActivationData();

            this.dataGraph.setCursor(this.dataGraph.getCursor());
            this.slopeGraph.setCursor(this.slopeGraph.getCursor());
            this.activationGraph.setCursor(this.activationGraph.getCursor());

            this.updateMotors();
        }
    }

    updateMotors() {
        const slopeValue = this.slopeGraph.getValueAtCursor() ?? 0;
        for (let i = 0; i < this.motors.length; i++) {
            this.setMotorActivated(i, this.isMotorActivated(i, slopeValue));
        }
    }

    setMotorActivated(motorIndex, isActivated) {
        if (motorIndex < 0 || motorIndex >= this.motors.length) {
            return;
        }
        const motor = this.motors[motorIndex];
        motor.fillStyle = isActivated
            ? new Color(18, 211, 140, 0.25)
            : this.dataGraph.fillStyle;
        motor.strokeStyle = isActivated
            ? new Color(110, 242, 194, 1)
            : this.dataGraph.strokeStyle;
    }

    isMotorActivated(motorIndex, slope) {
        switch (motorIndex) {
            case 0:
                return this.isBetween(slope, this.#activationThreshold1, this.#activationThreshold2);

            case 1:
                return this.isBetween(slope, -this.#activationThreshold2, -this.#activationThreshold1);

            case 2:
                return slope > this.#activationThreshold2;

            case 3:
                return slope < -this.#activationThreshold2;

            case 4:
                return Math.abs(slope) < this.#activationThreshold1;
            default: return false;
        }
    }

    // MARK: - Events
    onGraphMouseMove(type, event) {
        this.dataGraph.setCursor(event.x);
        this.slopeGraph.setCursor(event.x);
        this.activationGraph.setCursor(event.x);
        this.updateMotors();
    }

    onCanvasResize() {
        this.layoutViews();
    }

    // MARK: - Helpers
    layoutViews() {
        // data graph
        this.dataGraph.setPositionXY(this.PADDING, this.PADDING);
        this.dataGraph.size = new Vec2(this.canvas.size.x - this.PADDING * 2, this.GRAPH_HEIGHT);

        // slope graph
        this.slopeGraph.setPositionXY(
            this.PADDING,
            this.dataGraph.y + this.dataGraph.size.y + this.PADDING
        );
        this.slopeGraph.size = new Vec2(this.canvas.size.x - this.PADDING * 2, this.GRAPH_HEIGHT);

        // activation graph
        this.activationGraph.setPositionXY(
            this.PADDING,
            this.slopeGraph.y + this.slopeGraph.size.y + this.PADDING
        );
        this.activationGraph.size = new Vec2(this.canvas.size.x - this.PADDING * 2, this.GRAPH_HEIGHT);

        // motors
        this.motorContainer.setPositionXY(
            this.canvas.size.x / 2 - this.motorContainer.size.x / 2,
            this.activationGraph.y + this.activationGraph.size.y + this.PADDING
        );
    }

    calculateSlopeData() {
        const data = [];
        for (let i = 0; i < this.dataGraph.data.length; i++) {
            const previousIndex = this.positiveModulus(i - this.#samplePoints, this.dataGraph.data.length);
            const previousValue = this.dataGraph.data[previousIndex];
            const currentValue = this.dataGraph.data[i];
            data.push(currentValue - previousValue);
        }
        return data;
    }

    calculateActivationData() {
        const data = [];
        for (let i = 0; i < this.slopeGraph.data.length; i++) {
            const slopeValue = this.slopeGraph.data[i];
            let value = 0;
            for (let motorIndex = 0; motorIndex < this.MOTOR_COUNT; motorIndex++) {
                if (this.isMotorActivated(motorIndex, slopeValue)) {
                    value = - motorIndex - 1;
                    break;
                }
            }
            data.push(value);
        }
        return data;
    }

    isBetween(value, threshold1, threshold2) {
        return (value < threshold1) !== (value < threshold2);
    }

    positiveModulus(value, modulus) {
        const result = value % modulus;
        return result < 0 ? result + modulus : result;
    }

    createLabel(options = {}) {
        const label = new LabelView(options);
        label.setFillColor("white");
        label.setFontSize(16);
        label.setAnchorX(0.5);
        label.setAnchorY(0.5);
        label.setShrinkX(true);
        label.setShrinkY(true);
        return label;
    }

}
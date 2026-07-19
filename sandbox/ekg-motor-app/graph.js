import {
    Color,
    LabelView,
    LineView,
    RectangleView
} from "../../src/index.js";


export class Graph extends RectangleView {
    #data = [];
    #minDataValue = -1;
    #maxDataValue = 1;

    #graphLine;
    #zeroLine;
    #cursorLine;
    #valueLabel;
    #verticalPadding = 20;

    #isSquareWave = false;

    static get style() {
        return {
            backgroundFill: new Color(50, 50, 60, 0.5),
            backgroundStroke: new Color(100, 100, 110, 0.5),
            graphStroke: new Color(128, 244, 255, 1),
            zeroLineStroke: new Color(100, 100, 110, 0.5),
        };
    }

    // MARK: - Properties
    set data(value) {
        this.#data = value;
        this.#updateLines();
    }

    get data() {
        return this.#data;
    }

    // MARK: - Initialization
    constructor(data = [], isSquareWave = false) {
        super();

        this.setFillStyle(Graph.style.backgroundFill);
        this.setStrokeStyle(Graph.style.backgroundStroke);
        this.setStrokeWidth(2);

        this.#data = data;
        this.#isSquareWave = isSquareWave === true;

        this.initZeroLine();
        this.initGraphLine();
        this.initCursorLine();
        this.initCursorLabel();

        this.calculateDataRange();
    }

    initZeroLine() {
        this.#zeroLine = new LineView({ isPickable: false });
        this.#zeroLine.strokeStyle = Graph.style.zeroLineStroke;
        this.#zeroLine.strokeWidth = 2;
        this.addView(this.#zeroLine);
    }

    initGraphLine() {
        this.#graphLine = new LineView({ isPickable: false });
        this.#graphLine.strokeStyle = Graph.style.graphStroke;
        this.#graphLine.strokeWidth = 2;
        this.addView(this.#graphLine);
    }

    initCursorLine() {
        this.#cursorLine = new LineView({
            strokeStyle: this.strokeStyle,
            strokeWidth: 2,
        })
            .addPointXY(0, 0)
            .addPointXY(0, this.height);
        this.addView(this.#cursorLine);
    }

    initCursorLabel() {
        this.#valueLabel = new LabelView({
            text: ""
        });
        this.#valueLabel.setFillColor("white");
        this.#valueLabel.setFontSize(16);
        this.#valueLabel.setAnchorX(0.5);
        this.#valueLabel.setAnchorY(0.5);
        this.#valueLabel.setShrinkX(true);
        this.#valueLabel.setShrinkY(true);
        this.addView(this.#valueLabel);
    }


    // MARK: - Data Query
    getValue(x) {
        if (this.#isSquareWave) {
            const percent = x / this.width;
            const index = Math.floor(percent * (this.#data.length));
            return this.#data[index];

        } else {
            const percent = x / this.width;
            const index1 = Math.floor(percent * (this.#data.length - 1));
            const index2 = Math.ceil(percent * (this.#data.length - 1));
            const value1 = this.#data[index1];
            const value2 = this.#data[index2];
            const t = (percent * (this.#data.length - 1)) % 1;
            return value1 * (1 - t) + value2 * t;
        }
    }

    getValueAtCursor() {
        return this.getValue(this.getCursor());
    }

    calculateDataRange() {
        this.setDataRange(Math.min(...this.#data), Math.max(...this.#data));
    }

    setDataRange(min, max) {
        this.#minDataValue = min;
        this.#maxDataValue = max;
        this.#updateLines();
    }

    setCursor(x) {
        this.#cursorLine.x = x;
        const value = this.getValue(x) ?? 0;
        this.#valueLabel.setPositionXY(x, this.height + 15);
        this.#valueLabel.setText(value.toFixed(1));
    }

    getCursor() {
        return this.#cursorLine.x;
    }

    // MARK: - Helpers
    #updateLines() {
        const height = this.height - this.#verticalPadding * 2;

        // graph line
        this.#graphLine.clearPoints();
        for (let i = 0; i < this.#data.length; i++) {
            const value = this.#data[i];
            const xPercent = this.#isSquareWave 
                ? i / (this.#data.length) 
                : i / (this.#data.length - 1);
            const yPercent = (value - this.#minDataValue) / (this.#maxDataValue - this.#minDataValue);
            const x = xPercent * this.width;
            const y = this.height - this.#verticalPadding - yPercent * height;
            this.#graphLine.addPointXY(x, y);
            if (this.#isSquareWave) {
                const nextXPercent = (i + 1) / (this.#data.length);
                const nextX = nextXPercent * this.width;
                this.#graphLine.addPointXY(nextX, y);
            }
        }

        // zero line
        const yPercent = (-this.#minDataValue) / (this.#maxDataValue - this.#minDataValue);
        this.#zeroLine
            .clearPoints()
            .addPointXY(0, this.height - this.#verticalPadding - yPercent * height)
            .addPointXY(this.width, this.height - this.#verticalPadding - yPercent * height);

        // cursor line
        this.#cursorLine.clearPoints()
            .addPointXY(0, 0)
            .addPointXY(0, this.height);
    }

    // MARK: - Events
    onSizeChanged() {
        this.#updateLines();
    }

}
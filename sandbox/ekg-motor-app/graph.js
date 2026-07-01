import {
    Color,
    LabelView,
    LineView,
    RectangleView,
    Vec2
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
    set size(value) {
        super.size = value;

        if (#updateLines in this) {
            this.#updateLines();
        }
    }

    get size() {
        return super.size;
    }
    
    set data(value) {
        this.#data = value;
        this.#updateLines();
    }

    get data() {
        return this.#data;
    }

    // MARK: - Initialization
    constructor(options = {}) {
        options.fillStyle = options.fillStyle ?? Graph.style.backgroundFill;
        options.strokeStyle = options.strokeStyle ?? Graph.style.backgroundStroke;
        options.strokeWidth = options.strokeWidth ?? 2;

        super(options);
        this.#data = options.data ?? [];
        this.#isSquareWave = options.isSquareWave === true;

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
            points: [
                new Vec2(0, 0), 
                new Vec2(0, this.size.y)
            ],
            strokeStyle: this.strokeStyle,
            strokeWidth: 2,
        })
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
            const percent = x / this.size.x;
            const index = Math.floor(percent * (this.#data.length));
            return this.#data[index];

        } else {
            const percent = x / this.size.x;
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
        this.#valueLabel.setPositionXY(x, this.size.y + 15);
        this.#valueLabel.setText(value.toFixed(1));
    }

    getCursor() {
        return this.#cursorLine.x;
    }

    // MARK: - Helpers
    #updateLines() {
        const height = this.size.y - this.#verticalPadding * 2;

        // graph line
        this.#graphLine.points = [];
        for (let i = 0; i < this.#data.length; i++) {
            const value = this.#data[i];
            const xPercent = this.#isSquareWave 
                ? i / (this.#data.length) 
                : i / (this.#data.length - 1);
            const yPercent = (value - this.#minDataValue) / (this.#maxDataValue - this.#minDataValue);
            const x = xPercent * this.size.x;
            const y = this.size.y - this.#verticalPadding - yPercent * height;
            this.#graphLine.points.push(new Vec2(x, y));
            if (this.#isSquareWave) {
                const nextXPercent = (i + 1) / (this.#data.length);
                const nextX = nextXPercent * this.size.x;
                this.#graphLine.points.push(new Vec2(nextX, y));
            }
        }

        // zero line
        const yPercent = (-this.#minDataValue) / (this.#maxDataValue - this.#minDataValue);
        this.#zeroLine.points = [
            new Vec2(0, this.size.y - this.#verticalPadding - yPercent * height),
            new Vec2(this.size.x, this.size.y - this.#verticalPadding - yPercent * height)
        ];

        // cursor line
        this.#cursorLine.points = [
            new Vec2(0, 0),
            new Vec2(0, this.size.y)
        ];
    }

}
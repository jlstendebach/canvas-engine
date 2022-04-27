import { LabelView } from "../LabelView.js";
import { RectangleView } from "../shapes/RectangleView.js";
import { View } from "../View.js"

import { Vec2 } from "../../../math/index.js"

// ==[ PieChartSlice ]==========================================================
export class PieChartSlice {
    constructor(name = "", value = 0, color = null) {
        this.name = name;
        this.value = value;
        this.color = color;
        this.sAngle = 0;
        this.eAngle = 0;
    }
}

// ==[ PieChartTooltip ]========================================================
export class PieChartTooltip extends RectangleView {
    constructor(w, h) {
        super(w, h);
        this.padding = 8;
        this.topLabel = new LabelView();
        this.bottomLabel = new LabelView();

        this.initSelf();
        this.initTopLabel();
        this.initBottomLabel();
    }

    // --[ init ]---------------------------------------------------------------
    initSelf() {
        this.setFillColor("#ffffffef");
        this.setStrokeColor("#aaaaaa");
    }

    initTopLabel() {
        this.topLabel.setFillColor("black");
        this.topLabel.setFontSize(14);

        this.topLabel.setShrinkX(true);
        this.topLabel.setShrinkY(true);
        this.topLabel.setGrowX(true);
        this.topLabel.setGrowY(true);
        this.topLabel.setWordWrap(true);
        this.topLabel.setClip(false);

        this.addView(this.topLabel);
    }

    initBottomLabel() {
        this.bottomLabel = new LabelView();
        this.bottomLabel.setFillColor("black");
        this.bottomLabel.setFontSize(14);
        this.bottomLabel.setBold(true);

        this.bottomLabel.setShrinkX(true);
        this.bottomLabel.setShrinkY(true);
        this.bottomLabel.setGrowX(true);
        this.bottomLabel.setGrowY(true);
        this.bottomLabel.setWordWrap(false);
        this.bottomLabel.setClip(false);

        this.addView(this.bottomLabel);
    }

    // --[ padding ]------------------------------------------------------------
    getPadding() { return this.padding; }
    setPadding(padding) { this.padding = padding; }

    // --[ drawing ]------------------------------------------------------------
    drawSelf(context) {
        this.layout(context);
        super.drawSelf(context);
    }

    // --[ helpers ]------------------------------------------------------------
    layout(context) {
        // Top label
        this.topLabel.setX(this.getPadding());
        this.topLabel.setY(this.getPadding());
        this.topLabel.setWidth(this.getWidth() - this.getPadding() * 2);
        this.topLabel.measureIfNeeded(context);

        // Bottom label
        this.bottomLabel.setX(this.getPadding());
        this.bottomLabel.setY(
            this.topLabel.getY()
            + this.topLabel.getHeight()
            + this.getPadding()
        );
        this.bottomLabel.setWidth(this.getWidth() - this.getPadding() * 2);
        this.bottomLabel.measureIfNeeded(context);

        // This
        this.setHeight(
            this.getPadding() * 3
            + this.topLabel.getHeight()
            + this.bottomLabel.getHeight()
        );

    }

}

// ==[ PieChart ]===============================================================
export class PieChartView extends View {
    constructor() {
        super();
        this.position = new Vec2(0, 0);
        this.radius = 200;
        this.startAngle = -Math.PI / 2;

        this.slices = [];
        this.selectedSlice = null;

        this.defaultColors = [
            "#ff6961",
            "#ffb347",
            "#fdfd96",
            "#44f044",
            "#44f0f0",
            "#44aaf0",
            "#4444f0",
            "#aa44f0",
            "#f044f0"
        ];

        this.tooltip = this.initTooltip(200, 100);


    }

    // --[ initializers ]-------------------------------------------------------
    initTooltip(w, h) {
        const tooltip = new PieChartTooltip(w, h);
        tooltip.setVisible(false);
        tooltip.setPickable(false);
        this.addView(tooltip);
        return tooltip;
    }


    // --[ bounds ]-------------------------------------------------------------
    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    setRadius(radius) { this.radius = radius; }
    getRadius() { return this.radius; }

    isInBounds(x, y) {
        return Math.sqrt(Math.pow(x - this.getX(), 2) + Math.pow(y - this.getY(), 2)) < this.getRadius();
    }


    // --[ data ]---------------------------------------------------------------
    addData(name, value, color = null) {
        this.slices.push(new PieChartSlice(name, value, color));
    }

    removeAllData() {
        this.slices = [];
    }

    sortDataByValueAsc() {
        let sorted = [];

        for (let i = 0; i < this.slices.length; ++i) {
            let added = false;

            for (let j = 0; j < sorted.length; ++j) {
                if (this.slices[i].value <= sorted[j].value) {
                    sorted.splice(j, 0, this.slices[i]);
                    added = true;
                    break;
                }
            }

            if (!added) {
                sorted.push(this.slices[i]);
            }
        }

        this.slices = sorted;
    }

    sortDataByValueDesc() {
        let sorted = [];

        for (let i = 0; i < this.slices.length; ++i) {
            let added = false;

            for (let j = 0; j < sorted.length; ++j) {
                if (this.slices[i].value >= sorted[j].value) {
                    sorted.splice(j, 0, this.slices[i]);
                    added = true;
                    break;
                }
            }

            if (!added) {
                sorted.push(this.slices[i]);
            }
        }

        this.slices = sorted;
    }


    // --[ drawing ]------------------------------------------------------------
    fillSlices(context) {
        for (let i = 0; i < this.slices.length; ++i) {
            let slice = this.slices[i];
            const radius = (slice === this.selectedSlice)
                ? this.getRadius() + 8
                : this.getRadius();
            const color = this.getColorForSlice(i);

            // Define the path
            context.beginPath();
            context.arc(0, 0, radius, slice.sAngle, slice.eAngle);
            context.lineTo(0, 0);
            context.closePath();

            // Fill slice
            context.fillStyle = color;
            context.fill();
        }
    }

    strokeSlices(context) {
        context.beginPath();

        for (let i = 0; i < this.slices.length; ++i) {
            let slice = this.slices[i];
            const radius = (slice === this.selectedSlice)
                ? this.getRadius() + 8
                : this.getRadius();
            const color = this.getColorForSlice(i);

            // Define the path
            context.moveTo(0, 0);
            context.arc(0, 0, radius, slice.sAngle, slice.eAngle);
            context.lineTo(0, 0);
        }

        // Stroke all slices
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();
    }

    drawLabels(context) {
        let total = this.calcTotal();

        context.fillStyle = "black";

        for (let i = 0; i < this.slices.length; ++i) {
            let slice = this.slices[i];
            const radius = (slice === this.selectedSlice)
                ? this.getRadius() + 8
                : this.getRadius();
            const text = (100 * slice.value / total).toFixed(1) + "%";
            const color = this.getColorForSlice(i);

            // Draw value text
            if (slice.eAngle - slice.sAngle > Math.PI * 2 / 36) {
                // Contrast and color brightness: https://www.w3.org/TR/AERT/#color-contrast
                let r = parseInt(color.slice(1, 3), 16);
                let g = parseInt(color.slice(3, 5), 16);
                let b = parseInt(color.slice(5, 7), 16);
                let brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);

                context.fillStyle = (brightness > 125) ? 'black' : 'white';
                context.fillText(
                    text,
                    Math.cos((slice.sAngle + slice.eAngle) / 2) * (radius - 30),
                    Math.sin((slice.sAngle + slice.eAngle) / 2) * (radius - 30)
                );
            }
        }
    }

    drawSurroundLegend(context) {
        const self = this;
        const lineOffset = 20;
        const textOffset = 2;
        const padding = 4;
        const a90 = Math.PI / 2;
        const a180 = Math.PI;
        const a270 = 3 * Math.PI / 2;
        const a360 = 2 * Math.PI;

        let quadrants = {
            bottomRight: [], //   0 <= angle < 90
            bottomLeft: [],  //  90 <= angle < 180
            topLeft: [],     // 180 <= angle < 270
            topRight: []     // 270 <= angle < 360
        };

        const addSorted = function (array, slice) {
            let midAngle = self.clampAngle((slice.sAngle + slice.eAngle) / 2);

            for (let i = 0; i < array.length; ++i) {
                let arrayMidAngle = self.clampAngle((array[i].sAngle + array[i].eAngle) / 2);
                if (midAngle <= arrayMidAngle) {
                    array.splice(i, 0, slice);
                    return;
                }
            }

            array.push(slice);
        }

        // Sort each slice into their quadrants by midAngle. 
        for (let i = 0; i < this.slices.length; ++i) {
            let slice = this.slices[i];
            let midAngle = this.clampAngle((slice.sAngle + slice.eAngle) / 2);

            if (midAngle >= 0 && midAngle < a90) { // bottom right [0, 90)
                addSorted(quadrants.bottomRight, slice);

            } else if (midAngle >= a90 && midAngle < a180) { // bottom left [90, 180)
                addSorted(quadrants.bottomLeft, slice);

            } else if (midAngle >= a180 && midAngle < a270) { // top left [180, 270)
                addSorted(quadrants.topLeft, slice);

            } else if (midAngle >= a270 && midAngle < a360) { // top right [270, 360)
                addSorted(quadrants.topRight, slice);
            }
        }


        // Draw labels for each quadrants   
        context.lineWidth = 1;
        context.fillStyle = "black";
        context.strokeStyle = "black";

        for (let i = 0; i < 4; ++i) {
            const ascend = (i === 0 || i === 2);
            let quadrant = [];
            if (i === 0) {
                quadrant = quadrants.bottomRight;
            } else if (i === 1) {
                quadrant = quadrants.bottomLeft;
            } else if (i === 2) {
                quadrant = quadrants.topLeft;
            } else if (i === 3) { quadrant = quadrants.topRight; }

            let lastLabel = null;

            for (let j = 0; j < quadrant.length; ++j) {
                const k = (ascend ? j : quadrant.length - 1 - j);
                const slice = quadrant[k];
                const midAngle = (slice.sAngle + slice.eAngle) / 2;
                const v1 = Vec2.fromAngle(midAngle).scale(this.getRadius() + 2);
                const v2 = Vec2.fromAngle(midAngle).scale(this.getRadius() + lineOffset);
                const v3 = Vec2.copy(v2);

                // Setup the label
                let label = new LabelView();
                label.setWidth(200);
                label.setWordWrap(true);
                label.setText(slice.name);
                label.setFillColor("black");
                label.measureIfNeeded(context);

                if (v2.y >= 0) {
                    label.setY(v2.y - label.getLineHeight() / 2);
                } else {
                    label.setY(v2.y - label.getHeight() + label.getLineHeight() / 2);
                }

                if (v2.x >= 0) {
                    label.setX(v2.x + lineOffset + textOffset);
                    v3.x = v2.x + lineOffset;

                } else {
                    label.setAlignment(LabelViewOptions.RIGHT);
                    label.setX(v2.x - label.getWidth() - lineOffset - textOffset);
                    v3.x = v2.x - lineOffset;
                }

                // Shift the label up or down
                if (i < 2) { // bottom slices, push labels down
                    if (
                        lastLabel !== null
                        && label.getY() < lastLabel.getY() + lastLabel.getHeight() + padding) {
                        // push down
                        const dy = lastLabel.getY() + lastLabel.getHeight() + padding - label.getY();
                        label.setY(label.getY() + dy);
                        v2.y += dy;
                    }

                } else { // top slices, push labels up
                    if (
                        lastLabel !== null
                        && label.getY() + label.getHeight() + padding > lastLabel.getY()) {
                        // push up
                        const dy = lastLabel.getY() - padding - label.getHeight() - label.getY();
                        label.setY(label.getY() + dy);
                        v2.y += dy;
                    }
                }

                // Draw the line
                context.beginPath();
                context.moveTo(v1.x, v1.y);
                context.lineTo(v2.x, v2.y);
                context.lineTo(v3.x, v2.y);
                context.stroke();

                // Draw the label        
                label.draw(context);

                // Store this label for the next pass
                lastLabel = label;
            }
        }

    }

    drawVerticalLegend(context, x, y) {
        const boxSize = 20; // pixels
        const padding = 8;

        context.textAlign = "start";
        context.textBaseline = "middle";

        for (let i = 0; i < this.slices.length; ++i) {
            let s = this.slices[i];
            let boxX = x;
            let boxY = y + padding * i + boxSize * i;
            let textX = boxX + boxSize + padding;
            let textY = boxY + boxSize / 2

            // Draw the box
            context.beginPath();
            context.fillStyle = this.getColorForSlice(i);
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.rect(boxX, boxY, boxSize, boxSize);

            context.fill();
            context.stroke();

            // Draw text
            context.fillStyle = "black";

        }
    }

    drawSelf(context) {
        this.updateSlices();

        // Save the context to reverse the translation.
        context.save();

        // Set default style values
        context.font = "14px Arial";
        context.lineCap = "round";
        context.lineWidth = 2;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.translate(this.getX(), this.getY());

        // Draw
        this.fillSlices(context);
        this.strokeSlices(context);
        this.drawLabels(context);
        this.drawSurroundLegend(context);
        //this.drawVerticalLegend(context, this.getRadius()+30, -this.getRadius());

        /*
        context.beginPath();
        context.moveTo(-1000, 0);
        context.lineTo(1000, 0);
        context.moveTo(0, -1000);
        context.lineTo(0, 1000);
        context.stroke();
        */

        // Restore the context to reverse the translation.
        context.restore();
    }


    // --[ events ]-------------------------------------------------------------
    onMouseMove(event) {
        super.onMouseMove(event);

        const localX = event.x - this.getX();
        const localY = event.y - this.getY();
        const slice = this.pickSlice(event.x, event.y);

        if (slice !== null) {
            const total = this.calcTotal();
            const name = slice.name;
            const value = slice.value + " (" + (100 * slice.value / total).toFixed(1) + "%)";

            this.setSelectedSlice(slice);

            this.tooltip.setVisible(true);
            this.tooltip.topLabel.setText(name);
            this.tooltip.bottomLabel.setText(value);
            this.tooltip.setX(event.x - this.getX() - this.tooltip.getWidth() - 4);
            this.tooltip.setY(event.y - this.getY() - this.tooltip.getHeight() - 4);
        }
    }

    onMouseExit(event) {
        super.onMouseEnter(event);
        this.setSelectedSlice(null);
        this.tooltip.setVisible(false);
    }

    onMouseDrag(event) {
        super.onMouseDrag(event);
        this.setSelectedSlice(null);
        this.tooltip.setVisible(false);
    }


    // --[ helpers ]------------------------------------------------------------
    clampAngle(radians) {
        const tau = 2 * Math.PI;

        if (radians < 0) {
            return tau - (-radians % tau);
        } else {
            return radians % tau;
        }
    }

    calcTotal() {
        let total = 0;
        for (let i = 0; i < this.slices.length; ++i) {
            total += this.slices[i].value;
        }
        return total;
    }

    setSelectedSlice(slice) {
        this.selectedSlice = slice;
    }

    updateSlices() {
        // Total the data
        let total = this.calcTotal();

        let sAngle = this.startAngle;
        for (let i = 0; i < this.slices.length; ++i) {
            let slice = this.slices[i];

            // Determine the angle
            let ratio = slice.value / total;
            let eAngle = sAngle + ratio * Math.PI * 2;

            if (i === 0) {
                let mAngle = (eAngle - sAngle) / 2;
                sAngle -= mAngle;
                eAngle -= mAngle;
            }

            // Update the slice.
            slice.sAngle = sAngle;
            slice.eAngle = eAngle;

            // Set the new starting angle.
            sAngle = eAngle;
        }
    }


    pickSlice(x, y) {
        if (this.isInBounds(x, y) && this.slices.length > 0) {
            // Find the angle between the starting vector and the vector from the 
            // center to (x,y).
            let startVec = new Vec2(1, 0).rotate(this.slices[0].sAngle);
            let pickVec = new Vec2(x - this.getX(), y - this.getY());
            let pickAngle = Vec2.angleTau(startVec, pickVec);

            // Find the slice
            let sAngle = 0;
            let eAngle = 0;
            for (let i = 0; i < this.slices.length; ++i) {
                let s = this.slices[i];
                sAngle = eAngle; // start angle is the end angle from last pass
                eAngle = sAngle + Math.abs(s.eAngle - s.sAngle);

                if (pickAngle >= sAngle && pickAngle <= eAngle) {
                    return s;
                }
            }
        }

        return null;
    }

    getColorForSlice(index) {
        const slice = this.slices[index];
        return (slice.color === null
            ? this.defaultColors[index % this.defaultColors.length]
            : slice.color
        );
    }

}
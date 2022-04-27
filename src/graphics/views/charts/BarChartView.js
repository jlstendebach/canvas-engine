import { LabelView } from "../LabelView.js";
import { RectangleView } from "../shapes/RectangleView.js";
import { View } from "../View.js"

import { Vec2 } from "../../../math/index.js"

// ==[ BarChartTooltip ]========================================================
export class BarChartTooltip extends RectangleView {
    constructor(w, h) {
        super(w, h);
        this.padding = 8;
        this.topLabel = new LabelView();
        this.bottomLabel = new LabelView();

        this.desiredWidth = w;

        this.initSelf();
        this.initTopLabel();
        this.initBottomLabel();
    }

    // --[ init ]---------------------------------------------------------------
    initSelf() {
        this.setFillStyle("#ffffffef");
        this.setStrokeStyle("#aaaaaa");
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
        this.topLabel.setWidth(this.desiredWidth - 2 * this.getPadding());
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
        this.setWidth(
            this.getPadding() * 2
            + Math.max(this.topLabel.getWidth(), this.bottomLabel.getWidth())
        );
        this.setHeight(
            this.getPadding() * 3
            + this.topLabel.getHeight()
            + this.bottomLabel.getHeight()
        );

    }

}

// ==[ BarChartDataSource ]=====================================================
export class BarChartDataSource {
    constructor() {
        this.data = [];
        this.max = 0;
    }

    add(name, value, color) {
        this.data.push({
            name: name,
            value: value,
            color: color
        });
        this.max = this.considerForMax(value);
    }

    remove(i) {
        let removed = this.data.splice(i, 1);
        let obj = null;

        if (removed.length > 0) {
            obj = removed[0];
            if (this.max === obj.value) {
                this.calcMax();
            }
        }

        return obj;
    }

    get(i) {
        return this.data[i];
    }

    count() {
        return this.data.length;
    }

    clear() {
        this.data = [];
        this.max = 0;
    }

    calcMax() {
        this.max = 0;
        for (let i = 0; i < this.data.length; ++i) {
            this.max = this.considerForMax(this.data[i].value);
        }
    }

    considerForMax(value) {
        //return Math.max(this.max, Math.ceil(value*1.02));
        return Math.max(this.max, Math.ceil(value));
    }

}

// ==[ BarChart ]===============================================================
export class BarChartView extends View {
    constructor(w, h) {
        super();
        this.position = new Vec2();
        this.size = new Vec2(w, h);

        this.barData = new BarChartDataSource();
        this.barViews = [];
        this.selectedBar = null;

        this.leftLabels = [];
        this.bottomLabels = [];

        this.graphArea = { x1: 0, y1: 0, x2: 0, y2: 0 }
        this.padding = { left: 10, right: 10, top: 10, bottom: 10 }

        this.tooltip = this.initTooltip(200, 100);
    }

    // --[ initializers ]-------------------------------------------------------
    initTooltip(w, h) {
        const tooltip = new BarChartTooltip(w, h);
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

    setWidth(w) { this.size.x = w; }
    getWidth() { return this.size.x; }

    setHeight(h) { this.size.y = h; }
    getHeight() { return this.size.y; }

    isInBounds(x, y) {
        return (
            x >= this.getX()
            && y >= this.getY()
            && x < this.getX() + this.getWidth()
            && y < this.getY() + this.getHeight()
        );
    }

    // --[ data ]---------------------------------------------------------------
    /*
     * [
     *   {
     *     name: "name",
     *     value: #,
     *     color: "color"
     *   },  
     *   {
     *     name: "name",
     *     value: #,
     *     color: "color"
     *   },
     *   ...
     * ]
     */
    setData(data) {
        this.barData.clear();
        for (let i = 0; i < data.length; ++i) {
            this.barData.add(data[i].name, data[i].value, data[i].color);
        }
    }

    getBar(i) {
        return {
            index: i,
            data: (i < this.barData.count() ? this.barData.get(i) : null),
            view: (i < this.barViews.length ? this.barViews[i] : null)
        }
    }

    sortDataByValueDesc() {
        let sorted = [];

        for (let i = 0; i < this.barData.count(); ++i) {
            let added = false;

            for (let j = 0; j < sorted.length; ++j) {
                if (this.barData.get(i).value >= sorted[j].value) {
                    sorted.splice(j, 0, this.barData.get(i));
                    added = true;
                    break;
                }
            }

            if (!added) {
                sorted.push(this.barData.get(i));
            }
        }

        this.setData(sorted);
    }

    // --[ drawing ]------------------------------------------------------------
    layout(context) {
        // Generate initial graphArea based off of padding
        this.graphArea.x1 = this.padding.left;
        this.graphArea.y1 = this.padding.top;
        this.graphArea.x2 = this.getWidth() - this.padding.right;
        this.graphArea.y2 = this.getHeight() - this.padding.bottom;

        // Create and measure the left labels. This affects graphArea.x1.
        this.createAndMeasureLeftLabels(context);

        // Create and measure the bottom labels. This affects graphArea.y2 and 
        // graphArea.x2.
        this.layoutBottomLabels(context);

        // Layout the bars next so that we can reference their position when laying 
        // out the left labels.
        this.layoutBars();

        // Finally, layout the left labels. These have already been created, so we 
        // just need to position them based on the bars.
        this.layoutLeftLabels(context);
    }

    createAndMeasureLeftLabels(context) {
        const offset = 10;
        const labelWidth =
            this.getWidth() / 3
            - this.padding.left
            - this.padding.right
            - offset;
        let maxWidth = 0;

        this.leftLabels = [];

        // Create and measure each label
        for (let i = 0; i < this.barData.count(); ++i) {
            let data = this.barData.get(i);

            let label = new LabelView();
            label.setAlignment(LabelViewOptions.RIGHT);
            label.setAnchorX(1.0);
            label.setAnchorY(0.5);
            label.setClip(true);
            label.setFontSize(11);
            label.setGrowX(false);
            label.setGrowY(true);
            label.setShrinkX(true);
            label.setShrinkY(true);
            label.setText(data.name);
            label.setWidth(labelWidth);
            label.setWordWrap(true);

            label.measureIfNeeded(context);
            this.leftLabels.push(label);

            // Update the label width
            maxWidth = Math.max(maxWidth, label.getWidth());
        }

        // Update the graphArea
        this.graphArea.x1 = this.padding.left + maxWidth + offset;
    }

    layoutBottomLabels(context) {
        const offset = 10;
        const left = this.graphArea.x1;
        const dataMax = Math.ceil(this.barData.max);

        // Get the width of the largest label
        let label = new LabelView();
        label.setFontSize(11);
        label.setGrowX(true);
        label.setShrinkX(true);
        label.setText(dataMax);
        label.measureIfNeeded(context);

        let labelWidth = label.getWidth();
        let labelHeight = label.getLineHeight();

        // Change the graphArea based on the dimensions gathered from the label.
        this.graphArea.y2 =
            this.getHeight()
            - this.padding.bottom
            - labelHeight
            - offset;
        this.graphArea.x2 -= labelWidth / 2;

        let graphWidth = this.graphArea.x2 - this.graphArea.x1;

        // Determine how to step through the data
        let step = Math.ceil(dataMax * labelWidth * 2 / graphWidth);

        if (step > 2 && step < 5) {
            step = 5;
        } else if (step > 5 && step < 10) {
            step = 10;
        } else if (step > 10 && step < 20) {
            step = 20;
        } else if (step > 20 && step < 25) {
            step = 25;
        } else if (step > 25 && step < 50) {
            step = 50;
        } else if (step > 50 && step < 100) {
            step = 100;
        } else if (step > 100 && step < 200) {
            step = 200;
        } else if (step > 200 && step < 250) {
            step = 250;
        } else if (step > 250 && step < 500) {
            step = 500;
        } else if (step > 500 && step < 1000) { step = 1000; }

        // Create each label
        this.bottomLabels = [];

        for (let i = 0; i <= dataMax; i += step) {
            // Create and measure
            let label = new LabelView();
            label.setFontSize(11);
            label.setGrowX(true);
            label.setShrinkX(true);
            label.setText(i);
            label.setFillColor("black");
            label.setStrokeColor(null);
            label.setAnchorX(0.5);
            label.setAnchorY(0.0);

            label.measureIfNeeded(context);

            label.setX(left + graphWidth * i / dataMax);
            label.setY(this.graphArea.y2 + offset);
            this.bottomLabels.push(label);
        }
    }

    layoutBars() {
        const barPadding = 2;
        const barLeft = this.graphArea.x1;
        const barHeight = Math.floor(
            (
                this.graphArea.y2
                - this.graphArea.y1
                - (this.barData.count() + 1) * barPadding
            ) / this.barData.count()
        );
        const barWidthMax = this.graphArea.x2 - this.graphArea.x1;

        const totalBarHeight =
            (barHeight + barPadding) * this.barData.count()
            - barPadding

        const top = this.graphArea.y1 + Math.floor(
            (
                this.graphArea.y2
                - this.graphArea.y1
                - totalBarHeight
            ) / 2
        );

        this.barViews = [];

        for (let i = 0; i < this.barData.count(); ++i) {
            let data = this.barData.get(i);
            let y = top + (barPadding + barHeight) * i - 1;
            let w = barWidthMax * data.value / this.barData.max;

            let bar = new RectangleView(w, barHeight);
            bar.setFillStyle(data.color);
            bar.setStrokeStyle(null);
            bar.setStrokeWidth(1);
            bar.setX(barLeft);
            bar.setY(y);
            this.barViews.push(bar);
        }
    }

    layoutLeftLabels(context) {
        for (let i = 0; i < this.leftLabels.length; ++i) {
            let label = this.leftLabels[i];
            let bar = this.barViews[i];

            label.setX(bar.getX() - 10);
            label.setY(bar.getY() + bar.getHeight() / 2);
            label.measureIfNeeded(context);

            if (label.getHeight() > bar.getHeight()) {
                let lineHeight = label.getLineHeight();
                label.setClip(true);
                label.setGrowY(false);
                label.setHeight(Math.max(
                    lineHeight,
                    Math.floor(bar.getHeight() / lineHeight) * lineHeight
                ));
            }
        }
    }

    /*
    drawLeftLabels(context, padding) {
      const labelOffset = 8;
      const labelMarginLeft = 4;
      const labelMarginRight = 2;
      
      // Measure and position each label
      let label = new LabelView();
      label.setText("|");
      label.measure(context);
  
      padding.bottom = Math.max(padding.bottom, label.getHeight()/2 + 1);
      padding.top    = Math.max(padding.top   , label.getHeight()/2 + 1);
      
      const bottom = this.getHeight() - padding.bottom;
      const height = this.getHeight() - padding.bottom - padding.top;
  
      if (height <= 0) { return; }
      
      let step = Math.ceil(this.barData.max*label.getHeight()*3 / height);    
      let labels = [];
      
      if (       step >   2 && step <    5) { step =    5;
      } else if (step >   5 && step <   10) { step =   10;      
      } else if (step >  10 && step <   20) { step =   20;      
      } else if (step >  20 && step <   25) { step =   25;      
      } else if (step >  25 && step <   50) { step =   50;      
      } else if (step >  50 && step <  100) { step =  100;
      } else if (step > 100 && step <  200) { step =  200;
      } else if (step > 200 && step <  250) { step =  250;
      } else if (step > 250 && step <  500) { step =  500;
      } else if (step > 500 && step < 1000) { step = 1000; }
      
      for (let i=0; i<=this.barData.max; i+=step) {
        // Create and measure
        let label = new LabelView();
        label.setText(i);
        label.measure(context);
        label.setX(0);
        label.setY(bottom - height*i/this.barData.max - label.getHeight()/2 - 1);
        label.setFillColor("black");
        label.setStrokeColor(null);
        labels.push(label);
        
        // Calculate the left padding
        padding.left = Math.max(
          padding.left, 
          labelMarginLeft + label.getWidth() + labelMarginRight + labelOffset
        );
      }
  
      // Draw labels 
      for (let i=0; i<labels.length; ++i) {
        let label = labels[i];
        label.setX(padding.left - labelOffset - labelMarginRight - label.getWidth());
        label.draw(context);
      }
      
      // Draw lines to axis
      context.beginPath();
      for (let i=0; i<labels.length; ++i) {
        let label = labels[i];
        context.moveTo(
          label.getX() + label.getWidth() + 2, 
          label.getY() + label.getHeight()/2 + 1
        );
        context.lineTo(
          padding.left,
          label.getY() + label.getHeight()/2 + 1
        );
      }    
      context.stroke();
      
    }
    
    drawAxes(context, padding) {
      const offset = 5;
      
      context.lineCap = "round";
      context.lineWidth = 1;
      context.strokeStyle = "black";
  
      context.beginPath();
      context.moveTo(padding.left, padding.top);
      context.lineTo(padding.left, this.getHeight()-padding.bottom);
      context.lineTo(this.getWidth()-padding.right, this.getHeight()-padding.bottom);
      context.stroke();    
    }
    
    drawBars(context, padding) {
      const barPadding = 4;
      const barBottom = this.getHeight()-padding.bottom;
      const barWidth = (
        this.getWidth()
        - padding.left
        - padding.right
        - (this.barData.count()+1)*barPadding
      ) / this.barData.count();
      const barHeightMax = this.getHeight()-padding.top-padding.bottom;
      
      context.lineWidth = 1;
      context.strokeStyle = "white";
      
      this.barViews = [];
      for (let i=0; i<this.barData.count(); ++i) {
        let data = this.barData.get(i);
        let x = padding.left + barPadding + (barPadding + barWidth)*i
        let h = barHeightMax * data.value/this.barData.max; 
        let y = barBottom - h;
        
        context.fillStyle = data.color;
        context.beginPath();
        context.moveTo(parseInt(x), y+h);
        context.lineTo(parseInt(x), parseInt(y));
        context.lineTo(parseInt(x+barWidth), parseInt(y));
        context.lineTo(parseInt(x+barWidth), y+h);
        context.fill();
        context.stroke();
        
        this.barViews.push({
          x: x,
          y: y,
          w: barWidth,
          h: h,
          name: data.name,
          value: data.value
        });
      }
    }
    
    drawBottomLabels(context, padding) {
      const lineHeight = 4;
      const offset = 2;
      
      
      let label = new LabelView();
      label.setShrinkX(true);
      label.setShrinkY(false);
      label.setGrowX(true);
      label.setGrowY(true);
      label.setWordWrap(true);
      label.setClip(true);
      label.setAlignment(LabelViewOptions.CENTER);
      label.setAnchorX(0.5);
      label.setAnchorY(0.0);
      //label.setAngle(270 * Math.PI/180);
      
      for (let i=0; i<this.barViews.length; ++i) {
        let bar = this.barViews[i];
        let y = bar.y + bar.h + lineHeight + offset;
        
        label.setText(bar.name);
        label.measureIfNeeded(context);
        
        label.setX(bar.x + bar.w/2);
        label.setY(y);
        //label.setWidth((padding.bottom - lineHeight - offset - label.getHeight())*Math.sqrt(2));
        label.setWidth(bar.w-2);
        label.setHeight()
        label.draw(context);
      }
      
      context.beginPath();
      for (let i=0; i<this.barViews.length; ++i) {
        let bar = this.barViews[i];
        let x = bar.x + bar.w/2;
        let y1 = bar.y + bar.h;
        let y2 = y1 + lineHeight;
        context.moveTo(x, y1);
        context.lineTo(x, y2);
      }
      
      context.strokeStyle = "black";
      context.stroke();
      
    }
    */

    drawLeftLabels(context) {
        for (let i = 0; i < this.leftLabels.length; ++i) {
            this.leftLabels[i].draw(context);
        }
    }

    drawBottomLabels(context) {
        for (let i = 0; i < this.bottomLabels.length; ++i) {
            this.bottomLabels[i].draw(context);
        }

        context.beginPath();
        for (let i = 0; i < this.bottomLabels.length; i += 2) {
            let x = this.bottomLabels[i].getX();
            let w = (i < this.bottomLabels.length - 1
                ? this.bottomLabels[i + 1].getX() - x
                : this.graphArea.x2 - x
            );

            context.rect(
                x,
                this.graphArea.y1,
                w,
                this.graphArea.y2 - this.graphArea.y1
            );
        }

        context.fillStyle = "#f0f0f0";
        context.fill();
    }

    drawBars(context) {
        for (let i = 0; i < this.barViews.length; ++i) {
            let bar = this.barViews[i];

            if (this.selectedBar != null && i == this.selectedBar.index) {
                context.shadowBlur = 2;
                context.shadowColor = "rgba(0,0,0,0.5)";
            }

            bar.draw(context);
            context.shadowBlur = 0;

            if (this.selectedBar != null && i == this.selectedBar.index) {
                context.lineWidth = 2;
                context.fillStyle = "rgba(255,255,255,0.5)";
                context.strokeStyle = "white";

                context.beginPath();
                context.rect(bar.getX(), bar.getY(), bar.getWidth(), bar.getHeight());
                context.fill();
                //context.stroke();

            }
        }

    }

    drawAxes(context) {
        const offset = 2;

        context.lineCap = "square";
        context.lineWidth = 1;
        context.strokeStyle = "black";

        context.beginPath();

        // Draw left and bottom axes
        context.moveTo(this.graphArea.x1, this.graphArea.y1);
        context.lineTo(this.graphArea.x1, this.graphArea.y2);
        context.lineTo(this.graphArea.x2, this.graphArea.y2);

        // Draw lines to left labels
        for (let i = 0; i < this.leftLabels.length; ++i) {
            let label = this.leftLabels[i];
            context.moveTo(label.getX() + offset, label.getY());
            context.lineTo(this.graphArea.x1, label.getY());
        }

        // Draw lines to bottom labels
        for (let i = 0; i < this.bottomLabels.length; ++i) {
            let label = this.bottomLabels[i];
            context.moveTo(label.getX(), label.getY() - offset);
            context.lineTo(label.getX(), this.graphArea.y2);
        }

        // Stroke!!!
        context.stroke();
    }

    drawSelf(context) {
        this.layout(context);

        context.save();
        context.translate(this.getX(), this.getY());


        // Draw background
        context.fillStyle = "white";
        context.beginPath();
        context.rect(0, 0, this.getWidth(), this.getHeight());
        context.fill();


        // Draw graph area background
        context.strokeStyle = "#f0f0f0";
        context.beginPath();
        context.rect(
            this.graphArea.x1,
            this.graphArea.y1,
            this.graphArea.x2 - this.graphArea.x1,
            this.graphArea.y2 - this.graphArea.y1
        );
        context.stroke();

        // Draw components    
        this.drawLeftLabels(context);
        this.drawBottomLabels(context);
        this.drawBars(context);
        this.drawAxes(context);

        // Update tooltip 
        if (this.tooltip.getX() < 0) {
            this.tooltip.setX(0);
        }
        if (this.tooltip.getY() < 0) {
            this.tooltip.setY(0);
        }

        context.restore();
    }


    // --[ events ]-------------------------------------------------------------
    onMouseMove(event) {
        super.onMouseMove(event);

        const bar = this.pickBar(event.x, event.y);

        if (bar !== null) {
            const name = bar.data.name;
            const value = bar.data.value;

            this.tooltip.setVisible(true);
            this.tooltip.topLabel.setText(name);
            this.tooltip.bottomLabel.setText(value);
            this.tooltip.setX(event.x - this.getX() - this.tooltip.getWidth() - 4);
            this.tooltip.setY(event.y - this.getY() - this.tooltip.getHeight() - 4);

            this.selectedBar = bar;

        } else {
            this.tooltip.setVisible(false);
            this.selectedBar = null;
        }
    }

    onMouseExit(event) {
        super.onMouseExit(event);
        this.tooltip.setVisible(false);
        this.selectedBar = null;
    }

    onMouseDrag(event) {
        super.onMouseDrag(event);
        this.tooltip.setVisible(false);
        this.selectedBar = null;

        // Vector that points from the center of the chart to the mouse.
        let vecCurrent = new Vec2(
            event.x - this.getX() - this.getWidth() / 2,
            event.y - this.getY() - this.getHeight() / 2
        );
        let vecPrevious = new Vec2(
            vecCurrent.x - event.dx,
            vecCurrent.y - event.dy,
        );

        let vecDiff = new Vec2(
            Math.abs(vecCurrent.x) - Math.abs(vecPrevious.x),
            Math.abs(vecCurrent.y) - Math.abs(vecPrevious.y),
        );

        this.setWidth(this.getWidth() + vecDiff.x * 2);
        this.setHeight(this.getHeight() + vecDiff.y * 2);
    }


    // --[ helpers ]------------------------------------------------------------
    pickBar(x, y) {
        if (this.isInBounds(x, y) && this.barViews.length > 0) {
            let pickVec = new Vec2(x - this.getX(), y - this.getY());

            for (let i = 0; i < this.barViews.length; ++i) {
                let bar = this.barViews[i];
                if (bar.isInBounds(pickVec.x, pickVec.y)) {
                    return this.getBar(i);
                }
            }
        }

        return null;
    }
}
import { View } from "./View.js"
import { Vec2 } from "../../math/index.js"

export class LabelViewOptions { }

LabelViewOptions.LEFT   = 1;
LabelViewOptions.CENTER = 2;
LabelViewOptions.RIGHT  = 3;

LabelViewOptions.GROW_X    = 0x00000001 | 0; // 1 
LabelViewOptions.GROW_Y    = 0x00000002 | 0; // 2
LabelViewOptions.SHRINK_X  = 0x00000004 | 0; // 4
LabelViewOptions.SHRINK_Y  = 0x00000008 | 0; // 8
LabelViewOptions.WORD_WRAP = 0x00000010 | 0; // 16
LabelViewOptions.CLIP      = 0x00000020 | 0; // 32

LabelViewOptions.OVERFLOW_FLAG_MIN = LabelViewOptions.GROW_X;     // 1
LabelViewOptions.OVERFLOW_FLAG_MAX = LabelViewOptions.CLIP * 2 - 1; // 63

export class LabelView extends View {
    // --[ ctor ]---------------------------------------------------------------
    constructor() {
        super();
        this.isValid = false;

        this.position = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.anchor = new Vec2(0, 0);
        this.angle = 0;

        this.text = "";
        this.lines = [];

        this.fontFamily = "Arial";
        this.fontSize = 12;
        this.fontBold = false;
        this.fontItalic = false;
        this.fontCached = "";

        this.lineHeight = 0;
        this.textAlign = LabelViewOptions.LEFT_ALIGN;
        this.overflowFlags = LabelViewOptions.GROW_X | LabelViewOptions.GROW_Y;

        this.fillColor = "black";
        this.strokeColor = null;
        this.strokeWeight = 1;

        this.updateFont();
    }

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        let labelX = this.getX() - this.getAnchorX() * this.getWidth();
        let labelY = this.getY() - this.getAnchorY() * this.getHeight();

        return (
            x >= labelX
            && x < labelX + this.getWidth()
            && y >= labelY
            && y < labelY + this.getHeight()
        );
    }

    /************/
    /* position */
    /************/
    setX(x) {
        this.position.x = x;
    }

    getX() {
        return this.position.x;
    }

    setY(y) {
        this.position.y = y;
    }

    getY() {
        return this.position.y;
    }

    /********/
    /* size */
    /********/
    setWidth(w) {
        if (this.size.x !== w && w >= 0) {
            this.size.x = w;
            this.invalidate();
        }
    }

    getWidth() {
        return this.size.x;
    }

    getHeight() {
        return this.size.y;
    }

    setHeight(h) {
        if (this.size.y !== h && h >= 0) {
            this.size.y = h;
            this.invalidate();
        }
    }

    setLineHeight(h) {
        if (h != this.lineHeight) {
            this.lineHeight = h;
            this.invalidate();
        }
    }

    getLineHeight() {
        return this.lineHeight <= 0 ? this.fontSize : this.lineHeight;
    }

    /**********/
    /* anchor */
    /**********/
    setAnchorX(x) {
        this.anchor.x = x;
    }

    getAnchorX() {
        return this.anchor.x;
    }

    setAnchorY(y) {
        this.anchor.y = y;
    }

    getAnchorY() {
        return this.anchor.y;
    }


    /*********/
    /* angle */
    /*********/
    setAngle(a) {
        this.angle = a;
    }

    getAngle() {
        return this.angle;
    }


    measure(context) {
        context.font = this.getFont();

        // Reset lines. 
        this.lines = [this.getText()];

        /*************/
        /* WORD_WRAP */
        /*************/
        let width = context.measureText(this.getText()).width;

        if (this.isWordWrapping() && width > this.getWidth()) {
            let words = this.getText().split(" ");

            if (words.length > 0) {
                // ---- Measure each word ----
                let wordWidths = [];
                let spaceWidth = context.measureText(" ").width;
                let maxWordWidth = 0;

                for (let i = 0; i < words.length; ++i) {
                    // Add current word width
                    let wordWidth = context.measureText(words[i]).width;
                    wordWidths.push(wordWidth);

                    // Calculate max word width
                    maxWordWidth = Math.max(maxWordWidth, wordWidth);
                }


                // ---- Construct each line ----
                let line = words[0];
                let lineWidth = wordWidths[0];

                this.lines = [];

                // If the label wants to grow and the widest word is greater than the 
                // current width, use the width of the widest word as the testWidth. 
                // This allows multi-word lines that are shorter than maxWordWidth to 
                // exist. E.g. if "mainframe" is the longest word, the line "hack the" 
                // should be able to exist instead of being split into lines "hack" and 
                // "the". The latter should only happen if the label doesn't want to 
                // grow.
                let testWidth = (this.isGrowingX() && maxWordWidth > this.getWidth()
                    ? maxWordWidth
                    : this.getWidth()
                );

                // Reset the label width and recalculate based on line width.
                width = 0;

                // Add words until the line is too long, then move to the next.
                for (let i = 1; i < words.length; ++i) {
                    let word = words[i];
                    let wordWidth = wordWidths[i];

                    if (lineWidth + spaceWidth + wordWidth > testWidth) { // Add line...
                        this.lines.push(line);

                        // Calculate the new label width.
                        width = Math.max(width, lineWidth);

                        // Reset the line and width.
                        line = word;
                        lineWidth = wordWidth;

                    } else { // Update line...
                        // Update the line and width.
                        line += " " + word;
                        lineWidth += spaceWidth + wordWidth;
                    }
                }

                // At this point, the line should either be a single word, or one that 
                // passed the width check. Add it to lines and recalculate the width 
                // one last time.
                this.lines.push(line);
                width = Math.max(width, lineWidth);

            }
        }

        /*********************/
        /* SHRINK_X / GROW_X */
        /*********************/
        if (
            (this.isShrinkingX() && width !== 0 && width < this.getWidth())
            || (this.isGrowingX() && width > this.getWidth())
        ) {
            this.size.x = width;
        }


        /*********************/
        /* SHRINK_Y / GROW_Y */
        /*********************/
        let height = this.lines.length * this.getLineHeight();

        if (
            (height > this.getHeight() && this.isGrowingY())
            || (height < this.getHeight() && this.isShrinkingY())
        ) {
            this.size.y = height;
        }

        // All sizes and settings should not be correct
        this.validate();
    }

    measureIfNeeded(context) {
        if (!this.isValid) {
            this.measure(context);
        }
    }


    // --[ options ]------------------------------------------------------------
    /**********/
    /* GROW_X */
    /**********/
    setGrowX(g) {
        if (g) {
            this.addOverflowFlags(LabelViewOptions.GROW_X);
        } else { this.removeOverflowFlags(LabelViewOptions.GROW_X); }
    }

    isGrowingX() {
        return this.hasOverflowFlags(LabelViewOptions.GROW_X);
    }

    /**********/
    /* GROW_Y */
    /**********/
    setGrowY(g) {
        if (g) {
            this.addOverflowFlags(LabelViewOptions.GROW_Y);
        } else { this.removeOverflowFlags(LabelViewOptions.GROW_Y); }
    }

    isGrowingY() {
        return this.hasOverflowFlags(LabelViewOptions.GROW_Y);
    }

    /************/
    /* SHRINK_X */
    /************/
    setShrinkX(s) {
        if (s) {
            this.addOverflowFlags(LabelViewOptions.SHRINK_X);
        } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_X); }
    }

    isShrinkingX() {
        return this.hasOverflowFlags(LabelViewOptions.SHRINK_X);
    }

    /************/
    /* SHRINK_Y */
    /************/
    setShrinkY(s) {
        if (s) {
            this.addOverflowFlags(LabelViewOptions.SHRINK_Y);
        } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_Y); }
    }

    isShrinkingY() {
        return this.hasOverflowFlags(LabelViewOptions.SHRINK_Y);
    }

    /*************/
    /* WORD_WRAP */
    /*************/
    setWordWrap(w) {
        if (w) {
            this.addOverflowFlags(LabelViewOptions.WORD_WRAP);
        } else { this.removeOverflowFlags(LabelViewOptions.WORD_WRAP); }
    }

    isWordWrapping() {
        return this.hasOverflowFlags(LabelViewOptions.WORD_WRAP);
    }

    /********/
    /* CLIP */
    /********/
    setClip(c) {
        if (c) {
            this.addOverflowFlags(LabelViewOptions.CLIP);
        } else { this.removeOverflowFlags(LabelViewOptions.CLIP); }
    }

    isClipping() {
        return this.hasOverflowFlags(LabelViewOptions.CLIP);
    }

    /********************/
    /* overflow helpers */
    /********************/
    isValidOverflowFlag(flag) {
        return (
            flag >= LabelViewOptions.OVERFLOW_FLAG_MIN
            && flag <= LabelViewOptions.OVERFLOW_FLAG_MAX
        );
    }

    hasOverflowFlags(flags) {
        return (this.overflowFlags & flags) === flags;
    }

    addOverflowFlags(flags) {
        const newOverflowFlags = this.overflowFlags | flags;

        if (this.overflowFlags !== newOverflowFlags) {
            this.overflowFlags = newOverflowFlags;
            this.invalidate();
        }
    }

    removeOverflowFlags(flags) {
        const newOverflowFlags = this.overflowFlags & ~flags;

        if (this.overflowFlags !== newOverflowFlags) {
            this.overflowFlags = newOverflowFlags;
            this.invalidate();
        }
    }


    /*************/
    /* textAlign */
    /*************/
    setAlignment(align) {
        this.textAlign = align;
    }


    // --[ text ]---------------------------------------------------------------
    setText(text) {
        if (this.text !== text) {
            this.text = text;
            this.invalidate();
        }
    }

    getText() {
        return this.text;
    }


    // --[ font ]---------------------------------------------------------------
    /***************/
    /* font family */
    /***************/
    setFontFamily(family) {
        if (this.fontFamily !== family) {
            this.fontFamily = family;
            this.updateFont();
        }
    }

    getFontFamily() {
        return this.fontFamily;
    }


    /*************/
    /* font size */
    /*************/
    setFontSize(size) {
        if (this.fontSize !== size) {
            this.fontSize = size;
            this.updateFont();
        }
    }

    getFontSize() {
        return this.fontSize;
    }


    /****************/
    /* font options */
    /****************/
    setBold(bold) {
        if (bold !== this.fontBold) {
            this.fontBold = bold;
            this.updateFont();
        }
    }

    isBold() {
        return this.fontBold;
    }

    setItalic(italic) {
        if (italic != this.fontItalic) {
            this.fontItalic = italic;
            this.updateFont();
        }
    }

    isItalic() {
        return this.fontItalic;
    }


    /***************/
    /* cached font */
    /***************/
    getFont() {
        return this.fontCached;
    }

    updateFont() {
        this.fontCached = "";
        if (this.isBold()) { this.fontCached = "bold "; }
        if (this.isItalic()) { this.fontCached += "italic "; }
        this.fontCached += this.fontSize + "px " + this.fontFamily;

        this.invalidate();
    }


    // --[ color ]--------------------------------------------------------------
    setFillColor(color) {
        this.fillColor = color;
    }

    getFillColor() {
        return this.fillColor;
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    getStrokeColor() {
        return this.strokeColor;
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
    }

    getStrokeWidth() {
        return this.strokeWidth;
    }


    // --[ drawing ]------------------------------------------------------------
    drawSelf(context) {
        context.save();

        // Measurement must happen first! Widths or heights referenced prior to 
        // measurement will likely be incorrect
        this.measureIfNeeded(context);

        // Perform the translation and rotation of the canvas.
        const anchorX = this.getWidth() * this.getAnchorX();
        const anchorY = this.getHeight() * this.getAnchorY();

        context.translate(this.getX(), this.getY());
        if (this.getAngle() != 0) {
            context.rotate(this.getAngle());
        }
        context.translate(-anchorX, -anchorY);

        // Determine the position of the text
        let textX = 0;
        let textY = 0;

        if (this.textAlign === LabelViewOptions.RIGHT) {
            textX += this.getWidth();
            context.textAlign = "end";

        } else if (this.textAlign === LabelViewOptions.CENTER) {
            textX += this.getWidth() / 2;
            context.textAlign = "center";

        } else {
            context.textAlign = "start";
        }

        // Clip
        if (this.isClipping()) {
            context.beginPath();
            context.rect(
                0,
                0,
                this.getWidth(),
                this.getHeight() + this.getFontSize() * 0.1
            );
            //context.strokeStyle = "black";
            //context.stroke();
            context.clip();

        }

        // Setup values for drawing
        context.font = this.fontCached;
        context.lineJoin = "round";
        context.miterLimit = 2;
        context.textBaseline = "top";

        let lineHeight = this.getLineHeight();

        // Stroke 
        if (this.getStrokeColor() !== null && this.getStrokeWidth() > 0) {
            context.lineWidth = this.getStrokeWidth() * 2;
            context.strokeStyle = this.getStrokeColor();
            for (let i = 0; i < this.lines.length; ++i) {
                context.strokeText(this.lines[i], textX, textY + i * lineHeight);
            }
        }

        // Fill
        if (this.getFillColor() !== null) {
            context.lineWidth = 1;
            context.fillStyle = this.getFillColor();
            for (let i = 0; i < this.lines.length; ++i) {
                context.fillText(this.lines[i], textX, textY + i * lineHeight);
            }
        }

        context.restore();
    }


    // --[ helpers ]------------------------------------------------------------
    invalidate() {
        this.isValid = false;
    }

    validate() {
        this.isValid = true;
    }

}
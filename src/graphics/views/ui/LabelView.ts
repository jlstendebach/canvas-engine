import { Vec2 } from "../../../math/Vec2.js";
import { View } from "../core/View.js";

// MARK: - LabelViewOptions
export const LabelViewOptions = Object.freeze({
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3,

    GROW_X: 0x00000001 | 0, // 1 
    GROW_Y: 0x00000002 | 0, // 2
    SHRINK_X: 0x00000004 | 0, // 4
    SHRINK_Y: 0x00000008 | 0, // 8
    WORD_WRAP: 0x00000010 | 0, // 16
    CLIP: 0x00000020 | 0, // 32

    OVERFLOW_FLAG_MIN: 1,
    OVERFLOW_FLAG_MAX: 63
} as const);

export type LabelViewOptions = (typeof LabelViewOptions)[keyof typeof LabelViewOptions];


// MARK: - LabelView
export class LabelView extends View {
    #isValid: boolean = false;

    #size: Vec2 = new Vec2();
    #anchor: Vec2 = new Vec2();
    #angle: number = 0;

    #text: string = "";
    #lines: string[] = [];

    #fontFamily: string = "Arial";
    #fontSize: number = 12;
    #fontBold: boolean = false;
    #fontItalic: boolean = false;
    #fontCached: string = "";

    #lineHeight: number = 0;
    #textAlign: LabelViewOptions = LabelViewOptions.LEFT;
    #overflowFlags: LabelViewOptions = LabelViewOptions.GROW_X | LabelViewOptions.GROW_Y;

    #fillColor: string = "black";
    #strokeColor: string | null = null;
    #strokeWidth: number = 1;

    // --[ ctor ]---------------------------------------------------------------
    constructor(text: string = "") {
        super();
        this.#text = text;
        this.updateFont();
    }

    // --[ bounds ]-------------------------------------------------------------
    override containsPoint(point: Vec2): boolean {
        const labelX = this.x - this.getAnchorX() * this.getWidth();
        const labelY = this.y - this.getAnchorY() * this.getHeight();

        return (
            point.x >= labelX
            && point.x < labelX + this.getWidth()
            && point.y >= labelY
            && point.y < labelY + this.getHeight()
        );
    }

    /********/
    /* size */
    /********/
    setWidth(w: number): void {
        if (this.#size.x !== w && w >= 0) {
            this.#size.x = w;
            this.invalidate();
        }
    }

    getWidth(): number {
        return this.#size.x;
    }

    getHeight(): number {
        return this.#size.y;
    }

    setHeight(h: number): void {
        if (this.#size.y !== h && h >= 0) {
            this.#size.y = h;
            this.invalidate();
        }
    }

    setLineHeight(h: number): void {
        if (h != this.#lineHeight) {
            this.#lineHeight = h;
            this.invalidate();
        }
    }

    getLineHeight(): number {
        return this.#lineHeight <= 0 ? this.#fontSize : this.#lineHeight;
    }

    /**********/
    /* anchor */
    /**********/
    setAnchorX(x: number): void {
        this.#anchor.x = x;
    }

    getAnchorX(): number {
        return this.#anchor.x;
    }

    setAnchorY(y: number): void {
        this.#anchor.y = y;
    }

    getAnchorY(): number {
        return this.#anchor.y;
    }


    /*********/
    /* angle */
    /*********/
    setAngle(a: number): void {
        this.#angle = a;
    }

    getAngle(): number {
        return this.#angle;
    }


    measure(context: CanvasRenderingContext2D): void {
        context.font = this.getFont();

        // Reset lines. 
        this.#lines = [this.getText()];

        /*************/
        /* WORD_WRAP */
        /*************/
        let width = context.measureText(this.getText()).width;

        if (this.isWordWrapping() && width > this.getWidth()) {
            const words = this.getText().split(" ");

            if (words.length > 0) {
                // ---- Measure each word ----
                const wordWidths: number[] = [];
                const spaceWidth = context.measureText(" ").width;
                let maxWordWidth = 0;

                for (let i = 0; i < words.length; ++i) {
                    // Add current word width
                    const wordWidth = context.measureText(words[i]).width;
                    wordWidths.push(wordWidth);

                    // Calculate max word width
                    maxWordWidth = Math.max(maxWordWidth, wordWidth);
                }

                // ---- Construct each line ----
                let line = words[0];
                let lineWidth = wordWidths[0];

                this.#lines = [];

                // If the label wants to grow and the widest word is greater than the 
                // current width, use the width of the widest word as the testWidth. 
                // This allows multi-word lines that are shorter than maxWordWidth to 
                // exist. E.g. if "mainframe" is the longest word, the line "hack the" 
                // should be able to exist instead of being split into lines "hack" and 
                // "the". The latter should only happen if the label doesn't want to 
                // grow.
                const testWidth = (this.isGrowingX() && maxWordWidth > this.getWidth()
                    ? maxWordWidth
                    : this.getWidth()
                );

                // Reset the label width and recalculate based on line width.
                width = 0;

                // Add words until the line is too long, then move to the next.
                for (let i = 1; i < words.length; ++i) {
                    const word = words[i];
                    const wordWidth = wordWidths[i];

                    if (lineWidth + spaceWidth + wordWidth > testWidth) { // Add line...
                        this.#lines.push(line);

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
                this.#lines.push(line);
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
            this.#size.x = width;
        }


        /*********************/
        /* SHRINK_Y / GROW_Y */
        /*********************/
        const height = this.#lines.length * this.getLineHeight();

        if (
            (height > this.getHeight() && this.isGrowingY())
            || (height < this.getHeight() && this.isShrinkingY())
        ) {
            this.#size.y = height;
        }

        // All sizes and settings should not be correct
        this.validate();
    }

    measureIfNeeded(context: CanvasRenderingContext2D): void {
        if (!this.#isValid) {
            this.measure(context);
        }
    }


    // --[ options ]------------------------------------------------------------
    /**********/
    /* GROW_X */
    /**********/
    setGrowX(g: boolean): void {
        if (g) {
            this.addOverflowFlags(LabelViewOptions.GROW_X);
        } else { this.removeOverflowFlags(LabelViewOptions.GROW_X); }
    }

    isGrowingX(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.GROW_X);
    }

    /**********/
    /* GROW_Y */
    /**********/
    setGrowY(g: boolean): void {
        if (g) {
            this.addOverflowFlags(LabelViewOptions.GROW_Y);
        } else { this.removeOverflowFlags(LabelViewOptions.GROW_Y); }
    }

    isGrowingY(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.GROW_Y);
    }

    /************/
    /* SHRINK_X */
    /************/
    setShrinkX(s: boolean): void {
        if (s) {
            this.addOverflowFlags(LabelViewOptions.SHRINK_X);
        } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_X); }
    }

    isShrinkingX(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.SHRINK_X);
    }

    /************/
    /* SHRINK_Y */
    /************/
    setShrinkY(s: boolean): void {
        if (s) {
            this.addOverflowFlags(LabelViewOptions.SHRINK_Y);
        } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_Y); }
    }

    isShrinkingY(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.SHRINK_Y);
    }

    /*************/
    /* WORD_WRAP */
    /*************/
    setWordWrap(w: boolean): void {
        if (w) {
            this.addOverflowFlags(LabelViewOptions.WORD_WRAP);
        } else { this.removeOverflowFlags(LabelViewOptions.WORD_WRAP); }
    }

    isWordWrapping(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.WORD_WRAP);
    }

    /********/
    /* CLIP */
    /********/
    setClip(c: boolean): void {
        if (c) {
            this.addOverflowFlags(LabelViewOptions.CLIP);
        } else { this.removeOverflowFlags(LabelViewOptions.CLIP); }
    }

    isClipping(): boolean {
        return this.hasOverflowFlags(LabelViewOptions.CLIP);
    }

    /********************/
    /* overflow helpers */
    /********************/
    isValidOverflowFlag(flag: number): boolean {
        return (
            flag >= LabelViewOptions.OVERFLOW_FLAG_MIN
            && flag <= LabelViewOptions.OVERFLOW_FLAG_MAX
        );
    }

    hasOverflowFlags(flags: number): boolean {
        return (this.#overflowFlags & flags) === flags;
    }

    addOverflowFlags(flags: number): void {
        const newOverflowFlags = this.#overflowFlags | flags;

        if (this.#overflowFlags !== newOverflowFlags) {
            this.#overflowFlags = newOverflowFlags;
            this.invalidate();
        }
    }

    removeOverflowFlags(flags: number): void {
        const newOverflowFlags = this.#overflowFlags & ~flags;

        if (this.#overflowFlags !== newOverflowFlags) {
            this.#overflowFlags = newOverflowFlags;
            this.invalidate();
        }
    }


    /*************/
    /* textAlign */
    /*************/
    setAlignment(align: number): void {
        this.#textAlign = align;
    }


    // --[ text ]---------------------------------------------------------------
    setText(text: string): void {
        if (this.#text !== text) {
            this.#text = text;
            this.invalidate();
        }
    }

    getText(): string {
        return this.#text;
    }


    // --[ font ]---------------------------------------------------------------
    /***************/
    /* font family */
    /***************/
    setFontFamily(family: string): void {
        if (this.#fontFamily !== family) {
            this.#fontFamily = family;
            this.updateFont();
        }
    }

    getFontFamily(): string {
        return this.#fontFamily;
    }


    /*************/
    /* font size */
    /*************/
    setFontSize(size: number): void {
        if (this.#fontSize !== size) {
            this.#fontSize = size;
            this.updateFont();
        }
    }

    getFontSize(): number {
        return this.#fontSize;
    }


    /****************/
    /* font options */
    /****************/
    setBold(bold: boolean): void {
        if (bold !== this.#fontBold) {
            this.#fontBold = bold;
            this.updateFont();
        }
    }

    isBold(): boolean {
        return this.#fontBold;
    }

    setItalic(italic: boolean): void {
        if (italic != this.#fontItalic) {
            this.#fontItalic = italic;
            this.updateFont();
        }
    }

    isItalic(): boolean {
        return this.#fontItalic;
    }


    /***************/
    /* cached font */
    /***************/
    getFont(): string {
        return this.#fontCached;
    }

    updateFont(): void {
        this.#fontCached = "";
        if (this.isBold()) { this.#fontCached = "bold "; }
        if (this.isItalic()) { this.#fontCached += "italic "; }
        this.#fontCached += this.#fontSize + "px " + this.#fontFamily;

        this.invalidate();
    }


    // --[ color ]--------------------------------------------------------------
    setFillColor(color: string): void {
        this.#fillColor = color;
    }

    getFillColor(): string {
        return this.#fillColor;
    }

    setStrokeColor(color: string): void {
        this.#strokeColor = color;
    }

    getStrokeColor(): string | null {
        return this.#strokeColor;
    }

    setStrokeWidth(width: number): void {
        this.#strokeWidth = width;
    }

    getStrokeWidth(): number {
        return this.#strokeWidth;
    }


    // --[ drawing ]------------------------------------------------------------
    override onDraw(context: CanvasRenderingContext2D): void {
        context.save();

        // Measurement must happen first! Widths or heights referenced prior to 
        // measurement will likely be incorrect
        this.measureIfNeeded(context);

        // Perform the translation and rotation of the canvas.
        const anchorX = this.getWidth() * this.getAnchorX();
        const anchorY = this.getHeight() * this.getAnchorY();

        if (this.getAngle() != 0) {
            context.rotate(this.getAngle());
        }
        context.translate(-anchorX, -anchorY);

        // Determine the position of the text
        let textX = 0;
        const textY = 0;

        if (this.#textAlign === LabelViewOptions.RIGHT) {
            textX += this.getWidth();
            context.textAlign = "end";

        } else if (this.#textAlign === LabelViewOptions.CENTER) {
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
        context.font = this.#fontCached;
        context.lineJoin = "round";
        context.miterLimit = 2;
        context.textBaseline = "top";

        const lineHeight = this.getLineHeight();

        // Stroke 
        const strokeColor = this.getStrokeColor();
        if (strokeColor !== null && this.getStrokeWidth() > 0) {
            context.lineWidth = this.getStrokeWidth() * 2;
            context.strokeStyle = strokeColor;
            for (let i = 0; i < this.#lines.length; ++i) {
                context.strokeText(this.#lines[i], textX, textY + i * lineHeight);
            }
        }

        // Fill
        if (this.getFillColor() !== null) {
            context.lineWidth = 1;
            context.fillStyle = this.getFillColor();
            for (let i = 0; i < this.#lines.length; ++i) {
                context.fillText(this.#lines[i], textX, textY + i * lineHeight);
            }
        }

        context.restore();
    }


    // --[ helpers ]------------------------------------------------------------
    invalidate(): void {
        this.#isValid = false;
    }

    validate(): void {
        this.#isValid = true;
    }

}
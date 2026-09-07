import { Vec2 } from "../../../math/Vec2.js";
import { View } from "../core/View.js";
export declare class LabelViewOptions {
}
export declare namespace LabelViewOptions {
    var LEFT: number;
    var CENTER: number;
    var RIGHT: number;
    var GROW_X: number;
    var GROW_Y: number;
    var SHRINK_X: number;
    var SHRINK_Y: number;
    var WORD_WRAP: number;
    var CLIP: number;
    var OVERFLOW_FLAG_MIN: number;
    var OVERFLOW_FLAG_MAX: number;
}
export declare class LabelView extends View {
    isValid: boolean;
    size: Vec2;
    anchor: Vec2;
    angle: number;
    text: string;
    lines: any[];
    fontFamily: string;
    fontSize: number;
    fontBold: boolean;
    fontItalic: boolean;
    fontCached: string;
    lineHeight: number;
    textAlign: number;
    overflowFlags: number;
    fillColor: string;
    strokeColor: any;
    strokeWeight: number;
    strokeWidth: any;
    constructor(text?: string);
    containsPoint(point: any): boolean;
    /********/
    /********/
    setWidth(w: any): void;
    getWidth(): number;
    getHeight(): number;
    setHeight(h: any): void;
    setLineHeight(h: any): void;
    getLineHeight(): number;
    /**********/
    /**********/
    setAnchorX(x: any): void;
    getAnchorX(): number;
    setAnchorY(y: any): void;
    getAnchorY(): number;
    /*********/
    /*********/
    setAngle(a: any): void;
    getAngle(): number;
    measure(context: any): void;
    measureIfNeeded(context: any): void;
    /**********/
    /**********/
    setGrowX(g: any): void;
    isGrowingX(): boolean;
    /**********/
    /**********/
    setGrowY(g: any): void;
    isGrowingY(): boolean;
    /************/
    /************/
    setShrinkX(s: any): void;
    isShrinkingX(): boolean;
    /************/
    /************/
    setShrinkY(s: any): void;
    isShrinkingY(): boolean;
    /*************/
    /*************/
    setWordWrap(w: any): void;
    isWordWrapping(): boolean;
    /********/
    /********/
    setClip(c: any): void;
    isClipping(): boolean;
    /********************/
    /********************/
    isValidOverflowFlag(flag: any): boolean;
    hasOverflowFlags(flags: any): boolean;
    addOverflowFlags(flags: any): void;
    removeOverflowFlags(flags: any): void;
    /*************/
    /*************/
    setAlignment(align: any): void;
    setText(text: any): void;
    getText(): string;
    /***************/
    /***************/
    setFontFamily(family: any): void;
    getFontFamily(): string;
    /*************/
    /*************/
    setFontSize(size: any): void;
    getFontSize(): number;
    /****************/
    /****************/
    setBold(bold: any): void;
    isBold(): boolean;
    setItalic(italic: any): void;
    isItalic(): boolean;
    /***************/
    /***************/
    getFont(): string;
    updateFont(): void;
    setFillColor(color: any): void;
    getFillColor(): string;
    setStrokeColor(color: any): void;
    getStrokeColor(): any;
    setStrokeWidth(width: any): void;
    getStrokeWidth(): any;
    onDraw(context: any): void;
    invalidate(): void;
    validate(): void;
}

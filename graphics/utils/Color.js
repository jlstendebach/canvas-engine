export class Color {
    static RED_MASK = 0xff000000;
    static GREEN_MASK = 0x00ff0000;
    static BLUE_MASK = 0x0000ff00;
    static ALPHA_MASK = 0x000000ff;
    static RED_BITS = 24;
    static GREEN_BITS = 16;
    static BLUE_BITS = 8;
    static ALPHA_BITS = 0;
    
    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.value = 0;
        this.setRGBA(r, g, b, a);
    }

    // --[ factory functions ]--------------------------------------------------
    static fromHexString(hex) {
        let color = new Color();
        hex = hex.replace(/#/g, "");

        if (hex.length == 8) { // rrggbbaa
            color.value = parseInt(hex, 16) >>> 0;

        } else if (hex.length == 6) { // rrggbb
            color.value = ((parseInt(hex, 16) << 8) | Color.ALPHA_MASK) >>> 0;

        } else if (hex.length == 4) { // rgba 
            let intVal = parseInt(hex, 16);
            let r = (intVal & 0xf000) >>> 12;
            let g = (intVal & 0x0f00) >>> 8;
            let b = (intVal & 0x00f0) >>> 4;
            let a = (intVal & 0x000f) >>> 0;

            color.setRGBA(r | r << 4, g | g << 4, b | b << 4, a | a << 4);

        } else if (hex.length == 3) { // rgb     
            let intVal = parseInt(hex, 16);
            let r = (intVal & 0xf00) >>> 8;
            let g = (intVal & 0x0f0) >>> 4;
            let b = (intVal & 0x00f) >>> 0;

            color.setRGBA(r | r << 4, g | g << 4, b | b << 4, 255);
        }

        return color;
    }

    static fromString(rgba) {
        let color = new Color();

        // "rgba(".length = 5;
        let valueStr = rgba.substring(5, rgba.length - 1);
        let values = valueStr.split(",");
        color.setRGBA(
            parseInt(values[0]),
            parseInt(values[1]),
            parseInt(values[2]),
            parseInt(values[3] * 255)
        );

        return color;
    }

    static copy(other) {
        let color = new Color();
        color.value = other.value;
        return color;
    }

    // -------------------------------------------------------------------------
    setRGBA(r, g, b, a) {
        this.value = (
            (r << Color.RED_BITS) & Color.RED_MASK
            | (g << Color.GREEN_BITS) & Color.GREEN_MASK
            | (b << Color.BLUE_BITS) & Color.BLUE_MASK
            | (a << Color.ALPHA_BITS) & Color.ALPHA_MASK
        ) >>> 0;
    }

    setRGB(r, g, b) {
        this.setRGBA(r, g, b, this.a);
    }

    /*******/
    /* red */
    /*******/
    set r(r) {
        r = Math.max(0, Math.min(255, r));
        this.value = ((this.value & ~Color.RED_MASK) | (r << Color.RED_BITS)) >>> 0;
    }

    get r() {
        return (this.value & Color.RED_MASK) >>> Color.RED_BITS;
    }


    /*********/
    /* green */
    /*********/
    set g(g) {
        g = Math.max(0, Math.min(255, g));
        this.value = ((this.value & ~Color.GREEN_MASK) | (g << Color.GREEN_BITS)) >>> 0;
    }

    get g() {
        return (this.value & Color.GREEN_MASK) >>> Color.GREEN_BITS;
    }

    /********/
    /* blue */
    /********/
    set b(b) {
        b = Math.max(0, Math.min(255, b));
        this.value = ((this.value & ~Color.BLUE_MASK) | (b << Color.BLUE_BITS)) >>> 0;
    }

    get b() {
        return (this.value & Color.BLUE_MASK) >>> Color.BLUE_BITS;
    }

    /*********/
    /* alpha */
    /*********/
    set a(a) {
        a = Math.max(0, Math.min(255, a));
        this.value = ((this.value & ~Color.ALPHA_MASK) | (a << Color.ALPHA_BITS)) >>> 0;
    }

    get a() {
        return (this.value & Color.ALPHA_MASK) >>> Color.ALPHA_BITS;
    }


    // --[ operations ]---------------------------------------------------------
    add(c) {
        this.setRGBA(
            Math.max(0, Math.min(255, this.r + c.r)),
            Math.max(0, Math.min(255, this.g + c.g)),
            Math.max(0, Math.min(255, this.b + c.b)),
            Math.max(0, Math.min(255, this.a + c.a))
        );
        return this;
    }


    // --[ helpers ]------------------------------------------------------------
    /**
     * This method is preferred over toHexString, as toString's execution is 
     * nearly twice as fast
     */
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a / 255) + ")";
    }

    /**
     * This method exists for convenience only. Method toString is prefered, as 
     * its execution is nearly twice as fast.
     */
    toHexString() {
        return "#" + ("00000000" + this.value.toString(16)).substr(-8);
    }



}

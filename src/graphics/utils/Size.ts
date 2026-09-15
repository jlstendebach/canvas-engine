import { Vec2 } from "../../math/Vec2.js";

export class Size extends Vec2 {
    get width() { 
        return this.x; 
    }
    set width(value) { 
        this.x = value; 
    }

    get height() { 
        return this.y; 
    }
    set height(value) { 
        this.y = value; 
    }
}
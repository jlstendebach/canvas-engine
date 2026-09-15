import { Vec2 } from "../../math/Vec2.js";

export class Size extends Vec2 {
    get width(): number { 
        return this.x; 
    }
    set width(value: number) { 
        this.x = value; 
    }

    get height(): number { 
        return this.y; 
    }
    set height(value: number) { 
        this.y = value; 
    }
}
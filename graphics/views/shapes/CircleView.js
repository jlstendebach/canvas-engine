import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class CircleView extends ShapeView {
    constructor(r) {
        super();
        this.position = new Vec2();
        this.radius = r;
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return (
            Math.sqrt((this.position.x - x) ** 2 + (this.position.y - y) ** 2) <= this.radius
        );
    }

    setX(x) { 
        this.position.x = x; 
        return this; 
    }

    setY(y) { 
        this.position.y = y;
        return this; 
    }

    setPosition(x, y) { 
        this.position.set(x, y); 
        return this; 
    }

    setRadius(r) { 
        this.radius = r; 
        return this;
    }


    // --[ drawing ]------------------------------------------------------------
    path(context) {
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    }

}
import { ShapeView } from "./ShapeView.js"
import { Vec2 } from "../../../math/index.js"

export class PolygonView extends ShapeView {
    constructor(points) {
        super();
        this.position = new Vec2();
        this.rotation = 0;
        this.points = points || [];
    }


    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return false;
    }

    setX(x) { this.position.x = x; }
    getX() { return this.position.x; }

    setY(y) { this.position.y = y; }
    getY() { return this.position.y; }

    // --[ rotation ]-----------------------------------------------------------
    setRotation(angle) { this.rotation = angle; }
    getRotation() { return this.rotation; }

    // --[ points ]-------------------------------------------------------------
    setPoints(points) {
        this.points = points || [];
    }

    addPoint(x, y) {
        let point = null;
        if (!isNaN(x) && !isNaN(y)) { // x and y are both numbers
            point = new Vec2(x, y);

        } else if (typeof x === "object") { // input is a Vec2
            point = x;
        }


        if (point !== null) {
            this.points.push(point);
        }
    }

    removePoint(index) {
        this.points.splice(index, 1);
    }

    removeAllPoints() {
        this.points = [];
    }

    getPoint(index) {
        return this.points[index];
    }

    getPointCount() {
        return this.points.length;
    }


    // --[ drawing ]------------------------------------------------------------
    path(context) {
        if (this.getPointCount() >= 3) {
            let p = (this.rotation !== 0)
                ? Vec2.rotate(this.points[0], this.rotation)
                : this.points[0];

            context.moveTo(this.position.x + p.x, this.position.y + p.y);
            for (let i = 1; i < this.getPointCount(); ++i) {
                p = (this.rotation !== 0)
                    ? Vec2.rotate(this.points[i], this.rotation)
                    : this.points[i];
                context.lineTo(this.position.x + p.x, this.position.y + p.y);
            }
            context.closePath();
        }
    }

    /*
    path(context) {
      if (this.getPointCount() >= 3) {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);      
        context.moveTo(this.points[0].x, this.points[0].y);      
        for (let i = 1; i < this.getPointCount(); ++i) {
          context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.closePath();         
        context.rotate(-this.rotation);            
        context.translate(-this.position.x, -this.position.y);
      }
    }
    */

    drawSelf(context) {
        if (this.getPointCount() >= 3) {
            super.drawSelf(context);
        }
    }

}
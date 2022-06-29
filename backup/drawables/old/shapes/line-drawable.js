class LineDrawable extends Drawable {
  constructor(x1, y1, x2, y2) {
    super();
    

  }


  // --[ position ]-------------------------------------------------------------
  setX1(x) { this.x1 = x; }
  getX1() { return this.x1; }

  setY1(y) { this.y1 = y; }
  getY1() { return this.y1; }

  setX2(x) { this.x2 = x; }
  getX2() { return this.x2; }

  setY2(y) { this.y2 = y; }
  getY2() { return this.y2; }


  // --[ style ]----------------------------------------------------------------
  setStrokeColor(c) { this.strokeColor = c; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(w) { this.strokeWidth = w; }
  getStrokeWidth() { return this.strokeWidth; }


  // --[ drawing ]--------------------------------------------------------------
  draw(context) {
    context.strokeStyle = this.getStrokeColor();
    context.lineWidth = this.getStrokeWidth();
    
    context.beginPath();
    context.moveTo(this.getX1(), this.getY1());
    context.lineTo(this.getX2(), this.getY2());
    context.stroke();
  }
  
}
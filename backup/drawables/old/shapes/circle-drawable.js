class CircleDrawable extends Drawable {  
  constructor(r) {
    super();
    
    this.x = 0;
    this.y = 0;
    this.radius = r;
      
    this.fillColor = "white";
    this.strokeColor = "black";
    this.strokeWidth = 1;
    this.isDashed = false;
  }

  // --[ bounds ]---------------------------------------------------------------
  setX(x) { this.x = x; }
  getX() { return this.x; }

  setY(y) { this.y = y; }
  getY() { return this.y; }

  setRadius(r) { this.radius = r; }
  getRadius() { return this.radius; }

  // ---------------------------------------------------------------------------
  setFillColor(color) { this.fillColor = color; }
  getFillColor() { return this.fillColor; }

  setStrokeColor(color) { this.strokeColor = color; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(width) { this.strokeWidth = width; }
  getStrokeWidth() { return this.strokeWidth; }

  
  setStrokeDashed(dashed) { this.isDashed = dashed; }
  isStrokeDashed() { return this.isDashed; }
  
  // ---------------------------------------------------------------------------
  draw(context) {
    // Draw path
    context.beginPath();
    context.arc(
      this.getX(), 
      this.getY(), 
      this.getRadius(), 
      0, 
      2*Math.PI, 
      false
    );
    
    // Fill, if necessary
    let fillColor = this.getFillColor();
    if (fillColor !== null) {
      context.fillStyle = fillColor;
      context.fill();
    }
    
    // Stroke, if necessary
    let strokeColor = this.getStrokeColor();
    if (strokeColor !== null) {
      context.lineWidth = this.getStrokeWidth();
      context.strokeStyle = strokeColor;
      context.setLineDash(this.isStrokeDashed() 
        ? [context.lineWidth*2] 
        : []
      );
      context.stroke();
    }
  }

}

class RectangleDrawable extends Drawable {
  constructor(w, h) {
    super();
  
    this.x = 0;
    this.y = 0;
    this.width = w;
    this.height = h;
    
    this.fillColor = "white";
    this.strokeColor = "black";
    this.strokeWidth = 1;
  }

  // --[ bounds ]---------------------------------------------------------------
  setX(x) { this.x = x; }
  getX() { return this.x; }

  setY(y) { this.y = y; }
  getY() { return this.y; }

  setWidth(w) { this.width = w; }
  getWidth() { return this.width; }

  setHeight(h) { this.height = h; }
  getHeight() { return this.height; }

  // ---------------------------------------------------------------------------
  setFillColor(color) { this.fillColor = color;  }
  getFillColor() { return this.fillColor;  }

  setStrokeColor(color) { this.strokeColor = color;  }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(width) { this.strokeWidth = width; }
  getStrokeWidth() { return this.strokeWidth; }

  draw(context) {
    // Draw path
    context.beginPath();
    context.rect(
      this.getX(), 
      this.getY(), 
      this.getWidth(), 
      this.getHeight()
    ); 

    // Fill, if necessary
    if (this.getFillColor() !== null) {
      context.fillStyle = this.getFillColor();
      context.fill();
    }
    
    // Stroke, if necessary
    if (this.getStrokeColor() !== null) {
      context.lineCap = "square";
      context.lineWidth = this.getStrokeWidth();
      context.strokeStyle = this.getStrokeColor();
      context.stroke();
    }
  }
  
}

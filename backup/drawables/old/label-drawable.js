class LabelDrawable extends Drawable {
  constructor() {
    super();
    
    this.invalidate();
    
    this.position = new Vec2(0, 0);
    this.size = new Vec2(0, 10);
    
    this.text = "";

    this.fontFamily = "Arial";
    this.fontSize = 12;
    this.isBold = false;
    this.isItalic = false;
    this.fontCached = "";

    this.fillColor = "white";
    this.strokeColor = null;
    this.strokeWeight = 1;
    
    this.updateFont();
  }

  
  // --[ position ]-------------------------------------------------------------
  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }

  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }

  
  // --[ position ]-------------------------------------------------------------
  getWidth() { return this.size.x; }
  getHeight() { return this.size.y; }

  
  setAnchorX(x) { this.anchorX = x; }
  getAnchorX() { return this.anchorX; }
  
  setAnchorY(y) { this.anchorY = y; }
  getAnchorY() { return this.anchorY; }
  
    
  measure(context) {
    context.font = this.getFont();
    this.size.x = context.measureText(this.getText()).width;
    this.validate();
  }

  measureIfNeeded(context) {
    if (!this.isValid) {
      this.measure(context);
    }  
  }


  // --[ text ]-----------------------------------------------------------------
  setText(text) { 
    this.text = text; 
    this.invalidate();
  }

  getText() {
    return this.text;
  }


  // --[ font ]-----------------------------------------------------------------
  /***************/
  /* font family */
  /***************/
  setFontFamily(family) {
    this.fontFamily = family;
    this.updateFont();
  }

  getFontFamily() {
    return this.fontFamily;
  }

  /*************/
  /* font size */
  /*************/
  setFontSize(size) {
    this.size.y = size;
    this.updateFont();
  }

  getFontSize() {
    return this.size.y;
  }

  /****************/
  /* font options */
  /****************/
  setBold(isBold) { this.isBold = isBold; }
  isBold() { return this.isBold; }
  
  /***************/
  /* cached font */
  /***************/
  getFont() {
    return this.fontCached;
  }

  updateFont() {
    this.fontCached = this.size.y+"px "+this.fontFamily;
    this.invalidate();
  }


  // --[ color ]----------------------------------------------------------------
  setFillColor(color) { this.fillColor = color; }
  getFillColor() { return this.fillColor; }

  setStrokeColor(color) { this.strokeColor = color; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWeight(weight) { this.strokeWeight = weight; }
  getStrokeWeight() { return this.strokeWeight; }


  // --[ drawing ]--------------------------------------------------------------
  draw(context) {
    // Determine the position of the text
    this.measureIfNeeded(context);
    const x = this.getX() - this.getWidth()*this.getAnchorX();
    const y = this.getY() - this.getHeight()*this.getAnchorY();

    
    // Setup values for drawing
    context.font         = this.fontCached;
    context.textAlign    = "start";
    context.textBaseline = "top";    
    context.lineJoin     = "round";
    context.miterLimit   = 2;
    
          
    // Stroke 
    if (this.getStrokeColor() !== null && this.getStrokeWeight() > 0) {
      context.lineWidth = this.getStrokeWeight()*2;
      context.strokeStyle = this.getStrokeColor();
      context.strokeText(this.getText(), x, y);
    }

    // Fill
    if (this.getFillColor() !== null) {
      context.lineWidth = 1;
      context.fillStyle = this.getFillColor();
      context.fillText(this.getText(), x, y);
    }
    
    context.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    context.strokeStyle = "black";
    context.stroke();
    
  }
  
  // --[ helpers ]--------------------------------------------------------------
  invalidate() { this.isValid = false; }  
  validate() { this.isValid = true; }
  
}

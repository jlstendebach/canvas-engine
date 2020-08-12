class SceneView extends View {
  constructor() {
    super();
    this.position = new Vec2();
    this.size = new Vec2();

    this.translate = new Vec2();
    this.scale = 1;
    this.rotate = 0;

    this.clip = false;
    
  }
  
  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return this.size.isZero() || (
      x >= this.position.x 
      && x < this.position.x + this.size.x
      && y >= this.position.y
      && y < this.position.y + this.size.y      
    );
  }

  /************/
  /* position */
  /************/
  getX() { return this.position.x; }
  getY() { return this.position.y; }
  
  
  // --[ scale ]----------------------------------------------------------------
  getScaledWidth() { return this.size.x / this.scale; }
  getScaledHeight() { return this.size.y / this.scale; }
  getScaledSize() { return Vec2.div(this.size, this.scale); }

  
  // --[ drawing ]--------------------------------------------------------------
  drawChildren(context) {
    context.save();
    
    // clipping
    if (this.clip && !this.size.isZero()) {
      context.rect(0, 0, this.size.x, this.size.y);
      context.clip();
    }

    // translate, scale, rotate
    context.translate(-this.translate.x, -this.translate.y);
    context.scale(this.scale, this.scale);
    context.rotate(this.rotate);

    // draw children
    super.drawChildren(context);
    
    context.restore();
  }
  
}
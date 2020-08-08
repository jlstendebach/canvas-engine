class Scene extends View {
  constructor() {
    super();
    this.position = new Vec2();
    this.size = new Vec2();
    this.scale = 1;
    this.rotation = 1;
    this.clip = false;
    
  }
  
  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return (
      x >= this.position.x 
      && x < this.position.x + this.size.x
      && y >= this.position.y
      && y < this.position.y + this.size.y
    );
  }

  /************/
  /* position */
  /************/
  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }

  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }
  
  setPosition(p) { this.position = p; }
  getPosition() { return this.position; }
    
  /********/
  /* size */
  /********/
  setWidth(w) { this.size.x = w; }
  getWidth() { return this.size.x; }
  
  setHeight(h) { this.size.y = h; }
  getHeight() { return this.size.y; }
  
  setSize(s) { this.size = s; }
  getSize() { return this.size; }
  
  
  // --[ scale ]----------------------------------------------------------------
  setScale(s) { this.scale = s; }
  getScale() { return this.scale; }
  
  getScaledWidth() { return this.size.x / this.scale; }
  getScaledHeight() { return this.size.y / this.scale; }
  getScaledSize() { return Vec2.div(this.size, this.scale); }

  
  // --[ rotation ]-------------------------------------------------------------
  setRotation(r) { this.rotation = r; }
  getRotation() { return this.rotation; }
  
  
  // --[ clip ]-----------------------------------------------------------------
  setClip(c) { this.clip = c; }
  isClip() { return this.clip; }
  
}
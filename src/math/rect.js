class Rect { 
  constructor(x=0, y=0, w=1, h=1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  // --[ collision ]------------------------------------------------------------
  overlapsRect(rect) {
    return (
      this.x < rect.x + rect.w 
      && this.y < rect.y + rect.h
      && rect.x < this.x + this.w
      && rect.y < this.y + this.h
    );
  }
  
  containsPoint(x, y) {
    return (
      x >= this.x
      && y >= this.y
      && x < this.x + this.w
      && y < this.y + this.h
    );
  }
  
  
}
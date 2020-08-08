// --[ ctor ]-------------------------------------------------------------------
function Vec2Field(w, h) {
  this.field = [];
  this.w = w;
  this.h = h;

  // init field
  for (var x=0; x<w; x++) {
    var vecs = [];
    for (var y=0; y<h; y++) {
      vecs.push(new Vec2(0, 0));
    }
    this.field.push(vecs);
  }
}


// -----------------------------------------------------------------------------
Vec2Field.prototype.getWidth = function() { return this.w; }
Vec2Field.prototype.getHeight = function() { return this.h; }

Vec2Field.prototype.getInterpolated = function(x, y) {
  var new_x = x*(this.w-1);
  var new_y = y*(this.h-1);
  
  var x1 = Math.floor(new_x);
  var x2 = Math.ceil(new_x);
  var y1 = Math.floor(new_y);
  var y2 = Math.ceil(new_y);
  
  var v11 = this.getVector(x1, y1);
  var v12 = this.getVector(x1, y2);
  var v21 = this.getVector(x2, y1);
  var v22 = this.getVector(x2, y2);
  
  // interpolate
  var xa = new_x - x1;
  var ya = new_y - y1;
  
  var v1 = Vec2.interpolate(v11, v12, ya);
  var v2 = Vec2.interpolate(v21, v22, ya);
  
  return Vec2.interpolate(v1, v2, xa);
}

Vec2Field.prototype.setVector = function(x, y, vec) { this.field[x][y] = vec; }
Vec2Field.prototype.getVector = function(x, y) {   
  x = (x < 0 ? 0 : (x >= this.getWidth()  ? this.getWidth()-1  : x));
  y = (y < 0 ? 0 : (y >= this.getHeight() ? this.getHeight()-1 : y));
  return this.field[x][y]; 
}

Vec2Field.prototype.fill = function(vec) {
  for (var x=0; x<this.getWidth(); x++) {
    for (var y=0; y<this.getHeight(); y++) {
      this.setVector(x, y, vec);
    }
  }
}
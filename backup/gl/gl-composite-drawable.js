function GlCompositeDrawable() {
  GlDrawable.call(this);
  this.drawables = [];
}

GlCompositeDrawable.prototype = new GlDrawable();


// methods ---------------------------------------------------------------------
GlCompositeDrawable.prototype.addDrawable = function(d) {
  this.drawables.push(d);
}

GlCompositeDrawable.prototype.removeDrawableByIndex = function(i) {
  var deleted = null;
  
  i = Math.floor(i);
  if (i >= 0 && i < this.drawables.length) {
    deleted = this.drawables.splice(i, 1)[0]; 
  }

  return deleted;
}

GlCompositeDrawable.prototype.removeDrawable = function(d) {
  var index = this.getIndexOfDrawable(d);
  return this.removeDrawableByIndex(index)
}

GlCompositeDrawable.prototype.getDrawable = function(index) {
  return this.drawables[index];
}

GlCompositeDrawable.prototype.getDrawableIndex = function(d) {
  for (var i=0; i<this.drawables.length; i++) {
    var drawable = this.getDrawable(i);
    if (drawable === d) { 
      return i;
    }
  }
  return -1;
}

GlCompositeDrawable.prototype.getDrawableCount = function() {
  return this.drawables.length;
}


// drawing ---------------------------------------------------------------------
GlCompositeDrawable.prototype.drawChildren = function(renderer) {
  for (var i=0; i<this.getDrawableCount(); ++i) {
    this.getDrawable(i).draw(renderer);
  }
}

GlCompositeDrawable.prototype.draw = function(gl) {
  this.drawChildren(gl);
}
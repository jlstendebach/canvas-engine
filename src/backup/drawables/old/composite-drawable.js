class CompositeDrawable extends Drawable {
  constructor() {
    super();
    
    this.drawables = [];  
  }
  
  // ---------------------------------------------------------------------------
  addDrawable(d) {
    this.drawables.push(d);
  }

  getDrawable(index) {
    return this.drawables[index];
  }

  removeDrawableByIndex(i) {
    i = Math.floor(i);
    
    if (i >= 0 && i < this.drawables.length) {
      return this.drawables.splice(i, 1)[0]; 
    }

    return null;
  }

  removeDrawable(d) {
    let index = this.getIndexOfDrawable(d);
    return this.removeDrawableByIndex(index)
  }


  getDrawableIndex(d) {
    for (let i=0; i<this.drawables.length; i++) {
      let drawable = this.getDrawable(i);
      if (drawable === d) { 
        return i;
      }
    }
    return -1;
  }
  
  getDrawableIndexV2(d) {
    return this.drawables.indexOf(d);
  }

  getDrawableCount() {
    return this.drawables.length;
  }

  // --[ drawing ]--------------------------------------------------------------
  drawChildren(context) {
    for (var i=0; i<this.drawables.length; i++) {
      this.getDrawable(i).draw(context);
    }
  }

  draw(context) {
    this.drawChildren(context);
  }  
}

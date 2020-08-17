class ShapeGroupView extends ShapeView {
  constructor() {
    super();
  }
  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return false;
  }
  
  // --[ drawing ]--------------------------------------------------------------
  path(context) {
    for (let i = 0; i < this.views.length; ++i) {
      this.views[i].path(context);
    }
  }

  drawChildren(context) {}
  
  
}
function GlCamera() {
  GlCompositeDrawable.call(this);
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.x_rotation = 0;
  this.y_rotation = 0;
  this.z_rotation = 0;
}

GlCamera.prototype = new GlCompositeDrawable();

// --[ convenience ]------------------------------------------------------------
GlCamera.toRadians = function(degrees) {
  return Math.PI*degrees/180.0;
}

// --[ drawing ]----------------------------------------------------------------
GlCamera.prototype.draw = function(renderer) {
  var mv_matrix = renderer.getModelViewMatrix();
  mv_matrix[12] += -this.x;
  mv_matrix[13] += -this.y;
  mv_matrix[14] += -this.z;

  //mat4.translate(
  //    mv_matrix, mv_matrix, vec3.fromValues([-this.x, -this.y, -this.z]));
  mat4.rotateX(mv_matrix, mv_matrix, -GlCamera.toRadians(this.x_rotation));
  mat4.rotateY(mv_matrix, mv_matrix, -GlCamera.toRadians(this.y_rotation));
//  mat4.rotateZ(mv_matrix, mv_matrix, -GlCamera.toRadians(this.z_rotation));  

  
//  this.y += .05;

  
  renderer.pushModelViewMatrix();
  renderer.setModelViewMatrix(mv_matrix);
  GlCompositeDrawable.prototype.draw.call(this, renderer);
  renderer.popModelViewMatrix();
}


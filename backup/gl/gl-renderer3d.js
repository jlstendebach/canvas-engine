function GlRenderer3D(gl) {
  this.gl = gl;

  this.shader = null;
  
  this.mv_matrix = mat4.create();
  this.p_matrix = mat4.create();

  this.mv_matrix_stack = [];
  this.p_matrix_stack = [];
  
  this.vertex_position_name = null;
  this.vertex_color_name = null;
  this.mv_matrix_name = null;
  this.p_matrix_name = null;
  
  this.initGl(gl);
  this.initDefaultShader(gl);
}


// --[ initializers ]-----------------------------------------------------------
GlRenderer3D.prototype.initGl = function(gl) {
  gl.enable(gl.DEPTH_TEST); 
}

GlRenderer3D.prototype.initDefaultShader = function(gl) {
  var vert_shader_src = "\
    attribute vec3 aVertexPosition;\
    attribute vec4 aVertexColor;\
    \
    uniform mat4 uMVMatrix;\
    uniform mat4 uPMatrix;\
    \
    varying vec4 vColor;\
    \
    void main() {\
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
      vColor = aVertexColor;\
    }\
  ";
  
  var frag_shader_src = "\
    precision mediump float;\
    \
    varying vec4 vColor;\
    \
    void main() {\
      gl_FragColor = vColor;\
    }\
  ";
  
  
  this.shader = new GlShader(gl, vert_shader_src, frag_shader_src);
  this.shader.use();

  this.setVertexPositionName("aVertexPosition");
  this.setVertexColorName("aVertexColor");
  this.setModelViewMatrixName("uMVMatrix");
  this.setProjectionMatrixName("uPMatrix");
  
  this.setVertexPositionEnabled(true);
  this.setVertexColorEnabled(true);
  this.setModelViewMatrix(mat4.create());
  this.setProjectionMatrix(mat4.create());
  
}

// -----------------------------------------------------------------------------
GlRenderer3D.prototype.getGl = function() {
  return this.gl;
}


// --[ vertex position ]--------------------------------------------------------
GlRenderer3D.prototype.setVertexPositionName = function(name) {
  this.vertex_position_name = name;
}

GlRenderer3D.prototype.getVertexPositionName = function() {
  return this.vertex_position_name;
}

GlRenderer3D.prototype.getVertexPositionIndex = function() {
  return this.shader.getAttribLocation(this.getVertexPositionName());  
}

GlRenderer3D.prototype.setVertexPositionEnabled = function(enabled) {
  var name = this.getVertexPositionName();
  
  if (enabled) {
    this.shader.enableVertexAttribArray(name); 
  } else {
    this.shader.disableVertexAttribArray(name); 
  }
}


// --[ vertex color ]-----------------------------------------------------------
GlRenderer3D.prototype.setVertexColorName = function(name) {
  this.vertex_color_name = name;
}

GlRenderer3D.prototype.getVertexColorName = function() {
  return this.vertex_color_name;
}

GlRenderer3D.prototype.getVertexColorIndex = function() {
  return this.shader.getAttribLocation(this.getVertexColorName());  
}

GlRenderer3D.prototype.setVertexColorEnabled = function(enabled) {
  var name = this.getVertexColorName();
  
  if (enabled) {
    this.shader.enableVertexAttribArray(name); 
  } else {
    this.shader.disableVertexAttribArray(name); 
  }
}


// --[ modelview matrix ]-------------------------------------------------------
GlRenderer3D.prototype.setModelViewMatrixName = function(name) {
  this.mv_matrix_name = name;
}

GlRenderer3D.prototype.getModelViewMatrixName = function() {
  return this.mv_matrix_name;
}

GlRenderer3D.prototype.setModelViewMatrix = function(mat) {
  this.mv_matrix = mat;
  this.shader.setUniformMatrix4fv(this.getModelViewMatrixName(), this.mv_matrix);
}

GlRenderer3D.prototype.getModelViewMatrix = function() {
  return mat4.clone(this.mv_matrix);
}

GlRenderer3D.prototype.pushModelViewMatrix = function() {
  this.mv_matrix_stack.push(mat4.clone(this.mv_matrix));
}

GlRenderer3D.prototype.popModelViewMatrix = function() {
  var mat = this.mv_matrix_stack.pop();
  if (typeof mat !== "undefined") {
    this.setModelViewMatrix(mat);
  }
}


GlRenderer3D.prototype.translate = function(x, y, z) {
  mat4.translate(this.mv_matrix, this.mv_matrix, vec3.fromValues([x, y, z]));
  this.setModelViewMatrix(this.mv_matrix);
}

GlRenderer3D.prototype.scale = function(scale) {
  mat4.scale(this.mv_matrix, this.mv_matrix, scale);
  this.setModelViewMatrix(this.mv_matrix);
}

GlRenderer3D.prototype.rotateX = function(radians) {
  mat4.rotateX(this.mv_matrix, this.mv_matrix, radians);
  this.setModelViewMatrix(this.mv_matrix);
}
GlRenderer3D.prototype.rotateY = function(radians) {
  mat4.rotateY(this.mv_matrix, this.mv_matrix, radians);
  this.setModelViewMatrix(this.mv_matrix);
}
GlRenderer3D.prototype.rotateZ = function(radians) {
  mat4.rotateZ(this.mv_matrix, this.mv_matrix, radians);
  this.setModelViewMatrix(this.mv_matrix);
}


// --[ projection matrix ]------------------------------------------------------
GlRenderer3D.prototype.setProjectionMatrixName = function(name) {
  this.p_matrix_name = name;
}

GlRenderer3D.prototype.getProjectionMatrixName = function() {
  return this.p_matrix_name;
}

GlRenderer3D.prototype.setProjectionMatrix = function(mat) {
  this.p_matrix = mat;
  this.shader.setUniformMatrix4fv(this.getProjectionMatrixName(), this.p_matrix);
}

GlRenderer3D.prototype.getProjectionMatrix = function() {
  return mat4.clone(this.p_matrix);
}

GlRenderer3D.prototype.pushProjectionMatrix = function() {
  this.p_matrix_stack.push(mat4.clone(this.p_matrix));
}

GlRenderer3D.prototype.popProjectionMatrix = function() {
  var mat = this.p_matrix_stack.pop();
  if (typeof mat !== "undefined") {
    this.setProjectionMatrix(mat);
  }
}

GlRenderer3D.prototype.setPerspective = function(fovy, aspect_ratio, near, far) {
  this.setProjectionMatrix(mat4.perspective(
      mat4.create(), // out
      fovy, // fovy in radians
      aspect_ratio, // aspect ratio
      near,// near
      far)); // far
}

// --[ convenience methods ]----------------------------------------------------

// --[ drawing ]----------------------------------------------------------------
GlRenderer3D.prototype.draw = function(drawables) {
  this.shader.use();
  drawables.draw(this);
}

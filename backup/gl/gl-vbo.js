function GlVbo(gl, type) {
  this.gl = gl;
  this.type = type;
  this.vertex_size = 3;
  this.vertex_count = 0;
  this.buffer = gl.createBuffer();
}

// -----------------------------------------------------------------------------
GlVbo.prototype.bind = function() {
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
}

GlVbo.prototype.unbind = function() {
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0);
}

// --[ vertices ]---------------------------------------------------------------
GlVbo.prototype.setVertices = function(vertices) {
  this.vertex_count = vertices.length
  
  this.bind();
  this.gl.bufferData(
      this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
}


GlVbo.prototype.setVertexSize = function(vs) {
  this.vertex_size = vs;
}

GlVbo.prototype.getVertexSize = function() {
  return this.vertex_size;
}


GlVbo.prototype.setVertexCount = function(count) {
  this.vertex_count = count;
}

GlVbo.prototype.getVertexCount = function() {
  return this.vertex_count;
}


GlVbo.prototype.setVertexAttrib = function(vertex_attrib, size, stride, offset) {
  this.bind();
  this.gl.vertexAttribPointer(
      vertex_attrib, // vertex attribute to be modified
      size,          // number of elements per vertex attribute (1, 2, 3, or 4)
      this.gl.FLOAT, // data type of each element 
      false,         // should the data be normalized?
      4 * stride,                     
      4 * offset);                   
}

// --[ drawing ]----------------------------------------------------------------
GlVbo.prototype.draw = function(gl) {
  this.bind();
  gl.drawArrays(this.type, 0, this.getVertexCount());
}
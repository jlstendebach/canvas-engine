function GlShader(gl, vert_src, frag_src) {
  this.gl = gl;
  this.vert_shader = null;
  this.frag_shader = null;
  this.shader_program = null;
  this.uniforms = {};
  this.attribs = {};
  
  // Initialize the shaders
  if (!this.initShaders(gl, vert_src, frag_src)) {
    return;
  }
  
  // Initialize the program
  if (!this.initProgram(gl)) {
    return;
  }
  
  // Build a list of uniforms and attributes
  this.initUniforms(gl);
  this.initAttributes(gl);
}

// --[ statics vars ]-----------------------------------------------------------
GlShader.IN_USE = null;

// --[ initializers ]-----------------------------------------------------------
GlShader.prototype.initShaders = function(gl, vert_src, frag_src) {
  // Create the vertex shader
  this.vert_shader = this.createShader(gl, vert_src, gl.VERTEX_SHADER);
  if (this.vert_shader === null) {
    return false;
  }

  // Create the fragment shader
  this.frag_shader = this.createShader(gl, frag_src, gl.FRAGMENT_SHADER);
  if (this.frag_shader === null) {
    return false;
  }
  
  return true;
}

GlShader.prototype.initProgram = function(gl) {
  // Create the program
  this.shader_program = gl.createProgram();
  gl.attachShader(this.shader_program, this.vert_shader);
  gl.attachShader(this.shader_program, this.frag_shader);
  gl.linkProgram(this.shader_program);
  
  // Check link status
  if (!gl.getProgramParameter(this.shader_program, gl.LINK_STATUS)) {
    console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(this.shader_program));
    return false;
  }
  
  return true;
}

GlShader.prototype.initUniforms = function(gl) {
  // Get the number of all uniforms in the program
  var uniform_count = gl.getProgramParameter(this.shader_program, gl.ACTIVE_UNIFORMS);
  
  // Build a map of uniform "name => location" 
  for (var i=0; i<uniform_count; ++i) {
    var info = gl.getActiveUniform(this.shader_program, i);
    this.uniforms[info.name] = gl.getUniformLocation(this.shader_program, info.name);
  }
}

GlShader.prototype.initAttributes = function(gl) {
  // Get the number of all attributes in the program
  var attrib_count = gl.getProgramParameter(this.shader_program, gl.ACTIVE_ATTRIBUTES);

  // Build a map of attribute "name => location" 
  for (var i=0; i<attrib_count; ++i) {
    var info = gl.getActiveAttrib(this.shader_program, i);
    this.attribs[info.name] = gl.getAttribLocation(this.shader_program, info.name);
  }
}


// -----------------------------------------------------------------------------
GlShader.prototype.use = function() {
  this.gl.useProgram(this.shader_program);
  GlShader.IN_USE = this;
}

GlShader.prototype.isInUse = function() {
  return GlShader.IN_USE === this;
}


// --[ attributes ]-------------------------------------------------------------
GlShader.prototype.getAttribLocation = function(name) {
  //return this.gl.getAttribLocation(this.shader_program, name);
  return this.attribs[name];
}

GlShader.prototype.enableVertexAttribArray = function(name) {
  this.gl.enableVertexAttribArray(this.getAttribLocation(name));
}

GlShader.prototype.disableVertexAttribArray = function(name) {
  this.gl.disableVertexAttribArray(this.getAttribLocation(name));
}


// --[ uniforms ]---------------------------------------------------------------
GlShader.prototype.getUniformLocation = function(name) {
  //return this.gl.getUniformLocation(this.shader_program, name);
  return this.uniforms[name];
}


GlShader.prototype.setUniform1f = function(name, value) {
  this.gl.uniform1f(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform1fv = function(name, v0) {
  this.gl.uniform1fv(this.getUniformLocation(name), v0);
}
GlShader.prototype.setUniform1i = function(name, value) {
  this.gl.uniform1i(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform1iv = function(name, v0) {
  this.gl.uniform1iv(this.getUniformLocation(name), v0);
}

GlShader.prototype.setUniform2f = function(name, value) {
  this.gl.uniform2f(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform2fv = function(name, v0, v1) {
  this.gl.uniform2fv(this.getUniformLocation(name), v0, v1);
}
GlShader.prototype.setUniform2i = function(name, value) {
  this.gl.uniform2i(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform2iv = function(name, v0, v1) {
  this.gl.uniform2iv(this.getUniformLocation(name), v0, v1);
}

GlShader.prototype.setUniform3f = function(name, value) {
  this.gl.uniform3f(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform3fv = function(name, v0, v1, v2) {
  this.gl.uniform3fv(this.getUniformLocation(name), v0, v1, v2);
}
GlShader.prototype.setUniform3i = function(name, value) {
  this.gl.uniform3i(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform3iv = function(name, v0, v1, v2) {
  this.gl.uniform3iv(this.getUniformLocation(name), v0, v1, v2);
}

GlShader.prototype.setUniform4f = function(name, value) {
  this.gl.uniform4f(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform4fv = function(name, v0, v1, v2, v3) {
  this.gl.uniform4fv(this.getUniformLocation(name), v0, v1, v2, v3);
}
GlShader.prototype.setUniform4i = function(name, value) {
  this.gl.uniform4i(this.getUniformLocation(name), value);
}
GlShader.prototype.setUniform4iv = function(name, v0, v1, v2, v3) {
  this.gl.uniform4iv(this.getUniformLocation(name), v0, v1, v2, v3);
}

GlShader.prototype.setUniformMatrix2fv = function(name, value) {
  this.gl.uniformMatrix2fv(this.getUniformLocation(name), false, value);
}
GlShader.prototype.setUniformMatrix3fv = function(name, value) {
  this.gl.uniformMatrix3fv(this.getUniformLocation(name), false, value);
}
GlShader.prototype.setUniformMatrix4fv = function(name, value) {
  this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value);
}


// --[ convenience methods ]----------------------------------------------------
GlShader.prototype.createShader = function(gl, src, type) {
  // Create the shader
  var shader = gl.createShader(type);
  
  // Set the shader source
  gl.shaderSource(shader, src);
  
  // Try to compile the shader and check for errors
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
    gl.deleteShader(shader);
    return null;  
  }
  
  return shader;  
}  
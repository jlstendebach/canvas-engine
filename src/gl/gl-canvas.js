function GlCanvas(id) {
  this.canvas = document.getElementById(id);
  this.gl = 
      this.canvas.getContext("webgl") || 
      this.canvas.getContext("experimental-webgl");
  this.event_emitter = new EventEmitter();
      
  this.hookMouseEvents();
}

// --[ initializers ]-----------------------------------------------------------
GlCanvas.prototype.hookMouseEvents = function() { 
  var self = this;

  // mouse down 
  this.canvas.addEventListener("mousedown", function(event) {
    self.onMouseDown(event);   
  });

  // mouse up 
  this.canvas.addEventListener("mouseup", function(event) {
    self.onMouseUp(event);   
  });
  this.canvas.addEventListener("mouseout", function(event) {
    self.onMouseOut(event);   
  });

  // mouse move 
  this.canvas.addEventListener("mousemove", function(event) {
    self.onMouseMove(event);   
  });
}


// -----------------------------------------------------------------------------
GlCanvas.prototype.getGl = function() {
  return this.gl;
}


// --[ size ]-------------------------------------------------------------------
GlCanvas.prototype.setWidth = function(w) { 
  this.canvas.width = w; 
  this.gl.viewport(0, 0, this.getWidth(), this.getHeight());
}
GlCanvas.prototype.getWidth = function() { 
  return this.canvas.width; 
}

GlCanvas.prototype.setHeight = function(h) { 
  this.canvas.height = h; 
  this.gl.viewport(0, 0, this.getWidth(), this.getHeight());
}
GlCanvas.prototype.getHeight = function() { 
  return this.canvas.height; 
}

// --[ mouse events ] ----------------------------------------------------------
GlCanvas.prototype.onMouseDown = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  var x = event.clientX-canvas_bounds.left;
  var y = event.clientY-canvas_bounds.top;
  
  this.event_emitter.emit(MouseDown.TYPE, new MouseDown(x, y));
}

GlCanvas.prototype.onMouseUp = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  var x = event.clientX-canvas_bounds.left;
  var y = event.clientY-canvas_bounds.top;

  this.event_emitter.emit(MouseUp.TYPE, new MouseUp(x, y));
}

GlCanvas.prototype.onMouseOut = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  var x = event.clientX-canvas_bounds.left;
  var y = event.clientY-canvas_bounds.top;
  x = (x < canvas_bounds.width ? x : canvas_bounds.width-1); 
  y = (y < canvas_bounds.height ? y : canvas_bounds.height-1);

  this.event_emitter.emit(MouseUp.TYPE, new MouseUp(x, y));
}

GlCanvas.prototype.onMouseMove = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  var x = event.clientX-canvas_bounds.left;
  var y = event.clientY-canvas_bounds.top;
  var dx = event.movementX;
  var dy = event.movementY;

  this.event_emitter.emit(MouseMove.TYPE, new MouseMove(x, y, dx, dy));
}



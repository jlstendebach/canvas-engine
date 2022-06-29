function Canvas(id) {
  this.canvas = document.getElementById(id);
  this.drawables = new CompositeDrawable(this.canvas.width, this.canvas.height);  
  
  this.hookMouseEvents();
}

// --[ size ]-------------------------------------------------------------------
Canvas.prototype.setWidth = function(w) { 
  this.canvas.width = w; 
  this.drawables.setWidth(w);
}
Canvas.prototype.getWidth = function() { 
  return this.canvas.width; 
}

Canvas.prototype.setHeight = function(h) { 
  this.canvas.height = h; 
  this.drawables.setHeight(h);
}
Canvas.prototype.getHeight = function() { 
  return this.canvas.height; 
}


// --[ drawing ]----------------------------------------------------------------
Canvas.prototype.getDrawables = function() { 
  return this.drawables; 
}

Canvas.prototype.draw = function() {
  var context = this.canvas.getContext("2d");

  // Save the state of the context to be restored later.
  context.save();

  context.fillStyle = "black";
  context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  context.translate(0.5, 0.5); // workaround for lines appearing too thick
  
  this.drawables.draw(context);
  
  // Restore the context so we can start fresh next time.
  context.restore();
}


// --[ convenience methods ]----------------------------------------------------
Canvas.prototype.hookMouseEvents = function() { 
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


// --[ mouse events ] ----------------------------------------------------------
Canvas.prototype.onMouseDown = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  this.drawables.onMouseDown(
      event.clientX-canvas_bounds.left, // x
      event.clientY-canvas_bounds.top); // y
}

Canvas.prototype.onMouseUp = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  this.drawables.onMouseUp(
      event.clientX-canvas_bounds.left, // x
      event.clientY-canvas_bounds.top); // y
}

Canvas.prototype.onMouseOut = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  var x = event.clientX-canvas_bounds.left;
  var y = event.clientY-canvas_bounds.top;
  this.drawables.onMouseUp(
      (x < canvas_bounds.width ? x : canvas_bounds.width-1),    // x
      (y < canvas_bounds.height ? y : canvas_bounds.height-1)); // y
}

Canvas.prototype.onMouseMove = function(event) {  
  var canvas_bounds = this.canvas.getBoundingClientRect();
  this.drawables.onMouseMove(
      event.clientX-canvas_bounds.left, // x
      event.clientY-canvas_bounds.top,  // y
      event.movementX,  // dx
      event.movementY); // dy
}



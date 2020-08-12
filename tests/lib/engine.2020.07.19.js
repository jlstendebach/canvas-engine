class Rect { 
  constructor(x=0, y=0, w=1, h=1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  // --[ collision ]------------------------------------------------------------
  overlapsRect(rect) {
    return (
      this.x < rect.x + rect.w 
      && this.y < rect.y + rect.h
      && rect.x < this.x + this.w
      && rect.y < this.y + this.h
    );
  }
  
  containsPoint(x, y) {
    return (
      x >= this.x
      && y >= this.y
      && x < this.x + this.w
      && y < this.y + this.h
    );
  }
  
  
}
class Vec2 {
  // --[ ctor ]-----------------------------------------------------------------
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  // --[ static functions ]-----------------------------------------------------
  static fromAngle(radians) { 
    return new Vec2(Math.cos(radians), Math.sin(radians)); 
  }
  
  static copy(v) { return new Vec2(v.x, v.y); }
 
  static add(u, v)      { return new Vec2(u.x+v.x, u.y+v.y); }
  static subtract(u, v) { return new Vec2(u.x-v.x, u.y-v.y); }
  static multiply(u, v) { return new Vec2(u.x*v.x, u.y*v.y); }
  static divide(u, v)   { return new Vec2(u.x/v.x, u.y/v.y); }

  static scale(v, s) { return new Vec2(v.x*s, v.y*s); }
  static invert(v) { return new Vec2(-v.x, -v.y); }
  static normalize(v) { return this.copy(v).normalize(); }
  
  static normal(v) { return new Vec2(-v.y, v.x); }
  static unitNormal(v) { return this.normal(v).normalize(); }

  static interpolate(u, v, a) {
    return new Vec2(u.x + (v.x-u.x)*a, u.y + (v.y-u.y)*a);
  }

  static rotate(v, radians) {
    return new Vec2(
      v.x * Math.cos(radians) - v.y * Math.sin(radians),
      v.x * Math.sin(radians) + v.y * Math.cos(radians)
    );
  }
  
  static dist(u, v) {
    return Math.sqrt(Math.pow(u.x-v.x, 2) + Math.pow(u.y-v.y, 2));
  }

  static distSquared(u, v) {
    return Math.pow(u.x-v.x, 2) + Math.pow(u.y-v.y, 2);
  }

  static angle(u, v) {
    return Math.acos(u.dot(v) / (u.mag()*v.mag()));
  }
  
  static angleTau(u, v) {
    let angle = Vec2.angle(u, v);
    
    /*
     * Cross product:
     * ---------------------
     * x = u.y*v.z - u.z*v.y
     * y = u.z*v.x - u.x*v.z
     * z = u.x*v.y - u.y*v.x
     * 
     * z is 0, so...
     * ---------------------
     * x = 0
     * y = 0
     * z = u.x*v.y - u.y*v.x    
     *
     * If z is less than zero, then the angle between u and v is greater than 
     * pi. Angle in range [0, 2pi) needs to be calculated.
     */    
    if (u.x*v.y - u.y*v.x < 0) {
      return 2*Math.PI - angle;
    }
    
    // If the method gets here, return the original angle.
    return angle;
  }

  static projection(u, v) { // projection of u onto v
    let magSq = v.magSquared();
    if (magSq !== 0) {
      return this.scale(v, u.dot(v) / magSq);
    }
    return new Vec2(0, 0);
  }
  
  static rejection(u, v) { // rejection of u from v 
    let proj = this.projection(u, v);
    return this.subtract(u, proj);
  }
  
  
  // --[ in-place operations ]--------------------------------------------------
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  interpolate(v, a) {
    this.x += (v.x-this.x)*a; 
    this.y += (v.y-this.y)*a;
    return this;
  }

  normalize() {
    return this.setMag(1); 
  }


  rotate(radians) {
    let newX = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    let newY = this.x * Math.sin(radians) + this.y * Math.cos(radians);
    this.x = newX;
    this.y = newY;
    return this;
  }
  
  // --[ information operations ]-----------------------------------------------
  setMag(mag) {
    if (this.x !== 0 || this.y !== 0) {
      this.scale(mag/this.mag());
    }
    return this;
  }

  mag() {
    return Math.sqrt(this.magSquared());
  }

  magSquared() {
    return this.x*this.x + this.y*this.y;
  }

  dot(v) {
    return this.x*v.x + this.y*v.y;
  }  
  
}
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
class Vec3 {
  // --[ ctor ]-----------------------------------------------------------------
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  
  // --[ static functions ]-----------------------------------------------------
  static copy(v) { return new Vec3(v.x, v.y, v.z); }
  
  static add(u, v)      { return new Vec3(u.x+v.x, u.y+v.y, u.z+v.z); }
  static subtract(u, v) { return new Vec3(u.x-v.x, u.y-v.y, u.z-v.z); }
  static multiply(u, v) { return new Vec3(u.x*v.x, u.y*v.y, u.z*v.z); }
  static divide(u, v)   { return new Vec3(u.x/v.x, u.y/v.y, u.z/v.z); }

  static scale(v, s) { return new Vec3(v.x*s, v.y*s, v.z*s); }
  static invert(v) { return new Vec3(-v.x, -v.y, -v.z); }
  static normalize(v) { this.copy(v).normalize(); }

  static cross(u, v) {
    return new Vec3(
      u.y*v.z - u.z*v.y,
      u.z*v.x - u.x*v.z,
      u.x*v.y - u.y*v.x
    );    
  }
  
  static interpolate(u, v, a) {
    return new Vec3(
      u.x + (v.x-u.x)*a, 
      u.y + (v.y-u.y)*a, 
      u.z + (v.z-u.z)*a
    );
  }
  

  // --[ in-place operations ]--------------------------------------------------
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  interpolate(v, a) {
    this.x += (v.x-this.x)*a; 
    this.y += (v.y-this.y)*a;
    this.z += (v.z-this.z)*a;
    return this;
  }
  
  normalize() {
    return this.setMag(1);
  }
  

  // --[ information operations ]-----------------------------------------------
  setMag(mag) {
    if (this.x !== 0 || this.y !== 0 || this.z !== 0) {
      this.scale(mag/this.mag());
    }
    return this;
  }

  mag() {
    return Math.sqrt(this.magSquared());
  }

  magSquared() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
  }

  dot(v) {
    return Math.sqrt(this.dotSquared(v));
  }
  
  dotSquared(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
  }

  cross(v) {
    return Vec3.cross(this, v);
  }

}
class Profiler {
  constructor(sampleCount) {  
    this.lastTime = Profiler.currentTime();
    this.cachedTotal = 0;
    this.samples = [];
    
    for (let i=0; i<sampleCount; ++i) {
      this.samples.push(0);
    }
  }

  // ---------------------------------------------------------------------------
  start() { 
    this.lastTime = Profiler.currentTime(); 
  }
  
  mark() { 
    const time = Profiler.currentTime() - this.lastTime;
    
    // Start the timer again.
    this.lastTime = Profiler.currentTime();
    
    // Add the new time, remove the oldest time.
    this.samples.push(time);
    this.cachedTotal += time - this.samples.shift();
  }
  
  getTime() {
    return this.cachedTotal/this.samples.length;
  }

  
  // --[ static profilers ]-----------------------------------------------------
  static start(name, sampleCount=10) {
    if (!Profiler.profilers.hasOwnProperty(name)) {
      Profiler.profilers[name] = new Profiler(sampleCount);
    }
    Profiler.profilers[name].start();
  }

  static mark(name) {
    Profiler.profilers[name].mark();
  }
  
  static getTime(name) {
    return Profiler.profilers[name].getTime();
  }
  
  
  // --[ method profiling ]-----------------------------------------------------
  static profile(method, iterations) {
    let min = 1000000000; // over 11.5 days should be good enough
    let max = 0;
    let start = Profiler.currentTime();
    let itrStart = 0;
    let itrTime = 0;
    
    for (let i=0; i<iterations; ++i) {
      itrStart = Profiler.currentTime();
      method();
      itrTime = Profiler.currentTime() - itrStart;

      min = Math.min(min, itrTime);
      max = Math.max(max, itrTime);
    }
    
    let total = Profiler.currentTime() - start;
    
    return {
      total: total,
      average: total / iterations,
      min: min,
      max: max
    };
  }
  
  
  // --[ convenience methods ]--------------------------------------------------
  static currentTime() {
    return new Date().getTime();
  }
  
}

Profiler.profilers = {};
class Timer {
  constructor() {
    this.startTime = new Date().getTime();
  }

  start() {
    this.startTime = new Date().getTime();
  }

  getTime() {
    return (new Date().getTime() - this.startTime);
  }
}
// ==[ CanvasResizeEvent ]======================================================
class CanvasResizeEvent {
  constructor(canvas, oldWidth, oldHeight, width, height) {
    this.canvas = canvas;    
    this.oldWidth = oldWidth;
    this.oldHeight = oldHeight;
    this.width = width;
    this.height = height;
  }  
}
class EventListener {
  constructor(callback, owner=null) {
    this.callback = callback;
    this.owner = owner;
  }

  onEvent(type, event) {
    if (typeof this.owner !== "undefined" && this.owner !== null) { // owner exists
      this.callback.call(this.owner, type, event);
    
    } else { // owner does not exist
      this.callback(type, event);
    }
  }  
}



class EventEmitter {
  constructor() {
    this.listeners = {}; // type => [EventListener]
  }

  add(type, callback, owner=null) {
    var listenerList = this.listeners[type];
    if (typeof listenerList === "undefined") {
      listenerList = [];
      this.listeners[type] = listenerList;
    }  
    
    listenerList.push(new EventListener(callback, owner));
  }

  remove(type, callback, owner=null) {
    var listenerList = this.listeners[type];
    if (typeof listenerList !== "undefined") {
      for (var i=0; i<listenerList.length; i++) {
        if (listenerList[i].callback === callback && listenerList[i].owner === owner) {
          listenerList.splice(i, 1);
          return;
        }
      }
    }  
  }

  emit(type, event) {
    var listenerList = this.listeners[type];
    if (typeof listenerList !== "undefined") {
      for (var i=0; i<listenerList.length; i++) {
        listenerList[i].onEvent(type, event);
      }
    }
  }

}
class Keyboard {
  static eventEmitter = null;
  static down = {};
  
  // ---------------------------------------------------------------------------
  static init() {
    if (!Keyboard.isInit()) {
      Keyboard.eventEmitter = new EventEmitter();
      document.addEventListener("keydown", Keyboard.onKeyDown);
      document.addEventListener("keyup", Keyboard.onKeyUp);
    }
  }
  
  static isInit() { 
    return Keyboard.eventEmitter !== null; 
  }
  
  // --[ polling ]--------------------------------------------------------------
  static isKeyDown(key) {
    return typeof Keyboard.down[key] !== "undefined";
  }
  
  // --[ events ]---------------------------------------------------------------
  static onKeyDown(event) {
    if (!Keyboard.isKeyDown(event.code)) {
      Keyboard.down[event.key] = true;
      Keyboard.down[event.code] = true;
      Keyboard.eventEmitter.emit("KeyDownEvent", event);
    }
  }

  static onKeyUp(event) {
    delete Keyboard.down[event.key];
    delete Keyboard.down[event.code];
    Keyboard.eventEmitter.emit("KeyUpEvent", event);
  }
  
  static addEventListener(type, callback, owner=null) {
    if (type === "KeyDownEvent" || type === "KeyUpEvent") {
      Keyboard.eventEmitter.add(type, callback, owner);
    }
  }

  static removeEventListener(type, callback, owner=null) {
    if (type === "KeyDownEvent" || type === "KeyUpEvent") {
      Keyboard.eventEmitter.remove(type, callback, owner);
    }
  }
}


window.addEventListener("load", function() {
  window.removeEventListener("load", this);
  Keyboard.init();
});
class MouseEvent {
  constructor(x, y, btn, target=null) {
    this.x = x;
    this.y = y;
    this.btn = btn;
    this.target = target;
  }
}

// event.which values: https://www.w3schools.com/jsref/event_which.asp
MouseEvent.LEFT = 1;
MouseEvent.MIDDLE = 2;
MouseEvent.RIGHT = 3;


// ==[ MouseDownEvent ]=========================================================
class MouseDownEvent extends MouseEvent {
  constructor(x, y, btn, target) {
    super(x, y, btn, target);
  }
}

// ==[ MouseUpInsideEvent ]=====================================================
class MouseUpInsideEvent extends MouseEvent {
  constructor(x, y, btn, target) {
    super(x, y, btn, target);
  }
}

// ==[ MouseUpOutsideEvent ]====================================================
class MouseUpOutsideEvent extends MouseEvent {
  constructor(x, y, btn, target) {
    super(x, y, btn, target);
  }
}

// ==[ MouseDragEvent ]=========================================================
class MouseDragEvent extends MouseEvent {
  constructor(x, y, dx, dy, btn, target) {
    super(x, y, btn, target);
    this.dx = dx;
    this.dy = dy;
  }
}

// ==[ MouseMoveEvent ]=========================================================
class MouseMoveEvent extends MouseEvent {
  constructor(x, y, dx, dy, btn, target) {
    super(x, y, btn, target);
    this.dx = dx;
    this.dy = dy;
  }
}

// ==[ MouseEnterEvent ]========================================================
class MouseEnterEvent extends MouseEvent {
  constructor(x, y, btn, target) {
    super(x, y, btn, target);
  }
}

// ==[ MouseExitEvent ]=========================================================
class MouseExitEvent extends MouseEvent {
  constructor(x, y, btn, target) {
    super(x, y, btn, target);
  }
}
class MouseEventProcessor {

  constructor() {
    this.mouseDownView = null;
    this.mouseOverView = null;
  }

  // --[ events ]-----------------------------------------------------------------
  onMouseDown(view, event) {
    // The event passed in is assumed to be within view. As such, translate the 
    // event to have coordinates local the view for checking again subviews.
    let translatedX = event.x-view.getX();
    let translatedY = event.y-view.getY();
    
    // Find the subview at the translated coordinates. Subview should be null if
    // no subview was found.
    var subview = view.pickView(translatedX, translatedY);
    
    if (subview !== null) { // If a subview was found,
      // Recursively dive into the subview.
      return this.onMouseDown(
        subview, 
        new MouseEvent(translatedX, translatedY, event.btn)
      ); 
    } 
    
    // Otherwise, the event happened in this view. This should happen on the last
    // step of recursion.
    this.mouseDownView = view; 
    
    /********************
     *  MouseDownEvent  *
     ********************/
    view.onMouseDown(new MouseDownEvent(event.x, event.y, event.btn, view)); 

    // Return the view that the event happened in.
    return view; 
  }

  onMouseUp(view, event) {
    // The event passed in is assumed to be within view. As such, translate the 
    // event to have coordinates local the view for checking again subviews.
    let translatedX = event.x-view.getX();
    let translatedY = event.y-view.getY();

    // Find the subview at the translated coordinates. Subview should be null if
    // no subview was found.
    var subview = view.pickView(translatedX, translatedY);
    
    if (subview !== null) { // If a subview was found,
      // Recursively dive into the subview.
      return this.onMouseUp(
        subview, 
        new MouseEvent(translatedX, translatedY, event.btn)
      ); 
    } 

    // Otherwise, the event happened in this view. This should happen on the last
    // step of recursion.
    if (view === this.mouseDownView) { 
      // If the current view is the mouseDownView, then the user pressed the 
      // button down and released it inside the view. Trigger a 
      // MouseUpInsideEvent on the current view.
      
      /************************
       *  MouseUpInsideEvent  *
       ************************/
      view.onMouseUpInside(new MouseUpInsideEvent(
        event.x, event.y, event.btn, view
      )); 

    } else if (this.mouseDownView !== null) { // mouse up outside
      // If the current view is NOT the mouseDownView, then the user pressed the 
      // button down in the mouseDownView, but released it in the current view.
      // Trigger a MouseUpOutsideEvent on the mouseDownView.
      
      /*************************
       *  MouseUpOutsideEvent  *
       ************************/
      this.mouseDownView.onMouseUpOutside(new MouseUpOutsideEvent(
        event.x, event.y, event.btn, view
      )); 
    }
    
    // Reset mouseDownView.
    this.mouseDownView = null; 

    return view;   
  }

  onMouseMove(view, event) {
    if (this.mouseDownView !== null) { 
      // If the mouseDownView already exists, then the user is dragging the 
      // mouse. Trigger a MouseDragEvent on the mouseDownView.
      
      /********************
       *  MouseDragEvent  *
       ********************/    
      this.mouseDownView.onMouseDrag(new MouseDragEvent(
        event.x,
        event.y,
        event.dx,
        event.dy,
        event.btn,
        this.mouseDownView
      ));

    } else { 
      // The event passed in is assumed to be within view. As such, translate the 
      // event to have coordinates local the view for checking again subviews.
      let translatedX = event.x-view.getX();
      let translatedY = event.y-view.getY();

      // Find the subview at the translated coordinates. Subview should be null if
      // no subview was found.
      var subview = view.pickView(translatedX, translatedY);
      
      if (subview !== null) { // If a subview was found,
        // Recursively dive into the subview.
        return this.onMouseMove(
          subview, 
          new MouseMoveEvent(
            translatedX, translatedY, event.dx, event.dy, event.btn
          )
        ); 
      } 
      
      // Otherwise, the event happened in this view. This should happen on the last
      // step of recursion.
      if (this.mouseOverView !== view) { 
        if (this.mouseOverView !== null) {
          // If the mouseOverView already exists and it is not the current view, 
          // then the mouse is exiting the mouseOverView and entering the 
          // current view. Trigger a MouseExitEvent on the mouseOverView.
          
          /********************
           *  MouseExitEvent  *
           *******************/    
          this.mouseOverView.onMouseExit(new MouseExitEvent(
            event.x, event.y, event.dx, event.dy, event.btn, this.mouseOverView
          ));
        }

        // The current view is not the same as the mouseOverView, so the mouse 
        // is entering the current view. Trigger a MouseEnterEvent on the
        // current view.
        
        /*********************
         *  MouseEnterEvent  *
         *********************/    
        view.onMouseEnter(new MouseEnterEvent(
          event.x, event.y, event.dx, event.dy, event.btn, view
        ));
        
        // Change the mouseOverView to the current view. 
        this.mouseOverView = view;
      }

      /********************
       *  MouseMoveEvent  *
       ********************/          
      view.onMouseMove(new MouseMoveEvent(
        event.x, event.y, event.dx, event.dy, event.btn, view
      ));
      
      return view; 
    }
  }
  
}

class Color {  
  constructor(r=0, g=0, b=0, a=255) {
    this.value = 0;
    this.setRGBA(r, g, b, a);
  }
  
  // --[ factory functions ]----------------------------------------------------
  static fromHexString(hex) {
    let color = new Color();    
    hex = hex.replace(/#/g, "");
    
    if (hex.length == 8) { // rrggbbaa
      color.value = parseInt(hex, 16) >>> 0;
      
    } else if (hex.length == 6) { // rrggbb
      color.value = ((parseInt(hex, 16) << 8) | Color.ALPHA_MASK) >>> 0;
    
    } else if (hex.length == 4) { // rgba 
      let intVal = parseInt(hex, 16);
      let r = (intVal & 0xf000) >>> 12;
      let g = (intVal & 0x0f00) >>> 8;
      let b = (intVal & 0x00f0) >>> 4;
      let a = (intVal & 0x000f) >>> 0;
      
      color.setRGBA(r | r << 4, g | g << 4, b | b << 4, a | a << 4);
            
    } else if (hex.length == 3) { // rgb     
      let intVal = parseInt(hex, 16);
      let r = (intVal & 0xf00) >>> 8;
      let g = (intVal & 0x0f0) >>> 4;
      let b = (intVal & 0x00f) >>> 0;
      
      color.setRGBA(r | r << 4, g | g << 4, b | b << 4, 255);
    }

    return color;
  }
  
  static fromString(rgba) {
    let color = new Color();

    // "rgba(".length = 5;
    let valueStr = rgba.substring(5, rgba.length-1);
    let values = valueStr.split(",");
    color.setRGBA(
      parseInt(values[0]),
      parseInt(values[1]),
      parseInt(values[2]),
      parseInt(values[3]*255)      
    );
    
    return color;
  }
  
  static copy(other) {
    let color = new Color();
    color.value = other.value;
    return color;
  }

  // ---------------------------------------------------------------------------
  static black()   { return new Color(  0,   0,   0); }
  static white()   { return new Color(255, 255, 255); }
  static red()     { return new Color(255,   0,   0); }
  static lime()    { return new Color(  0, 255,   0); }
  static blue()    { return new Color(  0,   0, 255); }
  static yellow()  { return new Color(255, 255,   0); }
  static aqua()    { return new Color(  0, 255, 255); }
  static magenta() { return new Color(255,   0, 255); }
  static silver()  { return new Color(192, 192, 192); }
  static gray()    { return new Color(128, 128, 128); }
  static maroon()  { return new Color(128,   0,   0); }
  static green()   { return new Color(  0, 128,   0); }
  static navy()    { return new Color(  0,   0, 128); }
  static olive()   { return new Color(128, 128,   0); }
  static teal()    { return new Color(  0, 128, 128); }
  static purple()  { return new Color(128,   0, 128); }

  
  // ---------------------------------------------------------------------------
  setRGBA(r, g, b, a) {
    this.value = (
      (r << Color.RED_BITS) & Color.RED_MASK
      | (g << Color.GREEN_BITS) & Color.GREEN_MASK 
      | (b << Color.BLUE_BITS) & Color.BLUE_MASK 
      | (a << Color.ALPHA_BITS) & Color.ALPHA_MASK
    ) >>> 0;
  }

  setRGB(r, g, b) {
    this.setRGBA(r, g, b, this.a);
  }

  /*******/
  /* red */
  /*******/
  set r(r) {
    r = Math.max(0, Math.min(255, r));
    this.value = ((this.value & ~Color.RED_MASK) | (r << Color.RED_BITS)) >>> 0;
  }
  
  get r() {
    return (this.value & Color.RED_MASK) >>> Color.RED_BITS;
  }
  
  
  /*********/
  /* green */
  /*********/
  set g(g) {
    g = Math.max(0, Math.min(255, g));
    this.value = ((this.value & ~Color.GREEN_MASK) | (g << Color.GREEN_BITS)) >>> 0;
  }

  get g() {
    return (this.value & Color.GREEN_MASK) >>> Color.GREEN_BITS;
  }

  /********/
  /* blue */
  /********/
  set b(b) {
    b = Math.max(0, Math.min(255, b));
    this.value = ((this.value & ~Color.BLUE_MASK) | (b << Color.BLUE_BITS)) >>> 0;
  }

  get b() {
    return (this.value & Color.BLUE_MASK) >>> Color.BLUE_BITS;
  }

  /*********/
  /* alpha */
  /*********/
  set a(a) {
    a = Math.max(0, Math.min(255, a));
    this.value = ((this.value & ~Color.ALPHA_MASK) | (a << Color.ALPHA_BITS)) >>> 0;
  }

  get a() {
    return (this.value & Color.ALPHA_MASK) >>> Color.ALPHA_BITS;
  }
  
  
  // --[ operations ]-----------------------------------------------------------
  add(c) {
    this.setRGBA(
      Math.max(0, Math.min(255, this.r+c.r)),
      Math.max(0, Math.min(255, this.g+c.g)),
      Math.max(0, Math.min(255, this.b+c.b)),
      Math.max(0, Math.min(255, this.a+c.a))
    );
    return this;
  }
  
  
  // --[ helpers ]--------------------------------------------------------------
  /**
   * This method is preferred over toHexString, as toString's execution is 
   * nearly twice as fast
   */
  toString() {
    return "rgba("+this.r+","+this.g+","+this.b+","+(this.a/255)+")";
  }
  
  /**
   * This method exists for convenience only. Method toString is prefered, as 
   * its execution is nearly twice as fast.
   */ 
  toHexString() {
    return "#"+("00000000" + this.value.toString(16)).substr(-8);
  }
  
  

}

Color.RED_MASK   = 0xff000000;
Color.GREEN_MASK = 0x00ff0000; 
Color.BLUE_MASK  = 0x0000ff00; 
Color.ALPHA_MASK = 0x000000ff; 
Color.RED_BITS   = 24;
Color.GREEN_BITS = 16;
Color.BLUE_BITS  = 8;
Color.ALPHA_BITS = 0;



class View {
  constructor() {
    this.parent = null;
    this.views = [];
    this.isVisible = true;
    this.isPickable = true;
    
    this.eventEmitter = new EventEmitter();
  }


  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) { 
    return true; 
  }

  getX() { 
    return 0; 
  }
  
  getY() { 
    return 0; 
  }


  // --[ parent ]---------------------------------------------------------------
  getParent() { 
    return this.parent;
  }

  removeFromParent() {
    if (this.parent !== null) {
      this.parent.removeView(this);
      this.parent = null;
    }
  }

  
  // --[ views ]----------------------------------------------------------------
  addView(v) { 
    v.removeFromParent();
    v.parent = this;
    this.views.push(v); 
  }

  removeView(v) {
    var index = this.views.indexOf(v);
    if (index >= 0) {
      v.parent = null;
      this.views.splice(index, 1);
    }
  }

  getViews() { 
    return this.views; 
  }

  getViewCount() {
    return this.views.length;
  }

  pickView(x, y) {
    for (var i=this.getViewCount()-1; i>=0; i--) {
      var view = this.views[i];
      if (view.isVisible && view.isPickable && view.isInBounds(x, y)) {
        // View was picked.
        return view;
      }
    }

    // No child view was picked.
    return null;
  }

  
  // --[ isVisible ]------------------------------------------------------------
  setVisible(v) { 
    this.isVisible = v;
  }

  
  // --[ isPickable ]-----------------------------------------------------------
  setPickable(p) { 
    this.isPickable = p;
  }

  
  // --[ drawing ]--------------------------------------------------------------
  draw(context) {
    if (this.isVisible) {
      context.save();
      
      this.drawSelf(context);

      context.translate(this.getX(), this.getY());
      this.drawChildren(context);
      
      context.restore();
    }
  }

  drawSelf(context) {}

  drawChildren(context) {
    for (let i=0; i<this.views.length; i++) {
      this.views[i].draw(context);
    }
  }

  
  // --[ event emitter ]--------------------------------------------------------
  addEventListener(type, callback, owner=null) {
    this.eventEmitter.add(type, callback, owner);
  }

  removeEventListener(type, callback, owner=null) {
    this.eventEmitter.remove(type, callback, owner);
  }
  
  emitEvent(type, event) {
    this.eventEmitter.emit(type, event);
  }

  
  // --[ mouse events ]---------------------------------------------------------
  onMouseDown(event) {
    this.emitEvent(MouseDownEvent.name, event);
  }

  onMouseUpInside(event) {  
    this.emitEvent(MouseUpInsideEvent.name, event);
  }

  onMouseUpOutside(event) {
    this.emitEvent(MouseUpOutsideEvent.name, event);
  }

  onMouseDrag(event) {
    this.emitEvent(MouseDragEvent.name, event);
  }

  onMouseMove(event) {
    this.emitEvent(MouseMoveEvent.name, event);
  }

  onMouseEnter(event) {
    this.emitEvent(MouseEnterEvent.name, event);
  }

  onMouseExit(event) {
    this.emitEvent(MouseExitEvent.name, event);
  }
}



class Canvas {
  constructor(id) {
    this.id = id;
    this.canvas = document.getElementById(id);
    
    this.view = new View();
    this.fillStyle = "#fff";
        
    this.mouseProcessor = new MouseEventProcessor();    
    
    this.hookEvents();    
    this.updateCanvasSize();
  }


  // --[ canvas ]---------------------------------------------------------------
  getContext() {
    return this.canvas.getContext("2d");
  }


  // --[ size ]-----------------------------------------------------------------
  setWidth(w) { 
    if (this.canvas.width !== w) {
      // Create the event to emit.
      const event = new CanvasResizeEvent(
        this,               // canvas
        this.canvas.width,  // old width
        this.canvas.height, // old height
        w,                  // new width
        this.canvas.height  // new height
      );

      // Set the width of the canvas.
      this.canvas.width = w; 

      // Inform listeners of the event.
      this.emitEvent(CanvasResizeEvent.name, event);
    }
  }
  
  getWidth() { 
    return this.canvas.width; 
  }

  setHeight(h) { 
    if (this.canvas.height !== h) {
      // Create the event to emit.
      const event = new CanvasResizeEvent(
        this,               // canvas
        this.canvas.width,  // old width
        this.canvas.height, // old height
        this.canvas.width,  // new width
        h                   // new height
      );

      // Set the width of the canvas.
      this.canvas.height = h; 

      // Inform listeners of the event.
      this.emitEvent(CanvasResizeEvent.name, event);
    }
  }
  
  getHeight() { 
    return this.canvas.height; 
  }


  // --[ background ]-----------------------------------------------------------
  setFillStyleRGBA(r, g, b, a) {
    this.fillStyle = `rgba(${r},${g},${b},${a})`;
  }  

  setFillStyle(style) {
    this.fillStyle = style;
  }


  // --[ drawing ]--------------------------------------------------------------
  getView() { return this.view; }

  addView(view) {
    this.view.addView(view);
  }

  draw() {
    this.updateCanvasSize();
    
    var context = this.getContext();

    // Save the state of the context to be restored later.
    context.save();

    context.fillStyle = this.fillStyle;
    context.fillRect(0, 0, this.getWidth(), this.getHeight());    
    
    this.view.draw(context);
    
    // Restore the context so we can start fresh next time.
    context.restore();
  }


  // --[ events ]---------------------------------------------------------------
  addEventListener(type, callback, owner) {
    this.view.addEventListener(type, callback, owner);
  }

  removeEventListener(type, callback, owner) {
    this.view.removeEventListener(type, callback, owner);
  }
  
  emitEvent(type, event) {
    this.view.emitEvent(type, event);
  }

  
  onWindowResized() {
    this.updateCanvasSize();
  }
  
  
  hookEvents() { 
    var self = this;

    
    /****************************/
    /* ---- Window Resized ---- */
    /****************************/
    window.addEventListener("resize", function() {
      self.onWindowResized();
    });
        
    /************************/
    /* ---- Mouse Down ---- */
    /************************/
    this.canvas.addEventListener("mousedown", function(event) {
      let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
      var e = new MouseEvent(
        coords.x, // x
        coords.y, // y
        event.which
      );
      self.mouseProcessor.onMouseDown(self.view, e);
    });

    /**********************/
    /* ---- Mouse Up ---- */
    /**********************/
    this.canvas.addEventListener("mouseup", function(event) {
      let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
      var e = new MouseEvent(
        coords.x, // x
        coords.y, // y
        event.which
      );
      self.mouseProcessor.onMouseUp(self.view, e);
    });
    
    /***********************/
    /* ---- Mouse Out ---- */
    /***********************/
    this.canvas.addEventListener("mouseout", function(event) {
      let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
      var e = new MouseEvent(
        coords.x, // x
        coords.y, // y
        event.which
      );
      self.mouseProcessor.onMouseUp(self.view, e);
    });

    /************************/
    /* ---- Mouse Move ---- */
    /************************/
    this.canvas.addEventListener("mousemove", function(event) {
      let coords = self.windowToCanvasCoords(event.clientX, event.clientY);
      var e = new MouseMoveEvent(
        coords.x, // x
        coords.y, // y
        event.movementX, // dx
        event.movementY,  // dy
        event.which
      ); 
      self.mouseProcessor.onMouseMove(self.view, e);
    });
    
    /**************************/
    /* ---- Context Menu ---- */
    /**************************/
    this.canvas.oncontextmenu = function() { return false; }
    
  }
  
  
  // --[ helpers ]--------------------------------------------------------------
  windowToCanvasCoords(x, y) {
    this.canvas = document.getElementById(this.id);

    let style = window.getComputedStyle 
        ? getComputedStyle(this.canvas, null) 
        : this.canvas.currentStyle;

    let paddingLeft = parseInt(style.paddingLeft) || 0;
    let paddingTop = parseInt(style.paddingTop) || 0;
    let bounds = this.canvas.getBoundingClientRect();
    
    return new Vec2(
      Math.min(x - bounds.left - paddingLeft, bounds.width-1),
      Math.min(y - bounds.top  - paddingTop , bounds.height-1)
    );
      
  }
  
  updateCanvasSize() {
    this.canvas = document.getElementById(this.id);

    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
        
    const style = window.getComputedStyle 
        ? getComputedStyle(this.canvas, null) 
        : this.canvas.currentStyle;

    const paddingLeft = parseInt(style.paddingLeft) || 0;
    const paddingRight = parseInt(style.paddingRight) || 0;
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingBottom = parseInt(style.paddingBottom) || 0;    
    
    width -= (paddingLeft+paddingRight);
    height -= (paddingTop+paddingBottom);
    
    this.setWidth(width);
    this.setHeight(height);  
  }
  
}

class LabelViewOptions {}

LabelViewOptions.LEFT   = 1;
LabelViewOptions.CENTER = 2;
LabelViewOptions.RIGHT  = 3;

LabelViewOptions.GROW_X    = 0x00000001 | 0; // 1 
LabelViewOptions.GROW_Y    = 0x00000002 | 0; // 2
LabelViewOptions.SHRINK_X  = 0x00000004 | 0; // 4
LabelViewOptions.SHRINK_Y  = 0x00000008 | 0; // 8
LabelViewOptions.WORD_WRAP = 0x00000010 | 0; // 16
LabelViewOptions.CLIP      = 0x00000020 | 0; // 32

LabelViewOptions.OVERFLOW_FLAG_MIN = LabelViewOptions.GROW_X;     // 1
LabelViewOptions.OVERFLOW_FLAG_MAX = LabelViewOptions.CLIP*2 - 1; // 63



class LabelView extends View {
  // --[ ctor ]-----------------------------------------------------------------
  constructor() {
    super();
    this.isValid = false;
    
    this.position = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.anchor = new Vec2(0, 0);
    this.angle = 0;

    this.text = "";
    this.lines = [];

    this.fontFamily = "Arial";
    this.fontSize = 12;
    this.fontBold = false;
    this.fontItalic = false;
    this.fontCached = "";

    this.lineHeight = 0;    
    this.textAlign = LabelViewOptions.LEFT_ALIGN;
    this.overflowFlags = LabelViewOptions.GROW_X | LabelViewOptions.GROW_Y;

    this.fillColor = "black";
    this.strokeColor = null;
    this.strokeWeight = 1;        
    
    this.updateFont();
  }



  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    let labelX = this.getX() - this.getAnchorX()*this.getWidth();
    let labelY = this.getY() - this.getAnchorY()*this.getHeight();
    
    return (
      x >= labelX 
      && x < labelX+this.getWidth()
      && y >= labelY
      && y < labelY+this.getHeight()
    );
  }

  /************/
  /* position */
  /************/
  setX(x) { 
    this.position.x = x; 
  }
  
  getX() { 
    return this.position.x; 
  }

  setY(y) { 
    this.position.y = y; 
  }
  
  getY() { 
    return this.position.y; 
  }

  /********/
  /* size */
  /********/
  setWidth(w) {
    if (this.size.x !== w && w >= 0) {
      this.size.x = w;
      this.invalidate();      
    }
  }
  
  getWidth() { 
    return this.size.x; 
  }
  
  getHeight() { 
    return this.size.y; 
  }
  
  setHeight(h) {
    if (this.size.y !== h && h >= 0) {
      this.size.y = h;
      this.invalidate();
    }
  }
  
  setLineHeight(h) { 
    if (h != this.lineHeight) {
      this.lineHeight = h; 
      this.invalidate();
    }
  }
  
  getLineHeight() { 
    return this.lineHeight <= 0 ? this.fontSize : this.lineHeight; 
  }
  
  /**********/
  /* anchor */
  /**********/
  setAnchorX(x) {
    this.anchor.x = x;
  }
  
  getAnchorX() {
    return this.anchor.x;
  }

  setAnchorY(y) {
    this.anchor.y = y;
  }

  getAnchorY() {
    return this.anchor.y;
  }
  
  
  /*********/
  /* angle */
  /*********/
  setAngle(a) {
    this.angle = a;
  } 
  
  getAngle() { 
    return this.angle;
  }
  
  
  measure(context) {
    context.font = this.getFont();

    // Reset lines. 
    this.lines = [this.getText()];
    
    /*************/
    /* WORD_WRAP */
    /*************/
    let width = context.measureText(this.getText()).width;

    if (this.isWordWrapping() && width > this.getWidth()) {
      let words = this.getText().split(" ");
      
      if (words.length > 0) {
        // ---- Measure each word ----
        let wordWidths = [];
        let spaceWidth = context.measureText(" ").width;
        let maxWordWidth = 0;
        
        for (let i=0; i<words.length; ++i) {
          // Add current word width
          let wordWidth = context.measureText(words[i]).width;
          wordWidths.push(wordWidth);
          
          // Calculate max word width
          maxWordWidth = Math.max(maxWordWidth, wordWidth);
        }
        
        
        // ---- Construct each line ----
        let line = words[0];
        let lineWidth = wordWidths[0];

        this.lines = [];
      
        // If the label wants to grow and the widest word is greater than the 
        // current width, use the width of the widest word as the testWidth. 
        // This allows multi-word lines that are shorter than maxWordWidth to 
        // exist. E.g. if "mainframe" is the longest word, the line "hack the" 
        // should be able to exist instead of being split into lines "hack" and 
        // "the". The latter should only happen if the label doesn't want to 
        // grow.
        let testWidth = (this.isGrowingX() && maxWordWidth > this.getWidth()
          ? maxWordWidth
          : this.getWidth()
        );
        
        // Reset the label width and recalculate based on line width.
        width = 0;
        
        // Add words until the line is too long, then move to the next.
        for (let i=1; i<words.length; ++i) {
          let word = words[i];
          let wordWidth = wordWidths[i];
          
          if (lineWidth + spaceWidth + wordWidth > testWidth) { // Add line...
            this.lines.push(line);

            // Calculate the new label width.
            width = Math.max(width, lineWidth);

            // Reset the line and width.
            line = word;
            lineWidth = wordWidth; 
            
          } else { // Update line...
            // Update the line and width.
            line += " " + word;
            lineWidth += spaceWidth + wordWidth; 
          }
        }
        
        // At this point, the line should either be a single word, or one that 
        // passed the width check. Add it to lines and recalculate the width 
        // one last time.
        this.lines.push(line);
        width = Math.max(width, lineWidth);
        
      }        
    } 

    /*********************/
    /* SHRINK_X / GROW_X */
    /*********************/
    if (
      (this.isShrinkingX() && width !== 0 && width < this.getWidth())
      || (this.isGrowingX() && width > this.getWidth())
    ) { 
      this.size.x = width; 
    }
    
    
    /*********************/
    /* SHRINK_Y / GROW_Y */
    /*********************/
    let height = this.lines.length * this.getLineHeight();

    if (
      (height > this.getHeight() && this.isGrowingY())
      || (height < this.getHeight() && this.isShrinkingY())
    ) { 
      this.size.y = height;      
    }
    
    // All sizes and settings should not be correct
    this.validate();
  }

  measureIfNeeded(context) {
    if (!this.isValid) {
      this.measure(context);
    }  
  }
  
  
  // --[ options ]--------------------------------------------------------------
  /**********/
  /* GROW_X */
  /**********/
  setGrowX(g) {
    if (g) { this.addOverflowFlags(LabelViewOptions.GROW_X);
    } else { this.removeOverflowFlags(LabelViewOptions.GROW_X); }
  }
  
  isGrowingX() {
    return this.hasOverflowFlags(LabelViewOptions.GROW_X);
  }
  
  /**********/
  /* GROW_Y */
  /**********/
  setGrowY(g) {
    if (g) { this.addOverflowFlags(LabelViewOptions.GROW_Y);
    } else { this.removeOverflowFlags(LabelViewOptions.GROW_Y); }
  }
  
  isGrowingY() {
    return this.hasOverflowFlags(LabelViewOptions.GROW_Y);
  }
  
  /************/
  /* SHRINK_X */
  /************/
  setShrinkX(s) {
    if (s) { this.addOverflowFlags(LabelViewOptions.SHRINK_X);
    } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_X); }
  }
  
  isShrinkingX() {
    return this.hasOverflowFlags(LabelViewOptions.SHRINK_X);
  }
  
  /************/
  /* SHRINK_Y */
  /************/
  setShrinkY(s) {
    if (s) { this.addOverflowFlags(LabelViewOptions.SHRINK_Y);
    } else { this.removeOverflowFlags(LabelViewOptions.SHRINK_Y); }
  }
  
  isShrinkingY() {
    return this.hasOverflowFlags(LabelViewOptions.SHRINK_Y);
  }
  
  /*************/
  /* WORD_WRAP */
  /*************/
  setWordWrap(w) {
    if (w) { this.addOverflowFlags(LabelViewOptions.WORD_WRAP);
    } else { this.removeOverflowFlags(LabelViewOptions.WORD_WRAP); }
  }
  
  isWordWrapping() {
    return this.hasOverflowFlags(LabelViewOptions.WORD_WRAP);
  }

  /********/
  /* CLIP */
  /********/
  setClip(c) {
    if (c) { this.addOverflowFlags(LabelViewOptions.CLIP);
    } else { this.removeOverflowFlags(LabelViewOptions.CLIP); }
  }
  
  isClipping() {
    return this.hasOverflowFlags(LabelViewOptions.CLIP); 
  }  
  
  /********************/
  /* overflow helpers */
  /********************/
  isValidOverflowFlag(flag) {
    return (
      flag >= LabelViewOptions.OVERFLOW_FLAG_MIN
      && flag <= LabelViewOptions.OVERFLOW_FLAG_MAX
    );
  }
  
  hasOverflowFlags(flags) {
    return (this.overflowFlags & flags) === flags;
  }
  
  addOverflowFlags(flags) {
    const newOverflowFlags = this.overflowFlags | flags;
    
    if (this.overflowFlags !== newOverflowFlags) {
      this.overflowFlags = newOverflowFlags;
      this.invalidate();
    }
  }
  
  removeOverflowFlags(flags) {
    const newOverflowFlags = this.overflowFlags & ~flags;
    
    if (this.overflowFlags !== newOverflowFlags) {
      this.overflowFlags = newOverflowFlags;
      this.invalidate();
    }
  }


  /*************/
  /* textAlign */
  /*************/
  setAlignment(align) {
    this.textAlign = align;
  }
  
  
  // --[ text ]-----------------------------------------------------------------
  setText(text) { 
    if (this.text !== text) {
      this.text = text; 
      this.invalidate();      
    }
  }

  getText() {
    return this.text;
  }


  // --[ font ]-----------------------------------------------------------------
  /***************/
  /* font family */
  /***************/
  setFontFamily(family) {
    if (this.fontFamily !== family) {
      this.fontFamily = family;
      this.updateFont();
    }
  }

  getFontFamily() {
    return this.fontFamily;
  }

  
  /*************/
  /* font size */
  /*************/
  setFontSize(size) {
    if (this.fontSize !== size) {      
      this.fontSize = size;
      this.updateFont();
    }
  }

  getFontSize() {
    return this.fontSize;
  }

  
  /****************/
  /* font options */
  /****************/
  setBold(bold) { 
    if (bold !== this.fontBold) {
      this.fontBold = bold; 
      this.updateFont();
    }
  }
  
  isBold() { 
    return this.fontBold; 
  }

  setItalic(italic) { 
    if (italic != this.fontItalic) {
      this.fontItalic = italic; 
      this.updateFont();
    }
  }
  
  isItalic() { 
    return this.fontItalic; 
  }
  
  
  /***************/
  /* cached font */
  /***************/
  getFont() {
    return this.fontCached;
  }

  updateFont() {
    this.fontCached = "";
    if (this.isBold()) { this.fontCached = "bold "; }
    if (this.isItalic()) { this.fontCached += "italic "; }    
    this.fontCached += this.fontSize+"px "+this.fontFamily;
    
    this.invalidate();
  }


  // --[ color ]----------------------------------------------------------------
  setFillColor(color) {
    this.fillColor = color;
  }
  
  getFillColor() {
    return this.fillColor;
  }

  setStrokeColor(color) {
    this.strokeColor = color;
  }
  
  getStrokeColor() {
    return this.strokeColor;
  }

  setStrokeWidth(width) {
    this.strokeWidth = width;
  }
  
  getStrokeWidth() {
    return this.strokeWidth;
  }

 
  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    context.save();

    // Measurement must happen first! Widths or heights referenced prior to 
    // measurement will likely be incorrect
    this.measureIfNeeded(context);

    // Perform the translation and rotation of the canvas.
    const anchorX = this.getWidth() * this.getAnchorX();
    const anchorY = this.getHeight() * this.getAnchorY();
    
    context.translate(this.getX(), this.getY());
    if (this.getAngle() != 0) { 
      context.rotate(this.getAngle());
    }
    context.translate(-anchorX, -anchorY);
    
    // Determine the position of the text
    let textX = 0;
    let textY = 0;

    if (this.textAlign === LabelViewOptions.RIGHT) {
      textX += this.getWidth();
      context.textAlign = "end";
      
    } else if (this.textAlign === LabelViewOptions.CENTER) {
      textX += this.getWidth()/2;
      context.textAlign = "center";

    } else {
      context.textAlign = "start";  
    }    
    
    // Clip
    if (this.isClipping()) { 
      context.beginPath();
      context.rect(
        0,
        0,
        this.getWidth(),
        this.getHeight()+this.getFontSize()*0.1
      );
      //context.strokeStyle = "black";
      //context.stroke();
      context.clip();
      
    }
    
    // Setup values for drawing
    context.font         = this.fontCached;
    context.lineJoin     = "round";
    context.miterLimit   = 2;
    context.textBaseline = "top";    

    let lineHeight = this.getLineHeight();
    
    // Stroke 
    if (this.getStrokeColor() !== null && this.getStrokeWidth() > 0) {
      context.lineWidth = this.getStrokeWidth()*2;
      context.strokeStyle = this.getStrokeColor();
      for (let i=0; i<this.lines.length; ++i) {
        context.strokeText(this.lines[i], textX, textY+i*lineHeight);
      }
    }

    // Fill
    if (this.getFillColor() !== null) {
      context.lineWidth = 1;
      context.fillStyle = this.getFillColor();
      for (let i=0; i<this.lines.length; ++i) {
        context.fillText(this.lines[i], textX, textY+i*lineHeight);
      }
    }
    
    context.restore();
  }

  
  // --[ helpers ]--------------------------------------------------------------
  invalidate() {
    this.isValid = false;
  }
  
  validate() {
    this.isValid = true;
  }

}
// --[ ctor ]-------------------------------------------------------------------
class Vec2FieldView extends View {
  constructor(w, h) {
    super();
    this.field = new Vec2Field(1, 1);
    this.x = 0;
    this.y = 0;
    this.w = w;
    this.h = h;
    this.scale = 10;
  }



  // ---------------------------------------------------------------------------
  isInBounds(x, y) {
    return (
      x >= this.getX() 
      && x <  this.getX()+this.getWidth()
      && y >= this.getY() 
      && y <  this.getY()+this.getHeight()
    );
  }

  setX(x) { this.x = x; }
  getX() { return this.x; }

  setY(y) { this.y = y; }
  getY() { return this.y; }

  setWidth(w) { this.w = w; }
  getWidth() { return this.w; }
  setHeight(h) { this.h = h; }
  getHeight() { return this.h; }

  getVector(x, y) {
    return this.field.getVector((x-this.getX())/this.w, (y-this.getY())/this.h);
  }

  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    context.save();
    context.translate(this.getX(), this.getY());
    
    context.strokeStyle = "red";
    context.fillStyle = "red";

    this.drawBounds(context);
    //this.drawDots(context);
    this.drawVectors(context);
    
    context.restore();
  }

  drawBounds(context) {
    context.beginPath();
    context.rect(0, 0, this.getWidth(), this.getHeight());
    context.stroke();
  }  

  drawDots(context) {
    
    for (var x=0; x<this.field.getWidth(); x++) {    
      for (var y=0; y<this.field.getHeight(); y++) {
        var draw_x = this.getWidth()  * x/(this.field.getWidth()-1);
        var draw_y = this.getHeight() * y/(this.field.getHeight()-1);      
        
        // draw a dot
        context.beginPath();
        context.arc(draw_x, draw_y, 1, 0, 2*Math.PI);
        context.fill();
      }
    }
    
  }

  drawVectors(context) {
    context.beginPath();
    
    for (var x=0; x<this.field.getWidth(); x++) {    
      for (var y=0; y<this.field.getHeight(); y++) {
        var draw_x = this.getWidth()  * x/(this.field.getWidth()-1);
        var draw_y = this.getHeight() * y/(this.field.getHeight()-1);      
        var vec = this.field.getVector(x, y);
        
        // draw the vector
        context.moveTo(draw_x, draw_y);
        context.lineTo(draw_x+vec.x*this.scale, draw_y+vec.y*this.scale);      
      }
    }
    
    context.stroke();  
  }
}

class ShapeView extends View {
  constructor() {
    super();
    this.fillStyle = "white";
    this.strokeStyle = "black";
    this.strokeWidth = 1;
    this.strokeDash = [];
  }
  
  
  // --[ style ]----------------------------------------------------------------
  setFillStyle(style) { this.fillStyle = style; }  
  getFillStyle() { return this.fillStyle; }
    
  setStrokeStyle(style) { this.strokeStyle = style; }  
  getStrokeStyle() { return this.strokeStyle; }
    
  setStrokeWidth(width) { this.strokeWidth = width; }  
  getStrokeWidth() { return this.strokeWidth; }

  setStrokeDash(dash) { this.strokeDash = dash; }
  getStrokeDash() { return this.strokeDash; }
  
  
  // --[ drawing ]--------------------------------------------------------------
  fill(context) {
    let fillStyle = this.getFillStyle();
    if (fillStyle !== null) {
      context.fillStyle = fillStyle;
      context.fill();
    }    
  }
  
  stroke(context) {
    let strokeStyle = this.getStrokeStyle();
    let strokeWidth = this.getStrokeWidth();
    if (strokeStyle !== null && strokeWidth !== 0) {
      context.lineWidth = strokeWidth;
      context.strokeStyle = strokeStyle;
      context.setLineDash(this.getStrokeDash());
      context.stroke();
    }    
  }
  
}
class CircleView extends ShapeView {
  constructor(r) {
    super();
    this.position = new Vec2();
    this.radius = r;
  }

  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return (
      Math.sqrt(Math.pow(this.getX()-x,2) + Math.pow(this.getY()-y,2)) <= this.getRadius()
    );
  }

  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }

  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }

  setRadius(r) { this.radius = r; }
  getRadius() { return this.radius; }

  
  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    context.beginPath();
    context.arc(this.getX(), this.getY(), this.getRadius(), 0, 2*Math.PI);
    this.fill(context);
    this.stroke(context);
  }
  
}
class LineView extends View { 
  constructor(x1, y1, x2, y2) {
    super()
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.strokeColor = "white";
    this.strokeWidth = 1;
  }


  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return false;    
  }
  
  setX1(x) { this.x1 = x; }
  getX1() { return this.x1; }

  setY1(y) { this.y1 = y; }
  getY1() { return this.y1; }

  setX2(x) { this.x2 = x; }
  getX2() { return this.x2; }

  setY2(y) { this.y2 = y; }
  getY2() { return this.y2; }

  getX() { return this.getX1(); }
  getY() { return this.getY1(); }

  
  // --[ style ]----------------------------------------------------------------
  setStrokeColor(c) { this.strokeColor = c; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(w) { this.strokeWidth = w; }
  getStrokeWidth() { return this.strokeWidth; }
  
  
  // --[ drawing ]--------------------------------------------------------------
  path(context) {
    context.moveTo(this.getX1(), this.getY1());
    context.lineTo(this.getX2(), this.getY2());
  }
  
  fill(context) {}
  
  stroke(context) {
    context.strokeStyle = this.getStrokeColor();
    context.lineWidth = this.getStrokeWidth();
    context.stroke();
  }
  
  drawSelf(context) {
    context.save();
    context.beginPath();
    this.path(context);
    this.fill(context);
    this.stroke(context);
    context.restore();
  }
  
}
class LineStringView extends View { 
  constructor(vertices) {
    super()
    this.vertices = vertices || [];
    this.strokeColor = "white";
    this.strokeWidth = 1;
  }


  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return false;    
  }

  getX() { 
    let v = this.getVertex(0);
    return (typeof v !== "undefined" && v !== null) ? v.x : 0;
  }
  getY() { 
    let v = this.getVertex(0);
    return (typeof v !== "undefined" && v !== null) ? v.y : 0;
  }

  
  // --[ vertices ]-------------------------------------------------------------
  addVertex(x, y) {
    if (typeof y === "undefined") { 
      if (x instanceof Vec2) { // Vec2 provided
        this.vertices.push(x);
        return true;
      }

    } else { // other provided
      this.vertices.push(new Vec2(x, y));
      return true;
    }
    
    return false;
  }
  
  getVertex(index) {
    return this.vertices[index];
  }
  
  getVertexCount() {
    return this.vertices.length;
  }
  
  clear() {
    this.vertices = [];
  }
  
  
  // --[ style ]----------------------------------------------------------------
  setStrokeColor(c) { this.strokeColor = c; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(w) { this.strokeWidth = w; }
  getStrokeWidth() { return this.strokeWidth; }
  
  
  // --[ drawing ]--------------------------------------------------------------
  path(context) {
    if (this.getVertexCount() >= 2) {
      context.moveTo(this.getVertex(0).x, this.getVertex(0).y);
      for (let i = 1; i < this.vertices.length; ++i) {
        context.lineTo(this.getVertex(i).x, this.getVertex(i).y);
      }
    }
  }

  fill(context) {
    
  }
  
  stroke(context) {
    context.strokeStyle = this.getStrokeColor();
    context.lineWidth = this.getStrokeWidth();
    context.stroke();
  }
  
  drawSelf(context) {
    context.save();
    context.beginPath();
    this.path(context);
    this.fill(context);
    this.stroke(context);
    context.restore();
  }
  
}
class LineGroupView extends View { 
  constructor(lines) {
    super()
    this.lines = lines || [];
    this.strokeColor = "white";
    this.strokeWidth = 1;
  }


  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return false;    
  }

  getX() { 
    let l = this.getLine(0);
    return (typeof l !== "undefined" && l !== null) ? l.getX() : 0;
  }
  
  getY() { 
    let l = this.getLine(0);
    return (typeof l !== "undefined" && l !== null) ? l.getY() : 0;
  }

  
  // --[ vertices ]-------------------------------------------------------------
  addLine(line) {
    this.lines.push(line);
  }
  
  getLine(index) {
    return this.lines[index];
  }
  
  getLineCount() {
    return this.lines.length;
  }
  
  clear() {
    this.lines = [];
  }
  
  // --[ style ]----------------------------------------------------------------
  setStrokeColor(c) { this.strokeColor = c; }
  getStrokeColor() { return this.strokeColor; }

  setStrokeWidth(w) { this.strokeWidth = w; }
  getStrokeWidth() { return this.strokeWidth; }
  
  
  // --[ drawing ]--------------------------------------------------------------
  path(context) {
    if (this.getLineCount() >= 1) {
      for (let i = 0; i < this.getLineCount(); ++i) {
        let line = this.getLine(i);
        line.path(context);
      }
    }
  }

  fill(context) {}
  
  stroke(context) {
    context.strokeStyle = this.getStrokeColor();
    context.lineWidth = this.getStrokeWidth();
    context.stroke();
  }
  
  drawSelf(context) {
    context.save();
    context.beginPath();
    this.path(context);
    this.fill(context);
    this.stroke(context);
    context.restore();
  }
  
}
class PolygonView extends ShapeView {
  constructor(points) {
    super();
    this.position = new Vec2();
    this.points = points || [];
  }

  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return false;
  }

  setX(x) { this.position.x = x; }  
  getX() { return this.position.x; }
  
  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }


  // --[ points ]---------------------------------------------------------------
  setPoints(points) {
    this.points = points || [];
  }
  
  addPoint(x, y) {
    let point = null;
    console.log(typeof x, x);
    if (!isNaN(x) && !isNaN(y)) { // x and y are both numbers
      point = new Vec2(x, y);
    
    } else if (typeof x === "object") { // input is a Vec2
      point = x;      
    }
    
    
    if (point !== null) {
      this.points.push(point);
    }
  }
  
  removePoint(index) {
    this.points.splice(index, 1);
  }
  
  removeAllPoints() {
    this.points = [];
  }
  
  getPoint(index) {
    return this.points[index];
  }
  
  getPointCount() {
    return this.points.length;
  }


  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    if (this.getPointCount() >= 3) {
      context.save();
      
      // Move to this polygon's positon to treat it as the origin.
      context.translate(this.getX(), this.getY());
      
      // Draw
      context.beginPath();
      context.moveTo(this.getPoint(0).x, this.getPoint(0).y);
      for (let i = 1; i < this.getPointCount(); ++i) {
        let p = this.getPoint(i);
        context.lineTo(p.x, p.y);
      }
      context.closePath();
            
      this.fill(context);
      this.stroke(context);
    
      context.restore();
    }
  }
  
}
class RectangleView extends ShapeView {
  constructor(w, h) {
    super();
    this.position = new Vec2();
    this.size = new Vec2(w, h);
  }

  
  // --[ bounds ]---------------------------------------------------------------
  isInBounds(x, y) {
    return (
      x >= this.getX() 
      && x < this.getX()+this.getWidth() 
      && y >= this.getY() 
      && y < this.getY()+this.getHeight()
    );
  }

  setX(x) { this.position.x = x; }  
  getX() { return this.position.x; }
  
  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }

  setWidth(w) { this.size.x = w; }
  getWidth() { return this.size.x; }

  setHeight(h) { this.size.y = h; }
  getHeight() { return this.size.y; }


  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    context.beginPath();
    context.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight()); 
    this.fill(context);
    this.stroke(context);
  }
  
}
class VectorView extends View {
  constructor() {
    super();
    
    this.position = new Vec2(0, 0);
    this.vector = new Vec2(0, 0);

    this.strokeWidth = 3;
    this.isDashed = false;
    this.arrowWidth = 16;
    this.arrowHeight = 20;
    
    this.color = "#000";
  }
  
  // --[ bounds ]---------------------------------------------------------------
  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }

  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }
  
  getMidX() { return this.getX() + this.vector.x/2; }
  getMidY() { return this.getY() + this.vector.y/2; }

  getEndX() { return this.getX() + this.vector.x; }
  getEndY() { return this.getY() + this.vector.y; }
  
  isInBounds(x, y) { return false; }
  
  // --[ style ]----------------------------------------------------------------
  setStrokeWidth(w) { this.strokeWidth = w; }
  getStrokeWidth() { return this.strokeWidth; }
  
  setStrokeDashed(dashed) { this.isDashed = dashed; }
  isStrokeDashed() { return this.isDashed; }
  
  // --[ arrow ]----------------------------------------------------------------
  setArrowWidth(w) { this.arrowWidth = w; }
  getArrowWidth() { return this.arrowWidth; }
  
  setArrowHeight(h) { this.arrowHeight = h; }
  getArrowHeight() { return this.arrowHeight; }
  
  // --[ drawing ]--------------------------------------------------------------
  drawArrow(context) {
    const arrowMidScale = 0.8;
    
    const arrowHeight = Math.min(this.vector.mag(), this.arrowHeight);
    const arrowWidth = this.arrowWidth * (arrowHeight/this.arrowHeight);
    
    const normal = Vec2.normal(this.vector).setMag(arrowWidth/2);
    const inverse = Vec2.invert(this.vector).setMag(arrowHeight);
    
    const p1 = new Vec2(this.getEndX(), this.getEndY());
    const p2 = Vec2.add(p1, inverse).add(normal);
    const p3 = Vec2.add(p1, Vec2.scale(inverse, arrowMidScale));
    const p4 = Vec2.subtract(p2, normal).subtract(normal);
    
    context.beginPath();    
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.closePath();    
    context.fill();
    
    return arrowHeight*arrowMidScale;
  }
  
  drawLine(context, arrowHeight) {
    const newMag = this.vector.mag()-arrowHeight;
    const scaled = Vec2.copy(this.vector).setMag(newMag);
    
    context.beginPath();    
    context.moveTo(this.getX(), this.getY());
    context.lineTo(this.getX()+scaled.x, this.getY()+scaled.y);
    context.stroke();    
  }

  drawSelf(context) {
    context.fillStyle = this.color;
    context.lineCap = "round"
    context.lineWidth = this.strokeWidth;
    context.setLineDash(this.isStrokeDashed() ? [this.strokeWidth*2, this.strokeWidth*3] : []);
    context.strokeStyle = this.color;
    
    let arrowHeight = this.drawArrow(context);
    this.drawLine(context, arrowHeight);
  }
  
}
// ==[ BarChartTooltip ]========================================================
class BarChartTooltip extends RectangleView {
  constructor(w, h) {
    super(w, h);
    this.padding = 8;
    this.topLabel = new LabelView();
    this.bottomLabel = new LabelView();
    
    this.desiredWidth = w;
    
    this.initSelf();
    this.initTopLabel();
    this.initBottomLabel();
  }
  
  // --[ init ]-----------------------------------------------------------------
  initSelf() {
    this.setFillStyle("#ffffffef");
    this.setStrokeStyle("#aaaaaa");    
  }
  
  initTopLabel() {
    this.topLabel.setFillColor("black");
    this.topLabel.setFontSize(14);  
    
    this.topLabel.setShrinkX(true);
    this.topLabel.setShrinkY(true);
    this.topLabel.setGrowX(true);
    this.topLabel.setGrowY(true);
    this.topLabel.setWordWrap(true);
    this.topLabel.setClip(false);
 
    this.addView(this.topLabel);
  }
  
  initBottomLabel() {
    this.bottomLabel = new LabelView();
    this.bottomLabel.setFillColor("black");
    this.bottomLabel.setFontSize(14);
    this.bottomLabel.setBold(true);
    
    this.bottomLabel.setShrinkX(true);
    this.bottomLabel.setShrinkY(true);
    this.bottomLabel.setGrowX(true);
    this.bottomLabel.setGrowY(true);
    this.bottomLabel.setWordWrap(false);
    this.bottomLabel.setClip(false);
    
    this.addView(this.bottomLabel);    
  }  

  // --[ padding ]--------------------------------------------------------------
  getPadding() { return this.padding; }
  setPadding(padding) { this.padding = padding; }
  
  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    this.layout(context);
    super.drawSelf(context);
  }

  // --[ helpers ]--------------------------------------------------------------
  layout(context) {
    // Top label
    this.topLabel.setX(this.getPadding());
    this.topLabel.setY(this.getPadding());
    this.topLabel.setWidth(this.desiredWidth - 2*this.getPadding());
    this.topLabel.measureIfNeeded(context);

    // Bottom label
    this.bottomLabel.setX(this.getPadding());
    this.bottomLabel.setY(
      this.topLabel.getY() 
      + this.topLabel.getHeight()
      + this.getPadding()
    );
    this.bottomLabel.setWidth(this.getWidth() - this.getPadding()*2);
    this.bottomLabel.measureIfNeeded(context);
    
    // This
    this.setWidth(
      this.getPadding() * 2
      + Math.max(this.topLabel.getWidth(), this.bottomLabel.getWidth())
    );
    this.setHeight(
      this.getPadding()*3 
      + this.topLabel.getHeight() 
      + this.bottomLabel.getHeight()
    );
    
  }
  
}

// ==[ BarChartDataSource ]=====================================================
class BarChartDataSource {
  constructor() {
    this.data = [];
    this.max = 0;
  }
  
  add(name, value, color) {
    this.data.push({
      name: name,
      value: value,
      color: color
    });
    this.max = this.considerForMax(value);
  }
  
  remove(i) {
    let removed = this.data.splice(i, 1);
    let obj = null;
    
    if (removed.length > 0) {
      obj = removed[0];
      if (this.max === obj.value) {
        this.calcMax();
      }
    } 

    return obj;
  }
  
  get(i) {
    return this.data[i];
  }
  
  count() {
    return this.data.length;
  }

  clear() {
    this.data = [];
    this.max = 0;
  }
  
  calcMax() {
    this.max = 0;
    for (let i=0; i<this.data.length; ++i) {
      this.max = this.considerForMax(this.data[i].value);
    }
  }
  
  considerForMax(value) {
    //return Math.max(this.max, Math.ceil(value*1.02));
    return Math.max(this.max, Math.ceil(value));
  }
  
}

// ==[ BarChart ]===============================================================
class BarChartView extends View {
  constructor(w, h) {
    super();
    this.position = new Vec2();
    this.size = new Vec2(w, h);
    
    this.barData = new BarChartDataSource();
    this.barViews = [];
    this.selectedBar = null;
    
    this.leftLabels = [];
    this.bottomLabels = [];
    
    this.graphArea = {x1: 0, y1: 0, x2: 0, y2: 0}
    this.padding = {left: 10, right: 10, top: 10, bottom: 10}
    
    this.tooltip = this.initTooltip(200, 100);
  }

  // --[ initializers ]---------------------------------------------------------
  initTooltip(w, h) {
    const tooltip = new BarChartTooltip(w, h);
    tooltip.setVisible(false);
    tooltip.setPickable(false);
    this.addView(tooltip);    
    return tooltip;
  }
  
  // --[ bounds ]---------------------------------------------------------------
  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }
  
  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }
  
  setWidth(w) { this.size.x = w; }
  getWidth() { return this.size.x; }
  
  setHeight(h) { this.size.y = h; }
  getHeight() { return this.size.y; }

  isInBounds(x, y) {
    return (
      x >= this.getX() 
      && y >= this.getY()
      && x < this.getX() + this.getWidth()
      && y < this.getY() + this.getHeight()
    );
  }
  
  // --[ data ]-----------------------------------------------------------------
  /*
   * [
   *   {
   *     name: "name",
   *     value: #,
   *     color: "color"
   *   },  
   *   {
   *     name: "name",
   *     value: #,
   *     color: "color"
   *   },
   *   ...
   * ]
   */
  setData(data) {
    this.barData.clear();
    for (let i=0; i<data.length; ++i) {
      this.barData.add(data[i].name, data[i].value, data[i].color);
    }
  }
  
  getBar(i) {
    return {
      index: i,
      data: (i < this.barData.count() ? this.barData.get(i) : null),
      view: (i < this.barViews.length ? this.barViews[i]    : null)
    }
  }
  
  sortDataByValueDesc() {
    let sorted = [];
    
    for (let i=0; i<this.barData.count(); ++i) {
      let added = false;
      
      for (let j=0; j<sorted.length; ++j) {
        if (this.barData.get(i).value >= sorted[j].value) {
          sorted.splice(j, 0, this.barData.get(i));
          added = true;
          break;
        }
      }
    
      if (!added) {
        sorted.push(this.barData.get(i));
      }
    }
    
    this.setData(sorted);   
  }
  
  // --[ drawing ]--------------------------------------------------------------
  layout(context) {
    // Generate initial graphArea based off of padding
    this.graphArea.x1 = this.padding.left;
    this.graphArea.y1 = this.padding.top;
    this.graphArea.x2 = this.getWidth() - this.padding.right;
    this.graphArea.y2 = this.getHeight() - this.padding.bottom;
  
    // Create and measure the left labels. This affects graphArea.x1.
    this.createAndMeasureLeftLabels(context);
  
    // Create and measure the bottom labels. This affects graphArea.y2 and 
    // graphArea.x2.
    this.layoutBottomLabels(context);
    
    // Layout the bars next so that we can reference their position when laying 
    // out the left labels.
    this.layoutBars();
  
    // Finally, layout the left labels. These have already been created, so we 
    // just need to position them based on the bars.
    this.layoutLeftLabels(context);
  }
  
  createAndMeasureLeftLabels(context) {
    const offset = 10;
    const labelWidth = 
        this.getWidth()/3 
        - this.padding.left 
        - this.padding.right 
        - offset;
    let maxWidth = 0;
    
    this.leftLabels = [];
    
    // Create and measure each label
    for (let i=0; i<this.barData.count(); ++i) {
      let data = this.barData.get(i);
      
      let label = new LabelView();
      label.setAlignment(LabelViewOptions.RIGHT);
      label.setAnchorX(1.0);
      label.setAnchorY(0.5);
      label.setClip(true);
      label.setFontSize(11);
      label.setGrowX(false);
      label.setGrowY(true);
      label.setShrinkX(true);
      label.setShrinkY(true);
      label.setText(data.name);
      label.setWidth(labelWidth);
      label.setWordWrap(true);
      
      label.measureIfNeeded(context);
      this.leftLabels.push(label);
      
      // Update the label width
      maxWidth = Math.max(maxWidth, label.getWidth());
    }

    // Update the graphArea
    this.graphArea.x1 = this.padding.left + maxWidth + offset;
  }
  
  layoutBottomLabels(context) {
    const offset = 10;    
    const left = this.graphArea.x1;
    const dataMax = Math.ceil(this.barData.max);
    
    // Get the width of the largest label
    let label = new LabelView();
    label.setFontSize(11);
    label.setGrowX(true);
    label.setShrinkX(true);
    label.setText(dataMax);
    label.measureIfNeeded(context);
    
    let labelWidth = label.getWidth();
    let labelHeight = label.getLineHeight();
    
    // Change the graphArea based on the dimensions gathered from the label.
    this.graphArea.y2 = 
        this.getHeight() 
        - this.padding.bottom 
        - labelHeight 
        - offset;
    this.graphArea.x2 -= labelWidth/2;
    
    let graphWidth = this.graphArea.x2 - this.graphArea.x1;
    
    // Determine how to step through the data
    let step = Math.ceil(dataMax*labelWidth*2 / graphWidth);

    if (       step >   2 && step <    5) { step =    5;
    } else if (step >   5 && step <   10) { step =   10;      
    } else if (step >  10 && step <   20) { step =   20;      
    } else if (step >  20 && step <   25) { step =   25;      
    } else if (step >  25 && step <   50) { step =   50;      
    } else if (step >  50 && step <  100) { step =  100;
    } else if (step > 100 && step <  200) { step =  200;
    } else if (step > 200 && step <  250) { step =  250;
    } else if (step > 250 && step <  500) { step =  500;
    } else if (step > 500 && step < 1000) { step = 1000; }    
    
    // Create each label
    this.bottomLabels = [];
    
    for (let i=0; i<=dataMax; i+=step) {
      // Create and measure
      let label = new LabelView();
      label.setFontSize(11);
      label.setGrowX(true);
      label.setShrinkX(true);
      label.setText(i);
      label.setFillColor("black");
      label.setStrokeColor(null);
      label.setAnchorX(0.5);
      label.setAnchorY(0.0);
      
      label.measureIfNeeded(context);

      label.setX(left + graphWidth*i/dataMax);
      label.setY(this.graphArea.y2 + offset);
      this.bottomLabels.push(label);
    }    	
  }
  
  layoutBars() {
    const barPadding = 2;
    const barLeft = this.graphArea.x1;
    const barHeight = Math.floor(
      (
        this.graphArea.y2 
        - this.graphArea.y1       
        - (this.barData.count()+1)*barPadding
      ) / this.barData.count()
    );
    const barWidthMax = this.graphArea.x2 - this.graphArea.x1;
    
    const totalBarHeight = 
        (barHeight + barPadding)*this.barData.count() 
        - barPadding
        
    const top = this.graphArea.y1 + Math.floor(
      (
        this.graphArea.y2 
        - this.graphArea.y1 
        - totalBarHeight
      ) / 2
    );
    
    this.barViews = [];

    for (let i=0; i<this.barData.count(); ++i) {
      let data = this.barData.get(i);
      let y = top + (barPadding + barHeight)*i - 1;
      let w = barWidthMax * data.value/this.barData.max; 
      
      let bar = new RectangleView(w, barHeight);
      bar.setFillStyle(data.color);
      bar.setStrokeStyle(null);
      bar.setStrokeWidth(1);
      bar.setX(barLeft);
      bar.setY(y);
      this.barViews.push(bar);
    }
  }
  
  layoutLeftLabels(context) {
    for (let i=0; i<this.leftLabels.length; ++i) {
      let label = this.leftLabels[i];
      let bar = this.barViews[i];
      
      label.setX(bar.getX() - 10);
      label.setY(bar.getY() + bar.getHeight()/2);
      label.measureIfNeeded(context);
      
      if (label.getHeight() > bar.getHeight()) {
        let lineHeight = label.getLineHeight();
        label.setClip(true);
        label.setGrowY(false);
        label.setHeight(Math.max(
          lineHeight,
          Math.floor(bar.getHeight() / lineHeight) * lineHeight
        ));
      }
    }
  }
  
  /*
  drawLeftLabels(context, padding) {
    const labelOffset = 8;
    const labelMarginLeft = 4;
    const labelMarginRight = 2;
    
    // Measure and position each label
    let label = new LabelView();
    label.setText("|");
    label.measure(context);

    padding.bottom = Math.max(padding.bottom, label.getHeight()/2 + 1);
    padding.top    = Math.max(padding.top   , label.getHeight()/2 + 1);
    
    const bottom = this.getHeight() - padding.bottom;
    const height = this.getHeight() - padding.bottom - padding.top;

    if (height <= 0) { return; }
    
    let step = Math.ceil(this.barData.max*label.getHeight()*3 / height);    
    let labels = [];
    
    if (       step >   2 && step <    5) { step =    5;
    } else if (step >   5 && step <   10) { step =   10;      
    } else if (step >  10 && step <   20) { step =   20;      
    } else if (step >  20 && step <   25) { step =   25;      
    } else if (step >  25 && step <   50) { step =   50;      
    } else if (step >  50 && step <  100) { step =  100;
    } else if (step > 100 && step <  200) { step =  200;
    } else if (step > 200 && step <  250) { step =  250;
    } else if (step > 250 && step <  500) { step =  500;
    } else if (step > 500 && step < 1000) { step = 1000; }
    
    for (let i=0; i<=this.barData.max; i+=step) {
      // Create and measure
      let label = new LabelView();
      label.setText(i);
      label.measure(context);
      label.setX(0);
      label.setY(bottom - height*i/this.barData.max - label.getHeight()/2 - 1);
      label.setFillColor("black");
      label.setStrokeColor(null);
      labels.push(label);
      
      // Calculate the left padding
      padding.left = Math.max(
        padding.left, 
        labelMarginLeft + label.getWidth() + labelMarginRight + labelOffset
      );
    }

    // Draw labels 
    for (let i=0; i<labels.length; ++i) {
      let label = labels[i];
      label.setX(padding.left - labelOffset - labelMarginRight - label.getWidth());
      label.draw(context);
    }
    
    // Draw lines to axis
    context.beginPath();
    for (let i=0; i<labels.length; ++i) {
      let label = labels[i];
      context.moveTo(
        label.getX() + label.getWidth() + 2, 
        label.getY() + label.getHeight()/2 + 1
      );
      context.lineTo(
        padding.left,
        label.getY() + label.getHeight()/2 + 1
      );
    }    
    context.stroke();
    
  }
  
  drawAxes(context, padding) {
    const offset = 5;
    
    context.lineCap = "round";
    context.lineWidth = 1;
    context.strokeStyle = "black";

    context.beginPath();
    context.moveTo(padding.left, padding.top);
    context.lineTo(padding.left, this.getHeight()-padding.bottom);
    context.lineTo(this.getWidth()-padding.right, this.getHeight()-padding.bottom);
    context.stroke();    
  }
  
  drawBars(context, padding) {
    const barPadding = 4;
    const barBottom = this.getHeight()-padding.bottom;
    const barWidth = (
      this.getWidth()
      - padding.left
      - padding.right
      - (this.barData.count()+1)*barPadding
    ) / this.barData.count();
    const barHeightMax = this.getHeight()-padding.top-padding.bottom;
    
    context.lineWidth = 1;
    context.strokeStyle = "white";
    
    this.barViews = [];
    for (let i=0; i<this.barData.count(); ++i) {
      let data = this.barData.get(i);
      let x = padding.left + barPadding + (barPadding + barWidth)*i
      let h = barHeightMax * data.value/this.barData.max; 
      let y = barBottom - h;
      
      context.fillStyle = data.color;
      context.beginPath();
      context.moveTo(parseInt(x), y+h);
      context.lineTo(parseInt(x), parseInt(y));
      context.lineTo(parseInt(x+barWidth), parseInt(y));
      context.lineTo(parseInt(x+barWidth), y+h);
      context.fill();
      context.stroke();
      
      this.barViews.push({
        x: x,
        y: y,
        w: barWidth,
        h: h,
        name: data.name,
        value: data.value
      });
    }
  }
  
  drawBottomLabels(context, padding) {
    const lineHeight = 4;
    const offset = 2;
    
    
    let label = new LabelView();
    label.setShrinkX(true);
    label.setShrinkY(false);
    label.setGrowX(true);
    label.setGrowY(true);
    label.setWordWrap(true);
    label.setClip(true);
    label.setAlignment(LabelViewOptions.CENTER);
    label.setAnchorX(0.5);
    label.setAnchorY(0.0);
    //label.setAngle(270 * Math.PI/180);
    
    for (let i=0; i<this.barViews.length; ++i) {
      let bar = this.barViews[i];
      let y = bar.y + bar.h + lineHeight + offset;
      
      label.setText(bar.name);
      label.measureIfNeeded(context);
      
      label.setX(bar.x + bar.w/2);
      label.setY(y);
      //label.setWidth((padding.bottom - lineHeight - offset - label.getHeight())*Math.sqrt(2));
      label.setWidth(bar.w-2);
      label.setHeight()
      label.draw(context);
    }
    
    context.beginPath();
    for (let i=0; i<this.barViews.length; ++i) {
      let bar = this.barViews[i];
      let x = bar.x + bar.w/2;
      let y1 = bar.y + bar.h;
      let y2 = y1 + lineHeight;
      context.moveTo(x, y1);
      context.lineTo(x, y2);
    }
    
    context.strokeStyle = "black";
    context.stroke();
    
  }
  */
  
  drawLeftLabels(context) {
    for (let i=0; i<this.leftLabels.length; ++i) {
      this.leftLabels[i].draw(context);
    }
  }
  
  drawBottomLabels(context) {
    for (let i=0; i<this.bottomLabels.length; ++i) {
      this.bottomLabels[i].draw(context);
    }    
    
    context.beginPath();
    for (let i=0; i<this.bottomLabels.length; i+=2) {
      let x = this.bottomLabels[i].getX();
      let w = (i < this.bottomLabels.length-1
        ? this.bottomLabels[i+1].getX() - x
        : this.graphArea.x2 - x
      );

      context.rect(
        x,
        this.graphArea.y1,
        w, 
        this.graphArea.y2 - this.graphArea.y1
      );
    }
    
    context.fillStyle = "#f0f0f0";
    context.fill();
  }
  
  drawBars(context) {
    for (let i=0; i<this.barViews.length; ++i) {
      let bar = this.barViews[i];
      
      if (this.selectedBar != null && i == this.selectedBar.index) {
        context.shadowBlur = 2;
        context.shadowColor = "rgba(0,0,0,0.5)";
      }
      
      bar.draw(context);
      context.shadowBlur = 0;
      
      if (this.selectedBar != null && i == this.selectedBar.index) {
        context.lineWidth = 2;
        context.fillStyle = "rgba(255,255,255,0.5)";
        context.strokeStyle = "white";
        
        context.beginPath();
        context.rect(bar.getX(), bar.getY(), bar.getWidth(), bar.getHeight());
        context.fill();
        //context.stroke();
        
      }
    }
    
  }
  
  drawAxes(context) {
    const offset = 2; 
    
    context.lineCap = "square";
    context.lineWidth = 1;
    context.strokeStyle = "black";

    context.beginPath();
    
    // Draw left and bottom axes
    context.moveTo(this.graphArea.x1, this.graphArea.y1);
    context.lineTo(this.graphArea.x1, this.graphArea.y2);
    context.lineTo(this.graphArea.x2, this.graphArea.y2);    
    
    // Draw lines to left labels
    for (let i=0; i<this.leftLabels.length; ++i) {
      let label = this.leftLabels[i];
      context.moveTo(label.getX()+offset, label.getY());
      context.lineTo(this.graphArea.x1, label.getY());
    }
    
    // Draw lines to bottom labels
    for (let i=0; i<this.bottomLabels.length; ++i) {
      let label = this.bottomLabels[i];
      context.moveTo(label.getX(), label.getY()-offset);
      context.lineTo(label.getX(), this.graphArea.y2);
    }
    
    // Stroke!!!
    context.stroke();
  }
  
  drawSelf(context) {
    this.layout(context);
  
    context.save();
    context.translate(this.getX(), this.getY());

    
    // Draw background
    context.fillStyle = "white";
    context.beginPath();
    context.rect(0, 0, this.getWidth(), this.getHeight());
    context.fill();
    

    // Draw graph area background
    context.strokeStyle = "#f0f0f0";
    context.beginPath();
    context.rect(
      this.graphArea.x1, 
      this.graphArea.y1,
      this.graphArea.x2 - this.graphArea.x1,
      this.graphArea.y2 - this.graphArea.y1
    );    
    context.stroke();
    
    // Draw components    
    this.drawLeftLabels(context);
    this.drawBottomLabels(context);
    this.drawBars(context);
    this.drawAxes(context);
    
    // Update tooltip 
    if (this.tooltip.getX() < 0) {
      this.tooltip.setX(0);
    }
    if (this.tooltip.getY() < 0) {
      this.tooltip.setY(0);
    }

    context.restore();
  }
  
  
  // --[ events ]---------------------------------------------------------------
  onMouseMove(event) {
    super.onMouseMove(event);

    const bar = this.pickBar(event.x, event.y);
    
    if (bar !== null) {
      const name = bar.data.name;
      const value = bar.data.value;
      
      this.tooltip.setVisible(true);
      this.tooltip.topLabel.setText(name);
      this.tooltip.bottomLabel.setText(value);
      this.tooltip.setX(event.x - this.getX() - this.tooltip.getWidth() - 4);
      this.tooltip.setY(event.y - this.getY() - this.tooltip.getHeight() - 4);

      this.selectedBar = bar;
      
    } else {
      this.tooltip.setVisible(false);
      this.selectedBar = null;
    }
  }
    
  onMouseExit(event) {
    super.onMouseExit(event);
    this.tooltip.setVisible(false);
    this.selectedBar = null;
  }
  
  onMouseDrag(event) {
    super.onMouseDrag(event);
    this.tooltip.setVisible(false);
    this.selectedBar = null;
 
    // Vector that points from the center of the chart to the mouse.
    let vecCurrent = new Vec2(
      event.x - this.getX()-this.getWidth()/2,
      event.y - this.getY()-this.getHeight()/2
    );
    let vecPrevious = new Vec2(
      vecCurrent.x - event.dx,
      vecCurrent.y - event.dy,
    );
    
    let vecDiff = new Vec2(
      Math.abs(vecCurrent.x) - Math.abs(vecPrevious.x),
      Math.abs(vecCurrent.y) - Math.abs(vecPrevious.y),
    );
    
    this.setWidth(this.getWidth() + vecDiff.x*2);
    this.setHeight(this.getHeight() + vecDiff.y*2);
  }
  
  
  // --[ helpers ]--------------------------------------------------------------
  pickBar(x, y) {
    if (this.isInBounds(x, y) && this.barViews.length > 0) {
      let pickVec = new Vec2(x-this.getX(), y-this.getY());

      for (let i=0; i<this.barViews.length; ++i) {
        let bar = this.barViews[i];        
        if (bar.isInBounds(pickVec.x, pickVec.y)) {
          return this.getBar(i); 
        }
      }
    }
    
    return null;
  }  
}
// ==[ PieChartSlice ]==========================================================
class PieChartSlice {
  constructor(name="", value=0, color=null) {
    this.name = name;    
    this.value = value;
    this.color = color;
    this.sAngle = 0;
    this.eAngle = 0;
  }  
}


// ==[ PieChartTooltip ]========================================================
class PieChartTooltip extends RectangleView {
  constructor(w, h) {
    super(w, h);
    this.padding = 8;
    this.topLabel = new LabelView();
    this.bottomLabel = new LabelView();
    
    this.initSelf();
    this.initTopLabel();
    this.initBottomLabel();
  }
  
  // --[ init ]-----------------------------------------------------------------
  initSelf() {
    this.setFillColor("#ffffffef");
    this.setStrokeColor("#aaaaaa");    
  }
  
  initTopLabel() {
    this.topLabel.setFillColor("black");
    this.topLabel.setFontSize(14);  
    
    this.topLabel.setShrinkX(true);
    this.topLabel.setShrinkY(true);
    this.topLabel.setGrowX(true);
    this.topLabel.setGrowY(true);
    this.topLabel.setWordWrap(true);
    this.topLabel.setClip(false);
 
    this.addView(this.topLabel);
  }
  
  initBottomLabel() {
    this.bottomLabel = new LabelView();
    this.bottomLabel.setFillColor("black");
    this.bottomLabel.setFontSize(14);
    this.bottomLabel.setBold(true);
    
    this.bottomLabel.setShrinkX(true);
    this.bottomLabel.setShrinkY(true);
    this.bottomLabel.setGrowX(true);
    this.bottomLabel.setGrowY(true);
    this.bottomLabel.setWordWrap(false);
    this.bottomLabel.setClip(false);
    
    this.addView(this.bottomLabel);    
  }

  // --[ padding ]--------------------------------------------------------------
  getPadding() { return this.padding; }
  setPadding(padding) { this.padding = padding; }
  
  // --[ drawing ]--------------------------------------------------------------
  drawSelf(context) {
    this.layout(context);
    super.drawSelf(context);
  }

  // --[ helpers ]--------------------------------------------------------------
  layout(context) {
    // Top label
    this.topLabel.setX(this.getPadding());
    this.topLabel.setY(this.getPadding());
    this.topLabel.setWidth(this.getWidth() - this.getPadding()*2);
    this.topLabel.measureIfNeeded(context);

    // Bottom label
    this.bottomLabel.setX(this.getPadding());
    this.bottomLabel.setY(
      this.topLabel.getY() 
      + this.topLabel.getHeight()
      + this.getPadding()
    );
    this.bottomLabel.setWidth(this.getWidth() - this.getPadding()*2);
    this.bottomLabel.measureIfNeeded(context);
    
    // This
    this.setHeight(
      this.getPadding()*3 
      + this.topLabel.getHeight() 
      + this.bottomLabel.getHeight()
    );
    
  }
  
}


// ==[ PieChart ]===============================================================
class PieChartView extends View {
  constructor() {
    super();
    this.position = new Vec2(0, 0);
    this.radius = 200;
    this.startAngle = -Math.PI/2;

    this.slices = [];
    this.selectedSlice = null;
    
    this.defaultColors = [
      "#ff6961",
      "#ffb347",
      "#fdfd96",
      "#44f044",
      "#44f0f0",
      "#44aaf0",
      "#4444f0",
      "#aa44f0",
      "#f044f0"
    ];
    
    this.tooltip = this.initTooltip(200, 100);
    
    
  }

  // --[ initializers ]---------------------------------------------------------
  initTooltip(w, h) {
    const tooltip = new PieChartTooltip(w, h);
    tooltip.setVisible(false);
    tooltip.setPickable(false);
    this.addView(tooltip);    
    return tooltip;
  }
  
  
  // --[ bounds ]---------------------------------------------------------------
  setX(x) { this.position.x = x; }
  getX() { return this.position.x; }
  
  setY(y) { this.position.y = y; }
  getY() { return this.position.y; }
  
  setRadius(radius) { this.radius = radius; }
  getRadius() { return this.radius; }
  
  isInBounds(x, y) { 
    return Math.sqrt(Math.pow(x-this.getX(), 2) + Math.pow(y-this.getY(), 2)) < this.getRadius(); 
  }
  
  
  // --[ data ]-----------------------------------------------------------------
  addData(name, value, color=null) {
    this.slices.push(new PieChartSlice(name, value, color));
  }
  
  removeAllData() {
    this.slices = [];
  }
  
  sortDataByValueAsc() {
    let sorted = [];
    
    for (let i=0; i<this.slices.length; ++i) {
      let added = false;
      
      for (let j=0; j<sorted.length; ++j) {
        if (this.slices[i].value <= sorted[j].value) {
          sorted.splice(j, 0, this.slices[i]);
          added = true;
          break;
        }
      }
    
      if (!added) {
        sorted.push(this.slices[i]);
      }
    }
    
    this.slices = sorted;     
  }

  sortDataByValueDesc() {
    let sorted = [];
    
    for (let i=0; i<this.slices.length; ++i) {
      let added = false;
      
      for (let j=0; j<sorted.length; ++j) {
        if (this.slices[i].value >= sorted[j].value) {
          sorted.splice(j, 0, this.slices[i]);
          added = true;
          break;
        }
      }
    
      if (!added) {
        sorted.push(this.slices[i]);
      }
    }
    
    this.slices = sorted;    
  }

  
  // --[ drawing ]--------------------------------------------------------------
  fillSlices(context) {
    for (let i=0; i<this.slices.length; ++i) {
      let slice = this.slices[i];      
      const radius = (slice === this.selectedSlice) 
        ? this.getRadius()+8 
        : this.getRadius();
      const color = this.getColorForSlice(i);

      // Define the path
      context.beginPath();
      context.arc(0, 0, radius, slice.sAngle, slice.eAngle);
      context.lineTo(0, 0);
      context.closePath();
    
      // Fill slice
      context.fillStyle = color; 
      context.fill();      
    }
  }
  
  strokeSlices(context) {
    context.beginPath();
    
    for (let i=0; i<this.slices.length; ++i) {
      let slice = this.slices[i];      
      const radius = (slice === this.selectedSlice) 
        ? this.getRadius()+8 
        : this.getRadius();
      const color = this.getColorForSlice(i);

      // Define the path
      context.moveTo(0, 0);
      context.arc(0, 0, radius, slice.sAngle, slice.eAngle);
      context.lineTo(0, 0);
    }
    
    // Stroke all slices
    context.lineWidth = 1;
    context.strokeStyle = "white";
    context.stroke();
  }
  
  drawLabels(context) {
    let total = this.calcTotal();

    context.fillStyle = "black";
    
    for (let i=0; i<this.slices.length; ++i) {
      let slice = this.slices[i];      
      const radius = (slice === this.selectedSlice) 
        ? this.getRadius()+8 
        : this.getRadius();
      const text = (100 * slice.value/total).toFixed(1)+"%";
      const color = this.getColorForSlice(i);
      
      // Draw value text
      if (slice.eAngle - slice.sAngle > Math.PI*2/36) {
        // Contrast and color brightness: https://www.w3.org/TR/AERT/#color-contrast
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);
        let brightness = Math.round((r*299 + g*587 + b*114) / 1000);

        context.fillStyle = (brightness > 125) ? 'black' : 'white';                  
        context.fillText(
          text, 
          Math.cos((slice.sAngle+slice.eAngle)/2) * (radius-30), 
          Math.sin((slice.sAngle+slice.eAngle)/2) * (radius-30)
        );    
      }      
    }      
  }
  
  drawSurroundLegend(context) {
    const self = this;
    const lineOffset = 20;
    const textOffset = 2;
    const padding = 4;
    const a90 = Math.PI/2;
    const a180 = Math.PI;
    const a270 = 3*Math.PI/2;
    const a360 = 2*Math.PI;

    let quadrants = {
      bottomRight: [], //   0 <= angle < 90
      bottomLeft: [],  //  90 <= angle < 180
      topLeft: [],     // 180 <= angle < 270
      topRight: []     // 270 <= angle < 360
    };
    
    const addSorted = function(array, slice) {
      let midAngle = self.clampAngle((slice.sAngle+slice.eAngle)/2);
            
      for (let i=0; i<array.length; ++i) {
        let arrayMidAngle = self.clampAngle((array[i].sAngle+array[i].eAngle)/2);
        if (midAngle <= arrayMidAngle) {
          array.splice(i, 0, slice);
          return;
        }
      }
      
      array.push(slice);
    } 
   
    // Sort each slice into their quadrants by midAngle. 
    for (let i=0; i<this.slices.length; ++i) {
      let slice = this.slices[i];
      let midAngle = this.clampAngle((slice.sAngle+slice.eAngle)/2);
            
      if (midAngle >= 0 && midAngle < a90) { // bottom right [0, 90)
        addSorted(quadrants.bottomRight, slice);
      
      } else if (midAngle >= a90 && midAngle < a180) { // bottom left [90, 180)
        addSorted(quadrants.bottomLeft, slice);

      } else if (midAngle >= a180 && midAngle < a270) { // top left [180, 270)
        addSorted(quadrants.topLeft, slice);

      } else if (midAngle >= a270 && midAngle < a360) { // top right [270, 360)
        addSorted(quadrants.topRight, slice);
      }
    }
   
   
    // Draw labels for each quadrants   
    context.lineWidth = 1;
    context.fillStyle = "black";
    context.strokeStyle = "black";
        
    for (let i=0; i<4; ++i) {
      const ascend = (i === 0 || i === 2);
      let quadrant = [];
      if (i === 0) { quadrant = quadrants.bottomRight; 
      } else if (i === 1) { quadrant = quadrants.bottomLeft; 
      } else if (i === 2) { quadrant = quadrants.topLeft; 
      } else if (i === 3) { quadrant = quadrants.topRight; }
      
      let lastLabel = null;
      
      for (let j=0; j<quadrant.length; ++j) {
        const k = (ascend ? j : quadrant.length-1-j);
        const slice = quadrant[k];
        const midAngle = (slice.sAngle+slice.eAngle)/2;
        const v1 = Vec2.fromAngle(midAngle).scale(this.getRadius()+2);
        const v2 = Vec2.fromAngle(midAngle).scale(this.getRadius()+lineOffset);
        const v3 = Vec2.copy(v2);
        
        // Setup the label
        let label = new LabelView();
        label.setWidth(200);
        label.setWordWrap(true);
        label.setText(slice.name);
        label.setFillColor("black");
        label.measureIfNeeded(context);
        
        if (v2.y >= 0) {
          label.setY(v2.y - label.getLineHeight()/2);          
        } else {
          label.setY(v2.y - label.getHeight() + label.getLineHeight()/2);
        }
        
        if (v2.x >= 0) {
          label.setX(v2.x + lineOffset+textOffset);    
          v3.x = v2.x + lineOffset;
          
        } else {
          label.setAlignment(LabelViewOptions.RIGHT);
          label.setX(v2.x - label.getWidth() - lineOffset-textOffset);
          v3.x = v2.x - lineOffset;
        }
        
        // Shift the label up or down
        if (i < 2) { // bottom slices, push labels down
          if (
            lastLabel !== null 
            && label.getY() < lastLabel.getY()+lastLabel.getHeight()+padding) 
          { 
            // push down
            const dy = lastLabel.getY()+lastLabel.getHeight()+padding - label.getY();
            label.setY(label.getY() + dy);
            v2.y += dy;
          } 
          
        } else { // top slices, push labels up
          if (
            lastLabel !== null 
            && label.getY()+label.getHeight()+padding > lastLabel.getY()) 
          { 
            // push up
            const dy = lastLabel.getY()-padding-label.getHeight() - label.getY();
            label.setY(label.getY() + dy);
            v2.y += dy;
          } 
        }
        
        // Draw the line
        context.beginPath();
        context.moveTo(v1.x, v1.y);
        context.lineTo(v2.x, v2.y);
        context.lineTo(v3.x, v2.y);
        context.stroke();
        
        // Draw the label        
        label.draw(context);        
        
        // Store this label for the next pass
        lastLabel = label;
      }
    }
    
  }
  
  drawVerticalLegend(context, x, y) {
    const boxSize = 20; // pixels
    const padding = 8;
    
    context.textAlign = "start";
    context.textBaseline = "middle";
    
    for (let i=0; i<this.slices.length; ++i) {
      let s = this.slices[i];
      let boxX = x;
      let boxY = y + padding*i + boxSize*i;
      let textX = boxX + boxSize + padding;
      let textY = boxY + boxSize/2
      
      // Draw the box
      context.beginPath();
      context.fillStyle = this.getColorForSlice(i);
      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.rect(boxX, boxY, boxSize, boxSize);
      
      context.fill();
      context.stroke();
      
      // Draw text
      context.fillStyle = "black";
      
    }
  }
  
  drawSelf(context) {
    this.updateSlices();
    
    // Save the context to reverse the translation.
    context.save();

    // Set default style values
    context.font = "14px Arial";
    context.lineCap = "round";
    context.lineWidth = 2;
    context.textAlign = "center";
    context.textBaseline = "middle";    
    context.translate(this.getX(), this.getY());
    
    // Draw
    this.fillSlices(context);
    this.strokeSlices(context);
    this.drawLabels(context);
    this.drawSurroundLegend(context);
    //this.drawVerticalLegend(context, this.getRadius()+30, -this.getRadius());
    
    /*
    context.beginPath();
    context.moveTo(-1000, 0);
    context.lineTo(1000, 0);
    context.moveTo(0, -1000);
    context.lineTo(0, 1000);
    context.stroke();
    */
    
    // Restore the context to reverse the translation.
    context.restore();
  }
 
 
  // --[ events ]---------------------------------------------------------------
  onMouseMove(event) {
    super.onMouseMove(event);
    
    const localX = event.x - this.getX();
    const localY = event.y - this.getY();
    const slice = this.pickSlice(event.x, event.y);
    
    if (slice !== null) {
      const total = this.calcTotal();
      const name = slice.name;
      const value = slice.value+" ("+(100 * slice.value/total).toFixed(1)+"%)";
      
      this.setSelectedSlice(slice);        
      
      this.tooltip.setVisible(true);
      this.tooltip.topLabel.setText(name);
      this.tooltip.bottomLabel.setText(value);
      this.tooltip.setX(event.x - this.getX() - this.tooltip.getWidth() - 4);
      this.tooltip.setY(event.y - this.getY() - this.tooltip.getHeight() - 4);
    }
  }

  onMouseExit(event) {
    super.onMouseEnter(event);
    this.setSelectedSlice(null);        
    this.tooltip.setVisible(false);
  }
  
  onMouseDrag(event) {
    super.onMouseDrag(event);
    this.setSelectedSlice(null);        
    this.tooltip.setVisible(false);
  }
 
 
  // --[ helpers ]--------------------------------------------------------------
  clampAngle(radians) {
    const tau = 2*Math.PI;
    
    if (radians < 0) {
      return tau - (-radians % tau);
    } else {
      return radians % tau;
    }
  }
  
  calcTotal() { 
    let total = 0;
    for (let i=0; i<this.slices.length; ++i) {
      total += this.slices[i].value;      
    }
    return total;
  }
  
  setSelectedSlice(slice) {
    this.selectedSlice = slice;
  }
  
  updateSlices() {
    // Total the data
    let total = this.calcTotal();
    
    let sAngle = this.startAngle;    
    for (let i=0; i<this.slices.length; ++i) {
      let slice = this.slices[i];
      
      // Determine the angle
      let ratio = slice.value/total;
      let eAngle = sAngle + ratio*Math.PI*2;
      
      if (i === 0) {
        let mAngle = (eAngle-sAngle)/2;
        sAngle -= mAngle;
        eAngle -= mAngle;
      }
      
      // Update the slice.
      slice.sAngle = sAngle;
      slice.eAngle = eAngle;
      
      // Set the new starting angle.
      sAngle = eAngle;
    }    
  }


  pickSlice(x, y) {
    if (this.isInBounds(x, y) && this.slices.length > 0) {
      // Find the angle between the starting vector and the vector from the 
      // center to (x,y).
      let startVec = new Vec2(1, 0).rotate(this.slices[0].sAngle);
      let pickVec = new Vec2(x-this.getX(), y-this.getY());
      let pickAngle = Vec2.angleTau(startVec, pickVec);

      // Find the slice
      let sAngle = 0;
      let eAngle = 0;
      for (let i=0; i<this.slices.length; ++i) {
        let s=this.slices[i];        
        sAngle = eAngle; // start angle is the end angle from last pass
        eAngle = sAngle + Math.abs(s.eAngle-s.sAngle); 
        
        if (pickAngle >= sAngle && pickAngle <= eAngle) {
          return s;
        }
      }
    }
    
    return null;
  }
  
  getColorForSlice(index) {
    const slice = this.slices[index];
    return (slice.color === null 
      ? this.defaultColors[index%this.defaultColors.length] 
      : slice.color
    );
  }
 
}
class App {
  constructor(canvasId) {
    this.interval = null;    
    this.canvas = new Canvas(canvasId);
    this.paused = false;
    
    this.profilerUpdate = new Profiler(10);
    this.profilerDraw = new Profiler(10);
  }
  
  // --[ initalizers ]----------------------------------------------------------
  
  // --[ app control ]----------------------------------------------------------
  start(interval) {
    const self = this;
    const callback = function() { self.loop(); };
    this.interval = window.setInterval(callback, interval);
  }
  
  stop() {
    window.clearInterval(this.interval);
  }
  
  setPaused(p) { this.paused = p; }
  isPaused() { return this.paused; }
  
  
  // --[ profilers ]------------------------------------------------------------
  getUpdateTime() {
    return this.profilerUpdate.getTime();
  }
  
  getDrawTime() {
    return this.profilerDraw.getTime();
  }
  
  // ---------------------------------------------------------------------------
  update() {
    
  }
  
  draw() {
    this.canvas.draw();
  }
  
  loop() {
    // Update
    this.profilerUpdate.start();
    if (!this.isPaused()) {
      this.update();
    }
    this.profilerUpdate.mark();
    
    // Draw
    this.profilerDraw.start();
    this.draw();
    this.profilerDraw.mark();
  }
  
  
  
}

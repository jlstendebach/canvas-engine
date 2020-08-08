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
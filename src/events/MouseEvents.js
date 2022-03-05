export class MouseEvent {
    constructor(x, y, btn, target = null) {
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
export class MouseDownEvent extends MouseEvent {
    constructor(x, y, btn, target) {
        super(x, y, btn, target);
    }
}

// ==[ MouseUpInsideEvent ]=====================================================
export class MouseUpInsideEvent extends MouseEvent {
    constructor(x, y, btn, target) {
        super(x, y, btn, target);
    }
}

// ==[ MouseUpOutsideEvent ]====================================================
export class MouseUpOutsideEvent extends MouseEvent {
    constructor(x, y, btn, target) {
        super(x, y, btn, target);
    }
}

// ==[ MouseDragEvent ]=========================================================
export class MouseDragEvent extends MouseEvent {
    constructor(x, y, dx, dy, btn, target) {
        super(x, y, btn, target);
        this.dx = dx;
        this.dy = dy;
    }
}

// ==[ MouseMoveEvent ]=========================================================
export class MouseMoveEvent extends MouseEvent {
    constructor(x, y, dx, dy, btn, target) {
        super(x, y, btn, target);
        this.dx = dx;
        this.dy = dy;
    }
}

// ==[ MouseEnterEvent ]========================================================
export class MouseEnterEvent extends MouseEvent {
    constructor(x, y, btn, target) {
        super(x, y, btn, target);
    }
}

// ==[ MouseExitEvent ]=========================================================
export class MouseExitEvent extends MouseEvent {
    constructor(x, y, btn, target) {
        super(x, y, btn, target);
    }
}
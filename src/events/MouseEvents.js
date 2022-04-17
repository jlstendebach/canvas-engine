export class MouseEvent {
    // event.which values: https://www.w3schools.com/jsref/event_which.asp
    static LEFT = 0;
    static MIDDLE = 1;
    static RIGHT = 2;
    static BACK = 3;
    static FORWARD = 4;

    constructor(x, y, button, target = null) {
        this.x = x;
        this.y = y;
        this.button = button;
        this.target = target;
    }
}

// --[ MouseDownEvent ]---------------------------------------------------------
export class MouseDownEvent extends MouseEvent {
    constructor(x, y, button, target) {
        super(x, y, button, target);
    }
}

// --[ MouseUpInsideEvent ]-----------------------------------------------------
export class MouseUpInsideEvent extends MouseEvent {
    constructor(x, y, button, target) {
        super(x, y, button, target);
    }
}

// --[ MouseUpOutsideEvent ]----------------------------------------------------
export class MouseUpOutsideEvent extends MouseEvent {
    constructor(x, y, button, target) {
        super(x, y, button, target);
    }
}

// --[ MouseDragEvent ]---------------------------------------------------------
export class MouseDragEvent extends MouseEvent {
    constructor(x, y, dx, dy, button, target) {
        super(x, y, button, target);
        this.dx = dx;
        this.dy = dy;
    }
}

// --[ MouseMoveEvent ]---------------------------------------------------------
export class MouseMoveEvent extends MouseEvent {
    constructor(x, y, dx, dy, button, target) {
        super(x, y, button, target);
        this.dx = dx;
        this.dy = dy;
    }
}

// --[ MouseEnterEvent ]--------------------------------------------------------
export class MouseEnterEvent extends MouseEvent {
    constructor(x, y, button, target) {
        super(x, y, button, target);
    }
}

// --[ MouseExitEvent ]---------------------------------------------------------
export class MouseExitEvent extends MouseEvent {
    constructor(x, y, button, target) {
        super(x, y, button, target);
    }
}

// --[ MouseWheelEvent ]--------------------------------------------------------
export class MouseWheelEvent extends MouseEvent {
    constructor(x, y, button, amount, target) {
        super(x, y, button, target);
        this.amount = amount;
    }
}
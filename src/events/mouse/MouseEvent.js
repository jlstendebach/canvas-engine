export class MouseEvent {
    static get DOWN() { return "MouseDownEvent"; }
    static get UP() { return "MouseUpEvent"; }
    static get MOVE() { return "MouseMoveEvent"; }
    static get DRAG() { return "MouseDragEvent"; }
    static get ENTER() { return "MouseEnterEvent"; }
    static get EXIT() { return "MouseExitEvent"; }
    static get WHEEL() { return "MouseWheelEvent"; }

    type = null;

    canvasX = 0;
    canvasY = 0;
    canvasMovementX = 0;
    canvasMovementY = 0;

    parentX = 0;
    parentY = 0;
    parentMovementX = 0;
    parentMovementY = 0;

    x = 0;
    y = 0;
    movementX = 0;
    movementY = 0;

    wheelX = 0;
    wheelY = 0;
    wheelZ = 0;

    button = 0;
    buttons = 0;
    target = null;
    related = null;

    // MARK: - Utilities
    clone() {
        const event = new MouseEvent();

        event.type = this.type;

        event.canvasX = this.canvasX;
        event.canvasY = this.canvasY;
        event.canvasMovementX = this.canvasMovementX;
        event.canvasMovementY = this.canvasMovementY;
        
        event.parentX = this.parentX;
        event.parentY = this.parentY;
        event.parentMovementX = this.parentMovementX;
        event.parentMovementY = this.parentMovementY;
        
        event.x = this.x;
        event.y = this.y;
        event.movementX = this.movementX;
        event.movementY = this.movementY;

        event.wheelX = this.wheelX;
        event.wheelY = this.wheelY;
        event.wheelZ = this.wheelZ;

        event.button = this.button;
        event.buttons = this.buttons;
        event.target = this.target;
        event.related = this.related;

        return event;
    }

    copy(other) {
        this.type = other.type;

        this.canvasX = other.canvasX;
        this.canvasY = other.canvasY;
        this.canvasMovementX = other.canvasMovementX;
        this.canvasMovementY = other.canvasMovementY;

        this.parentX = other.parentX;
        this.parentY = other.parentY;
        this.parentMovementX = other.parentMovementX;
        this.parentMovementY = other.parentMovementY;

        this.x = other.x;
        this.y = other.y;
        this.movementX = other.movementX;
        this.movementY = other.movementY;
        
        this.wheelX = other.wheelX;
        this.wheelY = other.wheelY;
        this.wheelZ = other.wheelZ;

        this.button = other.button;
        this.buttons = other.buttons;
        this.target = other.target;
        this.related = other.related;
        
        return this;
    }

    isPressed(button) {
        return (this.buttons & button) !== 0;
    }

}
export class MouseEvent {
    static get DOWN() { return "MouseDownEvent"; }
    static get UP() { return "MouseUpEvent"; }
    static get MOVE() { return "MouseMoveEvent"; }
    static get DRAG() { return "MouseDragEvent"; }
    static get ENTER() { return "MouseEnterEvent"; }
    static get EXIT() { return "MouseExitEvent"; }
    static get WHEEL() { return "MouseWheelEvent"; }

    type = null;

    global = {
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0
    }
    parent = {
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0
    }
    local = {
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0
    }

    wheelX = 0;
    wheelY = 0;
    wheelZ = 0;

    button = 0;
    buttons = 0;
    target = null;
    related = null;

    // MARK: - Initialization
    constructor(type) {
        this.type = type;
    }

    // MARK: - Utilities
    clone() {
        const event = new MouseEvent(this.type);
        event.global.x = this.global.x;
        event.global.y = this.global.y;
        event.global.movementX = this.global.movementX;
        event.global.movementY = this.global.movementY;
        event.parent.x = this.parent.x;
        event.parent.y = this.parent.y;
        event.parent.movementX = this.parent.movementX;
        event.parent.movementY = this.parent.movementY;
        event.local.x = this.local.x;
        event.local.y = this.local.y;
        event.local.movementX = this.local.movementX;
        event.local.movementY = this.local.movementY;
        event.button = this.button;
        event.buttons = this.buttons;
        event.target = this.target;
        event.related = this.related;
        return event;
    }

    copy(other) {
        this.global.x = other.global.x;
        this.global.y = other.global.y;
        this.global.movementX = other.global.movementX;
        this.global.movementY = other.global.movementY;
        this.parent.x = other.parent.x;
        this.parent.y = other.parent.y;
        this.parent.movementX = other.parent.movementX;
        this.parent.movementY = other.parent.movementY;
        this.local.x = other.local.x;
        this.local.y = other.local.y;
        this.local.movementX = other.local.movementX;
        this.local.movementY = other.local.movementY;
        this.button = other.button;
        this.buttons = other.buttons;
        this.target = other.target;
        this.related = other.related;
        return this;
    }

    isPressed(button) {
        return (this.button & button) != 0;
    }

}
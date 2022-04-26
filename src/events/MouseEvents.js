import { Vec2 } from "../math/Math.js";

export class MouseEvent {
    static DOWN = "MouseDownEvent";
    static UP = "MouseUpEvent";
    static MOVE = "MouseMoveEvent";
    static DRAG = "MouseDragEvent";
    static ENTER = "MouseEnterEvent";
    static EXIT = "MouseExitEvent";

    type = null; // String
    x = 0; // Int
    y = 0; // Int
    dx = 0; // Int
    dy = 0; // Int
    button = 0; // Int
    buttons = 0; // Int
    view = null; // View
    target = null; // View

    // --[ init ]---------------------------------------------------------------
    constructor(type, x, y, dx, dy, button, buttons, target, related=null) {
        this.type = type;
        this.x = parseInt(x) || 0;
        this.y = parseInt(y) || 0;
        this.dx = parseInt(dx) || 0;
        this.dy = parseInt(dy) || 0;
        this.button = parseInt(button) || 0;
        this.buttons = parseInt(buttons) || 0;
        this.target = target;
        this.related = related;
    }

    static createDownEvent(x, y, button, buttons, target=null) {
        return new MouseEvent(this.DOWN, x, y, 0, 0, button, buttons, target);
    }

    static createUpEvent(x, y, button, buttons, target=null) {
        return new MouseEvent(this.UP, x, y, 0, 0, button, buttons, target);
    }

    static createMoveEvent(x, y, dx, dy, buttons, target=null) {
        return new MouseEvent(this.MOVE, x, y, dx, dy, 0, buttons, target);
    }

    static createDragEvent(x, y, dx, dy, button, buttons, target=null) {
        return new MouseEvent(this.DRAG, x, y, dx, dy, button, buttons, target);
    }

    static createEnterEvent(x, y, button, buttons, target=null) {
        return new MouseEvent(this.ENTER, x, y, 0, 0, button, buttons, target);
    }

    static createExitEvent(x, y, button, buttons, target=null) {
        return new MouseEvent(this.EXIT, x, y, 0, 0, button, buttons, target);
    }

    // --[ helpers ]------------------------------------------------------------
    copy() {
        return new MouseEvent(
            this.type,
            this.x, 
            this.y, 
            this.dx, 
            this.dy,
            this.button, 
            this.buttons,
            this.target
        );
    }

    isPressed(button) {
        return (this.button & button) != 0;
    }

    getGlobalXY() {
        let position = this.getLocalXY();
        let view = this.target;
        while (view != null) {
            position.x += view.getX();
            position.y += view.getY();
            view = view.getParent();
        }
        return position;
    }

    getParentXY() {
        let position = this.getLocalXY();
        if (this.target != null) {
            position.x += this.target.getX();
            position.y += this.target.getY();
        }
        return position;
    }

    getLocalXY() {
        return new Vec2(this.x, this.y);
    }

    getTargetXY() {
        let viewXY = this.view.getGlobalXY();
        let targetXY = this.target.getGlobalXY();

        return 
    }
}

// --[ MouseWheelEvent ]--------------------------------------------------------
export class MouseWheelEvent {
    constructor(x, y, amount, target) {
        this.x = x;
        this.y = y; 
        this.amount = amount;
        this.target = target;
    }
}
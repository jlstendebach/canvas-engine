import { Vec2 } from "../math/index.js";

export class MouseEvent {
    static DOWN  = "MouseDownEvent";
    static UP    = "MouseUpEvent";
    static MOVE  = "MouseMoveEvent";
    static DRAG  = "MouseDragEvent";
    static ENTER = "MouseEnterEvent";
    static EXIT  = "MouseExitEvent";
    static WHEEL = "MouseWheelEvent";

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
            this.target, 
            this.related
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
}
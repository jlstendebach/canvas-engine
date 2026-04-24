import { Vec2 } from "../../math/index.js";

export class MouseEvent {
    static get DOWN()  { return "MouseDownEvent"; }
    static get UP()    { return "MouseUpEvent"; }
    static get MOVE()  { return "MouseMoveEvent"; }
    static get DRAG()  { return "MouseDragEvent"; }
    static get ENTER() { return "MouseEnterEvent"; }
    static get EXIT()  { return "MouseExitEvent"; }
    static get WHEEL() { return "MouseWheelEvent"; }

    type = null; // String
    x = 0; // Int
    y = 0; // Int
    dx = 0; // Int
    dy = 0; // Int
    button = 0; // Int
    buttons = 0; // Int
    target = null; // View
    related = null; // View

    // --[ init ]---------------------------------------------------------------
    constructor(type, x, y, dx, dy, button, buttons, target, related = null) {
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
    clone() {
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
            position.x += view.position.x;
            position.y += view.position.y;
            view = view.parent;
        }
        return position;
    }

    getParentXY() {
        let position = this.getLocalXY();
        if (this.target != null) {
            position.x += this.target.position.x;
            position.y += this.target.position.y;
        }
        return position;
    }

    getLocalXY() {
        return new Vec2(this.x, this.y);
    }
}
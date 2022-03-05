import { 
    EventEmitter,
    MouseDownEvent,
    MouseDragEvent,
    MouseEnterEvent,
    MouseExitEvent,
    MouseMoveEvent,
    MouseUpInsideEvent,
    MouseUpOutsideEvent,
} from "../../events/Events.js"

export class View {
    constructor() {
        this.parent = null;
        this.views = [];
        this.visible = true;
        this.pickable = true;

        this.eventEmitter = new EventEmitter();
    }

    // --[ bounds ]-------------------------------------------------------------
    isInBounds(x, y) {
        return true;
    }

    getX() {
        return 0;
    }

    getY() {
        return 0;
    }

    // --[ parent ]-------------------------------------------------------------
    getParent() {
        return this.parent;
    }

    removeFromParent() {
        if (this.parent !== null) {
            this.parent.removeView(this);
            this.parent = null;
        }
    }

    // --[ views ]--------------------------------------------------------------
    addView(v) {
        v.removeFromParent();
        v.parent = this;
        this.views.push(v);

        return v;
    }

    removeView(v) {
        var index = this.views.indexOf(v);
        if (index >= 0) {
            v.parent = null;
            this.views.splice(index, 1);
        }

        return v;
    }

    getViews() {
        return this.views;
    }

    getViewCount() {
        return this.views.length;
    }

    pickView(x, y) {
        for (var i = this.getViewCount() - 1; i >= 0; i--) {
            var view = this.views[i];
            if (view.visible && view.pickable && view.isInBounds(x, y)) {
                // View was picked.
                return view;
            }
        }

        // No child view was picked.
        return null;
    }

    // --[ visible ]------------------------------------------------------------
    setVisible(v) {
        this.visible = v;
    }

    isVisible() {
        return this.visible;
    }

    // --[ pickable ]-----------------------------------------------------------
    setPickable(p) {
        this.pickable = p;
    }

    isPickable() {
        return this.pickable;
    }

    // --[ drawing ]------------------------------------------------------------
    draw(context) {
        if (this.visible) {
            this.drawSelf(context);

            context.translate(this.getX(), this.getY());
            this.drawChildren(context);
            context.translate(-this.getX(), -this.getY());
        }
    }

    drawSelf(context) { }

    drawChildren(context) {
        for (let i = 0; i < this.views.length; i++) {
            this.views[i].draw(context);
        }
    }

    // --[ event emitter ]------------------------------------------------------
    addEventListener(type, callback, owner = null) {
        this.eventEmitter.add(type, callback, owner);
    }

    removeEventListener(type, callback, owner = null) {
        this.eventEmitter.remove(type, callback, owner);
    }

    emitEvent(type, event) {
        this.eventEmitter.emit(type, event);
    }

    // --[ mouse events ]-------------------------------------------------------
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



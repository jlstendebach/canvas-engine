import { Vec2 } from "../../math/Vec2.js";
import { MouseButton } from "./MouseButton.js"
import { MouseEvent } from "./MouseEvent.js"

export class MouseEventProcessor {
    #canvasElement = null;
    #rootView = null;

    #domAbortController = null;

    #mouseDownViews = new Map([
        [MouseButton.LEFT, null],
        [MouseButton.RIGHT, null],
        [MouseButton.MIDDLE, null],
        [MouseButton.MOUSE4, null],
        [MouseButton.MOUSE5, null]
    ]);
    #mouseDragButton = null;
    #mouseOverView = null;

    // MARK: - Initialization
    constructor(canvasElement, rootView) {
        this.#canvasElement = canvasElement;
        this.#rootView = rootView;
    }

    // --[ events ]-------------------------------------------------------------
    onMouseDown(event) {
        let target = this.findView(event);
        let [position, delta] = this.getRelativeXY(event, target);

        /***************/
        /* onMouseDown */
        /***************/
        event = event.clone();
        event.type = MouseEvent.DOWN;
        event.x = position.x;
        event.y = position.y;
        event.target = target;
        event.related = null;
        event.target.onMouseDown(event);

        // Store the view and button to respond to other mouse events later.
        this.#mouseDownViews.set(event.button, target);
        if (this.#mouseDragButton == null) {
            this.#mouseDragButton = event.button;
        }
    }

    onMouseUp(event) {
        let mouseDownView = this.#mouseDownViews.get(event.button);
        if (mouseDownView != null) {
            let related = this.findView(event);
            let [position, delta] = this.getRelativeXY(event, mouseDownView);

            /*************/
            /* onMouseUp */
            /*************/
            event = event.clone();
            event.type = MouseEvent.UP;
            event.x = position.x;
            event.y = position.y;
            event.target = mouseDownView;
            event.related = related;
            event.target.onMouseUp(event);
        }

        // Reset the mouseDownView so we don't respond to mouse up events.
        this.#mouseDownViews.set(event.button, null);
        if (this.#mouseDragButton === event.button) {
            this.#mouseDragButton = null;
        }
    }

    onMouseMove(event) {
        let mouseDragView = this.#mouseDownViews.get(this.#mouseDragButton);
        if (mouseDragView != null) {
            let related = this.findView(event);
            let [position, delta] = this.getRelativeXY(event, mouseDragView);

            /***************/
            /* onMouseDrag */
            /***************/
            let dragEvent = event.clone();
            dragEvent.type = MouseEvent.DRAG;
            dragEvent.x = position.x;
            dragEvent.y = position.y;
            dragEvent.dx = delta.x;
            dragEvent.dy = delta.y;
            dragEvent.button = this.#mouseDragButton;
            dragEvent.target = mouseDragView;
            dragEvent.related = related;
            dragEvent.target.onMouseDrag(dragEvent);

        }

        let view = this.findView(event);
        if (this.#mouseOverView == view) {
            if (view != mouseDragView) {
                let [position, delta] = this.getRelativeXY(event, view);

                /***************/
                /* onMouseMove */
                /***************/
                let moveEvent = event.clone();
                moveEvent.type = MouseEvent.MOVE;
                moveEvent.x = position.x;
                moveEvent.y = position.y;
                moveEvent.dx = delta.x;
                moveEvent.dy = delta.y;
                moveEvent.target = view;
                moveEvent.related = null;
                moveEvent.target.onMouseMove(moveEvent);
            }

        } else {
            let exitView = this.#mouseOverView;
            let enterView = view;

            /****************/
            /* onMouseEnter */
            /****************/
            let [enterPosition, delta] = this.getRelativeXY(event, enterView);
            let enterEvent = event.clone();
            enterEvent.type = MouseEvent.ENTER;
            enterEvent.x = enterPosition.x;
            enterEvent.y = enterPosition.y;
            enterEvent.dx = delta.x;
            enterEvent.dy = delta.y;
            enterEvent.target = enterView;
            enterEvent.related = exitView;
            enterEvent.target.onMouseEnter(enterEvent);

            /***************/
            /* onMouseExit */
            /***************/
            if (exitView != null) {
                let [exitPosition, delta] = this.getRelativeXY(event, exitView);
                let exitEvent = event.clone();
                exitEvent.type = MouseEvent.EXIT;
                exitEvent.x = exitPosition.x;
                exitEvent.y = exitPosition.y;
                exitEvent.dx = delta.x;
                exitEvent.dy = delta.y;
                exitEvent.target = exitView;
                exitEvent.related = enterView;
                exitEvent.target.onMouseExit(exitEvent);
            }

            // Update the mouseOverView for the next event.
            this.#mouseOverView = view
        }
    }

    onMouseOut(event) {
        for (let [button, view] of this.#mouseDownViews.entries()) {
            if (!view) {
                continue;
            }
            this.onMouseUp(event);
            this.#mouseDownViews.set(button, null);
        }
    }

    onMouseWheel(event) {
        let target = this.findView(event);
        let [position, delta] = this.getRelativeXY(event, target);

        /*******************/
        /* MouseWheelEvent */
        /*******************/
        event = event.clone();
        event.type = MouseEvent.WHEEL;
        event.x = position.x;
        event.y = position.y;
        event.target = target;
        event.related = null;
        event.target.onMouseWheel(event);
    }

    // --[ helpers ]------------------------------------------------------------
    findView(event) {
        const view = event.target;
        const point = new Vec2(event.x, event.y);
        return view.pickView(point) ?? view;
    }

    getRelativeXY(event, view) {
        // I have a strong feeling that this can be optimized, but this works 
        // as expected for now.
        let views = [];
        let parent = view.parent;
        while (parent != event.target && parent != null) {
            views.push(parent);
            parent = parent.parent;
        }

        let position = new Vec2(event.x, event.y);
        let delta = new Vec2(event.x - event.dx, event.y - event.dy);
        for (let i = views.length - 1; i >= 0; i--) {
            position.x -= views[i].x;
            position.y -= views[i].y;
            position = views[i].localToChild(position);
            delta.x -= views[i].x;
            delta.y -= views[i].y;
            delta = views[i].localToChild(delta);
        }
        delta = Vec2.subtract(position, delta);

        position.x -= view.x;
        position.y -= view.y;

        return [position, delta];

        /*
        let position = new Vec2();
        while (view != event.target && view != null) {
            position.x += view.x;
            position.y += view.y;
            view = view.parent;
        }
        return new Vec2(event.x - position.x, event.y - position.y);
        */
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    attachDomEvents() {
        if (this.#domAbortController) { return; }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };

        // Mouse events
        this.#canvasElement.addEventListener("mousedown", this.#onMouseDown.bind(this), options);
        this.#canvasElement.addEventListener("mouseup", this.#onMouseUp.bind(this), options);
        this.#canvasElement.addEventListener("mouseout", this.#onMouseOut.bind(this), options);
        this.#canvasElement.addEventListener("mousemove", this.#onMouseMove.bind(this), options);
        this.#canvasElement.addEventListener("wheel", this.#onMouseWheel.bind(this), options);
    }

    detachDomEvents() {
        if (!this.#domAbortController) { return; }
        this.#domAbortController.abort();
        this.#domAbortController = null;
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Handlers
    // -------------------------------------------------------------------------

    #onMouseDown(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.DOWN, event);
        if (mouseEvent) {
            this.onMouseDown(mouseEvent);
        }
    }

    #onMouseUp(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.UP, event);
        if (mouseEvent) {
            this.onMouseUp(mouseEvent);
        }
    }

    #onMouseMove(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.MOVE, event);
        if (mouseEvent) {
            this.onMouseMove(mouseEvent);
        }
    }

    #onMouseOut(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.EXIT, event);
        if (mouseEvent) {
            this.onMouseOut(mouseEvent);
        }
    }

    #onMouseWheel(event) {
        const mouseEvent = this.#createMouseEvent(MouseEvent.WHEEL, event);
        if (mouseEvent) {
            this.onMouseWheel(mouseEvent);
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #createMouseEvent(type, event) {
        const style = getComputedStyle(this.#canvasElement)
        const paddingX = parseFloat(style.getPropertyValue("padding-left")) || 0;
        const paddingY = parseFloat(style.getPropertyValue("padding-top")) || 0;
        const x = Math.round(event.offsetX - paddingX);
        const y = Math.round(event.offsetY - paddingY);

        if (type !== MouseEvent.EXIT) {
            if (
                x < 0 ||
                y < 0 ||
                x >= this.#canvasElement.width ||
                y >= this.#canvasElement.height
            ) {
                return null;
            }
        }

        let dx, dy;
        if (type == MouseEvent.WHEEL) {
            dx = event.deltaX;
            dy = event.deltaY;
        } else {
            dx = event.movementX;
            dy = event.movementY;
        }

        return new MouseEvent(
            type,                                // type
            x,                                   // x
            y,                                   // y
            dx,                                  // dx
            dy,                                  // dy            
            MouseButton.fromIndex(event.button), // button
            event.buttons,                       // buttons
            this.#rootView,                      // target
            null                                 // related
        );
    }

}

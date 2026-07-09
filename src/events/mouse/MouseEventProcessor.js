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

    // -------------------------------------------------------------------------
    // MARK: - Event Handlers
    // -------------------------------------------------------------------------

    onMouseDown(domEvent) {
        const mouseEvent = this.#convertDomEvent(MouseEvent.DOWN, domEvent);
        if (!mouseEvent) { return; }

        /***************/
        /* onMouseDown */
        /***************/
        mouseEvent.target = this.#findView(mouseEvent);
        mouseEvent.related = null;
        this.#updateRelativePositions(mouseEvent);

        // Call the handler for the target
        mouseEvent.target.onMouseDown(mouseEvent);

        // Store the view and button to respond to other mouse events later.
        this.#mouseDownViews.set(mouseEvent.button, mouseEvent.target);
        if (this.#mouseDragButton == null) {
            this.#mouseDragButton = mouseEvent.button;
        }
    }

    onMouseUp(domEvent) {
        const mouseEvent = this.#convertDomEvent(MouseEvent.UP, domEvent);
        if (!mouseEvent) { return; }

        /*************/
        /* onMouseUp */
        /*************/
        const mouseDownView = this.#mouseDownViews.get(mouseEvent.button);
        if (mouseDownView != null) {
            mouseEvent.target = mouseDownView;
            mouseEvent.related = this.#findView(mouseEvent);
            this.#updateRelativePositions(mouseEvent);

            // Call the handler for the target
            mouseEvent.target.onMouseUp(mouseEvent);
        }

        // Reset the mouseDownView so it no longer responds to mouse up events.
        this.#mouseDownViews.set(mouseEvent.button, null);
        if (this.#mouseDragButton === mouseEvent.button) {
            this.#mouseDragButton = null;
        }
    }

    onMouseMove(domEvent) {
        const mouseEvent = this.#convertDomEvent(MouseEvent.MOVE, domEvent);
        if (!mouseEvent) { return; }

        const view = this.#findView(mouseEvent);

        /***************/
        /* onMouseDrag */
        /***************/
        const mouseDragView = this.#mouseDownViews.get(this.#mouseDragButton);
        if (mouseDragView != null) {
            const dragEvent = mouseEvent.clone();
            dragEvent.type = MouseEvent.DRAG;
            dragEvent.target = mouseDragView;
            dragEvent.related = view;
            dragEvent.button = this.#mouseDragButton;
            this.#updateRelativePositions(dragEvent);

            // Call the handler for the target
            dragEvent.target.onMouseDrag(dragEvent);
        }

        /***************/
        /* onMouseMove */
        /***************/
        if (this.#mouseOverView === view) {
            if (view !== mouseDragView) {
                mouseEvent.target = view;
                mouseEvent.related = null;
                this.#updateRelativePositions(mouseEvent);

                // Call the handler for the target
                mouseEvent.target.onMouseMove(mouseEvent);
            }
            return;
        }

        const exitView = this.#mouseOverView;
        const enterView = view;

        /****************/
        /* onMouseEnter */
        /****************/
        const enterEvent = mouseEvent.clone();
        enterEvent.type = MouseEvent.ENTER;
        enterEvent.target = enterView;
        enterEvent.related = exitView;
        this.#updateRelativePositions(enterEvent);

        // Call the handler for the target
        enterEvent.target.onMouseEnter(enterEvent);

        /***************/
        /* onMouseExit */
        /***************/
        if (exitView != null) {
            const exitEvent = mouseEvent.clone();
            exitEvent.type = MouseEvent.EXIT;
            exitEvent.target = exitView;
            exitEvent.related = enterView;
            this.#updateRelativePositions(exitEvent);

            // Call the handler for the target
            exitEvent.target.onMouseExit(exitEvent);
        }

        // Update the mouseOverView for the next event.
        this.#mouseOverView = view;
    }

    onMouseOut(domEvent) {
        const mouseEvent = this.#convertDomEvent(MouseEvent.EXIT, domEvent);
        if (!mouseEvent) { return; }

        for (let [button, view] of this.#mouseDownViews.entries()) {
            if (!view) { continue; }
            this.onMouseUp(domEvent);
            this.#mouseDownViews.set(button, null);
        }
    }

    onMouseWheel(domEvent) {
        const mouseEvent = this.#convertDomEvent(MouseEvent.WHEEL, domEvent);
        if (!mouseEvent) { return; }

        /*******************/
        /* MouseWheelEvent */
        /*******************/

        mouseEvent.target = this.#findView(mouseEvent);
        mouseEvent.related = null;
        this.#updateRelativePositions(mouseEvent);

        mouseEvent.target.onMouseWheel(mouseEvent);
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    attachDomEvents() {
        if (this.#domAbortController) { return; }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };

        // Mouse events
        this.#canvasElement.addEventListener("mousedown", this.onMouseDown.bind(this), options);
        this.#canvasElement.addEventListener("mouseup", this.onMouseUp.bind(this), options);
        this.#canvasElement.addEventListener("mouseout", this.onMouseOut.bind(this), options);
        this.#canvasElement.addEventListener("mousemove", this.onMouseMove.bind(this), options);
        this.#canvasElement.addEventListener("wheel", this.onMouseWheel.bind(this), options);
    }

    detachDomEvents() {
        if (!this.#domAbortController) { return; }
        this.#domAbortController.abort();
        this.#domAbortController = null;
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #convertDomEvent(type, event) {
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

        const mouseEvent = new MouseEvent(type);

        // Global position        
        mouseEvent.global.x = x;
        mouseEvent.global.y = y;
        mouseEvent.global.movementX = event.movementX;
        mouseEvent.global.movementY = event.movementY;

        // Target's parent position
        mouseEvent.parent.x = x;
        mouseEvent.parent.y = y;
        mouseEvent.parent.movementX = event.movementX;
        mouseEvent.parent.movementY = event.movementY;

        // Target's local position
        mouseEvent.local.x = x;
        mouseEvent.local.y = y;
        mouseEvent.local.movementX = event.movementX;
        mouseEvent.local.movementY = event.movementY;

        // Wheel
        mouseEvent.wheelX = event.deltaX;
        mouseEvent.wheelY = event.deltaY;
        mouseEvent.wheelZ = event.deltaZ;

        // Buttons
        mouseEvent.button = MouseButton.fromIndex(event.button);
        mouseEvent.buttons = event.buttons;

        // Target and related views
        mouseEvent.target = this.#rootView;
        mouseEvent.related = null;

        return mouseEvent;
    }

    #findView(event) {
        const view = event.target;
        const point = new Vec2(event.global.x, event.global.y);
        return view.pickView(point) ?? view;
    }

    #updateRelativePositions(event) {
        // Build a list of views from the target up to the root view so that we 
        // can traverse the hierarchy down to the target view.
        const views = [];
        let view = event.target;
        while (view) {
            views.push(view);
            view = view.parent;
        }

        const position = new Vec2(event.global.x, event.global.y);
        const movement = new Vec2(event.global.movementX, event.global.movementY);
        for (let i = views.length - 1; i >= 0; i--) {
            const view = views[i];
            view.parentToLocalPoint(position, position);
            view.parentToLocalVector(movement, movement);

            if (i === 1) {
                event.parent.x = position.x;
                event.parent.y = position.y;
                event.parent.movementX = movement.x;
                event.parent.movementY = movement.y;
            }
        }

        event.local.x = position.x;
        event.local.y = position.y;
        event.local.movementX = movement.x;
        event.local.movementY = movement.y;
    }

}

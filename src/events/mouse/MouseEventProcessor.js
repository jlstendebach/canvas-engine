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

    #mouseX = -1;
    #mouseY = -1;

    // MARK: - Initialization
    constructor(canvasElement, rootView) {
        this.#canvasElement = canvasElement;
        this.#rootView = rootView;
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    attachDomEvents() {
        if (this.#domAbortController) { return; }
        this.#domAbortController = new AbortController();
        const options = { signal: this.#domAbortController.signal };

        // Mouse events
        /*
        this.#canvasElement.addEventListener("mousedown", this.onMouseDown.bind(this), options);
        this.#canvasElement.addEventListener("mouseup", this.onMouseUp.bind(this), options);
        this.#canvasElement.addEventListener("mousemove", this.onMouseMove.bind(this), options);
        this.#canvasElement.addEventListener("mouseout", this.onMouseOut.bind(this), options);
        this.#canvasElement.addEventListener("wheel", this.onMouseWheel.bind(this), options);
        */
        for (const eventType of [
            "mousedown",
            "mouseup",
            "mousemove",
            "mouseout",
            "wheel"
        ]) {
            this.#canvasElement.addEventListener(
                eventType,
                this.#handleMouseEvent.bind(this, eventType),
                options
            );
        }

        // Disable context menu on right click
        this.#canvasElement.oncontextmenu = () => false;
    }

    detachDomEvents() {
        if (!this.#domAbortController) { return; }
        this.#domAbortController.abort();
        this.#domAbortController = null;

        // Restore default context menu behavior
        this.#canvasElement.oncontextmenu = null;
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Forwarding
    // -------------------------------------------------------------------------

    #handleMouseEvent(type, domEvent) {
        const mouseEvent = this.#createMouseEvent(domEvent);
        const isInsideCanvas = this.#isInsideCanvas(mouseEvent.canvasX, mouseEvent.canvasY);
        const wasInsideCanvas = this.#isInsideCanvas(this.#mouseX, this.#mouseY);

        this.#mouseX = mouseEvent.canvasX;
        this.#mouseY = mouseEvent.canvasY;

        // Mouse was and still is outside of the canvas.
        if (!wasInsideCanvas && !isInsideCanvas) {
            return;
        }

        // Clamp the mouse position to the canvas bounds.
        mouseEvent.canvasX = this.#clampX(mouseEvent.canvasX);
        mouseEvent.canvasY = this.#clampY(mouseEvent.canvasY);

        // Dispatch the event to the appropriate handler.
        if (isInsideCanvas && !wasInsideCanvas) {
            this.#onMouseEnter(mouseEvent);
        }

        switch (type) {
            case "mousedown": this.#onMouseDown(mouseEvent); break;
            case "mouseup": this.#onMouseUp(mouseEvent); break;
            case "mousemove": this.#onMouseMove(mouseEvent); break;
            case "wheel": this.#onMouseWheel(mouseEvent); break;
        }

        if (!isInsideCanvas && wasInsideCanvas) {
            this.#onMouseExit(mouseEvent);
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Handlers
    // -------------------------------------------------------------------------

    #onMouseEnter(event) {
        this.#onMouseMove(event);
    }

    #onMouseExit(event) {
        // Reset
        for (const [button, view] of this.#mouseDownViews.entries()) {
            if (view == null) { continue; }
            this.#mouseDownViews.set(button, null);

            event.type = MouseEvent.UP;
            event.target = view;
            event.related = null;
            this.#updateRelativePositions(event);

            // Call the handler for the target
            event.target.onMouseUp(event);
        }

        /***************/
        /* onMouseExit */
        /***************/
        if (this.#mouseOverView != null) {
            const exitEvent = event.clone();
            exitEvent.type = MouseEvent.EXIT;
            exitEvent.target = this.#mouseOverView;
            exitEvent.related = null;
            this.#updateRelativePositions(exitEvent);

            // Call the handler for the target
            exitEvent.target.onMouseExit(exitEvent);
        }

        this.#mouseDragButton = null;
        this.#mouseOverView = null;
    }

    #onMouseDown(event) {
        event.type = MouseEvent.DOWN;
        event.target = this.#findView(event);
        event.related = null;
        this.#updateRelativePositions(event);

        // Call the handler for the target
        event.target.onMouseDown(event);

        // Store the view and button to respond to other mouse events later.
        this.#mouseDownViews.set(event.button, event.target);
        if (this.#mouseDragButton == null) {
            this.#mouseDragButton = event.button;
        }
    }

    #onMouseUp(event) {
        const mouseDownView = this.#mouseDownViews.get(event.button);
        if (mouseDownView != null) {
            event.type = MouseEvent.UP;
            event.target = mouseDownView;
            event.related = this.#findView(event);
            this.#updateRelativePositions(event);

            // Call the handler for the target
            event.target.onMouseUp(event);
        }

        // Reset the mouseDownView so it no longer responds to mouse up events.
        this.#mouseDownViews.set(event.button, null);
        if (this.#mouseDragButton === event.button) {
            this.#mouseDragButton = null;
        }
    }

    #onMouseMove(event) {
        const view = this.#findView(event);

        /***************/
        /* onMouseDrag */
        /***************/
        const mouseDragView = this.#mouseDownViews.get(this.#mouseDragButton);
        if (mouseDragView != null) {
            const dragEvent = event.clone();
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
                event.type = MouseEvent.MOVE;
                event.target = view;
                event.related = null;
                this.#updateRelativePositions(event);

                // Call the handler for the target
                event.target.onMouseMove(event);
            }
            return;
        }

        const exitView = this.#mouseOverView;
        const enterView = view;

        /***************/
        /* onMouseExit */
        /***************/
        if (exitView != null) {
            const exitEvent = event.clone();
            exitEvent.type = MouseEvent.EXIT;
            exitEvent.target = exitView;
            exitEvent.related = enterView;
            this.#updateRelativePositions(exitEvent);

            // Call the handler for the target
            exitEvent.target.onMouseExit(exitEvent);
        }

        /****************/
        /* onMouseEnter */
        /****************/
        const enterEvent = event.clone();
        enterEvent.type = MouseEvent.ENTER;
        enterEvent.target = enterView;
        enterEvent.related = exitView;
        this.#updateRelativePositions(enterEvent);

        // Call the handler for the target
        enterEvent.target.onMouseEnter(enterEvent);

        // Update the mouseOverView for the next event.
        this.#mouseOverView = view;
    }

    #onMouseWheel(event) {
        event.type = MouseEvent.WHEEL;
        event.target = this.#findView(event);
        event.related = null;
        this.#updateRelativePositions(event);

        // Call the handler for the target
        event.target.onMouseWheel(event);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #isInsideCanvas(x, y) {
        return (
            x >= 0 &&
            y >= 0 &&
            x < this.#canvasElement.width &&
            y < this.#canvasElement.height
        );
    }

    #clampX(x) {
        return Math.max(0, Math.min(x, this.#canvasElement.width - 1));
    }

    #clampY(y) {
        return Math.max(0, Math.min(y, this.#canvasElement.height - 1));
    }

    #createMouseEvent(domEvent) {
        const style = getComputedStyle(this.#canvasElement)
        const paddingX = parseFloat(style.getPropertyValue("padding-left")) || 0;
        const paddingY = parseFloat(style.getPropertyValue("padding-top")) || 0;
        const x = Math.round(domEvent.offsetX - paddingX);
        const y = Math.round(domEvent.offsetY - paddingY);

        // Create the MouseEvent
        const mouseEvent = new MouseEvent();

        // Global position        
        mouseEvent.canvasX = x;
        mouseEvent.canvasY = y;
        mouseEvent.canvasMovementX = domEvent.movementX;
        mouseEvent.canvasMovementY = domEvent.movementY;

        // Target's parent position
        mouseEvent.parentX = x;
        mouseEvent.parentY = y;
        mouseEvent.parentMovementX = domEvent.movementX;
        mouseEvent.parentMovementY = domEvent.movementY;

        // Target's local position
        mouseEvent.x = x;
        mouseEvent.y = y;
        mouseEvent.movementX = domEvent.movementX;
        mouseEvent.movementY = domEvent.movementY;

        // Wheel
        mouseEvent.wheelX = domEvent.deltaX;
        mouseEvent.wheelY = domEvent.deltaY;
        mouseEvent.wheelZ = domEvent.deltaZ;

        // Buttons
        mouseEvent.button = MouseButton.fromIndex(domEvent.button);
        mouseEvent.buttons = domEvent.buttons;

        // Target and related views
        mouseEvent.target = this.#rootView;
        mouseEvent.related = null;

        return mouseEvent;
    }

    #findView(event) {
        const view = event.target;
        const point = new Vec2(event.canvasX, event.canvasY);
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

        const position = new Vec2(event.canvasX, event.canvasY);
        const movement = new Vec2(event.canvasMovementX, event.canvasMovementY);
        for (let i = views.length - 1; i >= 0; i--) {
            const view = views[i];
            view.parentToLocalPoint(position, position);
            view.parentToLocalVector(movement, movement);

            if (i === 1) {
                event.parentX = position.x;
                event.parentY = position.y;
                event.parentMovementX = movement.x;
                event.parentMovementY = movement.y;
            }
        }

        event.x = position.x;
        event.y = position.y;
        event.movementX = movement.x;
        event.movementY = movement.y;
    }

}

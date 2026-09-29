import { Vec2 } from "../../math/Vec2.js";
import { MouseButton } from "./MouseButton.js"
import { MouseEvent } from "./MouseEvent.js"
import { MouseEventType } from "./MouseEventType.js"
import type { View } from "../../graphics/views/core/View.js";

type DomMouseEvent = globalThis.MouseEvent;
type DomWheelEvent = globalThis.WheelEvent;

export class MouseEventProcessor {
    #canvasElement: HTMLCanvasElement;
    #rootView: View;

    #mouseDownViews: Map<MouseButton, View | null> = new Map([
        [MouseButton.LEFT, null],
        [MouseButton.RIGHT, null],
        [MouseButton.MIDDLE, null],
        [MouseButton.MOUSE4, null],
        [MouseButton.MOUSE5, null]
    ]);
    #mouseDragButton: MouseButton | null = null;
    #mouseOverView: View | null = null;

    #mouseX: number = -1;
    #mouseY: number = -1;

    // Event tracking management
    #domAbortController: AbortController | null = null;
    #mutationObserver: MutationObserver | null = null;

    // Cached objects for performance
    #computedStyle: CSSStyleDeclaration | null = null;
    #isComputedStyleDirty: boolean = true;

    // Temporary objects to avoid creating new objects for every event.
    #baseEvent: MouseEvent = new MouseEvent();
    #tempEvent: MouseEvent = new MouseEvent();
    #tempPosition: Vec2 = new Vec2();
    #tempMovement: Vec2 = new Vec2();
    #tempViewList: View[] = [];

    // MARK: - Initialization
    constructor(canvasElement: HTMLCanvasElement, rootView: View) {
        this.#canvasElement = canvasElement;
        this.#rootView = rootView;
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Binding
    // -------------------------------------------------------------------------

    attachDomEvents(): void {
        // Mouse events
        if (!this.#domAbortController) {
            this.#domAbortController = new AbortController();
            const options = { signal: this.#domAbortController.signal };

            for (const eventType of [
                "mousedown",
                "mouseup",
                "mousemove",
                "mouseout",
                "wheel"
            ] as const) {
                this.#canvasElement.addEventListener(
                    eventType,
                    this.#handleMouseEvent.bind(this, eventType),
                    options
                );
            }
        }

        // Disable context menu on right click
        this.#canvasElement.oncontextmenu = () => false;

        // CSS changes
        if (!this.#mutationObserver) {
            this.#mutationObserver = new MutationObserver(() => this.#isComputedStyleDirty = true);
            this.#mutationObserver.observe(this.#canvasElement, {
                attributes: true,
                attributeFilter: ["style", "class"]
            });
        }
    }

    detachDomEvents(): void {
        if (this.#domAbortController) {
            this.#domAbortController.abort();
            this.#domAbortController = null;
        }

        // Restore default context menu behavior
        this.#canvasElement.oncontextmenu = null;

        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Forwarding
    // -------------------------------------------------------------------------

    #handleMouseEvent(type: string, domEvent: DomMouseEvent): void {
        const mouseEvent = this.#getMouseEvent(domEvent);
        const isInsideCanvas = this.#isInsideCanvas(mouseEvent.canvasX, mouseEvent.canvasY);
        const wasInsideCanvas = this.#isInsideCanvas(this.#mouseX, this.#mouseY);

        this.#mouseX = mouseEvent.canvasX;
        this.#mouseY = mouseEvent.canvasY;

        // Mouse was and still is outside of the canvas.
        if (!wasInsideCanvas && !isInsideCanvas) {
            return;
        }

        // Clamp the mouse position to the canvas bounds.
        mouseEvent.canvasX = this.#clampX(this.#mouseX);
        mouseEvent.canvasY = this.#clampY(this.#mouseY);

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

    #onMouseEnter(event: MouseEvent): void {
        this.#onMouseMove(event);
    }

    #onMouseExit(event: MouseEvent): void {
        // Reset
        for (const [button, view] of this.#mouseDownViews.entries()) {
            if (view == null) { continue; }
            this.#mouseDownViews.set(button, null);

            const upEvent = this.#tempEvent.copy(event);
            upEvent.type = MouseEventType.UP;
            upEvent.button = button;
            upEvent.target = view;
            upEvent.related = null;
            this.#updateRelativePositions(upEvent);
            upEvent.target.onMouseUp(upEvent);
        }

        /***************/
        /* onMouseExit */
        /***************/
        if (this.#mouseOverView != null) {
            const exitEvent = this.#tempEvent.copy(event);
            exitEvent.type = MouseEventType.EXIT;
            exitEvent.target = this.#mouseOverView;
            exitEvent.related = null;
            this.#updateRelativePositions(exitEvent);
            exitEvent.target.onMouseExit(exitEvent);
        }

        this.#mouseDragButton = null;
        this.#mouseOverView = null;
    }

    #onMouseDown(event: MouseEvent): void {
        if (event.button == null) { return; }

        const downEvent = this.#tempEvent.copy(event);
        downEvent.type = MouseEventType.DOWN;
        downEvent.target = this.#findView(downEvent);
        downEvent.related = null;
        downEvent.button = event.button; // ensures button is not null
        this.#updateRelativePositions(downEvent);
        downEvent.target.onMouseDown(downEvent);

        // Store the view and button to respond to other mouse events later.
        this.#mouseDownViews.set(downEvent.button, downEvent.target);
        if (this.#mouseDragButton == null) {
            this.#mouseDragButton = downEvent.button;
        }
    }

    #onMouseUp(event: MouseEvent): void {
        if (event.button == null) { return; }

        const mouseDownView = this.#mouseDownViews.get(event.button);
        if (mouseDownView != null) {
            const upEvent = this.#tempEvent.copy(event);
            upEvent.type = MouseEventType.UP;
            upEvent.target = mouseDownView;
            upEvent.related = this.#findView(upEvent);
            this.#updateRelativePositions(upEvent);
            upEvent.target.onMouseUp(upEvent);
        }

        // Reset the mouseDownView so it no longer responds to mouse up events.
        this.#mouseDownViews.set(event.button, null);
        if (this.#mouseDragButton === event.button) {
            this.#mouseDragButton = null;
        }
    }

    #onMouseMove(event: MouseEvent): void {
        const view = this.#findView(event);

        /***************/
        /* onMouseDrag */
        /***************/
        const mouseDragView = this.#mouseDragButton !== null
            ? this.#mouseDownViews.get(this.#mouseDragButton)
            : null;
        if (mouseDragView != null) {
            const dragEvent = this.#tempEvent.copy(event);
            dragEvent.type = MouseEventType.DRAG;
            dragEvent.target = mouseDragView;
            dragEvent.related = view;
            dragEvent.button = this.#mouseDragButton;
            this.#updateRelativePositions(dragEvent);
            dragEvent.target.onMouseDrag(dragEvent);
        }

        /***************/
        /* onMouseMove */
        /***************/
        if (this.#mouseOverView === view) {
            if (view !== mouseDragView) {
                const moveEvent = this.#tempEvent.copy(event);
                moveEvent.type = MouseEventType.MOVE;
                moveEvent.target = view;
                moveEvent.related = null;
                this.#updateRelativePositions(moveEvent);
                moveEvent.target.onMouseMove(moveEvent);
            }
            return;
        }

        const exitView = this.#mouseOverView;
        const enterView = view;

        /***************/
        /* onMouseExit */
        /***************/
        if (exitView != null) {
            const exitEvent = this.#tempEvent.copy(event);
            exitEvent.type = MouseEventType.EXIT;
            exitEvent.target = exitView;
            exitEvent.related = enterView;
            this.#updateRelativePositions(exitEvent);
            exitEvent.target.onMouseExit(exitEvent);
        }

        /****************/
        /* onMouseEnter */
        /****************/
        const enterEvent = this.#tempEvent.copy(event);
        enterEvent.type = MouseEventType.ENTER;
        enterEvent.target = enterView;
        enterEvent.related = exitView;
        this.#updateRelativePositions(enterEvent);
        enterEvent.target.onMouseEnter(enterEvent);

        // Update the mouseOverView for the next event.
        this.#mouseOverView = view;
    }

    #onMouseWheel(event: MouseEvent): void {
        const wheelEvent = this.#tempEvent.copy(event);
        wheelEvent.type = MouseEventType.WHEEL;
        wheelEvent.target = this.#findView(wheelEvent);
        wheelEvent.related = null;
        this.#updateRelativePositions(wheelEvent);
        wheelEvent.target.onMouseWheel(wheelEvent);
    }

    // -------------------------------------------------------------------------
    // MARK: - Event Helpers
    // -------------------------------------------------------------------------

    #getMouseEvent(domEvent: DomMouseEvent): MouseEvent {
        if (this.#isComputedStyleDirty || this.#computedStyle === null) {
            this.#computedStyle = getComputedStyle(this.#canvasElement);
            this.#isComputedStyleDirty = false;
        }

        const style = this.#computedStyle;
        const paddingX = parseFloat(style.getPropertyValue("padding-left")) || 0;
        const paddingY = parseFloat(style.getPropertyValue("padding-top")) || 0;
        const x = Math.round(domEvent.offsetX - paddingX);
        const y = Math.round(domEvent.offsetY - paddingY);

        // Global position        
        this.#baseEvent.canvasX = x;
        this.#baseEvent.canvasY = y;
        this.#baseEvent.canvasMovementX = domEvent.movementX;
        this.#baseEvent.canvasMovementY = domEvent.movementY;

        // Target's parent position
        this.#baseEvent.parentX = x;
        this.#baseEvent.parentY = y;
        this.#baseEvent.parentMovementX = domEvent.movementX;
        this.#baseEvent.parentMovementY = domEvent.movementY;

        // Target's local position
        this.#baseEvent.x = x;
        this.#baseEvent.y = y;
        this.#baseEvent.movementX = domEvent.movementX;
        this.#baseEvent.movementY = domEvent.movementY;

        // Wheel
        this.#baseEvent.wheelX = 0;
        this.#baseEvent.wheelY = 0;
        this.#baseEvent.wheelZ = 0;
        if (domEvent.type === "wheel") {
            const domWheelEvent = domEvent as DomWheelEvent;
            this.#baseEvent.wheelX = domWheelEvent.deltaX;
            this.#baseEvent.wheelY = domWheelEvent.deltaY;
            this.#baseEvent.wheelZ = domWheelEvent.deltaZ;
        }

        // Buttons
        this.#baseEvent.button = MouseButton.fromIndex(domEvent.button);
        this.#baseEvent.buttons = domEvent.buttons;

        // Target and related views
        this.#baseEvent.target = this.#rootView;
        this.#baseEvent.related = null;

        return this.#baseEvent;
    }

    #findView(event: MouseEvent): View {
        const view = event.target ?? this.#rootView;
        this.#tempPosition.set(event.canvasX, event.canvasY);
        return view.pickView(this.#tempPosition) ?? view;
    }

    #updateRelativePositions(event: MouseEvent): void {
        // Build a list of views from the target up to the root view so that we 
        // can traverse the hierarchy down to the target view.
        const views = this.#tempViewList;
        views.length = 0;
        let view = event.target;
        while (view) {
            views.push(view);
            view = view.parent;
        }

        this.#tempPosition.set(event.canvasX, event.canvasY);
        this.#tempMovement.set(event.canvasMovementX, event.canvasMovementY);
        for (let i = views.length - 1; i >= 0; i--) {
            const view = views[i];
            view.toLocalPoint(this.#tempPosition, view.parent, this.#tempPosition);
            view.toLocalVector(this.#tempMovement, view.parent, this.#tempMovement);

            if (i === 1) {
                event.parentX = this.#tempPosition.x;
                event.parentY = this.#tempPosition.y;
                event.parentMovementX = this.#tempMovement.x;
                event.parentMovementY = this.#tempMovement.y;
            }
        }

        event.x = this.#tempPosition.x;
        event.y = this.#tempPosition.y;
        event.movementX = this.#tempMovement.x;
        event.movementY = this.#tempMovement.y;
    }

    // -------------------------------------------------------------------------
    // MARK: - Canvas Helpers 
    // -------------------------------------------------------------------------

    #isInsideCanvas(x: number, y: number): boolean {
        return (
            x >= 0 &&
            y >= 0 &&
            x < this.#canvasElement.width &&
            y < this.#canvasElement.height
        );
    }

    #clampX(x: number): number {
        return Math.max(0, Math.min(x, this.#canvasElement.width - 1));
    }

    #clampY(y: number): number {
        return Math.max(0, Math.min(y, this.#canvasElement.height - 1));
    }
}

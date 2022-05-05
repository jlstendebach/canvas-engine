import { Vec2 } from "../../index.js";
import { MouseButton } from "./MouseButton.js"
import { MouseEvent } from "./MouseEvents.js"

export class MouseEventProcessor {
    constructor() {
        this.mouseDownViews = {};
        this.mouseDownViews[MouseButton.LEFT] = null;
        this.mouseDownViews[MouseButton.RIGHT] = null;
        this.mouseDownViews[MouseButton.MIDDLE] = null;
        this.mouseDownViews[MouseButton.MOUSE4] = null;
        this.mouseDownViews[MouseButton.MOUSE5] = null;
        this.mouseDragButton = null;
        this.mouseOverView = null;
    }

    // --[ events ]-------------------------------------------------------------
    onMouseDown(event) {
        let target = this.findView(event);
        let position = this.getRelativeXY(event, target);

        /***************/
        /* onMouseDown */
        /***************/
        event = event.copy();
        event.type = MouseEvent.DOWN;
        event.x = position.x;
        event.y = position.y;
        event.target = target;
        event.related = null;
        event.target.onMouseDown(event);

        // Store the view and button to respond to other mouse events later.
        this.mouseDownViews[event.button] = target;
        if (this.mouseDragButton == null) {
            this.mouseDragButton = event.button;
        }
    }

    onMouseUp(event) {
        let mouseDownView = this.mouseDownViews[event.button];
        if (mouseDownView != null) {
            let related = this.findView(event);
            let position = this.getRelativeXY(event, mouseDownView);

            /*************/
            /* onMouseUp */
            /*************/
            event = event.copy();
            event.type = MouseEvent.UP;
            event.x = position.x;
            event.y = position.y;
            event.target = mouseDownView;
            event.related = related;
            event.target.onMouseUp(event);
        }

        // Reset the mouseDownView so we don't respond to mouse up events.
        this.mouseDownViews[event.button] = null;
        if (this.mouseDragButton === event.button) {
            this.mouseDragButton = null;
        }
    }

    onMouseMove(event) {
        let mouseDragView = this.mouseDownViews[this.mouseDragButton];
        if (mouseDragView != null) {
            let related = this.findView(event);
            let position = this.getRelativeXY(event, mouseDragView);

            /***************/
            /* onMouseDrag */
            /***************/
            let dragEvent = event.copy();
            dragEvent.type = MouseEvent.DRAG;
            dragEvent.x = position.x;
            dragEvent.y = position.y;
            dragEvent.button = this.mouseDragButton;
            dragEvent.target = mouseDragView;
            dragEvent.related = related;            
            dragEvent.target.onMouseDrag(dragEvent);    

        } 

        let view = this.findView(event);
        if (this.mouseOverView == view) {
            if (view != mouseDragView) {
                let position = this.getRelativeXY(event, view);

                /***************/
                /* onMouseMove */
                /***************/
                let moveEvent = event.copy();
                moveEvent.type = MouseEvent.MOVE;
                moveEvent.x = position.x;
                moveEvent.y = position.y;
                moveEvent.target = view;
                moveEvent.related = null;
                moveEvent.target.onMouseMove(moveEvent);    
            }

        } else {
            let exitView = this.mouseOverView;
            let enterView = view;

            /****************/
            /* onMouseEnter */
            /****************/
            let enterPosition = this.getRelativeXY(event, enterView);
            let enterEvent = event.copy();
            enterEvent.type = MouseEvent.ENTER;
            enterEvent.x = enterPosition.x;
            enterEvent.y = enterPosition.y;
            enterEvent.target = enterView;
            enterEvent.related = exitView;
            enterEvent.target.onMouseEnter(enterEvent);                

            /***************/
            /* onMouseExit */
            /***************/
            if (exitView != null) {
                let exitPosition = this.getRelativeXY(event, exitView);
                let exitEvent = event.copy();
                exitEvent.type = MouseEvent.EXIT;
                exitEvent.x = exitPosition.x;
                exitEvent.y = exitPosition.y;
                exitEvent.target = exitView;
                exitEvent.related = enterView;
                exitEvent.target.onMouseExit(exitEvent);                
            }

            // Update the mouseOverView for the next event.
            this.mouseOverView = view
        }
    }

    onMouseWheel(event) {
        let target = this.findView(event);
        let position = this.getRelativeXY(event, target);

        /*******************/
        /* MouseWheelEvent */
        /*******************/
        event = event.copy();
        event.type = MouseEvent.WHEEL;
        event.x = position.x;
        event.y = position.y;
        event.target = target;
        event.related = null;
        event.target.onMouseWheel(event);
    }    

    // --[ helpers ]------------------------------------------------------------
    findView(event) {
        let view = event.target;
        let subview = event.target;
        let position = new Vec2(event.x, event.y);
        while (subview != null) {
            view = subview;
            position.x -= view.getX();
            position.y -= view.getY();
            subview = view.pickView(position.x, position.y);    
        }
        return view;
    }

    getRelativeXY(event, view) {
        let position = new Vec2();
        while (view != event.target && view != null) {
            position.x += view.getX();
            position.y += view.getY();
            view = view.parent;
        }
        return new Vec2(event.x - position.x, event.y - position.y);
    }

}

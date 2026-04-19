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
        this.mouseDownViews[event.button] = target;
        if (this.mouseDragButton == null) {
            this.mouseDragButton = event.button;
        }
    }

    onMouseUp(event) {
        let mouseDownView = this.mouseDownViews[event.button];
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
        this.mouseDownViews[event.button] = null;
        if (this.mouseDragButton === event.button) {
            this.mouseDragButton = null;
        }
    }

    onMouseMove(event) {
        let mouseDragView = this.mouseDownViews[this.mouseDragButton];
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
            dragEvent.button = this.mouseDragButton;
            dragEvent.target = mouseDragView;
            dragEvent.related = related;            
            dragEvent.target.onMouseDrag(dragEvent);    

        } 

        let view = this.findView(event);
        if (this.mouseOverView == view) {
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
            let exitView = this.mouseOverView;
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
            this.mouseOverView = view
        }
    }

    onMouseWheel(event) {
        let target = this.findView(event);
        let position = this.getRelativeXY(event, target);

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
        let view = event.target;
        let subview = event.target;
        let position = new Vec2(event.x, event.y);
        while (subview != null) {
            view = subview;
            position.x -= view.getX();
            position.y -= view.getY();
            subview = view.pickView(position.x, position.y);    
            position = view.localToChild(position.x, position.y);
        }
        return view;
    }

    getRelativeXY(event, view) {
        // I have a strong feeling that this can be optimized, but this works 
        // as expected for now.
        let views = [];
        let parent = view.getParent();
        while (parent != event.target && parent != null) {
            views.push(parent);
            parent = parent.getParent();
        }
        
        let position = new Vec2(event.x, event.y);
        let delta = new Vec2(event.x - event.dx, event.y - event.dy); 
        for (let i = views.length-1; i >= 0; i--) {
            position.x -= views[i].getX();
            position.y -= views[i].getY();
            position = views[i].localToChild(position.x, position.y);
            delta.x -= views[i].getX();
            delta.y -= views[i].getY();
            delta = views[i].localToChild(delta.x, delta.y);
        }
        delta = Vec2.subtract(position, delta);

        position.x -= view.getX();
        position.y -= view.getY();

        return [position, delta];

        /*
        let position = new Vec2();
        while (view != event.target && view != null) {
            position.x += view.getX();
            position.y += view.getY();
            view = view.parent;
        }
        return new Vec2(event.x - position.x, event.y - position.y);
        */
    }

}

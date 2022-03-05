import { 
    MouseDownEvent,
    MouseDragEvent,
    MouseEnterEvent,
    MouseEvent,
    MouseExitEvent,
    MouseMoveEvent,
    MouseUpInsideEvent,
    MouseUpOutsideEvent,
} from "./MouseEvents.js"

export class MouseEventProcessor {
    constructor() {
        this.mouseDownView = null;
        this.mouseOverView = null;
    }

    // --[ events ]-------------------------------------------------------------
    onMouseDown(view, event) {
        // The event passed in is assumed to be within view. As such, translate 
        // the event to have coordinates local the view for checking again 
        // subviews.
        let translatedX = event.x - view.getX();
        let translatedY = event.y - view.getY();

        // Find the subview at the translated coordinates. Subview should be 
        // null if no subview was found.
        var subview = view.pickView(translatedX, translatedY);

        if (subview !== null) { // If a subview was found,
            // Recursively dive into the subview.
            return this.onMouseDown(
                subview,
                new MouseEvent(translatedX, translatedY, event.btn)
            );
        }

        // Otherwise, the event happened in this view. This should happen on the 
        // last step of recursion.
        this.mouseDownView = view;

        /********************
         *  MouseDownEvent  *
         ********************/
        view.onMouseDown(new MouseDownEvent(event.x, event.y, event.btn, view));

        // Return the view that the event happened in.
        return view;
    }

    onMouseUp(view, event) {
        // The event passed in is assumed to be within view. As such, translate 
        // the event to have coordinates local the view for checking again 
        // subviews.
        let translatedX = event.x - view.getX();
        let translatedY = event.y - view.getY();

        // Find the subview at the translated coordinates. Subview should be 
        // null if no subview was found.
        var subview = view.pickView(translatedX, translatedY);

        if (subview !== null) { // If a subview was found,
            // Recursively dive into the subview.
            return this.onMouseUp(
                subview,
                new MouseEvent(translatedX, translatedY, event.btn)
            );
        }

        // Otherwise, the event happened in this view. This should happen on the
        // last step of recursion.
        if (view === this.mouseDownView) {
            // If the current view is the mouseDownView, then the user pressed 
            // the button down and released it inside the view. Trigger a 
            // MouseUpInsideEvent on the current view.

            /************************
             *  MouseUpInsideEvent  *
             ************************/
            view.onMouseUpInside(new MouseUpInsideEvent(
                event.x, event.y, event.btn, view
            ));

        } else if (this.mouseDownView !== null) { // mouse up outside
            // If the current view is NOT the mouseDownView, then the user 
            // pressed the button down in the mouseDownView, but released it in 
            // the current view. Trigger a MouseUpOutsideEvent on the 
            // mouseDownView.

            /*************************
             *  MouseUpOutsideEvent  *
             ************************/
            this.mouseDownView.onMouseUpOutside(new MouseUpOutsideEvent(
                event.x, event.y, event.btn, view
            ));
        }

        // Reset mouseDownView.
        this.mouseDownView = null;

        return view;
    }

    onMouseMove(view, event) {
        if (this.mouseDownView !== null) {
            // If the mouseDownView already exists, then the user is dragging 
            // the mouse. Trigger a MouseDragEvent on the mouseDownView.

            /********************
             *  MouseDragEvent  *
             ********************/
            this.mouseDownView.onMouseDrag(new MouseDragEvent(
                event.x,
                event.y,
                event.dx,
                event.dy,
                event.btn,
                this.mouseDownView
            ));

        } else {
            // The event passed in is assumed to be within view. As such, 
            // translate the event to have coordinates local the view for 
            // checking again subviews.
            let translatedX = event.x - view.getX();
            let translatedY = event.y - view.getY();

            // Find the subview at the translated coordinates. Subview should be 
            // null if no subview was found.
            var subview = view.pickView(translatedX, translatedY);

            if (subview !== null) { // If a subview was found,
                // Recursively dive into the subview.
                return this.onMouseMove(
                    subview,
                    new MouseMoveEvent(
                        translatedX, translatedY, event.dx, event.dy, event.btn
                    )
                );
            }

            // Otherwise, the event happened in this view. This should happen on 
            // the last step of recursion.
            if (this.mouseOverView !== view) {
                if (this.mouseOverView !== null) {
                    // If the mouseOverView already exists and it is not the 
                    // current view, then the mouse is exiting the mouseOverView 
                    // and entering the current view. Trigger a MouseExitEvent 
                    // on the mouseOverView.

                    /********************
                     *  MouseExitEvent  *
                     *******************/
                    this.mouseOverView.onMouseExit(new MouseExitEvent(
                        event.x, event.y, event.dx, event.dy, event.btn, this.mouseOverView
                    ));
                }

                // The current view is not the same as the mouseOverView, so the
                // mouse is entering the current view. Trigger a MouseEnterEvent
                // on the current view.

                /*********************
                 *  MouseEnterEvent  *
                 *********************/
                view.onMouseEnter(new MouseEnterEvent(
                    event.x, event.y, event.dx, event.dy, event.btn, view
                ));

                // Change the mouseOverView to the current view. 
                this.mouseOverView = view;
            }

            /********************
             *  MouseMoveEvent  *
             ********************/
            view.onMouseMove(new MouseMoveEvent(
                event.x, event.y, event.dx, event.dy, event.btn, view
            ));

            return view;
        }
    }

}

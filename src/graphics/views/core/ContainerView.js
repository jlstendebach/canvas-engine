import { View } from './View.js';

export class ContainerView extends View {
    updateBounds(out) {
        out.reset();
        const views = this.getViews();
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            if (!view.isVisible) { continue; }
            out.addBounds(view.localToParentBounds(view.bounds));
        }
    }

    onChildBoundsChanged() {
        this.invalidateBounds();
    }

    containsPoint(point) {
        return this.bounds.containsPoint(point);
    }
}
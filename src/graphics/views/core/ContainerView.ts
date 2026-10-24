import type { Bounds } from "../../../math/Bounds.js";
import type { Vec2 } from "../../../math/Vec2.js";
import { View } from "./View.js";

export class ContainerView extends View {
    override updateBounds(out: Bounds): void {
        out.reset();
        const views = this.getViews();
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            if (!view.isVisible) { continue; }
            out.addBounds(view.localToParentBounds(view.bounds));
        }
    }

    override containsPoint(point: Vec2): boolean {
        return this.bounds.containsPoint(point);
    }

    override onChildBoundsInvalidated(): void {
        this.invalidateBounds();
    }
}
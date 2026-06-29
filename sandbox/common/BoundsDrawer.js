import {
    Color,
    View
} from "../../src/index.js";

export class BoundsDrawer extends View {
    rootView;
    depth = 0;
    maxDepth = 0;

    colors = [
        new Color(0,   0,   255),
        new Color(0,   128, 128),
        new Color(0,   255, 0),
        new Color(128, 128, 0),
        new Color(255, 0,   0),
    ];

    constructor(rootView) {
        super();
        this.rootView = rootView;
        this.isPickable = false;
    }

    updateMaxDepth(view = this.rootView) {
        if (view === null) {
            return;
        }
        if (view === this.rootView) {
            this.maxDepth = 0;
            this.depth = 0;
        }
        this.maxDepth = Math.max(this.depth, this.maxDepth);

        this.depth++;
        let children = view.getViews();
        for (let i = 0; i < children.length; i++) {
            this.updateMaxDepth(children[i]);
        }
        this.depth--;
    }

    getColorForDepth(depth) {
        const percent = depth / this.maxDepth;
        const index = percent * (this.colors.length - 1);
        const index1 = Math.floor(index);
        const index2 = Math.ceil(index);
        const t = index - index1;
        return Color.lerp(this.colors[index1], this.colors[index2], t);
    }

    getBoundsInWorldSpace(view) {
        let bounds = view.localToParentBounds(view.bounds);
        let current = view.parent;
        while (current !== null) {
            bounds = current.localToParentBounds(bounds);
            current = current.parent;
        }
        return bounds;
    }

    draw(context) {
        this.updateMaxDepth();

        this.depth = 0;
        this.drawChildBounds(context, this.rootView);
    }

    drawChildBounds(context, child) {
        const bounds = this.getBoundsInWorldSpace(child);

        if (!bounds.isEmpty()) {
            const color = this.getColorForDepth(this.depth).clone();
            color.a = 0.2;
            context.fillStyle = color.toRgba();
            color.a = 1;
            context.strokeStyle = color.toRgba();
            context.lineWidth = 2;
            context.beginPath();
            context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
            context.fill();
            context.stroke();
        }
        
        this.depth++;

        let children = child.getViews();
        for (let i = 0; i < children.length; i++) {
            this.drawChildBounds(context, children[i]);
        }

        this.depth--;
    }
}
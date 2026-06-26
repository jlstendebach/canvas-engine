import {
    CanvasApp,
    CircleView,
    Color,
    MouseButton,
    MouseEvent,
    View
} from "../../src/index.js";

class BoundsDrawer extends View {
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
        let bounds = view.getBoundsInParentSpace();
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
            context.strokeStyle = this.getColorForDepth(this.depth).toRgba();
            context.lineWidth = 2;
            context.strokeRect(bounds.minX, bounds.minY, bounds.width, bounds.height);
        }
        
        this.depth++;

        let children = child.getViews();
        for (let i = 0; i < children.length; i++) {
            this.drawChildBounds(context, children[i]);
        }

        this.depth--;
    }
}


export class BoundsApp extends CanvasApp {
    #boundsDrawer;
    #container;
    #subcontainer;

    // MARK: - Initialization 
    constructor(canvasSelectorOrElement) {
        super(canvasSelectorOrElement);
        this.initCanvas();
        this.initBall();

        this.#boundsDrawer = new BoundsDrawer(this.#container);
        this.canvas.addView(this.#boundsDrawer);
    }

    initCanvas() {
        this.canvas.fillStyle = new Color(0, 0, 20);
    }

    initBall() {
        this.#container = new View();
        for (let i = 0; i < 5; i++) {
            this.createBall({
                parent: this.#container,
                fillStyle: new Color(200, 0, 0),
                strokeStyle: new Color(100, 100, 100),
            });
        }
        this.canvas.addView(this.#container);

        this.#subcontainer = new View();
        for (let i = 0; i < 5; i++) {
            this.createBall({
                parent: this.#subcontainer,
                fillStyle: new Color(0, 200, 0),
                strokeStyle: new Color(100, 100, 100),
            });
        }
        this.#container.addView(this.#subcontainer);
        
    }
    
    // MARK: - Events Handlers
    onBallGrab(type, event) {
        if (event.button === MouseButton.LEFT) {
            event.target.position = event.getParentXY();
        }
    }

    onBallDrag(type, event) {
        event.target.position = event.getParentXY();
    }

    onBallDrop(type, event) {
        event.target.position = event.getParentXY();
    }

    // MARK: - Update
    onUpdate(timestamp, deltaTime) {
        /*
        for (let i = 0; i < this.#boundsDrawer.maxDepth; i++) {
            const color = this.#boundsDrawer.getColorForDepth(i);
            console.log(`Depth ${i}: ${color.toRgba()}`);
        }
            */
    }

    // MARK: - Helpers
    createBall({ parent, fillStyle, strokeStyle } = {}) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        if (parent === this.#container) {
            width = this.canvas.width * 0.8
            height = this.canvas.height * 0.8;
        } else if (parent === this.#subcontainer) {
            width = this.canvas.width * 0.6;
            height = this.canvas.height * 0.6;
        }

        const ball = new CircleView({
            x: Math.random() * width * 0.8 + width * 0.1, 
            y: Math.random() * height * 0.8 + height * 0.1,
            radius: 30,
            fillStyle: fillStyle ?? new Color(0, 0, 200),
            strokeStyle: strokeStyle ?? new Color(100, 100, 100),
            strokeWidth: 2,
        });
        ball.addEventListener(MouseEvent.DOWN, this.onBallGrab, this);
        ball.addEventListener(MouseEvent.DRAG, this.onBallDrag, this);
        ball.addEventListener(MouseEvent.UP, this.onBallDrop, this);
        parent.addView(ball);
        return ball;
    }

}
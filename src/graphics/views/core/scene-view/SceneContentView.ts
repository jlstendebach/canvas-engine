import { View } from "../View.js";

export class SceneContentView extends View {
    #sceneView;

    // MARK: - Accessors
    get sceneView() {
        return this.#sceneView;
    }

    get parent() {
        return this.#sceneView;
    }

    // MARK: - Initialization
    constructor(sceneView) {
        super();
        this.#sceneView = sceneView;
    }

    // MARK: - Overrides
    addToParent(parent) {
        void parent;
        throw new Error("SceneContentView cannot be added to a parent view.");
    }

    removeFromParent(parent) {
        void parent;
        throw new Error("SceneContentView cannot be removed from its parent view.");
    }

}
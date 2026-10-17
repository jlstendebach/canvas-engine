import { View } from "../View.js";
import type { SceneView } from "./SceneView.js";

export class SceneContentView extends View {
    #sceneView: SceneView;

    // MARK: - Accessors
    get sceneView(): SceneView {
        return this.#sceneView;
    }

    override get parent(): SceneView {
        return this.#sceneView;
    }

    // MARK: - Initialization
    constructor(sceneView: SceneView) {
        super();
        this.#sceneView = sceneView;
    }

    // MARK: - Overrides
    override addToParent(parent: View): never {
        void parent;
        throw new Error("SceneContentView cannot be added to a parent view.");
    }

    override removeFromParent(): never {
        throw new Error("SceneContentView cannot be removed from its parent view.");
    }

}
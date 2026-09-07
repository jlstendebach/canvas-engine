import { View } from "../View.js";
export declare class SceneContentView extends View {
    #private;
    get sceneView(): any;
    get parent(): any;
    constructor(sceneView: any);
    addToParent(parent: any): void;
    removeFromParent(parent: any): void;
}

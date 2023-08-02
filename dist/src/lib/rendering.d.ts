export class Rendering {
    /**
     * @internal
     * @param {import('../index').Engine} noa
    */
    constructor(noa: import('../index').Engine, opts: any, canvas: any);
    /** @internal */
    noa: import("../index").Engine;
    /** Whether to redraw the screen when the game is resized while paused */
    renderOnResize: boolean;
    /** @internal */
    useAO: boolean;
    /** @internal */
    aoVals: any;
    /** @internal */
    revAoVal: any;
    /** @internal */
    meshingCutoffTime: number;
    /** @internal */
    _scene: Scene;
    /** @internal */
    _engine: Engine;
    /** @internal */
    _octreeManager: SceneOctreeManager;
    initScene(canvas: any, opts: any): void;
    _cameraHolder: TransformNode;
    _camera: FreeCamera;
    _camScreen: import("@babylonjs/core/Meshes").Mesh;
    _camScreenMat: StandardMaterial;
    _camLocBlock: number;
    _light: HemisphericLight;
    /** The Babylon `scene` object representing the game world. */
    getScene(): Scene;
    /** @internal */
    tick(dt: any): void;
    /** @internal */
    render(): void;
    /** @internal */
    postRender(): void;
    /** @internal */
    resize(): void;
    /** @internal */
    highlightBlockFace(show: any, posArr: any, normArr: any): void;
    /**
     * Add a mesh to the scene's octree setup so that it renders.
     *
     * @param mesh the mesh to add to the scene
     * @param isStatic pass in true if mesh never moves (i.e. change octree blocks)
     * @param pos (optional) global position where the mesh should be
     * @param isPickable (optional) whether the mesh is pickable
     */
    addMeshToScene(mesh: any, isStatic?: boolean, pos?: any, isPickable?: boolean): void;
    /**
     * Create a default standardMaterial:
     * flat, nonspecular, fully reflects diffuse and ambient light
     */
    makeStandardMaterial(name: any): StandardMaterial;
    /** Exposed hook for if the client wants to do something to newly created materials */
    postMaterialCreationHook(mat: any): void;
    /** @internal */
    prepareChunkForRendering(chunk: any): void;
    /** @internal */
    disposeChunkForRendering(chunk: any): void;
    /** @internal */
    _rebaseOrigin(delta: any): void;
    /** @internal */
    debug_SceneCheck(): string;
    /** @internal */
    debug_MeshCount(): void;
}
import { Scene } from "@babylonjs/core/scene";
import { Engine as Engine_1 } from "@babylonjs/core/Engines/engine";
import { SceneOctreeManager } from "./sceneOctreeManager";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";

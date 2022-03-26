export class Rendering {
    /** @internal */
    constructor(noa: any, opts: any, canvas: any);
    /** @internal */
    noa: any;
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
    _scene: any;
    /** @internal */
    _engine: any;
    /** @internal */
    _octreeManager: any;
    MeshMetadataType: typeof MeshMetadataType;
    getScene(): any;
    tick(dt: any): void;
    render(): void;
    postRender(): void;
    resize(): void;
    highlightBlockFace(show: any, posArr: any, normArr: any): void;
    addMeshToScene(mesh: any, isStatic?: boolean, pos?: any, containingChunk?: any, isPickable?: boolean): void;
    makeStandardMaterial(name: any): StandardMaterial;
    postMaterialCreationHook(mat: any): void;
    prepareChunkForRendering(chunk: any): void;
    disposeChunkForRendering(chunk: any): void;
    _rebaseOrigin(delta: any): void;
    debug_SceneCheck(): string;
    debug_MeshCount(): void;
}
/**
 * `noa.rendering` -
 * Manages all rendering, and the BABYLON scene, materials, etc.
 *
 * This module uses the following default options (from the options
 * object passed to the [[Engine]]):
 * ```js
 * {
 *     showFPS: false,
 *     antiAlias: true,
 *     clearColor: [0.8, 0.9, 1],
 *     ambientColor: [1, 1, 1],
 *     lightDiffuse: [1, 1, 1],
 *     lightSpecular: [1, 1, 1],
 *     groundLightColor: [0.5, 0.5, 0.5],
 *     useAO: true,
 *     AOmultipliers: [0.93, 0.8, 0.5],
 *     reverseAOmultiplier: 1.0,
 *     preserveDrawingBuffer: true,
 *     octreeBlockSize: 2,
 *     renderOnResize: true,
 * }
 * ```
*/
declare function MeshMetadataType(): void;
declare class MeshMetadataType {
    markAsDirtyOnRebase: boolean;
    playerEId: any;
    gltf: any;
    _noaIsDynamicContent: boolean;
    _noaContainingBlock: any;
}
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
export {};

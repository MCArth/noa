/**
 * `noa.world` - manages world data, chunks, voxels.
 *
 * This module uses the following default options (from the options
 * object passed to the [[Engine]]):
 * ```js
 * var defaultOptions = {
 *   chunkSize: 24,
 *   chunkAddDistance: [2, 2],           // [horizontal, vertical]
 *   chunkRemoveDistance: [3, 3],        // [horizontal, vertical]
 *   worldGenWhilePaused: false,
 *   manuallyControlChunkLoading: false,
 * }
 * ```
*/
export class World extends EventEmitter {
    /** @internal */
    constructor(noa: any, opts: any);
    /** @internal */
    noa: any;
    /** @internal */
    playerChunkLoaded: boolean;
    /** @internal */
    Chunk: typeof Chunk;
    /**
     * Game clients should set this if they need to manually control
     * which chunks to load and unload. When set, client should call
     * `noa.world.manuallyLoadChunk` / `manuallyUnloadChunk` as needed.
     */
    manuallyControlChunkLoading: boolean;
    /**
     * Defining this function sets a custom order in which to create chunks.
     * The function should look like:
     * ```js
     *   (i, j, k) => 1 // return a smaller number for chunks to process first
     * ```
     */
    chunkSortingDistFn: (i: any, j: any, k: any) => number;
    /**
     * Set this higher to cause chunks not to mesh until they have some neighbors.
     * Max legal value is 26 (each chunk will mesh only when all neighbors are present)
     */
    minNeighborsToMesh: number;
    /** When true, worldgen queues will keep running if engine is paused. */
    worldGenWhilePaused: boolean;
    /** Limit the size of internal chunk processing queues
     * @type {number}
    */
    maxChunksPendingCreation: number;
    /** Limit the size of internal chunk processing queues
     * @type {number}
    */
    maxChunksPendingMeshing: number;
    /** Cutoff (in ms) of time spent each **tick**
     * @type {number}
    */
    maxProcessingPerTick: number;
    /** Cutoff (in ms) of time spent each **render**
     * @type {number}
    */
    maxProcessingPerRender: number;
    /** @internal */
    _chunkSize: any;
    /** @internal */
    _chunkAddDistance: number[];
    /** @internal */
    _chunkRemoveDistance: number[];
    /** @internal */
    _addDistanceFn: (i: any, j: any, k: any) => boolean;
    /** @internal */
    _remDistanceFn: (i: any, j: any, k: any) => boolean;
    /** @internal */
    _prevWorldName: string;
    /** @internal */
    _prevPlayerChunkHash: number;
    /** @internal */
    _chunkAddSearchFrom: number;
    /** @internal */
    _prevSortingFn: any;
    /** @internal */
    _chunksKnown: any;
    /** @internal */
    _chunksPending: any;
    /** @internal */
    _chunksToRequest: any;
    /** @internal */
    _chunksToRemove: any;
    /** @internal */
    _chunksToMesh: any;
    /** @internal */
    _chunksToMeshFirst: any;
    /** @internal */
    _chunksSortedLocs: any;
    /** @internal */
    _storage: ChunkStorage;
    /** @internal */
    _coordsToChunkIndexes: typeof chunkCoordsToIndexesGeneral;
    /** @internal */
    _coordsToChunkLocals: typeof chunkCoordsToLocalsGeneral;
    /** @internal */
    _coordShiftBits: number;
    /** @internal */
    _coordMask: number;
    canChangeBlockCoord: Set<any>;
    canChangeBlockType: Set<any>;
    canChangeBlockRect: any[];
    cantChangeBlockCoord: Set<any>;
    cantChangeBlockType: Set<any>;
    cantChangeBlockRect: any[];
    walkThroughType: Set<any>;
    walkThroughRect: any[];
    meshingTick: number;
    getBlockID(x: any, y: any, z: any): any;
    getBlockSolidity(x: any, y: any, z: any): boolean;
    getBlockOpacity(x: any, y: any, z: any): any;
    getBlockFluidity(x: any, y: any, z: any): any;
    getBlockProperties(x: any, y: any, z: any): any;
    setBlockID(val: any, x: any, y: any, z: any): any;
    hasChunkWithBlockCoordinates(x: any, y: any, z: any): boolean;
    isBoxUnobstructed(box: any): boolean;
    setChunkData(id: any, array: any, userData: any): void;
    setAddRemoveDistance(addDist?: number | number[], remDist?: number | number[]): void;
    invalidateVoxelsInAABB(box: any): void;
    manuallyLoadChunk(x: any, y: any, z: any): void;
    manuallyUnloadChunk(x: any, y: any, z: any): void;
    canChangeBlock(pos: any): any;
    tick(): void;
    render(): void;
    _getChunkByCoords(x: any, y: any, z: any): any;
    _queueChunkForRemesh(chunk: any): void;
    markAllChunksForRemoval(): void;
    report(): void;
}
import EventEmitter from "events";
import Chunk from "./chunk";
import { ChunkStorage } from "./util";
declare function chunkCoordsToIndexesGeneral(x: any, y: any, z: any): number[];
declare function chunkCoordsToLocalsGeneral(x: any, y: any, z: any): number[];
export {};

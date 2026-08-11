import { BufferGeometry, InstancedBufferAttribute, InstancedMesh, Material, MathUtils, Matrix4, Skeleton } from "three";
import { getDelta } from "../Device";
import { Map } from "immutable";
import { forEach, getExn, getWithDefault } from "../utils/NullableUtils";
import { reducePromise } from "../utils/ArrayUtils";
import { objectName, state } from "../type/StateType";
import { getClipSteps, getPlayClipData, getTime } from "./GPUSkinAnimation";
import { Flow, NullableUtils, Optimize } from "../Main";
import { getFloat32ArrayAndReset, mutableAddFloat32Array } from "../Optimize";
import { readState } from "../state/State";
import { disposeSkeleton } from "../scene/utils/DisposeUtils";

type name = string

// type instancedSkeletonAnimationData = {
//     name: name,
//     time: number
// }

// type onCompleteFunc<specificState> = (specificState: specificState) => Promise<specificState>

export class InstancedSkinnedMesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[]> extends InstancedMesh {

    public readonly isInstancedSkinnedMesh = true;
    public readonly isSkinnedMesh = true;
    public readonly bindMode = "detached";

    public bindMatrix = new Matrix4();
    public bindMatrixInverse = new Matrix4();

    public skeleton: Skeleton;

    public allNames: Array<objectName> = [];

    public instanceFrameData: InstancedBufferAttribute;


    // public playedClipIndexMap: Map<name, [number, boolean]> = Map()
    // public onceClipOnCompleteFuncMap: Map<name, onCompleteFunc<any>> = Map()
    // public timeMap: Map<name, number> = Map()
    // public isOnceClipOnCompleteFuncExecutedMap: Map<name, boolean> = Map()


    // constructor(state, geometry: TGeometry, material: TMaterial, count: number) {
    constructor(data: Float32Array, geometry: TGeometry, material: TMaterial, count: number) {
        super(geometry, material, count);

        // let d = getFloat32ArrayAndReset(state, this.count * 2)
        // state = d[0]
        // let data = d[1]

        // this.instanceFrameData = new InstancedBufferAttribute(new Float32Array(this.count * 2), 2);
        this.instanceFrameData = new InstancedBufferAttribute(data, 2);

        geometry.attributes["instanceFrameData"] = this.instanceFrameData;
    }

    public bind(skeleton, bindMatrix: Matrix4) {
        this.skeleton = skeleton;

        this.bindMatrix.copy(bindMatrix);
        this.bindMatrixInverse.copy(bindMatrix).invert();

        // for (let i = 0; i < this.count; i++) {
        //     this.allNames.push(new InstancedSkeletonData(i, this));
        // }
    }

    // private _isPlayedOnce(name: name) {
    //     return this.onceClipOnCompleteFuncMap.has(name)
    // }

    // public createInstancedSkeletonAnimationData(name: name) {
    //     return {
    //         name,
    //         time: getWithDefault(
    //             this.timeMap.get(name),
    //             0
    //         )
    //     }
    // }

    // public createInstancedSkeletonAnimationDataForUpdateData(name: name) {
    //     let time
    //     if (this._isPlayedOnce(name)) {
    //         time = +Infinity
    //     }
    //     else {
    //         time = 0
    //     }

    //     return {
    //         name,
    //         time
    //     }
    // }

    public addName(name: name) {
        // this.allNames.push(this.createInstancedSkeletonAnimationData(name));
        this.allNames.push(name)
    }

    public setFrameDataAt(index: number, clipIndex: number, frame: number) {
        this.instanceFrameData.setX(index, clipIndex);
        this.instanceFrameData.setY(index, frame);
        this.instanceFrameData.needsUpdate = true;
    }

    // private _resetInstancedSkeletonAnimationData(name) {
    //     this.allNames = this.allNames.map(data => {
    //         if (data.name == name) {
    //             return {
    //                 name,
    //                 time: 0
    //             }
    //         }

    //         return data
    //     })
    // }

    // public playLoop(name: name, clipIndex) {
    //     this.playedClipIndexMap = this.playedClipIndexMap.set(name, [clipIndex, true])

    //     this._resetInstancedSkeletonAnimationData(name)
    // }

    // public playOnce(onCompleteFunc: onCompleteFunc<any>, name: name, clipIndex) {
    //     this.playedClipIndexMap = this.playedClipIndexMap.set(name, [clipIndex, false])
    //     this.onceClipOnCompleteFuncMap = this.onceClipOnCompleteFuncMap.set(name, onCompleteFunc)
    //     this.isOnceClipOnCompleteFuncExecutedMap = this.isOnceClipOnCompleteFuncExecutedMap.set(name, false)

    //     this._resetInstancedSkeletonAnimationData(name)
    // }


    // private _updateLoopInstancedSkeletonAnimationData(state,
    //     data: instancedSkeletonAnimationData,
    //     index,
    //     duration: number, fps: number, steps, clipIndex
    // ) {
    //     let dt = getDelta(state);

    //     let time = data.time

    //     time += dt;
    //     time = MathUtils.clamp(time - Math.floor(time / duration) * duration, 0, duration);

    //     let frame = Math.floor(time * fps);
    //     frame = frame % steps;

    //     this.setFrameDataAt(index, clipIndex, frame);

    //     data.time = time
    // }

    // private _getLastFrame(steps) {
    //     return steps - 1
    // }

    // private _updateOnceInstancedSkeletonAnimationData(
    //     // onCompleteFunc,
    //     state,
    //     data: instancedSkeletonAnimationData,
    //     index,
    //     duration: number, fps: number,
    //     steps,
    //     clipIndex
    // ) {
    //     let dt = getDelta(state);

    //     let time = data.time

    //     if (time + dt >= duration) {
    //         this.setFrameDataAt(index, clipIndex, this._getLastFrame(steps))

    //         return true
    //     }

    //     time += dt

    //     let frame = Math.floor(time * fps);
    //     frame = frame >= steps ? this._getLastFrame(steps) : frame

    //     this.setFrameDataAt(index, clipIndex, frame);

    //     data.time = time

    //     return false
    // }

    // dispose(state: state): void {
    // disposeWithState(state: state): state {
    dispose(): void {
        super.dispose()

        if (!NullableUtils.isNullable(this.instanceFrameData)) {
            mutableAddFloat32Array(readState(), this.instanceFrameData.array)
        }


        this.skeleton = null


        this.instanceMatrix = null
        this.instanceColor = null

        this.bindMatrix = null
        this.bindMatrixInverse = null
        this.allNames = null
        this.instanceFrameData = null
    }

    private _getLastFrame(steps) {
        return steps - 1
    }


    update<specificState>(specificState: specificState,
        getAbstractStateFunc,
        // fps,
    ) {
        let state = getAbstractStateFunc(specificState)
        // let fps = Flow.getFPS(state)
        let fps = Flow.getMaxFPS(state)

        for (let i = 0; i < this.count; i++) {
            let name = this.allNames[i]

            forEach(([clipIndex, isLoop]) => {
                let steps = getClipSteps(state, name)[clipIndex]

                let time = getTime(state, name)

                let frame = Math.floor(time * fps);
                if (isLoop) {
                    frame = frame % steps;
                }
                else {
                    frame = frame >= steps ? this._getLastFrame(steps) : frame
                }

                this.setFrameDataAt(i, clipIndex, frame);
            },
                getPlayClipData(state, name)
            )
        }

        // return Promise.resolve(specificState)
        return specificState
    }

    // copyFromOldOne(instancedSkinnedMesh) {
    //     // this.playedClipIndexMap = instancedSkinnedMesh.playedClipIndexMap
    //     // this.onceClipOnCompleteFuncMap = instancedSkinnedMesh.onceClipOnCompleteFuncMap
    //     // this.timeMap = instancedSkinnedMesh.timeMap
    //     // this.isOnceClipOnCompleteFuncExecutedMap = instancedSkinnedMesh.isOnceClipOnCompleteFuncExecutedMap
    // }
}


// // Keep track of passed time for each instance
// export class InstancedSkeletonData {
//     public time = 0;

//     constructor(public name: string, public mesh: InstancedSkinnedMesh) {
//     }

//     update(state,
//         index,
//         duration: number, fps: number, steps, clipIndex
//     ) {
//         let dt = getDelta(state);

//         this.time += dt;
//         this.time = MathUtils.clamp(this.time - Math.floor(this.time / duration) * duration, 0, duration);

//         let frame = Math.floor(this.time * fps);
//         frame = frame % steps;

//         this.mesh.setFrameDataAt(index, clipIndex, frame);
//     }
// }
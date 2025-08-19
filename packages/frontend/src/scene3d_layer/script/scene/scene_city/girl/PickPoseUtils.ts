import { Box3, Matrix4, Quaternion, Vector3 } from "three";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { lodQueueIndex } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue";
import { LOD } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../state/State";

const _m1 = new Matrix4();

export let updateTransform = (state: state, queue: LODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4) => {
    queue.updateTransform(
        (transform) => {
            transform.copy(
                _m1.multiplyMatrices(
                    parentTransform,
                    localTransform
                )
            )
        }, index, true
    )

    return state
}

export let updateHierachyLODQueueTransform = (state: state, queue: HierachyLODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4) => {
    LOD.markNeedsUpdate(getAbstractState(state), queue.name, index, true)

    queue.updateTransform(
        (transform) => {
            transform.copy(
                _m1.multiplyMatrices(
                    parentTransform,
                    localTransform
                )
            )
        }, index, true
    )

    return state
}

export let getLocalTransform = (state: state, queue, index, name) => {
    return NullableUtils.getExn(queue).transforms[index]
}

export let getBoxForPick = (state: state, queue, index, name) => {
    return NullableUtils.getExn(queue).boxes[index]
}
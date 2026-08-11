import { Loader } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { Camera } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { AmbientLight } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { Box3, Box3Helper, Matrix4, Texture, Vector3 } from "three"
import { LODQueue as LODQueueType } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { getScene } from "../CityScene"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract"
import { buildStatus } from "./LODContainerUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { addBox3Helper } from "./ConfigUtils"
import { lodQueueIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as LODQueueUtils from "./LODQueueUtils"

export let buildQueue = LODQueueUtils.buildQueue

export let getOrAddData = (state: state, getNameFunc, reallocateQueueIndex: Array<lodQueueIndex>, queue: LODQueueType): [lodQueueIndex, Matrix4, Box3] => {
    let queueIndex = ArrayUtils.popLastOne(
        reallocateQueueIndex
    )

    if (NullableUtils.isNullable(queueIndex)) {
        let newQueueIndex = queue.getLastIndex() + 1


        let newTransform = new Matrix4()
        let newName = getNameFunc(newQueueIndex)
        let newBox = queue.originBox.clone()

        queue.insert(newTransform, newBox, newName, buildStatus(true, false, true))


        // state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), newName, buildStatus(true, false, true)))

        return [newQueueIndex, newTransform, newBox]
    }

    queueIndex = NullableUtils.getExn(queueIndex)

    // state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), getNameFunc(queueIndex), buildStatus(true, false, true)))
    queue.setStatus(queueIndex, buildStatus(true, false, true))

    return [queueIndex, queue.getTransform(queueIndex), queue.getBox(queueIndex)]
}

export let reallocate = (state: state, queue: LODQueueType, reallocateQueueIndex, index: lodQueueIndex): state => {
    let _ = ArrayUtils.push(
        reallocateQueueIndex,
        index
    )

    // state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), getNameFunc(index), buildStatus(false, false, false)))
    // state = setAbstractState(state, LOD.setStatusForLODQueueByName(getAbstractState(state), getNameFunc(index), buildStatus(false, false, false)))
    queue.setStatus(index, buildStatus(false, false, false))

    return state
}
import { Map, List } from "immutable"
import { lod, lodQueueIndex, state, staticLODContainerIndex } from "../type/StateType"
import { getLODState, setLODState } from "../state/State"
import { Octree } from "./utils/Octree"
import { Frustum, Matrix4, Box3, Vector3 } from "three"
import { status } from "./lod2/LODContainerType"
import { ArrayUtils, MutableMapUtils, MutableNumberMapUtils, NullableUtils } from "../Main"
import { getCurrentCamera } from "../scene/Camera"
import { create, get, getExn, remove, set } from "../utils/MutableMapUtils"
import { range } from "../utils/ArrayUtils"
import { buildBigBoundingBox } from "../terrain/Terrain"
import { LODQueue } from "./lod2/LODQueue"
import { getIndexFromBox } from "./utils/OctreeUtils"
// import { StaticLODContainer } from "./lod2/StaticLODContainer"

const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


export let createState = (): lod => {
    return {
        instancedMesh2LevelsMap: Map(),
        lod2s: List(),
        skinLOD2s: List(),
        needsUpdateForHierachyLODQueueMap: MutableMapUtils.create(),


        // octreeForStaticLODContainer: new Octree(new Box3(
        //     // new Vector3(- Infinity, - Infinity, - Infinity),
        //     // new Vector3(+ Infinity, + Infinity, + Infinity)
        //     new Vector3(0, 0, 0),
        //     new Vector3(0, 0, 0)
        // ), 2, 0),
        octreeForStaticLODContainer: new Octree(buildBigBoundingBox(), 2, 0),
        staticLODContainerMaxIndex: 0,

        visibleIndicesAfterfrustumCull: MutableNumberMapUtils.create(),

        staticLODContainerNames: [],
        staticLODContainerStatuses: [],
        staticLODContainerTransforms: [],
        staticLODContainerBoxes: [],
        staticLODContainerIndicesMap: create(),



        lodQueueStatusMap: create(),
        lodQueueMap: create(),
    }
}

export let getOctreeForStaticLODContainer = (state: state) => {
    return getLODState(state).octreeForStaticLODContainer
}

export let getStaticLODContainerAllIndices = (state: state) => {
    return range(0, getLODState(state).staticLODContainerMaxIndex)
}

export let getNewIndex = (state: state) => {
    return getLODState(state).staticLODContainerMaxIndex
}

export let addIndex = (state: state) => {
    return setLODState(state, {
        ...getLODState(state),
        staticLODContainerMaxIndex: getLODState(state).staticLODContainerMaxIndex + 1
    })
}

let _getIndex = (state: state, name) => {
    return getExn(
        getLODState(state).staticLODContainerIndicesMap, name
    )
}


export let getAllStaticLODContainerIndices = (state: state) => {
    return getAllBoxes(state).map(box => {
        return getIndexFromBox(box)
    })
}

// export let getStaticLODContainer = (state: state, index: staticLODContainerIndex) => {
//     return get(getLODState(state).staticLODContainerMap, index)
// }

// export let setStaticLODContainer = (state: state, index: staticLODContainerIndex, staticLODContainer: StaticLODContainer) => {
//     set(
//         getLODState(state).staticLODContainerMap,
//         index,
//         staticLODContainer
//     )

//     return state
// }

export let getStatus = (state: state, index: staticLODContainerIndex) => {
    return NullableUtils.getExn(getLODState(state).staticLODContainerStatuses[index])
}

export let setStatus = (state: state, index: staticLODContainerIndex, status: status) => {
    getLODState(state).staticLODContainerStatuses[index] = status

    return state
}

export let setStatusByName = (state: state, name, status: status) => {
    getLODState(state).staticLODContainerStatuses[_getIndex(state, name)] = status

    // return state
}

export let getName = (state: state, index: staticLODContainerIndex) => {
    return NullableUtils.getExn(getLODState(state).staticLODContainerNames[index])
}

export let setName = (state: state, index: staticLODContainerIndex, name) => {
    getLODState(state).staticLODContainerNames[index] = name

    set(
        getLODState(state).staticLODContainerIndicesMap, name, index
    )

    return state
}

export let getTransform = (state: state, index: staticLODContainerIndex) => {
    return NullableUtils.getExn(getLODState(state).staticLODContainerTransforms[index])
}

export let setTransform = (state: state, index: staticLODContainerIndex, transform) => {
    getLODState(state).staticLODContainerTransforms[index] = transform

    return state
}

export let getBox = (state: state, index: staticLODContainerIndex) => {
    return NullableUtils.getExn(getLODState(state).staticLODContainerBoxes[index])
}

export let setBox = (state: state, index: staticLODContainerIndex, box) => {
    getLODState(state).staticLODContainerBoxes[index] = box

    return state
}


export let getBoxByName = (state: state, name) => {
    return getBox(state,
        _getIndex(state, name)
    )
}

export let getAllBoxes = (state: state) => {
    return getLODState(state).staticLODContainerBoxes
}


// export let getStatusForLODQueue = (state: state, index: lodQueueIndex) => {
//     return NullableUtils.getExn(getLODState(state).lodQueueStatuses[index])
// }

// export let setStatusForLODQueue = (state: state, index: lodQueueIndex, status: status) => {
//     getLODState(state).lodQueueStatuses[index] = status

//     return state
// }

export let getStatusForLODQueue = (state: state, name) => {
    return getExn(getLODState(state).lodQueueStatusMap, name)
}

export let setStatusForLODQueue = (state: state, name, status: status) => {
    set(
        getLODState(state).lodQueueStatusMap, name, status
    )

    return state
}

export let removeStatusForLODQueue = (state: state, name) => {
    remove(
        getLODState(state).lodQueueStatusMap, name
    )

    return state
}

export let dispose = (state: state) => {
    getLODState(state).octreeForStaticLODContainer.dispose()

    return setLODState(state, createState())
}

export let markNeedsUpdate = (state: state, hierachyLODQueueName, index, isNeedsUpdate) => {
    MutableMapUtils.set(
        state.lod.needsUpdateForHierachyLODQueueMap,
        hierachyLODQueueName,
        ArrayUtils.set(
            NullableUtils.getWithDefault(
                MutableMapUtils.get(
                    state.lod.needsUpdateForHierachyLODQueueMap,
                    hierachyLODQueueName
                ),
                []
            ),
            index,
            isNeedsUpdate
        )
    )

    return state
}

export let isNeedsUpdate = (state: state, hierachyLODQueueName, index) => {
    return ArrayUtils.getExn(MutableMapUtils.getExn(state.lod.needsUpdateForHierachyLODQueueMap, hierachyLODQueueName), index) === true
}

export let update = (state: state) => {
    let camera = getCurrentCamera(state)
    let frustum = new Frustum().setFromProjectionMatrix(
        _m.multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        )
    )

    let visibleIndicesAfterfrustumCull = getLODState(state).visibleIndicesAfterfrustumCull

    // visibleIndicesAfterfrustumCull = MutableNumberMapUtils.map(visibleIndicesAfterfrustumCull, (value, key) => {
    //     return false
    // })
    for (let i = 0, len = visibleIndicesAfterfrustumCull.length; i < len; i++) {
        visibleIndicesAfterfrustumCull[i] = false
    }

    state = setLODState(state, {
        ...getLODState(state),
        visibleIndicesAfterfrustumCull: getOctreeForStaticLODContainer(state).queryByFrustum(state, frustum, visibleIndicesAfterfrustumCull)
    })

    return Promise.resolve(state)
}

export let getVisibleIndicesAfterfrustumCull = (state: state) => {
    return getLODState(state).visibleIndicesAfterfrustumCull
}

export let getLODQueue = (state: state, name) => {
    return getExn(getLODState(state).lodQueueMap, name)
}

export let setLODQueue = (state: state, name, queue: LODQueue) => {
    set(
        getLODState(state).lodQueueMap, name, queue
    )

    return state
}

export let removeLODQueue = (state: state, name) => {
    remove(
        getLODState(state).lodQueueMap, name
    )

    return state
}

export let isAlive = (state: state, index) => {
    return getStatus(state, index).isCollisionable
}

export let isAliveByName = (state: state, name) => {
    return getStatusForLODQueue(state, name).isCollisionable
}
import { Map, List } from "immutable"
import { lod, lodQueueIndex, state, staticLODContainerIndex } from "../type/StateType"
import { getLODState, setLODState } from "../state/State"
import { Octree } from "./utils/Octree"
import { Frustum, Matrix4, Box3, Vector3 } from "three"
// import { status } from "./lod2/LODContainerType"
import { ArrayUtils, MutableRecordUtils, MutableNumberMapUtils, NullableUtils, MutableMapUtils } from "../Main"
import { getCurrentCamera } from "../scene/Camera"
import { create, get, getExn, has, remove, set } from "../utils/MutableMapUtils"
import { range } from "../utils/ArrayUtils"
import { buildBigBoundingBox } from "../terrain/Terrain"
import { LODQueue } from "./lod2/LODQueue"
import { getIndexFromBox } from "./utils/OctreeUtils"
import { nullable } from "../utils/nullable"
import { HierachyLODQueue } from "./lod2/HierachyLODQueue"
import { getCurrentScene, getScene } from "../scene/Scene"
import { getRenderer } from "../Render"
import { status } from "./lod2/LODContainerType"
import { setShadow } from "../light/Shadow"
// import { StaticLODContainer } from "./lod2/StaticLODContainer"

const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


export let createState = (): lod => {
    return {
        instancedMesh2LevelsMap: Map(),
        lod2s: List(),
        skinLOD2s: List(),
        needsUpdateForHierachyLODQueueMap: create(),


        // octreeForStaticLODContainer: new Octree(new Box3(
        //     // new Vector3(- Infinity, - Infinity, - Infinity),
        //     // new Vector3(+ Infinity, + Infinity, + Infinity)
        //     new Vector3(0, 0, 0),
        //     new Vector3(0, 0, 0)
        // ), 2, 0),
        octreeForStaticLODContainer: new Octree(buildBigBoundingBox(), 2, 0),
        staticLODContainerMaxIndex: 0,

        visibleIndicesAfterfrustumCull: MutableMapUtils.create(),

        staticLODContainerNames: create(),
        staticLODContainerIsCollisionable: create(),
        staticLODContainerIsVisible: create(),
        staticLODContainerTransforms: create(),
        staticLODContainerBoxes: create(),
        staticLODContainerIndicesMap: create(),



        // lodQueueStatusMap: create(),
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

export let getIndexNullable = (state: state, name) => {
    return get(getLODState(state).staticLODContainerIndicesMap, name)
}

export let getIndex = (state: state, name) => {
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

// export let getStatus = (state: state, index: staticLODContainerIndex) => {
//     return MutableMapUtils.getExn(getLODState(state).staticLODContainerStatuses, index)
// }

// export let getStatusNullable = (state: state, index: staticLODContainerIndex) => {
//     return MutableMapUtils.get(getLODState(state).staticLODContainerStatuses, index)
// }

export let getIsCollisionable = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.getExn(getLODState(state).staticLODContainerIsCollisionable, index)
}

export let getIsCollisionableNullable = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.get(getLODState(state).staticLODContainerIsCollisionable, index)
}

export let getIsVisible = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.getExn(getLODState(state).staticLODContainerIsVisible, index)
}

export let getIsVisibleNullable = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.get(getLODState(state).staticLODContainerIsVisible, index)
}

export let setStatus = (state: state, index: staticLODContainerIndex, status: status) => {
    MutableMapUtils.set(getLODState(state).staticLODContainerIsCollisionable, index, status.isCollisionable)
    MutableMapUtils.set(getLODState(state).staticLODContainerIsVisible, index, status.isVisible)

    return state
}

export let setStatusByName = (state: state, name, status: status) => {
    MutableMapUtils.set(getLODState(state).staticLODContainerIsCollisionable, getIndex(state, name), status.isCollisionable)
    MutableMapUtils.set(getLODState(state).staticLODContainerIsVisible, getIndex(state, name), status.isVisible)

    // return state
}

export let getName = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.getExn(getLODState(state).staticLODContainerNames, index)
}

export let setName = (state: state, index: staticLODContainerIndex, name) => {
    MutableMapUtils.set(getLODState(state).staticLODContainerNames, index, name)

    set(
        getLODState(state).staticLODContainerIndicesMap, name, index
    )

    return state
}

export let getTransform = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.getExn(getLODState(state).staticLODContainerTransforms, index)
}

export let setTransform = (state: state, index: staticLODContainerIndex, transform) => {
    MutableMapUtils.set(getLODState(state).staticLODContainerTransforms, index, transform)

    return state
}

export let getBox = (state: state, index: staticLODContainerIndex) => {
    return MutableMapUtils.getExn(getLODState(state).staticLODContainerBoxes, index)
}

export let setBox = (state: state, index: staticLODContainerIndex, box) => {
    MutableMapUtils.set(getLODState(state).staticLODContainerBoxes, index, box)

    return state
}


export let getBoxByName = (state: state, name) => {
    return getBox(state,
        getIndex(state, name)
    )
}

export let getAllBoxes = (state: state) => {
    return MutableMapUtils.values(getLODState(state).staticLODContainerBoxes)
}


// export let getStatusForLODQueue = (state: state, index: lodQueueIndex) => {
//     return NullableUtils.getExn(getLODState(state).lodQueueStatuses[index])
// }

// export let setStatusForLODQueue = (state: state, index: lodQueueIndex, status: status) => {
//     getLODState(state).lodQueueStatuses[index] = status

//     return state
// }

// export let getStatusForLODQueue = (state: state, name) => {
//     return getExn(getLODState(state).lodQueueStatusMap, name)
// }

// export let getStatusForLODQueueNullable = (state: state, name) => {
//     return get(getLODState(state).lodQueueStatusMap, name)
// }

// export let setStatusForLODQueue = (state: state, name, status: status) => {
//     set(
//         getLODState(state).lodQueueStatusMap, name, status
//     )

//     return state
// }

export let setStatusForLODQueueByName = (state: state, name, status: status) => {
    // getLODQueue(state, name).setStatusByName(name, status)
    NullableUtils.forEach(queue => {
        queue.setStatusByName(name, status)
    }, getLODQueueNullable(state, name))

    return state
}


// export let removeStatusForLODQueue = (state: state, name) => {
//     remove(
//         getLODState(state).lodQueueStatusMap, name
//     )

//     return state
// }

export let disposeStaticData = (state: state, name) => {
    let {
        visibleIndicesAfterfrustumCull,

        staticLODContainerNames,
        // staticLODContainerStatuses,
        staticLODContainerTransforms,
        staticLODContainerBoxes,
        staticLODContainerIndicesMap,
    } = getLODState(state)

    let index = getIndex(state, name)

    // MutableMapUtils.set(visibleIndicesAfterfrustumCull, index, false)
    MutableMapUtils.remove(visibleIndicesAfterfrustumCull, index)

    MutableMapUtils.remove(staticLODContainerNames, index)
    // MutableMapUtils.remove(staticLODContainerStatuses, index)
    MutableMapUtils.remove(staticLODContainerTransforms, index)
    MutableMapUtils.remove(staticLODContainerBoxes, index)
    MutableMapUtils.remove(staticLODContainerIndicesMap, index)


    return state
}

export let dispose = (state: state) => {
    let {
        lod2s,
        skinLOD2s,
        octreeForStaticLODContainer
    } = getLODState(state)

    octreeForStaticLODContainer.dispose()

    lod2s.forEach(lod2 => {
        lod2.dispose()
    })
    skinLOD2s.forEach(lod2 => {
        lod2.dispose()
    })

    return setLODState(state, createState())
}

export let markNeedsUpdate = (state: state, hierachyLODQueueName, index, isNeedsUpdate) => {
    MutableRecordUtils.set(
        state.lod.needsUpdateForHierachyLODQueueMap,
        hierachyLODQueueName,
        ArrayUtils.set(
            NullableUtils.getWithDefault(
                MutableRecordUtils.get(
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
    return ArrayUtils.getExn(MutableRecordUtils.getExn(state.lod.needsUpdateForHierachyLODQueueMap, hierachyLODQueueName), index) === true
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

    // for (let i = 0, len = MutableNumberMapUtils.getCount(visibleIndicesAfterfrustumCull); i < len; i++) {
    //     visibleIndicesAfterfrustumCull[i] = false
    // }
    MutableMapUtils.forEach(visibleIndicesAfterfrustumCull, (value, key) => {
        MutableMapUtils.set(visibleIndicesAfterfrustumCull, key, false)
    })

    state = setLODState(state, {
        ...getLODState(state),
        visibleIndicesAfterfrustumCull: getOctreeForStaticLODContainer(state).queryByFrustum(state, frustum, visibleIndicesAfterfrustumCull)
    })

    return Promise.resolve(state)
}

export let getVisibleIndicesAfterfrustumCull = (state: state) => {
    return getLODState(state).visibleIndicesAfterfrustumCull
}

export let getLODQueueNullable = <queue extends LODQueue>(state: state, name): nullable<queue> => {
    return get(getLODState(state).lodQueueMap, name)
}

export let getLODQueue = (state: state, name): LODQueue | HierachyLODQueue => {
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


export let isAlive = getIsCollisionable

export let isAliveNullable = (state: state, name) => {
    return NullableUtils.bind(
        index => {
            return getIsCollisionableNullable(state, index)
        },
        getIndexNullable(state, name)
    )
}

// export let isAliveByName = (state: state, name) => {
//     return getStatusForLODQueue(state, name).isCollisionable
// }

export let isAliveInLODQueue = (state: state, name) => {
    // if (
    //     has(getLODState(state).lodQueueMap, name)
    // ) {
    //     return getStatusForLODQueue(state, name).isCollisionable
    // }
    return NullableUtils.getWithDefault(
        NullableUtils.map(queue => {
            // return queue.getStatusByName(name).isCollisionable
            return queue.getIsCollisionableByName(name)
        }, getLODQueueNullable(state, name)),
        false
    )
}


export let closeAllShadow = (state: state) => {
    getLODState(state).lod2s.concat(getLODState(state).skinLOD2s).forEach(lod => {
        lod.container.details.forEach(({ group }) => {
            setShadow(group, false, false)
        })

        lod.instancedMeshOfAllLevel.forEach(obj => {
            obj.castShadow = false
            obj.receiveShadow = false
        })
    })
}
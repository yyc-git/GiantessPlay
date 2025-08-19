import { ModelLoader } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { state } from "../../../../../type/StateType"
import { getBaseMapResourceId, getColorMapResourceId, getHeightMapResourceId, getScene, getState, setState } from "../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { map } from "../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Terrain } from "meta3d-jiehuo-abstract"
import { return_ } from "meta3d-jiehuo-abstract/src/utils/NullableUtils"
import { StaticLODContainer } from "meta3d-jiehuo-abstract"
import { Collision } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { Box3Helper } from "three"
import { buildStatus } from "../../utils/LODContainerUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { addBox3Helper } from "../../utils/ConfigUtils"
// import { getCameraCollisionableOctrees, getPlayerCollisionableContainers, setCameraCollisionableOctrees, setPlayerCollisionableContainers } from "meta3d-jiehuo-abstract/src/collision/Collision"
// import { getPlayerCollisionableContainers, setPlayerCollisionableContainers } from "../../Collision"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).map)
}

let _setState = (state: state, flowerState: map) => {
    return setState(state, {
        ...getState(state),
        map: NullableUtils.return_(flowerState)
    })
}

export let getNamePrefix = () => "MapWall"

export let isMapWall = (name: string) => {
    return name.includes(getNamePrefix())
}

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

// export let parseAndAddResources = (state: state) => {
//     let staticLODContainer = new StaticLODContainer.StaticLODContainer(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


//     let geometry = NewThreeInstance.createBoxGeometry(1, 1, 1)
//     let material = NewThreeInstance.createMeshBasicMaterial({})

//     let group = NewThreeInstance.createGroup()
//     group.add(NewThreeInstance.createMesh(geometry, material))

//     staticLODContainer.details = [
//         {
//             group: group,
//             level: "l0",
//             distance: +Infinity,
//         },
//     ]
//     staticLODContainer.name = buildName()

//     return Promise.resolve(_setState(state, {
//         ..._getState(state),
//         wall: return_(staticLODContainer)
//     }))

// }

export let initWhenImportScene = (state: state) => {
    state = NullableUtils.getWithDefault(
        NullableUtils.map(wall => {
            let abstractState = getAbstractState(state)

            // abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([wall]))


            let staticLODContainer = wall
            // staticLODContainer.batchSetStatus(staticLODContainer.traverse(o => o.names), buildStatus(true, false, false))
            abstractState = LOD.getStaticLODContainerAllIndices(abstractState).filter(index => staticLODContainer.isContainIndex(index)).reduce((abstractState, index) => {
                return LOD.setStatus(abstractState, index, buildStatus(true, false, false))
            }, abstractState)

            state = setAbstractState(state, abstractState)

            if (getIsDebug(state)) {
                let scene = getScene(state)

                staticLODContainer.getAllBoxes(getAbstractState(state)).forEach(box => {
                    addBox3Helper(getAbstractState(state), scene, box, 0x0000FF)
                })
            }

            return state
        }, _getState(state).wall),
        state
    )

    return Promise.resolve(state)
}

export let addStaticLODContainerData = (state: state,
    staticLODContainer,
    details,
) => {
    return _setState(state, {
        ..._getState(state),
        wall: return_(staticLODContainer)
    })
}

export let initialAttributes = (state, name) => {
    return state
}
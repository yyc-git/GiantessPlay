// import { ModelLoader } from "meta3d-jiehuo-abstract"
// import { getAbstractState } from "../../../../../state/State"
// import { state } from "../../../../../type/StateType"
// import { StaticLODContainer } from "meta3d-jiehuo-abstract"
// import { Loader } from "meta3d-jiehuo-abstract"
// import { getState, setState } from "../../CityScene"
// import { Render } from "meta3d-jiehuo-abstract"
// import { Box3, DoubleSide, Object3D, TextureLoader, Vector3 } from "three"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
// import { getIsDebug } from "../../../Scene"
// import { NullableUtils } from "meta3d-jiehuo-abstract"
// import { grass } from "../../type/StateType"
// import { Scene } from "meta3d-jiehuo-abstract"
// import { NewThreeInstance } from "meta3d-jiehuo-abstract"
// import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
// import { GrassMap } from "meta3d-jiehuo-abstract"
// import { Terrain } from "meta3d-jiehuo-abstract"

// let _getState = (state: state) => {
//     return NullableUtils.getExn(getState(state).grass)
// }

// let _setState = (state: state, grassState: grass) => {
//     return setState(state, {
//         ...getState(state),
//         grass: NullableUtils.return_(grassState)
//     })
// }

// export let buildName = () => "grass1"

// export let findAllGrass1s = (state, scene) => {
//     return Scene.findObjects(scene, ({ name }) => name == buildName())
// }

// export let parseAndAddResources = (state: state) => {
//     let high = NewThreeInstance.createGroup()
//     high.add(GrassMap.create({
//         width: 20,
//         height: 10
//     }, GrassMap.loadGrass1Texture()))

//     high.castShadow = false
//     high.receiveShadow = false

//     // high.matrixAutoUpdate = false


//     let details = [
//         {
//             group: high,
//             level: "l0",
//             distance: 800,
//         },
//     ]

//     let octree = new StaticLODContainer.StaticLODContainer(Terrain.getBoundingBox(NullableUtils.getExn(getState(state).terrain.terrainMesh)), 5, 0)


//     octree.details = details
//     octree.name = buildName()

//     // let grass = new InstanceSourceLOD.InstanceSourceLOD()

//     // grass.addLevel(high, 100, 0, getIsDebug(state))


//     return Promise.resolve(_setState(state, {
//         ..._getState(state),
//         grass1: NullableUtils.return_(
//             [
//                 octree,
//                 details,
//                 octree.name
//             ]
//         )
//     }))
// }

// export let dispose = (state: state) => {
//     // let [octree,
//     //     details,
//     //     name
//     // ] = NullableUtils.getExn(_getState(state).grass1)

//     // octree.dispose()


//     return Promise.resolve(state)
// }
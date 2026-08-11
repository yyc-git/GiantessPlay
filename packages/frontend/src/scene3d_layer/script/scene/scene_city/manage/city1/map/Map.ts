import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../../../type/StateType";
// import { getSceneResourceId } from "../ManageScene";
import { interactionName, map, usedGirlEnum } from "../../../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getName, getScene, getState, setState } from "../../../CityScene";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Loader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../../../state/State";
import { addBuildingAndTreeAndInteraction, addProp, generateTiles, isEmptyResourceId } from "procedural_city";
import { MutableNumberMapUtils } from "meta3d-jiehuo-abstract";
import { addAllBuildingCrackDecals, getFarDistance, getMiddleDistance, getNearDistance, handleDetails, parseStaticGroup } from "../WholeScene";
import { buildingTileCount, depthIndex, outputAddBuildingAndTreeAndInteractionData, outputAddPropData, outputSingleAddBuildingAndTreeAndInteractionData, outputTileData, resourceId, singleOutputData, widthIndex } from "procedural_city/src/Main.gen1";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { Map } from "immutable";
import { AdditiveBlending, Euler, FrontSide, InstancedMesh, Material, Matrix4, Mesh, NormalBlending, Quaternion, Vector3 } from "three";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
// import * as Tiles from "../Tiles";
import * as Buildings from "../Buildings";
import * as TreesAndProps from "../TreesAndProps";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { setCrowdData, setValidCrowdPositions } from "../Army";
import * as LittleMan from "../../../little_man/LittleMan";
import { buildingTileType, getBuildingLoadData, getChestBoxResourceId, getFateGirlResourceId, getInteractionLoadData, getLoadResourceIdData, getPlayerInitialPosition, getTileConfig, getTileLoadData, getTileRelations, getTileResourcePath, getTradeGirlResourceId, getTreeLoadData, getWholeSize } from "../../../data/play/level1/map/MapData";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import * as PathFind from "../PathFind"
import { off } from "meta3d-jiehuo-abstract/src/Event";
import { getNow } from "../../../Time";
// import { setMoveableRange } from "../../../utils/PlayerUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { lookat } from "../../../LittleManCamera";
import { Console } from "meta3d-jiehuo-abstract";
;
import { Camera } from "meta3d-jiehuo-abstract";
import { buildQueue } from "../../../utils/LODQueueUtils";
import { addQueue, getNamePrefix } from "../../../Interaction";
import { LOD } from "meta3d-jiehuo-abstract";
import { buildStatus } from "../../../utils/LODContainerUtils";
import { getIsDebug } from "../../../../Scene";
import { addBox3Helper } from "../../../utils/ConfigUtils";
import { getRenderAccuracy, getRenderSetting } from "../../../../../../mod/SettingMod";
import { mapSparse, renderAccuracyLevel } from "setting-default/src/Type";
import { api } from "type-api/src/Type";
import { buildAPI } from "../../../../../../mod/Mod";
import { fixGiantessModelMaterial } from "../../../utils/MaterialUtils";
import { getMapSparseFactor } from "./MapUtils";
import { getAllMapData } from "../../../../../../mod/InteractionMod";
import { getModAPI } from "../../../Mod";
import { getIsRemoveMapEdgeZone } from "../../../difficulty/HeatImplementer";
import { setMoveableRange } from "../../../utils/PlayerUtils";

type group = Array<
    [
        Mesh,
        Array<
            [
                string,
                Vector3,
                Quaternion,
                Vector3
            ]
        >
    ]
>

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

export let getMapState = (state): map => {
    return getState(state).map
}

export let setMapState = (state, mapState: map) => {
    return setState(state, {
        ...getState(state),
        map: mapState
    })
}

// export let getSceneResourceId = () => "city1"


export let getBuildingResourceId = (buildingTileType_, buildingTileCount_: buildingTileCount, index) => {
    let id = `building_${buildingTileType_}_`
    switch (buildingTileCount_) {
        case buildingTileCount.One_One:
            return `${id}1_1_${index}`
        case buildingTileCount.One_Two:
            return `${id}1_2_${index}`
        case buildingTileCount.One_Three:
            return `${id}1_3_${index}`
        case buildingTileCount.Two_One:
            return `${id}2_1_${index}`
        case buildingTileCount.Two_Two:
            return `${id}2_2_${index}`
        case buildingTileCount.Two_Three:
            return `${id}2_3_${index}`
        case buildingTileCount.Three_One:
            return `${id}3_1_${index}`
        case buildingTileCount.Three_Two:
            return `${id}3_2_${index}`
        case buildingTileCount.Three_Three:
            return `${id}3_3_${index}`
    }
}

export let getBuildingResourceIds = (buildingTileType_, buildingTileCount_: buildingTileCount, count) => {
    if (count == 0) {
        return []
    }

    return ArrayUtils.range(1, count).map(index => {
        return getBuildingResourceId(buildingTileType_, buildingTileCount_, index)
    })
}

export let getSmallTreeResourceId = (index) => {
    return `tree_small_${index}`
}

export let getBigTreeResourceId = (index) => {
    return `tree_big_${index}`
}

// export let getStreetLightUpResourceId = () => "streetLight_up"

export let getTrafficLightResourceId = () => "trafficLight"


let _getBuildingResourcePath = (resourceId) => {
    return `./resource/${getName()}/map/building/${resourceId}.glb`
}

let _getTreeResourcePath = (resourceId) => {
    return `./resource/${getName()}/map/tree/${resourceId}.glb`
}

let _getPropResourcePath = (resourceId) => {
    return `./resource/${getName()}/map/prop/${resourceId}.glb`
}


let _getBuildingLoadData = (state: state) => {
    return ArrayUtils.flatten(getBuildingLoadData().map(d => {
        return getBuildingResourceIds(d.tileType, d.buildingTileCount, d.count).map(resourceId => {
            return {
                id: resourceId,
                path: _getBuildingResourcePath(
                    resourceId,
                ),
                type: resourceType.ArrayBuffer
            }
        })
    })
    )
}

let _getTreeLoadData = (state: state) => {
    let {
        bigTreeCount,
        smallTreeCount
    } = getTreeLoadData()

    return [
        {
            id: getBigTreeResourceId(bigTreeCount),
            path: _getTreeResourcePath(
                getBigTreeResourceId(bigTreeCount),
            ),
            type: resourceType.ArrayBuffer
        },
        {
            id: getSmallTreeResourceId(smallTreeCount),
            path: _getTreeResourcePath(
                getSmallTreeResourceId(smallTreeCount),
            ),
            type: resourceType.ArrayBuffer
        }
    ]
}

let _getPropLoadData = () => {
    return [
        // {
        //     id: getStreetLightUpResourceId(),
        //     path: _getPropResourcePath(getStreetLightUpResourceId()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: getTrafficLightResourceId(),
            path: _getPropResourcePath(getTrafficLightResourceId()),
            type: resourceType.ArrayBuffer
        },
    ]
}


export let getRandomMapLoadData = (state: state,
    interactionLoadData
) => {
    // return {
    //     id: getSceneResourceId(),
    //     path: `./resource/${getName()}/map/rogue/scene${_getRandomIndex(state)}.glb`,
    //     type: resourceType.ArrayBuffer
    // }
    return getTileLoadData(state).concat(_getBuildingLoadData(state)).concat(_getTreeLoadData(state)).concat(_getPropLoadData()).concat(interactionLoadData)
}

// export let clearSceneLoadData = (state: state) => {
//     // return setAbstractState(state, Loader.removeResource(getAbstractState(state), getSceneResourceId()))
//     return state
// }

export let createState = (): map => {
    return {
        wall: null,
        // meshMap: Map(),
        lastRogueMapIndex: NullableUtils.getEmpty(),
    }
}

export let dispose = (state: state) => {
    return setMapState(state, createState())
}

let _getRandomFunc = () => {
    return Math.random
    // return () => 0.6
}


// let _computeQuaternion = (mesh: Mesh, quaternion) => {
//     // return NullableUtils.getWithDefault(
//     //     // NullableUtils.map(quaternion => {
//     //     //     return _q.copy(mesh.quaternion).multiply(quaternion)
//     //     //     // return _q.copy(mesh.quaternion).premultiply(quaternion)
//     //     // }, quaternion),
//     //     quaternion,
//     //     mesh.quaternion
//     // )
//     quaternion
// }

// let _convertLoadResourceIdToAlgorithmResourceId = (loadResourceId: string) => {
//     return ArrayUtils.range(0, loadResourceId.length - 1).reduce((sum, index) => {
//         return sum + loadResourceId.charCodeAt(index)
//     }, 0)
// }

let _computeBuildingTileCount = (id: resourceId, startIndex: number): nullable<[buildingTileCount, number]> => {
    if (id >= startIndex + 100) {
        return NullableUtils.getEmpty()
    }

    if (id >= startIndex && id < startIndex + 10) {
        return NullableUtils.return_([buildingTileCount.One_One, id - startIndex + 1])
    }

    if (id >= startIndex + 10 && id < startIndex + 20) {
        return NullableUtils.return_([buildingTileCount.One_Two, id - startIndex - 10 + 1])
    }

    if (id >= startIndex + 20 && id < startIndex + 30) {
        return NullableUtils.return_([buildingTileCount.One_Three, id - startIndex - 20 + 1])
    }

    if (id >= startIndex + 30 && id < startIndex + 40) {
        return NullableUtils.return_([buildingTileCount.Two_One, id - startIndex - 30 + 1])
    }

    if (id >= startIndex + 40 && id < startIndex + 50) {
        return NullableUtils.return_([buildingTileCount.Two_Two, id - startIndex - 40 + 1])
    }

    if (id >= startIndex + 50 && id < startIndex + 60) {
        return NullableUtils.return_([buildingTileCount.Two_Three, id - startIndex - 50 + 1])
    }

    if (id >= startIndex + 60 && id < startIndex + 70) {
        return NullableUtils.return_([buildingTileCount.Three_One, id - startIndex - 60 + 1])
    }

    if (id >= startIndex + 70 && id < startIndex + 80) {
        return NullableUtils.return_([buildingTileCount.Three_Two, id - startIndex - 70 + 1])
    }

    if (id >= startIndex + 80 && id < startIndex + 90) {
        return NullableUtils.return_([buildingTileCount.Three_Three, id - startIndex - 80 + 1])
    }

    throw new Error("err")
}

let _convertBuildingAlgorithmResourceIdToLoadResourceId = (id: resourceId, startIndex: number, tileType): nullable<string> => {
    // return ArrayUtils.range(0, loadResourceId.length - 1).reduce((sum, index) => {
    //     return sum + loadResourceId.charCodeAt(index)
    // }, 0)

    return NullableUtils.map(
        ([buildingTileCount_, index]) => {
            return NullableUtils.return_(getBuildingResourceId(tileType, buildingTileCount_, index))
        }, _computeBuildingTileCount(id, startIndex)
    )
}

let _convertTreeAlgorithmResourceIdToLoadResourceId = (id: resourceId): nullable<string> => {
    if (id >= 50 && id < 60) {
        return NullableUtils.return_(getSmallTreeResourceId(id - 50 + 1))
    }


    if (id >= 60 && id < 70) {
        return NullableUtils.return_(getBigTreeResourceId(id - 60 + 1))
    }

    return NullableUtils.getEmpty()
}

let _parseMesh = (meshMap, quaternion, algorithmResourceId, loadResourceId, state): Promise<[any, nullable<Quaternion>]> => {
    if (MutableRecordUtils.has(meshMap, algorithmResourceId)) {
        return Promise.resolve([meshMap, quaternion])
    }

    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), loadResourceId), getTileResourcePath(loadResourceId)).then(gltf => {
        let mesh = gltf.scene.children[0] as Mesh

        // state = setMapState(state, {
        //     ...getMapState(state),
        //     meshMap: getMapState(state).meshMap.set(id, mesh)
        // })

        return [MutableRecordUtils.set(meshMap, algorithmResourceId, mesh), quaternion]
    })
}

let _getOrParseMesh = (meshMap, state: state, loadResourceIdData, resourceId: number): Promise<[any, nullable<Quaternion>]> => {
    let id, quaternion

    let data = MutableRecordUtils.get(
        // getLoadResourceIdData(state),
        loadResourceIdData,
        resourceId
    )
    if (NullableUtils.isNullable(data)) {
        id = _convertTreeAlgorithmResourceIdToLoadResourceId(resourceId)

        if (NullableUtils.isNullable(id)) {
            id = _convertBuildingAlgorithmResourceIdToLoadResourceId(resourceId, 100, buildingTileType.Grass)

            if (NullableUtils.isNullable(id)) {
                id = _convertBuildingAlgorithmResourceIdToLoadResourceId(resourceId, 200, buildingTileType.Concrete)

                if (NullableUtils.isNullable(id)) {
                    id = _convertBuildingAlgorithmResourceIdToLoadResourceId(resourceId, 300, buildingTileType.GrassAndConcrete)

                    if (NullableUtils.isNullable(id)) {
                        throw new Error("err")
                    }
                }
            }

            id = NullableUtils.getExn(id)
        }
        else {
            id = NullableUtils.getExn(id)
        }

        quaternion = NullableUtils.getEmpty()
    }
    else {
        data = NullableUtils.getExn(data)

        id = data.loadResourceId
        quaternion = data.quaternion
    }

    return _parseMesh(meshMap, quaternion, resourceId, id, state)
}

let _getTileSize = (state: state) => {
    const defaultSize = 20

    return defaultSize * getMapSparseFactor(state)
}

let _computePosition = (state, widthIndex, depthIndex) => {
    let tileSize = _getTileSize(state)

    return new Vector3(
        widthIndex * tileSize,
        0,
        depthIndex * tileSize
    )
}

let _computeIndexWithCount = (index, count) => {
    requireCheck(() => {
        test("count should <= 3 and >= 1", () => {
            return count <= 3 && count >= 1
        })
    }, true)

    switch (count) {
        case 1:
            return index
        case 2:
            return index + 0.5
        case 3:
            return index + 1
    }
}

let _isRoadIntersect = (resourceId: resourceId) => {
    // if (resourceId >= 1 && resourceId < 20) {
    if (resourceId >= 1 && resourceId < 12) {
        if (resourceId != 6 && resourceId != 7) {
            return true
        }
    }

    return false
}

let _isRoadLaneHorrizon = (resourceId: resourceId) => {
    return resourceId == 6
}

let _isRoadLaneVertical = (resourceId: resourceId) => {
    return resourceId == 7
}

let _isRoad = (resourceId: resourceId) => {
    return _isRoadIntersect(resourceId) || _isRoadLaneHorrizon(resourceId) || _isRoadLaneVertical(resourceId)
}

let _convertAddDataToGroup = (state: state,
    isObjectFunc,
    loadResourceIdData,
    outputAddBuildingAndTreeAndInteractionData: outputAddBuildingAndTreeAndInteractionData): Promise<group> => {
    let defaultQuaternion = new Quaternion(0, 0, 0, 1)
    let defaultScale = new Vector3(1, 1, 1)

    return MutableRecordUtils.reducePromise(
        MutableRecordUtils.filter(outputAddBuildingAndTreeAndInteractionData, (_, resourceId) => {
            return isObjectFunc(Number(resourceId))
        }),
        ([meshMap, transformDataMap], data: Array<outputSingleAddBuildingAndTreeAndInteractionData>, resourceId_: string) => {
            let resourceId = Number(resourceId_)

            return _getOrParseMesh(meshMap, state, loadResourceIdData, resourceId).then(([meshMap, quaternion]) => {
                return [
                    meshMap,
                    MutableRecordUtils.set(transformDataMap, resourceId,
                        ArrayUtils.pushArrs(
                            NullableUtils.getWithDefault(
                                MutableRecordUtils.get(transformDataMap, resourceId),
                                ArrayUtils.create()
                            ),

                            data.map(([widthIndex, depthIndex, widthCount, depthCount]) => {
                                return [
                                    `${widthIndex}_${depthIndex}`,
                                    _computePosition(state,
                                        _computeIndexWithCount(widthIndex, widthCount),
                                        _computeIndexWithCount(depthIndex, depthCount)),
                                    NullableUtils.getWithDefault(
                                        quaternion,
                                        defaultQuaternion
                                    ),
                                    defaultScale
                                ]
                            })
                        )
                    )
                ]
            })
        }, [MutableRecordUtils.create(), MutableRecordUtils.create()]).then(_buildGroup)
}

let _addTransformDataForProp = (state, transformDataMap,
    meshMap,
    getTransformDataFunc,
    resourceId, widthIndex, depthIndex, defaultScale,
    prefix = ""
) => {
    let center = _computePosition(state,
        widthIndex,
        depthIndex
    )

    return [
        meshMap,
        MutableRecordUtils.set(transformDataMap, resourceId,
            ArrayUtils.pushArrs(
                NullableUtils.getWithDefault(
                    MutableRecordUtils.get(transformDataMap, resourceId),
                    ArrayUtils.create()
                ),
                getTransformDataFunc(center)
                    .map(([quaternion, pos], index) => {
                        return [
                            `${prefix}${index}_${widthIndex}_${depthIndex}`,
                            pos,
                            quaternion,
                            defaultScale
                        ]
                    })
            )
        )
    ]
}

let _convertAddPropDataToGroup = (state: state,
    {
        roadLaneHorrizonIndices, roadLaneIntersectIndices, roadLaneVerticalIndices
    }: outputAddPropData): Promise<group> => {
    let defaultScale = new Vector3(1, 1, 1)

    let offset = _getTileSize(state) / 2.3

    return ArrayUtils.reducePromise(roadLaneIntersectIndices, ([meshMap, transformDataMap], [widthIndex, depthIndex]) => {
        let resourceId = getTrafficLightResourceId()

        return _parseMesh(meshMap, _q, resourceId, resourceId, state).then(([meshMap, _]) => {
            return _addTransformDataForProp(state, transformDataMap, meshMap,
                (center) => [
                    [
                        new Quaternion(0, 0, 0, 1),
                        new Vector3(center.x - offset, center.y, center.z - offset),
                    ],
                    [
                        new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI / 2),
                        new Vector3(center.x + offset, center.y, center.z + offset),
                    ]
                ],
                resourceId, widthIndex, depthIndex, defaultScale, "")
        })
    }, [MutableRecordUtils.create(), MutableRecordUtils.create()])
        .then(_buildGroup)
    // .then(group => {
    // let resourceId = getStreetLightUpResourceId()

    //     return _parseMesh(MutableRecordUtils.create(), _q, resourceId, resourceId, state).then(([meshMap, _]) => {
    //         return ArrayUtils.reduce(roadLaneHorrizonIndices, ([meshMap, transformDataMap], [widthIndex, depthIndex]) => {
    //             return _addTransformDataForProp(transformDataMap, meshMap,
    //                 (center) => [
    //                     [
    //                         new Quaternion(0, 0, 0, 1),
    //                         new Vector3(center.x, center.y, center.z + offset),
    //                     ],
    //                     [
    //                         new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI),
    //                         new Vector3(center.x, center.y, center.z - offset),
    //                     ]
    //                 ],
    //                 resourceId, widthIndex, depthIndex, defaultScale, "horrizon")
    //         }, [meshMap, MutableRecordUtils.create()])
    //     })
    //         .then(([meshMap, transformDataMap]) => {
    //             return ArrayUtils.reduce<any, any>(roadLaneVerticalIndices, ([meshMap, transformDataMap], [widthIndex, depthIndex]) => {
    //                 return _addTransformDataForProp(transformDataMap, meshMap,
    //                     (center) => [
    //                         [
    //                             new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), - Math.PI / 2),
    //                             new Vector3(center.x - offset, center.y, center.z),
    //                         ],
    //                         [
    //                             new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI / 2),
    //                             new Vector3(center.x + offset, center.y, center.z),
    //                         ]
    //                     ],
    //                     resourceId, widthIndex, depthIndex, defaultScale, "vertical")
    //             }, [meshMap, transformDataMap])
    //         })
    //         .then(data => _addGroup(group, data))
    // })
}

let _addGroup = (group, [meshMap, transformDataMap]) => {
    return MutableRecordUtils.reduce(meshMap, (group, mesh, resourceId) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(d => {
                return ArrayUtils.push(
                    group,
                    [
                        mesh,
                        d
                    ]
                )
            }, MutableRecordUtils.get(transformDataMap, resourceId)),
            group
        )
    }, group)
}

let _buildGroup = ([meshMap, transformDataMap]) => {
    return _addGroup(ArrayUtils.create(), [meshMap, transformDataMap])
}

let _convertTileDataToGroup = (state: state, loadResourceIdData, tileData: outputTileData): Promise<group> => {
    let defaultQuaternion = new Quaternion(0, 0, 0, 1)
    let defaultScale = new Vector3(1, 1, 1)

    return ArrayUtils.reducePromise<[any, any], any>(tileData, (data, widthMap, widthIndex) => {
        return ArrayUtils.reducePromise<[any, any], singleOutputData>(widthMap, ([meshMap, transformDataMap], { resourceId }, depthIndex) => {
            return _getOrParseMesh(meshMap, state, loadResourceIdData, resourceId).then(([meshMap, quaternion]) => {
                return [
                    // state,
                    meshMap,
                    MutableRecordUtils.set(transformDataMap, resourceId,
                        ArrayUtils.push(
                            NullableUtils.getWithDefault(
                                MutableRecordUtils.get(transformDataMap, resourceId),
                                ArrayUtils.create()
                            ),
                            [
                                `${widthIndex}_${depthIndex}`,
                                _computePosition(state, widthIndex, depthIndex),
                                NullableUtils.getWithDefault(
                                    quaternion,
                                    defaultQuaternion
                                ),
                                // quaternion,
                                defaultScale
                            ]
                        )
                    )
                ]
            })
        }, data)
    }, [MutableRecordUtils.create(), MutableRecordUtils.create()]).then(_buildGroup)
}


export let changeToFrontSide = (mesh) => {
    (mesh.material as any).side = FrontSide
}


let _changeGroupMaterialToFrontSide = (group: group) => {
    group.forEach(([mesh, transformData]) => {
        changeToFrontSide(mesh)
    })

    return group
}

let _addTiles = (group: group, state: state) => {
    let scene = getScene(state)

    // let material = group[0][0].material

    group = _changeGroupMaterialToFrontSide(group)

    group.forEach(([mesh, transformData]) => {
        let instancedMesh = new InstancedMesh(mesh.geometry, mesh.material, transformData.length)
        // let instancedMesh = new InstancedMesh(mesh.geometry, material, transformData.length)
        instancedMesh.frustumCulled = false

        instancedMesh.castShadow = false
        instancedMesh.receiveShadow = true

        instancedMesh = transformData.reduce((instancedMesh, [name, position, quaternion, scale], meshIndex) => {
            let factor
            switch (getRenderSetting(state).mapSparse) {
                case mapSparse.Small:
                    factor = 0
                    break
                case mapSparse.Middle:
                    factor = 0.5
                    break
                case mapSparse.Big:
                    factor = 1
                    break
                case mapSparse.VeryBig:
                    factor = 1.5
                    break
            }

            instancedMesh.setMatrixAt(meshIndex, new Matrix4().compose(
                position, quaternion,
                scale.clone().add(_v1.set(factor, 0, factor))
            ))

            return instancedMesh
        }, instancedMesh)

        scene.add(instancedMesh)
    })

    return state
}

let _isBuilding = (resourceId: resourceId) => {
    return resourceId >= 100 && !_isInteraction(resourceId)
}

let _isTree = (resourceId: resourceId) => {
    return resourceId >= 50 && resourceId < 70
}

let _isInteraction = (resourceId: resourceId) => {
    return resourceId >= 1000
}

let _isSpecificInteraction = (specificResourceId) => {
    return (resourceId: resourceId) => resourceId == specificResourceId
}


let _isGrass = (id: resourceId) => {
    return id == 20
}

let _isConcrete = (id: resourceId) => {
    return id == 30
}


let _searchByZone = (state: state, func: (state: state, zone: Array<{
    widthIndex: widthIndex,
    depthIndex: depthIndex,
    resourceId: resourceId
}>) => state, tileData: outputTileData, widthStep: number, depthStep: number) => {
    // // let minInterval = 3
    // // let maxInterval = 6

    // let size = 5
    // let minCount = 1
    // let maxCount = 2

    let [widthSize, depthSize] = getWholeSize(state)

    let previousWidthIndex = 0
    let nextWidthIndex
    let previousDepthIndex = 0
    // let nextDepthIndex
    let nextDepthIndex = previousDepthIndex + depthStep
    let zone: Array<{
        widthIndex: widthIndex,
        depthIndex: depthIndex,
        resourceId: resourceId
    }>


    if (nextDepthIndex >= depthSize) {
        return state
    }

    do {
        nextWidthIndex = previousWidthIndex + widthStep
        // nextDepthIndex = previousDepthIndex + depthStep

        if (nextWidthIndex >= widthSize) {
            previousWidthIndex = 0

            previousDepthIndex = nextDepthIndex
            nextDepthIndex = previousDepthIndex + depthStep


            if (nextDepthIndex >= depthSize) {
                break
            }


            continue
        }

        zone = ArrayUtils.range(previousWidthIndex, nextWidthIndex - 1).reduce((zone, widthIndex) => {
            return ArrayUtils.range(previousDepthIndex, nextDepthIndex - 1).reduce((zone, depthIndex) => {
                return ArrayUtils.push(
                    zone,
                    {
                        widthIndex,
                        depthIndex,
                        resourceId: MutableRecordUtils.getExn(
                            MutableRecordUtils.getExn(tileData, widthIndex),
                            depthIndex
                        ).resourceId
                    }
                )
            }, zone)
        }, [])

        state = func(state, zone)


        previousWidthIndex = nextWidthIndex
    }
    while (true)

    return state
}

// let _addMarks = (state: state, tileData: outputTileData) => {
//     let minInterval = 3
//     let maxInterval = 6

//     let [positions, _] = MutableRecordUtils.reduce(tileData, ([positions, nextWidthIndex], widthMap, widthIndex) => {
//         if (widthIndex == nextWidthIndex) {
//             let d = MutableRecordUtils.reduce(widthMap, ([positions, nextDepthIndex], { resourceId }, depthIndex) => {
//                 if (depthIndex != nextDepthIndex) {
//                     return [positions, nextDepthIndex]
//                 }

//                 if (isEmptyResourceId(resourceId) || _isRoad(resourceId)) {
//                     positions = ArrayUtils.push(positions, _computePosition(widthIndex, depthIndex))
//                 }

//                 return [
//                     positions,
//                     nextDepthIndex + NumberUtils.getRandomInteger(minInterval, maxInterval)
//                 ]
//             }, [positions, NumberUtils.getRandomInteger(minInterval, maxInterval)])
//             positions = d[0]

//             return [positions, nextWidthIndex + NumberUtils.getRandomInteger(minInterval, maxInterval)]
//         }

//         return [positions, nextWidthIndex]
//     }, [[], NumberUtils.getRandomInteger(minInterval, maxInterval)])

//     state = setCrowdData(state, positions)


//     if (positions.length == 0) {
//         state = LittleMan.setInitialTransform(state, _v1.set(0, 0, 0), _q.set(0, -0.707, 0, 0.707))
//     }
//     else {
//         state = LittleMan.setInitialTransform(state, NumberUtils.randomSelect(positions), _q.set(0, -0.707, 0, 0.707))
//     }

//     return state
// }

// export let getPlayerInitialPosition = () => {
//     return new Vector3(-12, 0, -12)
// }

let _addMarks = (state: state, tileData: outputTileData) => {
    let size = 3
    // let minCount = 1
    // let maxCount = 2
    let maxCount = Math.round(2 * getMapSparseFactor(state))
    // let maxCount = 1

    let positions = []

    state = _searchByZone(state, (state, zone) => {
        let data = zone.reduce<[Array<Vector3>, number]>(([positions, count], { widthIndex, depthIndex, resourceId }) => {
            if (
                count < maxCount
                &&
                (
                    isEmptyResourceId(resourceId) || _isRoad(resourceId)
                )
            ) {
                return [
                    ArrayUtils.push(positions, _computePosition(state, widthIndex, depthIndex)),
                    count + 1
                ]
            }

            return [positions, count]
        }, [positions, 0])
        positions = data[0]

        return state
    }, tileData, size, size)


    state = setCrowdData(state, positions)
    state = setValidCrowdPositions(state, ArrayUtils.clone(positions))

    // if (positions.length == 0) {
    //     state = LittleMan.setInitialTransform(state, _v1.set(0, 0, 0), _q.set(0, -0.707, 0, 0.707))
    // }
    // else {
    //     state = LittleMan.setInitialTransform(state, NumberUtils.randomSelect(positions), _q.set(0, -0.707, 0, 0.707))
    // }
    // state = LittleMan.setInitialTransform(state, _v1.set(0, 0, 0), _q.set(0, -0.707, 0, 0.707))
    // state = LittleMan.setInitialTransform(state, _v1.set(0, 0, 0), _q.set(0, 0, 0, 1))
    // state = LittleMan.setInitialTransform(state, _v1.set(0, 0, 0), _q.setFromEuler(_e.set(0, -Math.PI / 2, 0)))

    // let position = _v1.set(0, 0, 0)
    // let position = _v1.set(-15, 0, -15)
    let position = getPlayerInitialPosition()
    let lookatPosition = _v2.set(100, 0, 100)
    state = LittleMan.setInitialTransform(state, position.clone(), TransformUtils.getLookatQuaternion(position, lookatPosition))
    state = lookat(state, lookatPosition.clone().sub(position).normalize())

    return state
}

export let getMoveableRange = (state: state, factor) => {
    let [widthSize, depthSize] = getWholeSize(state)
    let tileSize = _getTileSize(state)

    return {
        minX: -tileSize * factor,
        maxX: tileSize * (widthSize + factor),
        minZ: -tileSize * factor,
        maxZ: tileSize * (depthSize + factor),
    }
}

let _setMoveableRange = (state: state) => {
    // return setMoveableRange(state, [
    //     getMoveableRange(state, 10)
    // ])
    // return LittleMan.setMovableRanges(state, [
    //     getMoveableRange(state, getIsRemoveMapEdgeZone(state) ? 1 : 10)
    // ])
    if (getIsRemoveMapEdgeZone(state)) {
        // return setMoveableRange(state, usedGirlEnum.PlayerGirl, [
        //     getMoveableRange(state, 1)
        // ])
        return LittleMan.setMovableRanges(state, [
            getMoveableRange(state, 1)
        ])
    }

    return LittleMan.setMovableRanges(state, [
        getMoveableRange(state, 10)
    ])
}

let _getIsReceiveShadow = (state: state) => {
    let isReceiveShadow
    switch (getRenderAccuracy(state)) {
        // case renderAccuracyLevel.MostHigh2:
        // case renderAccuracyLevel.MostHigh:
        //     isReceiveShadow = false
        //     break
        case renderAccuracyLevel.VeryHigh:
        case renderAccuracyLevel.High:
            isReceiveShadow = true
            break
        case renderAccuracyLevel.Middle:
        case renderAccuracyLevel.Low:
        default:
            isReceiveShadow = false
            break
    }

    return isReceiveShadow
}

let _parseInteractionGroup = (state, group: Array<
    [
        Mesh,
        Array<
            [
                string,
                Vector3,
                Quaternion,
                Vector3
            ]
        >,
    ]
>, getDistanceFunc, interactionName_) => {
    let api = getModAPI(state)
    return group.reduce((state, [mesh, transformData], index) => {
        let data = buildQueue(state, fixGiantessModelMaterial(api), getDistanceFunc, mesh, {
            castShadow: true,
            receiveShadow: false
        })
        state = data[0]
        let queue = data[1]

        queue.name = interactionName_

        state = addQueue(state, queue)

        let box = queue.originBox

        state = transformData.reduce((state, [name, position, quaternion, scale]) => {
            let newTransform = new Matrix4().compose(position, quaternion, scale)
            let newName = `${getNamePrefix()}_${name}`
            let newBox = box.clone().applyMatrix4(newTransform)


            queue.insert(newTransform, newBox, newName, buildStatus(false, true, true))

            // state = setAbstractState(state, LOD.setStatusForLODQueue(getAbstractState(state), newName, buildStatus(false, true, true)))


            if (getIsDebug(state)) {
                addBox3Helper(getAbstractState(state), getScene(state), newBox, 0x1fff00)
            }

            return state
        }, state)

        return state
    }, state)
}

let _addInteraction = (state: state, outputAddBuildingAndTreeAndInteractionData, resourceId, interactionName,
    loadResourceIdData
) => {
    return _convertAddDataToGroup(state, _isSpecificInteraction(resourceId),
        loadResourceIdData,
        outputAddBuildingAndTreeAndInteractionData).then((group) => {
            // let [farDistance,
            //     middleDistance,
            //     nearDistance] = getDistance(state)

            return _parseInteractionGroup(state, group, getMiddleDistance, interactionName)
        })
}


export let initWhenImportScene = (state: state,
    buildingAndTreeAndInteractionConfig,
    loadResourceIdData,
    allMapData
) => {
    let a1 = getNow(state);


    let tileData = generateTiles(_getRandomFunc(), getTileConfig(state), getTileRelations())

    // console.log(tileData)

    return _convertTileDataToGroup(state, loadResourceIdData, tileData,).then((group) => {
        // let [farDistance,
        //     middleDistance,
        //     nearDistance] = getDistance(state)

        // return parseStaticGroup(state, group,
        //     [
        //         Tiles.getNamePrefix,
        //         Tiles.buildCategoryName, Tiles.initialAttributes, Tiles.addStaticLODContainerData],
        //     {
        //         castShadow: false,
        //         receiveShadow: true,
        //         distance: farDistance
        //     }
        // )
        return _addTiles(group, state)
    }).then(state => {
        let outputAddBuildingAndTreeAndInteractionData = addBuildingAndTreeAndInteraction(tileData, [
            _isGrass,
            _isConcrete,
            _getRandomFunc()
        ],
            buildingAndTreeAndInteractionConfig
        )

        let isReceiveShadow = _getIsReceiveShadow(state)

        // console.log(outputAddBuildingAndTreeAndInteractionData)

        return _convertAddDataToGroup(state,
            _isBuilding,
            loadResourceIdData,
            outputAddBuildingAndTreeAndInteractionData).then((group) => {
                // let [farDistance,
                //     middleDistance,
                //     nearDistance] = getDistance(state)

                state = parseStaticGroup(state, group,
                    [
                        Buildings.getNamePrefix,
                        Buildings.buildCategoryName,
                        Buildings.initialAttributes,
                        Buildings.addStaticLODContainerData,
                        (details, mesh, box) => {
                            let sizeY = box.getSize(_v1).y

                            // if (sizeY <= 6) {
                            if (sizeY <= 12) {
                                return details
                            }
                            // else if (sizeY <= 25) {
                            else if (sizeY <= 40) {
                                return handleDetails(details, mesh, getMiddleDistance)
                            }
                            else {
                                return handleDetails(details, mesh, getFarDistance)
                            }
                        }
                    ],
                    {
                        castShadow: true,
                        receiveShadow: isReceiveShadow,
                        getDistanceFunc: getNearDistance,
                        isPickable: true
                    }
                )

                return addAllBuildingCrackDecals(state, Buildings.getNamePrefix, group, getNearDistance)
            }).then(state => {
                return _convertAddDataToGroup(state, _isTree,
                    loadResourceIdData,
                    outputAddBuildingAndTreeAndInteractionData).then((group) => {
                        // let [farDistance,
                        //     middleDistance,
                        //     nearDistance] = getDistance(state)

                        return parseStaticGroup(state, group,
                            [
                                TreesAndProps.getNamePrefix,
                                TreesAndProps.buildCategoryName,
                                TreesAndProps.initialAttributes,
                                TreesAndProps.addStaticLODContainerData,
                                (details, mesh, box) => {
                                    // return handleDetails(details, mesh, farDistance)
                                    return handleDetails(details, mesh, getMiddleDistance)
                                }
                            ],
                            {
                                castShadow: true,
                                receiveShadow: isReceiveShadow,
                                getDistanceFunc: getNearDistance,
                                isPickable: true
                            }
                        )
                    })
            })
            .then(state => {
                return _addInteraction(state, outputAddBuildingAndTreeAndInteractionData, getChestBoxResourceId(), interactionName.ChestBox,
                    loadResourceIdData
                ).then(state => {
                    return _addInteraction(state, outputAddBuildingAndTreeAndInteractionData, getTradeGirlResourceId(), interactionName.TradeGirl,
                        loadResourceIdData
                    )
                })
                    // .then(state => {
                    //     return _addInteraction(state, outputAddBuildingAndTreeAndInteractionData, getWarGirlResourceId(), interactionName.WarGirl)
                    // })
                    .then(state => {
                        return _addInteraction(state, outputAddBuildingAndTreeAndInteractionData, getFateGirlResourceId(), interactionName.FateGirl,
                            loadResourceIdData
                        )
                    })
                    .then(state => {
                        return ArrayUtils.reducePromise(
                            allMapData,
                            (state, [name, resourceId]) => {
                                return _addInteraction(state, outputAddBuildingAndTreeAndInteractionData, resourceId, name,
                                    loadResourceIdData
                                )
                            }, state
                        )
                    })
            })
            .then(state => {
                let outputAddPropData = addProp(tileData, [
                    _isRoadIntersect,
                    _isRoadLaneHorrizon,
                    _isRoadLaneVertical,
                    _getRandomFunc()
                ],
                )

                // console.log(outputAddPropData)


                return _convertAddPropDataToGroup(state, outputAddPropData).then((group) => {
                    // let [farDistance,
                    //     middleDistance,
                    //     nearDistance] = getDistance(state)

                    group = _changeGroupMaterialToFrontSide(group)

                    return parseStaticGroup(state, group,
                        [
                            TreesAndProps.getNamePrefix,
                            TreesAndProps.buildCategoryName,
                            TreesAndProps.initialAttributes,
                            TreesAndProps.addStaticLODContainerData,
                            // (details, mesh, box) => {
                            //     return handleDetails(details, mesh, farDistance)
                            // }
                        ],
                        {
                            castShadow: true,
                            receiveShadow: isReceiveShadow,
                            getDistanceFunc: getNearDistance,
                            isPickable: true
                        }
                    )
                })
            })
    })
        .then(state => {
            return _addMarks(state, tileData)
        })
        .then(_setMoveableRange)
        .then(state => {
            let { minX, maxX, minZ, maxZ } = getMoveableRange(state, 1)

            return PathFind.initWhenImportScene(state,
                {
                    min: [minX, minZ],
                    max: [maxX, maxZ]
                }
            )
        })
        .then(state => {

            Console.log(getNow(state) - a1)

            return state
        })
}
import { Object3D, Mesh, Material, LOD, Box3 } from "three"
import { Color } from "three"
import { Matrix4, InstancedMesh } from "three"
// import { CullingStatic, InstancedMesh2 } from '@three..ez/instanced-mesh'
import { get, push, range } from "../utils/ArrayUtils"
import { getExn, getWithDefault, isNullable, map } from "../utils/NullableUtils"
import { findObjectByName, findObjects, getCurrentScene, isScene } from "../scene/Scene"
import { instance, instanceIndex, state, instancedMesh2LODId, instancedSourceId, instancedSource } from "../type/StateType"
// import { Map } from "immutable"
import { disableAllPickableLayer, disablePickableLayer, enableAllPickableLayer } from "../Layer"
import { getInstanceState, getIsDebug, setInstanceState } from "../state/State"
import { markAllMeshesNotVisible, markNotNeedsUpdate } from "../utils/Object3DUtils"
import { getCurrentCamera } from "../scene/Camera"
import { CullingDynamic, CullingStatic, InstancedMesh2 } from "./InstancedMesh2"
import { InstanceSourceLOD, getAllLevelMeshes, getUniqueId } from "../lod/InstanceSourceLOD"
import * as InstancedMesh2LOD from "../lod/InstancedMesh2LOD"
import { requireCheck, test } from "../utils/Contract"
import * as MutableMapUtils from "../utils/MutableMapUtils"
import { group } from "../utils/Object3DUtils"
import { Object3DUtils } from "../Main"
import { removeAndDispose } from "../scene/utils/DisposeUtils"
// import { getInstanceState, setInstanceState } from "../state/State"


type invertedStructure = {
    clonedOnes: Array<Object3D>,
    children: Array<invertedStructure>
}

export let invertStructure = (objects: Array<Object3D>): invertedStructure => {
    let _func = (result, objects) => {
        result.clonedOnes = objects

        let childrenCount = objects[0].children.length
        // Console.log(childrenCount)

        result.children = range(0, childrenCount - 1).reduce((childrenResult, i) => {
            let clonedOnes = objects.map(object => {
                return object.children[i]
            })

            childrenResult.push(
                // {
                //     clonedOnes,
                //     children: _func({}, clonedOnes)
                // }
                _func({}, clonedOnes)
            )

            return childrenResult
        }, [])


        return result
    }

    return _func({}, objects)
}

let _reduceInvertedStructure = (result: any, func: (result: any, clonedOnes: Array<Object3D>) => any, invertedStructure: invertedStructure) => {
    result = func(result, invertedStructure.clonedOnes)

    return invertedStructure.children.reduce((result, child) => {
        return _reduceInvertedStructure(result, func, child)
    }, result)
}

let _getNamePostfix = () => "_meta3d_instancedMesh"

let _addNamePostfix = (name) => {
    return `${name}${_getNamePostfix()}`
}

export let getInstanceIdPostfix = (id: string) => `_meta3d_instanceId_${id}`

export let addInstanceIdPostfix = (name, id: string) => {
    return `${name}${getInstanceIdPostfix(id)}`
}

export let addInstanceIdPostfixToObject = (object: Object3D, id: string) => {
    object.traverse(object => {
        object.name = addInstanceIdPostfix(object.name, id)
    })

    return object
}

let _getInstanceIdPostfixRegex = () => {
    return /_meta3d_instanceId_(\d+_\d+)/g
}

export let restoreName = (name) => {
    return name.replace(_getNamePostfix(), "").replace(_getInstanceIdPostfixRegex(), "")
}

export let getDefaultInstanceColor = () => new Color(1, 1, 1)

// let _updateMatrix = (mesh: InstancedMesh, index: number, matrixWorld: Matrix4) => {
//     mesh.setMatrixAt(index, matrixWorld)
// }

// let _addAllInstanceMeshLODs = (state: state, scene, invertedStructure: invertedStructure): [state, Object3D] => {
//     let color = getDefaultInstanceColor()

//     return _reduceInvertedStructure([state, scene], ([state, scene], clonedOnes: Array<InstanceSourceLOD>) => {
//         let clonedOne = clonedOnes[0]

//         if (!(clonedOne.levels[0].object as Mesh).isMesh) {
//             return [state, scene]
//         }

//         // let { geometry, material } = clonedOne

//         // let mesh = new InstancedMesh2(geometry, material as Material, clonedOnes.length, {
//         //     behaviour: CullingStatic,
//         //     onInstanceCreation: (obj, index) => {
//         //         obj.setMatrixWorld(clonedOnes[index].matrixWorld)

//         //         obj.setColor(color)
//         //     }
//         // })

//         // let mesh = new InstancedMesh2(clonedOne.levels, clonedOnes.length, {
//         //     behaviour: CullingStatic,
//         //     onInstanceCreation: (obj, index) => {
//         //         obj.setMatrixWorld(clonedOnes[index].matrixWorld)

//         //         obj.setColor(color)
//         //     }
//         // })

//         let data = InstancedMesh2LOD.create(state, clonedOne.levels, clonedOnes.length, {
//             behaviour: CullingStatic,
//             onInstanceCreation: (obj, index) => {
//                 obj.setMatrixWorld(clonedOnes[index].matrixWorld)

//                 obj.setColor(color)
//             }
//         })
//         state = data[0]
//         let mesh = data[1]



//         mesh = InstancedMesh2LOD.setName(mesh, _addNamePostfix(clonedOne.name))
//         mesh = InstancedMesh2LOD.setShadow(mesh, state, clonedOne.castShadow, clonedOne.receiveShadow)

//         // disableAllVisibleLayer(mesh)
//         // disableAllPickableLayer(mesh)
//         mesh = InstancedMesh2LOD.setLayer(mesh, state, disablePickableLayer)

//         // scene.add(mesh)
//         scene = InstancedMesh2LOD.addToScene(scene, state, mesh)

//         let [indexMap, instancedMesh2OneMap] = clonedOnes.reduce(([indexMap, instancedMesh2OneMap], clonedOne, i) => {
//             // _updateMatrix(mesh, i, clonedOne.matrixWorld)
//             // // mesh.setColorAt(i, getColorFunc(clonedOne))
//             // mesh.setColorAt(i, color)


//             return [
//                 indexMap.MutableMapUtils.set(clonedOne.id, i),
//                 instancedMesh2OneMap.MutableMapUtils.set(clonedOne.id, mesh)
//             ]
//         }, [Map<instancedMesh2LODId, instanceIndex>(), Map<instancedMesh2LODId, InstancedMesh2LOD.InstancedMesh2LOD>()])

//         state = setInstanceState(state, {
//             ...getInstanceState(state),
//             indexMap: indexMap,
//             instancedMesh2OneMap: instancedMesh2OneMap as any,
//             sourcesMap: getInstanceState(state).sourcesMap.MutableMapUtils.set(mesh.id, clonedOnes)
//         })

//         // state = InstancedMesh2LOD.build(state, mesh)

//         return [state, scene]
//     }, invertedStructure)
// }

let _addInstanceMeshLODs = (state, allInstanceSourceLODs, scene) => {
    if (allInstanceSourceLODs.length == 0) {
        return state
    }

    let color = getDefaultInstanceColor()

    let clonedOne = allInstanceSourceLODs[0]

    // if (!clonedOne.levels[0].object.isMesh) {
    //     return [state, scene]
    // }

    let data = InstancedMesh2LOD.create(state, clonedOne.levels, allInstanceSourceLODs.length, {
        behaviour: CullingDynamic,
        onInstanceCreation: (obj, index) => {
            obj.setMatrixWorld(allInstanceSourceLODs[index].matrixWorld)

            obj.setColor(color)
        }
    })
    state = data[0]
    let mesh = data[1]



    mesh = InstancedMesh2LOD.setName(mesh, _addNamePostfix(clonedOne.name))
    // mesh = InstancedMesh2LOD.setShadow(mesh, state, clonedOne.castShadow, clonedOne.receiveShadow)

    // disableAllVisibleLayer(mesh)
    // disableAllPickableLayer(mesh)
    mesh = InstancedMesh2LOD.setLayer(mesh, state, disablePickableLayer)

    // scene.add(mesh)
    scene = InstancedMesh2LOD.addToScene(scene, state, mesh)

    let [indexMap, instancedMesh2OneMap] = allInstanceSourceLODs.reduce(([indexMap, instancedMesh2OneMap], clonedOne, i) => {
        return [
            MutableMapUtils.set(indexMap, clonedOne.id, i),
            MutableMapUtils.set(instancedMesh2OneMap, clonedOne.id, mesh),
        ]
    }, [getInstanceState(state).indexMap, getInstanceState(state).instancedMesh2OneMap])

    state = setInstanceState(state, {
        ...getInstanceState(state),
        indexMap: indexMap,
        instancedMesh2OneMap: instancedMesh2OneMap as any,
        sourcesMap:
            MutableMapUtils.set(
                getInstanceState(state).sourcesMap,
                mesh.id,
                allInstanceSourceLODs
            )
    })

    // state = InstancedMesh2LOD.build(state, mesh)

    return state
}

let _addAllInstanceMeshLODs = (state: state, scene, allInstanceSourceLODs: Array<InstanceSourceLOD>): [state, Object3D] => {
    let isDebug = getIsDebug(state)

    let allInstanceSourceLODGroup = group(allInstanceSourceLODs, (sourceLOD) => {
        return getUniqueId(sourceLOD, isDebug)
    })


    for (let id in allInstanceSourceLODGroup) {
        if (allInstanceSourceLODGroup.hasOwnProperty(id)) {
            state = _addInstanceMeshLODs(state, allInstanceSourceLODGroup[id], scene)
        }
    }


    return [state, scene]
}

let _updateBoundingBox = (state: state, instanceSource: InstanceSourceLOD | Object3D, boundingBox: Box3) => {
    return setInstanceState(state, {
        ...getInstanceState(state),
        sourceWorldBoundingBoxMap:
            MutableMapUtils.set(
                getInstanceState(state).sourceWorldBoundingBoxMap,
                instanceSource.id,
                boundingBox.clone().applyMatrix4(instanceSource.matrixWorld)
            )
    })
}

export let getWorldBoundingBox = (state: state, instanceSource: InstanceSourceLOD | Object3D) => {
    return getExn(
        MutableMapUtils.get(
            getInstanceState(state).sourceWorldBoundingBoxMap,
            instanceSource.id
        )
    )
}

let _updateBoundingBoxForLOD = (state: state, instanceSource: InstanceSourceLOD) => {
    return _updateBoundingBox(state, instanceSource, instanceSource.getBoundingBox())
}

let _updateBoundingBoxForObject3D = (state: state, instanceSource: Object3D) => {
    let newState = state

    instanceSource.traverse(obj => {
        if ((obj as Mesh).isMesh) {
            if ((obj as Mesh).geometry.boundingBox == null) {
                (obj as Mesh).geometry.computeBoundingBox()
            }

            newState = _updateBoundingBox(newState, obj, (obj as Mesh).geometry.boundingBox)
        }
    })

    return newState
}

let _markIsInstanceSource = (state: state, instanceSource: InstanceSourceLOD | Object3D) => {
    return setInstanceState(state, {
        ...getInstanceState(state),
        isInstancedSourceMap:
            MutableMapUtils.set(
                getInstanceState(state).isInstancedSourceMap,
                instanceSource.id, true
            )
    })
}

export let isInstanceSource = (state: state, instanceSource: instancedSource) => {
    return getWithDefault(
        MutableMapUtils.get(
            getInstanceState(state).isInstancedSourceMap,
            instanceSource.id
        )
        , false)
}

let _initSourceMatrix = <T extends instancedSource>(instanceSource: T) => {
    instanceSource.traverse(object => {
        object.matrixAutoUpdate = false
        object.matrixWorldAutoUpdate = false
    })

    return instanceSource
}

export let convertLODToInstanceMeshLOD = (state: state, scene, allInstanceSourceLODs: Array<InstanceSourceLOD>): [state, Object3D] => {
    requireCheck(() => {
        test("should be InstanceSourceLOD", () => {
            return allInstanceSourceLODs.filter(allInstanceSourceLOD => allInstanceSourceLOD.type != "InstanceSourceLOD").length == 0
        })
    }, getIsDebug(state))

    let isDebug = getIsDebug(state)

    state = allInstanceSourceLODs.reduce((state, instanceSourceLOD) => {
        // instanceSourceLOD.updateWorldMatrix2(true, false)
        instanceSourceLOD.updateWorldMatrix2(true, true, isDebug)
        state = _updateBoundingBoxForLOD(state, instanceSourceLOD)
        state = _markIsInstanceSource(state, instanceSourceLOD)

        instanceSourceLOD = _initSourceMatrix<InstanceSourceLOD>(instanceSourceLOD)

        markAllMeshesNotVisible(instanceSourceLOD)
        enableAllPickableLayer(instanceSourceLOD)

        return state
    }, state)

    // return _addAllInstanceMeshLODs(state, scene, invertStructure(allInstanceSourceLODs))
    return _addAllInstanceMeshLODs(state, scene, allInstanceSourceLODs)
}

let _addInstanceMeshes = (state: state, scene, invertedStructure: invertedStructure): [state, Array<InstancedMesh2>, Object3D] => {
    let color = getDefaultInstanceColor()

    return _reduceInvertedStructure([state, [], scene], ([state, instancedMeshes, scene], clonedOnes: Array<Object3D>) => {
        let clonedOne = clonedOnes[0]

        if (!(clonedOne as Mesh).isMesh) {
            return [state, instancedMeshes, scene]
        }

        let { geometry, material } = clonedOne as Mesh

        let mesh = new InstancedMesh2(geometry, material as Material, clonedOnes.length, {
            behaviour: CullingDynamic,
            onInstanceCreation: (obj, index) => {
                obj.setMatrixWorld(clonedOnes[index].matrixWorld)

                obj.setColor(color)
            }
        })


        mesh.name = _addNamePostfix(clonedOne.name)

        mesh.castShadow = clonedOne.castShadow
        mesh.receiveShadow = clonedOne.receiveShadow

        Object3DUtils.markNotNeedsUpdate(mesh)

        disablePickableLayer(mesh.layers)

        mesh.addToScene(scene)

        let [indexMap, instancedMesh2OneMap] = clonedOnes.reduce(([indexMap, instancedMesh2OneMap], clonedOne, i) => {
            return [
                MutableMapUtils.set(
                    indexMap,
                    clonedOne.id, i
                ),
                MutableMapUtils.set(
                    instancedMesh2OneMap,
                    clonedOne.id, mesh
                )
            ]
            // }, [Map<instancedSourceId, instanceIndex>(), Map<instancedSourceId, InstancedMesh2>()])
        }, [getInstanceState(state).indexMap, getInstanceState(state).instancedMesh2OneMap])

        state = setInstanceState(state, {
            ...getInstanceState(state),
            indexMap: indexMap,
            instancedMesh2OneMap: instancedMesh2OneMap as any,
            sourcesMap:
                MutableMapUtils.set(
                    getInstanceState(state).sourcesMap,
                    mesh.id, clonedOnes as Array<Mesh>
                )
        })

        // state = InstancedMesh2LOD.build(state, mesh)

        return [state, push(instancedMeshes, mesh), scene]
    }, invertedStructure)
}

export let convertNotLODToInstanceMesh = (state: state, scene, allInstanceSources: Array<Object3D>): [state, Array<InstancedMesh2>, Object3D] => {
    requireCheck(() => {
        test("shouldn't be InstanceSourceLOD", () => {
            return allInstanceSources.filter(allInstanceSource => allInstanceSource.type == "InstanceSourceLOD").length == 0
        })
    }, getIsDebug(state))

    if (allInstanceSources.length == 0) {
        return [state, [], scene]
    }

    state = allInstanceSources.reduce((state, instanceSource) => {
        instanceSource.updateWorldMatrix(true, true)
        state = _updateBoundingBoxForObject3D(state, instanceSource)
        state = _markIsInstanceSource(state, instanceSource)

        instanceSource = _initSourceMatrix<Object3D>(instanceSource)

        markAllMeshesNotVisible(instanceSource)
        enableAllPickableLayer(instanceSource)

        return state
    }, state)

    return _addInstanceMeshes(state, scene, invertStructure(allInstanceSources))
}


export let isInstancedMesh = (name) => {
    return name.includes(_getNamePostfix())
}

export let isInstanceSourceObject = (id: number, state: state) => {
    // return _getInstanceIdPostfixRegex().test(name)

    let { instancedMesh2OneMap } = getInstanceState(state)

    return MutableMapUtils.has(instancedMesh2OneMap, id)
}

export let getInstanceId = (name) => {
    return [...name.matchAll(_getInstanceIdPostfixRegex())][0][1]
}

// let _findSourceMesh = (scene, instancedMeshName, id): nullable<Mesh> => {
//     let sourceName = addInstanceIdPostfix(restoreName(instancedMeshName), id)

//     return ensureCheck(
//         findObjectByName<Mesh>(scene, sourceName), (sourceLOD) => {
//             test("should be Mesh", () => {
//                 return getWithDefault(
//                     map(sourceLOD => sourceLOD.isMesh, sourceLOD),
//                     true
//                 )
//             })
//         }, true)
// }

let _isNotLODSourceMatrixWorldNeedsUpdate = (source, state) => {
    if (source.matrixWorldNeedsUpdate) {
        return true
    }

    if (isInstanceSource(state, source)) {
        return source.matrixWorldNeedsUpdate
    }

    if (!isNullable(source.parent) && !isScene(source.parent)) {
        return _isNotLODSourceMatrixWorldNeedsUpdate(getExn(source.parent), state)
    }

    throw new Error("err")
}


let _isLODSourceMatrixWorldNeedsUpdate = (source: InstanceSourceLOD) => {
    return source.matrixWorldNeedsUpdate
}

export let markNeedUpdateColor = (state: state, id: number, color: Color) => {
    return setInstanceState(state, {
        ...getInstanceState(state),
        needUpdateColorMap: MutableMapUtils.set(getInstanceState(state).needUpdateColorMap, id, color)
    })
}

// let _findSource = (object, state: state) => {
//     if (isInstanceSource(state, object)) {
//         return object
//     }

//     if (!isNullable(object.parent) && !isScene(object.parent)) {
//         return _findSource(getExn(object.parent), state)
//     }

//     throw new Error("err")
// }

export let findAllSources = <T extends instancedSource>(state: state, id) => {
    return (getExn(
        MutableMapUtils.get(
            getInstanceState(state).sourcesMap,
            id
        )
    ) as Array<T>)
    // .map(source => {
    //     return _findSource(source, state)
    // })
}

// export let findSource = (state: state, id: number, index: number) => {
//     return findAllSources(state, id)[index]
// }

// export let init = (state: state) => {
//     let scene = getCurrentScene(state)

//     findObjects(scene, ({ name }) => isInstancedMesh(name))
//         .forEach((instancedMesh: InstancedMesh2) => {
//             instancedMesh.build(state)
//         })

//         return state
// }


export let getIndex = (state: state, sourceObject: Object3D) => {
    return getExn(
        MutableMapUtils.get(
            getInstanceState(state).indexMap,
            sourceObject.id
        )
    )
}

let _markLODSourceMatrixNotUpdate = (source: InstanceSourceLOD, isDebug) => {
    source = markNotNeedsUpdate(source)

    // getAllLevelMeshes(source, isDebug).forEach(levelMeshes => {
    //     levelMeshes.forEach(mesh => {
    //         markNotNeedsUpdate(mesh)
    //     })
    // })

    return source
}

let _markNotLODSourceMatrixNotUpdate = (source: Object3D | Mesh, state) => {
    source = markNotNeedsUpdate(source)

    if (isInstanceSource(state, source)) {
        return source
    }

    if (!isNullable(source.parent) && !isScene(source.parent)) {
        return _markNotLODSourceMatrixNotUpdate(getExn(source.parent), state)
    }

    throw new Error("err")
}

export let updateAllInstances = (state: state) => {
    let scene = getCurrentScene(state)
    let needUpdateColorMap = getInstanceState(state).needUpdateColorMap
    let camera = getCurrentCamera(state)

    let instanceMeshes = findObjects(scene, ({ name }) => isInstancedMesh(name))

    let isDebug = getIsDebug(state)

    state = instanceMeshes.filter(instancedMesh2LOD => {
        return instancedMesh2LOD.isInstancedMesh2LOD
    }).reduce((state, instancedMesh2LOD: InstancedMesh2LOD.InstancedMesh2LOD) => {
        state = findAllSources<InstanceSourceLOD>(state, instancedMesh2LOD.id).reduce((state, sourceLOD) => {
            if (_isLODSourceMatrixWorldNeedsUpdate(sourceLOD)) {
                // sourceLOD.updateWorldMatrix2(true, true)
                sourceLOD.updateWorldMatrix2(true, true, isDebug)


                state = _updateBoundingBoxForLOD(state, sourceLOD)

                let index = getIndex(state, sourceLOD)

                InstancedMesh2LOD.setMatrixWorld(state, instancedMesh2LOD, index, sourceLOD)

                sourceLOD = _markLODSourceMatrixNotUpdate(sourceLOD, isDebug)
            }

            if (MutableMapUtils.has(needUpdateColorMap, sourceLOD.id)
            ) {
                let index = getIndex(state, sourceLOD)

                InstancedMesh2LOD.setColor(state, instancedMesh2LOD, index, getExn(
                    MutableMapUtils.get(
                        needUpdateColorMap,
                        sourceLOD.id
                    )
                ))
            }

            return state
        }, state)

        InstancedMesh2LOD.updateCulling(state, instancedMesh2LOD, camera)

        return state
    }, state)


    state = instanceMeshes.filter(instancedMesh2 => {
        return instancedMesh2.isInstancedMesh2
    }).reduce((state, instancedMesh2: InstancedMesh2) => {
        state = findAllSources<Object3D>(state, instancedMesh2.id).reduce((state, source) => {
            if (_isNotLODSourceMatrixWorldNeedsUpdate(source, state)) {
                // source.updateWorldMatrix(true, false)
                source.updateWorldMatrix(true, true)
                state = _updateBoundingBoxForObject3D(state, source)

                let index = getIndex(state, source)

                instancedMesh2.setMatrixWorld(index, source.matrixWorld)

                source = _markNotLODSourceMatrixNotUpdate(source, state)
            }

            if (MutableMapUtils.has(needUpdateColorMap, source.id)) {
                let index = getIndex(state, source)

                instancedMesh2.setColor(index, getExn(
                    MutableMapUtils.get(
                        needUpdateColorMap,
                        source.id
                    )
                ))
            }

            return state
        }, state)

        instancedMesh2.updateCulling(state, camera)

        return state
    }, state)

    state = setInstanceState(state, {
        ...getInstanceState(state),
        needUpdateColorMap: MutableMapUtils.create()
    })

    return state
}

export let createState = (): instance => {
    return {
        isInstancedSourceMap: MutableMapUtils.create(),
        indexMap: MutableMapUtils.create(),
        instancedMesh2OneMap: MutableMapUtils.create(),
        sourcesMap: MutableMapUtils.create(),
        sourceWorldBoundingBoxMap: MutableMapUtils.create(),
        // sourceOriginScaleMap: MutableMapUtils.create(),
        needUpdateColorMap: MutableMapUtils.create(),
        visibleMap: MutableMapUtils.create()
    }
}

// export let findInstance = (sourceLODId, state: state) => {
//     let { indexMap, instancedMesh2OneMap } = getInstanceState(state)

//     if (!isInstanceSourceObject(sourceLODId, state)) {
//         return null
//     }

//     return getExn(instancedMesh2OneMap.get(sourceLODId)).instances[getExn(indexMap.get(sourceLODId))]
// }

// export let setVisible = (state: state, sourceObject: Object3D, visible): [state, Object3D] => {
//     if (!visible) {
//         state = setInstanceState(state, {
//             ...getInstanceState(state),
//             sourceOriginScaleMap: getInstanceState(state).sourceOriginScaleMap.MutableMapUtils.set(sourceObject.name, sourceObject.scale.clone())
//         })

//         sourceObject.scale.MutableMapUtils.set(0, 0, 0)
//         sourceObject.matrixWorldNeedsUpdate = true
//     }
//     else {
//         state = getWithDefault(
//             map(sourceOriginScale => {
//                 sourceObject.scale.copy(sourceOriginScale)
//                 sourceObject.matrixWorldNeedsUpdate = true

//                 // return setInstanceState(state, {
//                 //     ...getInstanceState(state),
//                 //     sourceOriginScaleMap: getInstanceState(state).sourceOriginScaleMap.remove(sourceObject.name)
//                 // })

//                 return state
//             }, getInstanceState(state).sourceOriginScaleMap.get(sourceObject.name)),
//             state
//         )
//     }

//     return [state, sourceObject]
// }

// export let setVisible = (state: state, sourceObject: Object3D, visible): [state, Object3D] => {
export let setVisible = (state: state, sourceObject: Object3D, visible): state => {
    let newState = state
    sourceObject.traverse(obj => {

        newState = setInstanceState(newState, {
            ...getInstanceState(newState),
            visibleMap: MutableMapUtils.set(getInstanceState(newState).visibleMap, obj.id, visible)
        })
    })
    // if (!visible) {
    //     state = setInstanceState(state, {
    //         ...getInstanceState(state),
    //         visibleMap: getInstanceState(state).visibleMap.MutableMapUtils.set(sourceObject.id, visible)
    //     })
    // }
    // else {
    //     state = setInstanceState(state, {
    //         ...getInstanceState(state),
    //         visibleMap: getInstanceState(state).visibleMap.MutableMapUtils.set(sourceObject.id, false)
    //     })
    // }

    // return [state, sourceObject]
    return newState
}

export let isVisible = (state: state, sourceObject: Object3D) => {
    return getWithDefault(
        MutableMapUtils.get(
            getInstanceState(state).visibleMap,
            sourceObject.id
        )
        ,
        true
    )
}

let _removeInstanceSource = (state: state, source: instancedSource, scene) => {
    let sourceId = source.id

    // scene.remove(source)
    removeAndDispose(scene, source)


    MutableMapUtils.remove(getInstanceState(state).isInstancedSourceMap, sourceId)
    MutableMapUtils.remove(getInstanceState(state).sourceWorldBoundingBoxMap, sourceId)
    MutableMapUtils.remove(getInstanceState(state).indexMap, sourceId)
    MutableMapUtils.remove(getInstanceState(state).instancedMesh2OneMap, sourceId)
    MutableMapUtils.remove(getInstanceState(state).needUpdateColorMap, sourceId)
    MutableMapUtils.remove(getInstanceState(state).visibleMap, sourceId)

    return state
}

export let removeInstanceSource = (state: state, source: instancedSource, scene) => {
    // let sourceId = source.id

    // let instancedId = MutableMapUtils.get(getInstanceState(state).instancedMesh2OneMap, sourceId).id

    // MutableMapUtils.set(getInstanceState(state).sourcesMap, instancedId, MutableMapUtils.get(getInstanceState(state).sourcesMap, instancedId).filter(s => s.id != sourceId))

    // state = _removeInstanceSource(state, source, scene)


    // scene.remove(source)
    removeAndDispose(scene, source)

    state = setVisible(state, source, false)

    markNotNeedsUpdate(source)

    return state
}

export let removeInstanceMesh2 = (state: state, instancedMesh2: InstancedMesh2, scene) => {
    let id = instancedMesh2.id

    // scene.remove(instancedMesh2)
    removeAndDispose(scene, instancedMesh2)

    let sources = findAllSources(state, instancedMesh2.id)

    MutableMapUtils.remove(getInstanceState(state).sourcesMap, id)

    return sources.reduce((state, source) => {
        return _removeInstanceSource(state, source, scene)
    }, state)
}

export let dispose = (state: state) => {
    return setInstanceState(state, createState())
}
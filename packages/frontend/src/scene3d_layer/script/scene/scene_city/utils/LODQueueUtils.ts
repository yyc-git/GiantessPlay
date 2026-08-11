import { state } from "../../../../type/StateType"
import { Camera } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { AmbientLight } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { LODQueue as LODQueueType } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { getScene } from "../CityScene"
import { DoubleSide } from "three"
import { changeToPhongMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"

export let buildQueue = (state: state, fixMaterialFunc, getDistanceFunc: (state: state) => number, mesh, {
    castShadow,
    receiveShadow,
}): [state, LODQueueType] => {
    let camera = Camera.getCurrentCamera(getAbstractState(state))

    let group_ = NewThreeInstance.createGroup()


    mesh = Object3DUtils.changeTransformToDefault(mesh)
    // mesh.material = AmbientLight.makeMaterialToAceeptAmbientLight(mesh.material)
    mesh = changeToPhongMaterial(mesh)
    mesh.material = fixMaterialFunc(mesh.material)


    group_.add(mesh)


    group_.matrixAutoUpdate = false


    group_.castShadow = castShadow
    group_.receiveShadow = receiveShadow

    let details = [
        {
            group: group_,
            level: "l0",
            getDistanceFunc,
        },
    ]


    let queue = new LODQueue.LODQueue()

    queue.name = "lodQueue"

    queue.details = details

    let box = queue.computeBox()
    queue.originBox = box

    let scene = getScene(state)

    let instancedlod = new InstancedLOD2.InstancedLOD2(scene, camera)

    instancedlod.setContainer(queue);
    instancedlod.setLevels(details, getIsDebug(state));
    state = setAbstractState(state, instancedlod.setPopulation(getAbstractState(state)));



    state = setAbstractState(state, InstancedLOD2.add(getAbstractState(state), instancedlod))

    return [state, queue]
}
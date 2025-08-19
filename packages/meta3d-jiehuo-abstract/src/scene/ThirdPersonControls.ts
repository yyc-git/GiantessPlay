import { Vector3, Object3D, Euler, Ray, PerspectiveCamera } from "three"
import { road, renderAccuracyLevel, state } from "../type/StateType"
import { Map, isCollection } from "immutable"
import { getEmpty, getExn, getWithDefault, isNullable, map, return_ } from "../utils/NullableUtils"
import { getIsDebug, getPickState, getSceneState, setSceneState } from "../state/State"
import { getKeyDownEventName, getKeyUpEventName, on, off } from "../Event"
import { getCurrentCamera, getOrbitControls, isCanLock } from "./Camera"
import { isMobile } from "../Device"
import * as nipplejs from 'nipplejs'
import { getRoad, getCurrentScene, isRoad, isGiantessRoad, isLittleRoad } from "./Scene"
import { findTerrainGeometry } from "../terrain/Terrain"
import { computeAfterAddVelocity, handleCameraCollision } from "../collision/CameraCollision"
import { getWeight } from "../animation/SkinBlendAnimation"
import { getFrameIndex } from "../animation/SkinAnimation"
import { between } from "../utils/NumberUtils"
import type { OrbitControls } from "../three/OrbitControls"
import { getRenderSetting } from "../setting/RenderSetting"
import { addDeferExecFuncData } from "../Flow"
import { NullableUtils, NumberUtils } from "../Main"
import { nullable } from "../utils/nullable"
import { getDirectionDataFromKeyState, getDirectionDataFromState, getKeyState, getState, setKeyState as setKeyStateUtils, setState } from "./utils/CameraControlsUtils"
import * as LittleManThirdPersonControls from "./little_man/ThirdPersonControls"
import * as GiantessThirdPersonControls from "./giantess/ThirdPersonControls"
import { ensureCheck, test } from "../utils/Contract"
import { initKeyState } from "./CameraControls"


// let getSize = () => "3rem"

// let _createAndInsertZoneDom = () => {
//     let div = document.createElement("div")
//     div.id = "meta3d_joystick_zone"
//     // div.style.width = getSize()
//     // div.style.height = getSize()
//     div.style.width = `${getSize()}px`
//     div.style.height = `${getSize()}px`
//     div.style.position = "absolute"
//     div.style.top = "30%"
//     div.style.left = "5%"
//     div.style.zIndex = "2"

//     // document.body.appendChild(div)
//     document.body.append(div)
// }

// let _removeZoneDom = () => {
//     document.querySelector("#meta3d_joystick_zone")?.remove()
// }


// let _keydownHandler = (specficState, { userData }) => {
//     let event = getExn(userData)

//     switch (event.code) {
//         case "AltLeft":
//             getOrbitControls(getabs).lock()
//             break
//     }


//     let state = getAbstractStateFunc(specficState)

//     if (_isAllowCode(getKeyState(state), event.code)) {
//         state = _resetKey(state)

//         state = setKeyStateUtils(state, getKeyState(state).set(event.code, true))
//     }

//     specficState = setAbstractStateFunc(specficState, state)

//     return Promise.resolve(specficState)
// }

// export let initWhenUse = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {


let _setTarget = (orbitControls: OrbitControls, target: Vector3) => {
    orbitControls.target = target
}

export let updateControls = (state: state, [near, far], isCameraCollision, orbitControls: OrbitControls, camera, orbitControlsTarget, position, minDistance, maxDistance) => {
    camera.near = near
    camera.far = far

    camera.position.copy(position)

    _setTarget(orbitControls, orbitControlsTarget)

    orbitControls.maxDistance = maxDistance

    if (!getIsDebug(state) && isCameraCollision) {
        if (isNullable(getState(state).distanceBeforeCameraCollision) || getExn(getState(state).distanceBeforeCameraCollision) < minDistance) {
            state = setState(state, {
                ...getState(state),
                distanceBeforeCameraCollision: return_(minDistance)
            })
        }
    }


    return state
}

export let initControls = (state: state, [near, far]: [number, number], isCameraCollision, orbitControls: OrbitControls, camera: PerspectiveCamera, orbitControlsTarget, position, minDistance, maxDistance, maxPolarAngle: number, isDebug) => {
    camera.fov = 60

    updateControls(state,
        [near, far],
        isCameraCollision,
        orbitControls, camera, orbitControlsTarget, position, minDistance, maxDistance)

    _setTarget(orbitControls, orbitControlsTarget)

    orbitControls.maxDistance = maxDistance



    orbitControls.object = camera

    orbitControls.minDistance = 1

    orbitControls.maxPolarAngle = maxPolarAngle


    // orbitControls.enableZoom = false
    orbitControls.enableZoom = true
    orbitControls.enablePan = false


    if (isMobile()) {
        orbitControls.enableZoom = false
        // orbitControls.enablePan = false

        orbitControls.rotateSpeed = 0.5
    }
    else {
        state = initKeyState(state)
    }

    return state
}

// let _handleCameraCollision = (state: state, targetWorldPosition: Vector3, cameraCurrentWorldPosition: Vector3, velocity: Vector3) => {
//     // let { raycaster } = getPickState(state)

//     let targetToCameraDirection = cameraCurrentWorldPosition.clone().sub(targetWorldPosition).normalize()

//     // raycaster.set(targetWorldPosition, targetToCameraDirection)

//     let ray = new Ray(targetWorldPosition, targetToCameraDirection)


//     let scene = getCurrentScene(state)

//     getCameraCollisionableOctrees(state).reduce((isCollision, octree) =>{
//         if(isCollision){
//             return isCollision
//         }

//         return octree.queryByRay(ray)
//     }, false)

//     let intersects = raycaster.intersectObject(scene, true)

//     let cameraToTargetDistance = cameraCurrentWorldPosition.clone().distanceTo(targetWorldPosition)

//     let minDistance = getState(state).distance
//     // let currentDistance = getOrbitControls(state).getDistance()
//     let currentDistance = cameraToTargetDistance

//     if (currentDistance < minDistance
//         && (
//             intersects.length == 0
//             // || intersects[0].distance >= minDistance
//             || intersects[0].distance > currentDistance
//         )
//     ) {
//         // let currentDistance = getOrbitControls(state).getDistance()
//         // let minDistance = getState(state).distance

//         // return targetToCameraDirection.clone().multiplyScalar(minDistance - currentDistance)

//         let speed
//         if (intersects.length == 0 || intersects[0].distance > minDistance) {
//             speed = minDistance / currentDistance
//         }
//         else {
//             speed = intersects[0].distance / currentDistance

//             if(intersects[0].distance + speed > currentDistance){
//                 speed = 0
//             }
//         }


//         return targetToCameraDirection.clone().multiplyScalar(speed)
//     }

//     if (intersects.length == 0 || intersects[0].distance >= cameraToTargetDistance) {
//         return velocity
//     }

//     let cameraToTargetDirection = targetWorldPosition.clone().sub(cameraCurrentWorldPosition).normalize()
//     let speed = cameraToTargetDistance / intersects[0].distance

//     return velocity.add(cameraToTargetDirection.multiplyScalar(speed))
// }

// let _handleCameraCollision = (state: state,
//     cameraCurrentWorldPosition: Vector3, velocity: Vector3
// ) => {
//     let scene = getCurrentScene(state)

//     let terrainGeometry = getExn(findTerrainGeometry(scene))

//     let height = terrainGeometry.getHeightAtCoordinates(cameraCurrentWorldPosition.x, cameraCurrentWorldPosition.z)

//     const heightScale = 1.05

//     if ((cameraCurrentWorldPosition.y + velocity.y) <= height) {
//         return velocity.setY(height * heightScale - cameraCurrentWorldPosition.y)
//     }

//     return velocity
// }

export let updateCamera = (state: state, velocity: Vector3, orbitControlsTarget: Vector3, isCameraCollision) => {
    _setTarget(getOrbitControls(state), orbitControlsTarget)

    let camera = getCurrentCamera(state)

    // state = updateControls(state,
    //     getOrbitControls(state), camera, orbitControlsTarget, position, minDistance, maxDistance)


    // velocity = _handleCameraCollision(state, orbitControlsTarget, getCurrentCamera(state).getWorldPosition(new Vector3()), velocity)

    let distanceBeforeCameraCollision
    if (!getIsDebug(state) && isCameraCollision) {
        // if (true) {
        let data = handleCameraCollision(state, getState(state).distanceBeforeCameraCollision,
            orbitControlsTarget, camera.getWorldPosition(new Vector3()), velocity)
        velocity = data[0]
        distanceBeforeCameraCollision = data[1]
    }

    getCurrentCamera(state).position.add(velocity)

    if (!getIsDebug(state) && isCameraCollision) {
        distanceBeforeCameraCollision = computeAfterAddVelocity(distanceBeforeCameraCollision, orbitControlsTarget, camera.getWorldPosition(new Vector3()))

        state = setState(state, {
            ...getState(state),
            distanceBeforeCameraCollision
        })
    }


    getCurrentCamera(state).updateMatrixWorld(true)

    return state
}

export let computeTransformForCamera = (state: state, orbitControls, road_: road): number => {
    let controlRotationAngle
    if (isRoad(state, road_)) {
        controlRotationAngle = orbitControls.getAzimuthalAngle()
    }
    else {
        controlRotationAngle = 0
    }
    return controlRotationAngle
}

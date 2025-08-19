import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getGirlScale, getState, setState } from "./CityScene"
import { Object3D, PerspectiveCamera, Vector3 } from "three"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { camera, littleManCamera, littleManThirdPersonCameraTarget, objectStateName } from "./type/StateType"
import { getRenderSetting } from "meta3d-jiehuo-abstract/src/setting/RenderSetting"
import { renderAccuracyLevel } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import * as LittleMan from "./little_man/LittleMan"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { getFarFactorByScale } from "./utils/CameraUtils"
import { markAllMeshesNotVisible } from "meta3d-jiehuo-abstract/src/utils/Object3DUtils"
import * as FirstPersonControls from "./FirstPersonControls"
import { getWorldPosition } from "./little_man/Transform"
import { getCameraFar, getCameraNear, getMaxDistance, getMinDistance, isCameraCollision, updateThirdPersonControlsByCameraData } from "./utils/LittleManCameraUtils"

const _v1 = new Vector3();

export let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).littleManCamera)
}

export let _setState = (state: state, cameraState: littleManCamera) => {
    return setState(state, {
        ...getState(state),
        littleManCamera: NullableUtils.return_(cameraState)
    })
}

export let getThirdPersonCameraTarget = (state: state) => {
    return _getState(state).thirdPersonCameraTarget
}

export let setThirdPersonCameraTarget = (state: state, thirdPersonCameraTarget_: littleManThirdPersonCameraTarget) => {
    (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera).near = _buildCameraNear(thirdPersonCameraTarget_)

    return _setState(state, {
        ..._getState(state),
        thirdPersonCameraTarget: thirdPersonCameraTarget_
    })
}

let _getThirdPersonControlOrbitControlsTarget = (state: state): Vector3 => {
    let center = LittleMan.getBoxCenter(state)

    switch (getThirdPersonCameraTarget(state)) {
        case littleManThirdPersonCameraTarget.Body:
            return center.setY(center.y + LittleMan.getBoxSizeForCompute(state) * 4)
        default:
            throw new Error("err")
    }
}

export let getOrbitControlsTarget = (state: state): Vector3 => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            return _getThirdPersonControlOrbitControlsTarget(state)
        case cameraType.FirstPerson:
            return FirstPersonControls.getOrbitControlsTarget(state, _getState(state).targetDirection)
            break
        default:
            throw new Error("err")
    }
}

let _getCameraInitialPosition = (state) => {
    let targetDirection = _getState(state).targetDirection

    if (NullableUtils.isNullable(targetDirection)) {
        return LittleMan.getBoxCenter(state).add(
            new Vector3(LittleMan.getBoxSizeForCompute(state) * 6, LittleMan.getBoxSizeForCompute(state) * 2, 0)
        )
    }


    // let distance = getDistance(state)

    // let offset = NullableUtils.getExn(targetDirection).clone().negate().normalize().multiplyScalar(LittleMan.getBoxSizeForCompute(state) * 2)
    // let offset = NullableUtils.getExn(targetDirection).clone().negate().multiplyScalar(LittleMan.getBoxSizeForCompute(state) * 6).normalize().multiplyScalar(distance)
    let offset = NullableUtils.getExn(targetDirection).clone().negate().normalize().multiplyScalar(LittleMan.getBoxSizeForCompute(state) * 6)


    return LittleMan.getBoxCenter(state).add(new Vector3(0, LittleMan.getBoxSizeForCompute(state) * 2, 0)).add(
        // NullableUtils.getExn(targetDirection).clone().negate().multiplyScalar(LittleMan.getBoxSizeForCompute(state) * 6).normalize().multiplyScalar(distance)

        _v1.set(offset.x, 0, offset.z)
        // offset
    )
}

let _limitDistance = (distance, state) => {
    return NumberUtils.clamp(distance,
        getMinDistance(state), getMaxDistance(state))
}

// let _getCameraPosition = (state, camera, orbitControls, orbitControlsTarget) => {
//     let targetToCameraDirection = camera.position.clone().sub(orbitControls.target)

//     let distance = targetToCameraDirection.length()

//     distance = _limitDistance(distance, state)

//     return orbitControlsTarget.clone().add(targetToCameraDirection.normalize().multiplyScalar(distance))
// }
let _getCameraPosition = (state, camera, orbitControls, orbitControlsTarget, distance) => {
    let targetToCameraDirection = camera.position.clone().sub(orbitControls.target)

    // let distance = targetToCameraDirection.length()

    // distance = _limitDistance(distance, state)

    return orbitControlsTarget.clone().add(targetToCameraDirection.normalize().multiplyScalar(distance))
}

// export let isCameraCollision = (state) => {
//     return getThirdPersonCameraTarget(state) !== littleManThirdPersonCameraTarget.Foot
// }

let _buildCameraNear = (thirdPersonCameraTarget_: littleManThirdPersonCameraTarget) => {
    // return 0.1
    return 1
}

export let buildCameraFar = (state: state, factor = 0.6) => {
    let far
    switch (getRenderSetting(getAbstractState(state)).renderAccuracy) {
        case renderAccuracyLevel.VeryHigh:
            far = 8000
            break
        case renderAccuracyLevel.High:
            far = 2000
            break
        case renderAccuracyLevel.Middle:
            far = 1500
            break
        case renderAccuracyLevel.Low:
            far = 1000
            break
    }

    return far * factor * NumberUtils.greaterThan(getFarFactorByScale(getGirlScale(state)) / 1.5, 1)
}


export let updateThirdPersonControls = (state: state, near, far, distance: number) => {
    let abstractState = getAbstractState(state)

    let camera = Camera.getCurrentCamera(abstractState)

    abstractState = ThirdPersonControls.updateControls(abstractState,
        [
            // _buildCameraNear(getThirdPersonCameraTarget(state)),
            near,
            // buildCameraFar(state)
            far
        ],
        isCameraCollision(state),
        getOrbitControls(abstractState), camera, _getThirdPersonControlOrbitControlsTarget(state),
        _getCameraPosition(state, camera, getOrbitControls(abstractState), _getThirdPersonControlOrbitControlsTarget(state), distance),
        // NullableUtils.getEmpty(),
        getMinDistance(state),
        getMaxDistance(state),
    )

    return setAbstractState(state, abstractState)
}



// export let zoomOutCamera = (state: state) => {
//     while (
//         getOrbitControls(getAbstractState(state)).getDistance() <
//         LittleMan.getBoxSizeForCompute(state) * 10
//     ) {
//         state = zoomOut(state)
//     }

//     return state
// }

let _initThirdPersonControlsWhenUse = (state: state, controls, camera, isDebug) => {
    getOrbitControls(getAbstractState(state)).enabled = true

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _buildCameraNear(getThirdPersonCameraTarget(state)),
            buildCameraFar(state)
        ],
        isCameraCollision(state),
        controls, camera, _getThirdPersonControlOrbitControlsTarget(state),
        _getCameraInitialPosition(state),
        getMinDistance(state),
        getMaxDistance(state),
        // isDebug ? Math.PI : Math.PI / 1.2,
        Math.PI,
        isDebug)
    abstractState = CameraControls.initWhenUse(abstractState)

    return setAbstractState(state, abstractState)
}

// let _initOribitControls = (controls, camera, { position, target }) => {
//     camera.position.copy(position)

//     controls.object = camera

//     controls.target = target

//     controls.minDistance = 1
//     // controls.maxDistance = 150
//     controls.maxDistance = 2000

//     controls.maxPolarAngle = Math.PI / 2
//     // controls.maxPolarAngle = Math.PI 

//     controls.enableZoom = true
//     // controls.enablePan = true
//     controls.enablePan = false
// }

export let setCameraType = (state: state, cameraType_) => {
    return _setState(state, {
        ..._getState(state),
        cameraType: cameraType_
    })
}

// export let useOrbitControls = (state: state) => {
//     state = setCameraType(state, cameraType.Orbit)

//     _initOribitControls(Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), NullableUtils.getExn(_getState(state).orbitControlsConfig))

//     return state
// }

export let useThirdPersonControls = (state: state) => {
    state = setCameraType(state, cameraType.ThirdPerson)

    state = LittleMan.show(state)

    state = _initThirdPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state))

    return state
}

export let useFirstPerfonControls = (state: state) => {
    state = setCameraType(state, cameraType.FirstPerson)

    state = LittleMan.hide(state)

    state = FirstPersonControls.initFirstPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), _getState(state).targetDirection)

    return state
}

export let getZoom = (state: state) => {
    // return getOrbitControls(getAbstractState(state)).getZoom()

    return _getState(state).cameraZoom
}

export let setZoom = (state: state, zoom: number) => {
    getOrbitControls(getAbstractState(state)).setZoom(zoom)

    return _setState(state, {
        ..._getState(state),
        cameraZoom: zoom
    })
}

let _getDefaultZoom = () => {
    // return getOrbitControls(getAbstractState(state)).getZoom()
    return 1
}

export let getMaxZoom = (state: state) => {
    return 3
    // return 1.5
}

export let getMinZoom = (state: state) => {
    return 0.1
    // return 0.5
}

export let zoomIn = (state: state) => {
    getOrbitControls(getAbstractState(state)).zoomIn()
    return state
}

export let zoomOut = (state: state) => {
    getOrbitControls(getAbstractState(state)).zoomOut()
    return state
}

let _getDefaultCameraType = () => cameraType.ThirdPerson

let _getDefaultThirdPersonCameraTarget = () => littleManThirdPersonCameraTarget.Body

export let dispose = (state: state) => {
    state = setAbstractState(state, CameraControls.dispose(getAbstractState(state)))

    state = _setState(state, {
        ..._getState(state),

        cameraType: _getDefaultCameraType(),
        thirdPersonCameraTarget: _getDefaultThirdPersonCameraTarget(),
        cameraZoom: _getDefaultZoom(),
    })

    return state
}


export let createState = (): littleManCamera => {
    return {
        cameraType: _getDefaultCameraType(),

        needRestoreData: NullableUtils.getEmpty(),

        thirdPersonCameraTarget: _getDefaultThirdPersonCameraTarget(),
        cameraZoom: _getDefaultZoom(),
        // orbitControlsConfig: NullableUtils.getEmpty(),
        // thirdPersonControlsConfig: null,
        // firstPersonControlsConfig: null,

        targetDirection: NullableUtils.getEmpty(),
    }
}

export let getCameraType = (state: state) => {
    return _getState(state).cameraType
}

export let isThirdPersonCamera = (state: state) => {
    return getCameraType(state) == cameraType.ThirdPerson
}

export let getCameraPosition = (state: state) => {
    return getCurrentCamera(getAbstractState(state)).position
}

export let getControlsTarget = (state: state) => {
    return getOrbitControls(getAbstractState(state)).target
}


// export let saveNeedRestoreData = (state: state, near, far, distance, cameraType) => {
export let saveNeedRestoreData = (state: state, near, far, cameraPosition, controlsTarget, cameraType) => {
    return _setState(state, {
        ..._getState(state),
        needRestoreData: NullableUtils.return_([near, far, cameraPosition, controlsTarget, cameraType])
    })
}

export let hasNeedRestoreData = (state: state) => {
    return !NullableUtils.isNullable(_getState(state).needRestoreData)
}

let _getNeedRestoreDataExn = (state: state) => {
    return NullableUtils.getExn(_getState(state).needRestoreData)
}

export let getDistance = (state: state) => {
    return getOrbitControls(getAbstractState(state)).getDistance()
}

// export let updateControlsWhenZoomOutToThirdPersonControls = (state: state, near, far, distance: number) => {
export let updateControlsWhenZoomOutToThirdPersonControls = (state: state, cameraPosition, controlsTarget) => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControlsByCameraData(state,
                getCameraNear(state), getCameraFar(state),
                cameraPosition, controlsTarget)
            break
        case cameraType.FirstPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControlsByCameraData(state,
                getCameraNear(state), getCameraFar(state),
                cameraPosition, controlsTarget)
            break
        default:
            throw new Error("err")
    }

    return state
}

export let updateControlsWhenZoomOutToThirdPersonControls2 = (state: state, near, far, distance: number) => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControls(state, near, far, distance)
            break
        case cameraType.FirstPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControls(state, near, far, distance)
            break
        default:
            throw new Error("err")
    }

    return state
}

export let updateControlsWhenRestore = (state: state) => {
    let [near, far, cameraPosition, controlsTarget, cameraType_] = _getNeedRestoreDataExn(state)

    state = _setState(state, {
        ..._getState(state),
        needRestoreData: NullableUtils.getEmpty()
    })

    switch (cameraType_) {
        case cameraType.ThirdPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControlsByCameraData(state, near, far, cameraPosition, controlsTarget)
            break
        case cameraType.FirstPerson:
            state = useFirstPerfonControls(state)
            state = FirstPersonControls.updateFirstPersonControls(state, near, far, cameraPosition, controlsTarget)
            break
        default:
            throw new Error("err")
    }

    return state
}

export let keepDistance = (state, distance) => {
    let camera = getCurrentCamera(getAbstractState(state))

    camera.position.copy(
        _getCameraPosition(state, camera, getOrbitControls(getAbstractState(state)), _getThirdPersonControlOrbitControlsTarget(state), distance)
    )

    return state
}

export let isLockToThirdPersonControls = (state: state) => {
    return hasNeedRestoreData(state)
}

export let lookat = (state: state, targetDirection: Vector3) => {
    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            state = FirstPersonControls.updateForTargetDirection(state, targetDirection)
            break
    }

    return _setState(state, {
        ..._getState(state),
        // thirdPersonControlsConfig: NullableUtils.return_({
        //     targetDirection: targetDirection
        // })
        // firstPersonControlsConfig: NullableUtils.return_({
        //     targetDirection: targetDirection
        // })
        targetDirection: NullableUtils.return_(targetDirection)
    })
}

export let updateCamera = (state: state, velocity) => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, _getThirdPersonControlOrbitControlsTarget(state),
                isCameraCollision(state),
            )
            )
            break
        case cameraType.FirstPerson:
            state = FirstPersonControls.updateCamera(state, velocity, _getState(state).targetDirection)
            break
        // default:
        //     throw new Error("err")
    }

    return state
}

// let _getFirstPersonControlsTargetDirection = (state: state) => {
//     return NullableUtils.map(firstPersonControlsConfig => firstPersonControlsConfig.targetDirection,
//         _getState(state).firstPersonControlsConfig)
// }

// let _setFirstPersonControlsTarget = (state: state, targetDirection) => {
//     return _setState(state, {
//         ..._getState(state),
//         firstPersonControlsConfig: NullableUtils.return_({
//             targetDirection: targetDirection
//         })
//     })
// }

// export let restoreFirstPersonControlsTarget = (state: state) => {
//     return _setState(state, {
//         ..._getState(state),
//         firstPersonControlsConfig: NullableUtils.getEmpty()
//     })
// }
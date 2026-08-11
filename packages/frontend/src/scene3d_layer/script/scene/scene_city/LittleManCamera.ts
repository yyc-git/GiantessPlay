import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getGirlScale, getState, restoreCameraFromSavedData, setState, updateCameraDistance } from "./CityScene"
import { Object3D, PerspectiveCamera, Vector3 } from "three"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getFirstPersonControls, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { camera, littleManCamera, littleManThirdPersonCameraTarget, objectStateName } from "./type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import * as LittleMan from "./little_man/LittleMan"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { markAllMeshesNotVisible } from "meta3d-jiehuo-abstract/src/utils/Object3DUtils"
// import * as FirstPersonControls from "./FirstPersonControls"
import { getWorldPosition } from "./little_man/Transform"
import { getMaxDistance, getMinDistance, isCameraCollision, updateThirdPersonControlsByCameraData } from "./utils/LittleManCameraUtils"
import * as ShootControls from "./ShootControls"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { renderAccuracyLevel } from "setting-default/src/Type"
import { getCameraFarByRenderAccuracy } from "./manage/city1/WholeScene"
import { getRemainCameraType } from "./utils/CameraUtils"
import { computeTargetToCameraDirection, disableAllControls, getCameraNear, getCameraRotateSpeedRatio } from "./Camera"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
// import * as GirlCamera from "./Camera"
// import { hasGirl, hasGirlMesh } from "./girl/Girl"

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

export let getTargetDirection = (state: state) => {
    return _getState(state).targetDirection
}

export let removeTargetDirection = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        targetDirection: NullableUtils.getEmpty()
    })
}

export let getThirdPersonCameraTarget = (state: state) => {
    return _getState(state).thirdPersonCameraTarget
}

export let setThirdPersonCameraTarget = (state: state, thirdPersonCameraTarget_: littleManThirdPersonCameraTarget) => {
    (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera).near = _buildCameraNear()

    return _setState(state, {
        ..._getState(state),
        thirdPersonCameraTarget: thirdPersonCameraTarget_
    })
}

export let getLittleManThirdPersonControlOrbitControlsTarget = (state: state): Vector3 => {
    let center = LittleMan.getBoxCenter(state)

    // // TODO remove
    // if(isNaN(center.x)){
    //     console.error(center)
    // }

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
            return getLittleManThirdPersonControlOrbitControlsTarget(state)
        // case cameraType.FirstPerson:
        // return FirstPersonControls.getOrbitControlsTarget(state, _getState(state).targetDirection)
        case cameraType.Shoot:
            return ShootControls.getOrbitControlsTarget(state)
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

    // let offset = NullableUtils.getExn(targetDirection).clone().negate().normalize().multiplyScalar(LittleMan.getBoxSizeForCompute(state, usedGirl) * 2)
    // let offset = NullableUtils.getExn(targetDirection).clone().negate().multiplyScalar(LittleMan.getBoxSizeForCompute(state, usedGirl) * 6).normalize().multiplyScalar(distance)
    let offset = NullableUtils.getExn(targetDirection).clone().negate().normalize().multiplyScalar(LittleMan.getBoxSizeForCompute(state) * 6)


    return LittleMan.getBoxCenter(state).add(new Vector3(0, LittleMan.getBoxSizeForCompute(state) * 2, 0)).add(
        // NullableUtils.getExn(targetDirection).clone().negate().multiplyScalar(LittleMan.getBoxSizeForCompute(state, usedGirl) * 6).normalize().multiplyScalar(distance)

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
    let targetToCameraDirection
    let targetDirection = _getState(state).targetDirection

    if (!NullableUtils.isNullable(targetDirection)) {
        targetToCameraDirection = targetDirection.clone().negate()
    }
    else {
        targetToCameraDirection = camera.position.clone().sub(orbitControls.target)
    }

    // let distance = targetToCameraDirection.length()

    // distance = _limitDistance(distance, state)

    return orbitControlsTarget.clone().add(targetToCameraDirection.normalize().multiplyScalar(distance))
}

// export let isCameraCollision = (state) => {
//     return getThirdPersonCameraTarget(state) !== littleManThirdPersonCameraTarget.Foot
// }

let _buildCameraNear = () => {
    // return 0.1
    return 1
}

export let buildCameraFar = (state: state, factor = 0.6) => {
    // let far
    // switch (getRenderAccuracy(state)) {
    //     case renderAccuracyLevel.MostHigh:
    //         far = 20000
    //         break
    //     case renderAccuracyLevel.VeryHigh:
    //         far = 8000
    //         break
    //     case renderAccuracyLevel.High:
    //         far = 2000
    //         break
    //     case renderAccuracyLevel.Middle:
    //         far = 1500
    //         break
    //     case renderAccuracyLevel.Low:
    //         far = 1000
    //         break
    // }

    // // return far * factor * (hasGirlMesh(state) ? NumberUtils.greaterThan(getFarFactorByScale(getGirlScale(state, usedGirl)) / 1.5, 1) : 1)

    // far *= factor

    // // if (hasGirl(state)) {
    // //     return far * NumberUtils.greaterThan(getFarFactorByScale(getGirlScale(state, usedGirl)) / 1.5, 1)
    // // }

    // return far

    // return getNewestFarDistance(state) * factor
    return getCameraFarByRenderAccuracy(state) * factor
}

export let getCameraPositionWhenUpdate = (camera) => {
    let position = camera.position.clone()

    return position.setY(position.y + 10)
}

let _updateThirdPersonControls = (state: state, near, far, distance: number) => {
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
        getOrbitControls(abstractState), camera, getLittleManThirdPersonControlOrbitControlsTarget(state),
        _getCameraPosition(state, camera, getOrbitControls(abstractState), getLittleManThirdPersonControlOrbitControlsTarget(state), distance),
        // getCameraPositionWhenUpdate(camera),

        // NullableUtils.getEmpty(),

        getMinDistance(state),
        // getMaxDistance(state),
        Infinity,
    )

    return setAbstractState(state, abstractState)
}



// export let zoomOutCamera = (state: state) => {
//     while (
//         getOrbitControls(getAbstractState(state)).getDistance() <
//         LittleMan.getBoxSizeForCompute(state, usedGirl) * 10
//     ) {
//         state = zoomOut(state)
//     }

//     return state
// }

let _initThirdPersonControlsWhenUse = (state: state, controls, camera, isDebug, isFirstUse) => {
    state = disableAllControls(state)
    getOrbitControls(getAbstractState(state)).enabled = true

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _buildCameraNear(),
            buildCameraFar(state)
        ],
        isCameraCollision(state),
        controls, camera, getLittleManThirdPersonControlOrbitControlsTarget(state),

        isFirstUse ?
            _getCameraInitialPosition(state) :
            _getCameraPosition(state, camera, getOrbitControls(getAbstractState(state)),
                getLittleManThirdPersonControlOrbitControlsTarget(state),
                4.3),


        getMinDistance(state),
        getMaxDistance(state),
        // isDebug ? Math.PI : Math.PI / 1.2,
        Math.PI,
        isDebug,
        getCameraRotateSpeedRatio(state, characterType.LittleMan)
    )
    abstractState = CameraControls.initWhenUse(abstractState)

    state = LittleMan.show(state)

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

export let useThirdPersonControls = (state: state, isFirstUse = false) => {
    state = setCameraType(state, cameraType.ThirdPerson)

    state = _initThirdPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), isFirstUse)

    state = updateCameraDistance(state)

    return state
}

// export let useFirstPerfonControls = (state: state) => {
//     state = setCameraType(state, cameraType.FirstPerson)

//     state = LittleMan.hide(state)

//     state = FirstPersonControls.initFirstPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), _getState(state).targetDirection, buildCameraFar(state))

//     return state
// }


let _getCameraPositionForFirstPersonControls = (state: state) => {
    return LittleMan.getBoxCenter(state).add(
        // new Vector3(LittleMan.getBoxSizeForCompute(state, usedGirl) * 0, LittleMan.getBoxSizeForCompute(state, usedGirl) * 2, 0)
        new Vector3(0, LittleMan.getBoxSizeForCompute(state) * 2, LittleMan.getBoxSizeForCompute(state) * -1)
    )
}

let _initFirstPersonControlsWhenUse = (state: state, controls, camera) => {
    state = disableAllControls(state)
    getFirstPersonControls(getAbstractState(state)).enabled = true

    camera.near = _buildCameraNear()
    camera.far = buildCameraFar(state)

    state = setAbstractState(state, CameraControls.initWhenUse(getAbstractState(state)))

    camera.fov = 60


    // let targetToCameraDirection = computeTargetToCameraDirection(camera, getOrbitControlsTarget(state))

    camera = Camera.updatePosition(camera, _getCameraPositionForFirstPersonControls(state))

    // controls.target = camera.position.clone().sub(
    //     targetToCameraDirection.multiplyScalar(5)
    // )

    controls.movementSpeed = 0
    // controls.lookVertical = true

    controls.autoForward = false
    // controls.activeLook = false

    controls.constrainVertical = true
    controls.verticalMin = Math.PI * 0.25
    controls.verticalMax = Math.PI


    // controls.constrainHorrizon = true
    // controls.horrizonMin = 0
    // controls.horrizonMax = Math.PI
    controls.constrainHorrizon = false

    // controls.setLookat(0, 90)

    // controls.lookSpeed = 0.125 * 50 * getCameraRotateSpeedRatio(state, characterType.Giantess)
    controls.lookSpeed = 0.125 * 50 * getCameraRotateSpeedRatio(state, characterType.LittleMan) * 1.5

    if (Device.isMobileByState(getAbstractState(state))) {
        controls.lookSpeed *= 2
    }
    else {
        // controls.lookSpeed *= 0.8
        controls.lookSpeed *= 1.2

        // state = setAbstractState(state, CameraControls.initKeyState(getAbstractState(state)))
    }


    // state = _handleHideMaterialForFirstPerson(state)
    state = LittleMan.hide(state)

    return state
}

export let useFirstPerfonControls = (state: state) => {
    state = setCameraType(state, cameraType.FirstPerson)

    // state = LittleMan.hide(state)

    // state = FirstPersonControls.initFirstPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), _getState(state).targetDirection, buildCameraFar(state))
    state = _initFirstPersonControlsWhenUse(state, Camera.getFirstPersonControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)))

    return state
}

export let useShootControls = (state: state) => {
    // requireCheck(() => {
    //     test("current camera type should be Third Person", () => {
    //         return getCameraType(state) == cameraType.ThirdPerson
    //     })
    // }, getIsDebug(state))

    state = setCameraType(state, cameraType.Shoot)

    // state = ShootControls.initShootControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), _getState(state).targetDirection)
    state = ShootControls.initShootControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state))

    return state
}

export let getZoom = (state: state) => {
    // return getOrbitControls(getAbstractState(state)).getZoom()

    return _getState(state).cameraZoom
}

export let setZoom = (state: state, zoom: number) => {
    // getOrbitControls(getAbstractState(state)).setZoom(zoom)

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
        // ..._getState(state),
        ...createState(),

        cameraType: getRemainCameraType(_getDefaultCameraType, _getState(state).cameraType),
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

export let isShootCamera = (state: state) => {
    return getCameraType(state) == cameraType.Shoot
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
            // state = useThirdPersonControls(state)
            // state = updateThirdPersonControlsByCameraData(state,
            //     getCameraNear(state), getCameraFar(state),
            //     cameraPosition, controlsTarget)
            break
        case cameraType.Shoot:
        case cameraType.FirstPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControlsByCameraData(state,
                getCameraNear(state),
                // getCameraFar(state),
                buildCameraFar(state),

                // cameraPosition,
                getCameraPositionWhenUpdate(Camera.getCurrentCamera(getAbstractState(state))),
                controlsTarget)
            break
        default:
            throw new Error("err")
    }

    return state
}

export let updateControlsWhenZoomOutToThirdPersonControls2 = (state: state, near, far, distance: number) => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            // // state = useThirdPersonControls(state)
            state = _updateThirdPersonControls(state, near, far, distance)
            break
        case cameraType.Shoot:
        case cameraType.FirstPerson:
        default:
            state = useThirdPersonControls(state)
            state = _updateThirdPersonControls(state, near, far, distance)
            break
        // default:
        //     throw new Error("err")
    }

    return state
}

export let restoreControlsForNotChangePosition = (state: state) => {
    if (!hasNeedRestoreData(state)) {
        state = useThirdPersonControls(state)
        return state
    }

    let [near, far, cameraPosition, controlsTarget, cameraType_] = _getNeedRestoreDataExn(state)

    state = clearNeedRestoreData(state)

    switch (cameraType_) {
        case cameraType.Shoot:
        case cameraType.ThirdPerson:
            state = useThirdPersonControls(state)
            state = updateThirdPersonControlsByCameraData(state, near, far, cameraPosition, controlsTarget)
            break
        case cameraType.FirstPerson:
            state = useFirstPerfonControls(state)
            // state = FirstPersonControls.updateFirstPersonControls(state, near, far, cameraPosition, controlsTarget)
            break
        default:
            throw new Error("err")
    }

    return state
}

export let clearNeedRestoreData = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        needRestoreData: NullableUtils.getEmpty()
    })
}

export let restoreControlsForChangePosition = (state: state) => {
    // if (!hasNeedRestoreData(state)) {
    //     state = useThirdPersonControls(state)
    //     return state
    // }

    // let [near, far, cameraPosition, controlsTarget, cameraType_] = _getNeedRestoreDataExn(state)

    state = clearNeedRestoreData(state)

    // switch (cameraType_) {
    //     case cameraType.Shoot:
    //     case cameraType.ThirdPerson:
    //         state = useThirdPersonControls(state)
    //         // state = updateThirdPersonControlsByCameraData(state, near, far, cameraPosition, controlsTarget)
    //         break
    //     case cameraType.FirstPerson:
    //         state = useFirstPerfonControls(state)
    //         // state = FirstPersonControls.updateFirstPersonControls(state, near, far, cameraPosition, controlsTarget)
    //         break
    //     default:
    //         throw new Error("err")
    // }

    state = restoreCameraFromSavedData(state)

    return state
}

export let updatePosition = (state) => {
    // let camera = getCurrentCamera(getAbstractState(state))

    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            // state = FirstPersonControls.updateForTargetDirection(state,
            //     getTargetToCameraDirection(state)
            // )

            // Camera.updatePosition(camera, _getCameraPosition(state, camera, getOrbitControls(getAbstractState(state)), FirstPersonControls.getOrbitControlsTarget(state, NullableUtils.getEmpty()), distance)
            // )


            // state = FirstPersonControls.initFirstPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state), _getState(state).targetDirection, buildCameraFar(state))
            state = updateFirstPersonControls(state)

            break
        case cameraType.ThirdPerson:
            // Camera.updatePosition(camera, _getCameraPosition(state, camera, getOrbitControls(getAbstractState(state)), getLittleManThirdPersonControlOrbitControlsTarget(state), distance)
            // )


            // ThirdPersonControls.setTarget(getOrbitControls(getAbstractState(state)), getLittleManThirdPersonControlOrbitControlsTarget(state))
            // Camera.updatePosition(camera, _getCameraPosition(state, camera, getOrbitControls(getAbstractState(state)), getLittleManThirdPersonControlOrbitControlsTarget(state), distance)
            // )


            let velocity = getLittleManThirdPersonControlOrbitControlsTarget(state).clone().sub(
                getControlsTarget(state)
            )
            state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getLittleManThirdPersonControlOrbitControlsTarget(state),
                isCameraCollision(state),
            )
            )

            break
    }

    return state
}

export let isLockToThirdPersonControls = (state: state) => {
    // return hasNeedRestoreData(state)
    return false
}

export let lookat = (state: state, targetDirection: Vector3) => {
    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            getFirstPersonControls(getAbstractState(state)).lookAt(getCameraPosition(state).clone().add(targetDirection))
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

export let updateFirstPersonControls = (state: state) => {
    let camera = getCurrentCamera(getAbstractState(state))

    Camera.updatePosition(camera, _getCameraPositionForFirstPersonControls(state))

    // state = _updateFirstPersonCameraNearAndFar(state)

    // if (getCurrentPose(state, usedGirl) != pose.Sit) {
    //     let controlRotationAngle = FirstPersonControls.computeTransformForCamera(getAbstractState(state), Camera.getFirstPersonControls(getAbstractState(state)))

    //     state = setGirlRotation(state,
    //         new Quaternion().setFromAxisAngle(
    //             new Vector3(0, 1, 0),
    //             Math.PI + controlRotationAngle
    //         )
    //     )
    // }

    return state
}

export let updateCamera = (state: state, velocity) => {
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getLittleManThirdPersonControlOrbitControlsTarget(state),
                isCameraCollision(state),
            )
            )
            break
        case cameraType.FirstPerson:
            // state = FirstPersonControls.updateCamera(state, velocity, _getState(state).targetDirection)
            state = updateFirstPersonControls(state)
            break
        case cameraType.Shoot:
            state = ShootControls.updateCamera(state, velocity)
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

export let getTargetToCameraDirection = (state: state) => {
    // return NullableUtils.getWithDefault(
    //     _getState(state).targetDirection,
    //     computeTargetToCameraDirection(getCurrentCamera(getAbstractState(state)), getLittleManThirdPersonControlOrbitControlsTarget(state))
    // )


    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
        case cameraType.Shoot:
            return computeTargetToCameraDirection(getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))
        case cameraType.FirstPerson:
            return getFirstPersonControls(getAbstractState(state)).getLookatDirection().clone().negate()
        default:
            throw new Error("err")
    }
}

export let moveCameraForScreenShake = (state: state, offset: Vector3) => {
    let camera = getCurrentCamera(getAbstractState(state))
    let target

    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
        case cameraType.Shoot:
            target = getOrbitControlsTarget(state)
            break
        case cameraType.FirstPerson:
            // Camera.updatePosition(camera, getCameraPosition(state).clone().add(offset.multiplyScalar(10)))
            target = getCameraPosition(state).clone().add(getFirstPersonControls(getAbstractState(state)).getLookatDirection().clone().multiplyScalar(2))
            break
        default:
            // throw new Error("err")
            return
    }

    camera.lookAt(target.clone().add(offset))
}
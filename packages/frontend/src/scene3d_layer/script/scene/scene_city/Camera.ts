import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getConfigData, getGirlScale, getState, setState } from "./CityScene"
import { Euler, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State"
import { getCurrentMMDCharacterName, getGirl, getGirlMesh, getGirlState } from "./girl/Girl"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getFirstPersonControls, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { camera, thirdPersonCameraTarget, collisionPart, firstPersonCameraTarget } from "./type/StateType"
import { getBoxSizeForCompute, getGirlBox, getGirlBoxCenter, getScale, setGirlRotation } from "./girl/Utils"
import { getRenderSetting } from "meta3d-jiehuo-abstract/src/setting/RenderSetting"
import { renderAccuracyLevel, road } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getSceneState, setSceneState } from "meta3d-jiehuo-abstract/src/state/State"
// import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls"
import { Render } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { FirstPersonControls } from "meta3d-jiehuo-abstract"
import { setMaterialVisibleByName } from "./utils/MMDUtils"
import { firstPersonControlsData } from "./data/mmd/MMDData"
import { getFarFactorByScale } from "./utils/CameraUtils"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

// export let createPerspectiveCamera = () => {
//     // let camera = NewThreeInstance.createPerspectiveCamera(60, View.getWidth() / View.getHeight(), 0.1, 1000)
//     let camera = NewThreeInstance.createPerspectiveCamera(60, View.getWidth() / View.getHeight(), 1, 1000)

//     // Layer.enableVisibleLayer(camera.layers)

//     return camera
// }

// export let getCamera = (state: state) => {
//     return NullableUtils.getExn(_getState(state).camera)
// }

export let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).camera)
}

export let _setState = (state: state, cameraState: camera) => {
    return setState(state, {
        ...getState(state),
        camera: NullableUtils.return_(cameraState)
    })
}

export let getThirdPersonCameraTarget = (state: state) => {
    return _getState(state).thirdPersonCameraTarget
}

export let setThirdPersonCameraTarget = (state: state, thirdPersonCameraTarget_: thirdPersonCameraTarget) => {
    // (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera).near = _getCameraNearForThirdPerson(getScale(state), thirdPersonCameraTarget_)

    return _setState(state, {
        ..._getState(state),
        thirdPersonCameraTarget: thirdPersonCameraTarget_
    })
}

let _updateFirstPersonCameraDistance = (state: state) => {
    let girlScale = getScale(state)

    let camera = (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera)
    camera.near = _getCameraNearForFirstPerson(girlScale, _getState(state).firstPersonCameraTarget)
    camera.far = _getCameraFar(state, girlScale)

    return state
}

export let getFirstPersonCameraTarget = (state: state) => {
    return _getState(state).firstPersonCameraTarget
}

export let setFirstPersonCameraTarget = (state: state, firstPersonCameraTarget_: firstPersonCameraTarget) => {
    state = _setState(state, {
        ..._getState(state),
        firstPersonCameraTarget: firstPersonCameraTarget_
    })

    state = _handleHideMaterialForFirstPerson(state)

    state = _updateFirstPersonCameraDistance(state)

    return state
}

export let getOrbitControlsTarget = (state: state): Vector3 => {
    // let capsule = getGirlState(state).capsule
    let center = getGirlBoxCenter(state)

    switch (getThirdPersonCameraTarget(state)) {
        case thirdPersonCameraTarget.Chest:
            return center.setY(center.y + getBoxSizeForCompute(state))

        // return _getTarget(state, collisionPart.LeftBreast, collisionPart.RightBreast)
        case thirdPersonCameraTarget.Foot:
            // return capsule.start.clone().setY(capsule.start.y - getCapsuleRadiusForCompute(capsule) / 2)

            // return _getTarget(state, collisionPart.LeftFoot, collisionPart.RightFoot)

            return center.setY(0 + getBoxSizeForCompute(state) / 2)
        default:
            throw new Error("err")
    }
}

let _getCameraInitialPosition = (state) => {
    // let capsule = getGirlState(state).capsule

    // return getBoxSizeForCompute(state) * 2

    // return new Vector3(capsule.end.x - getCapsuleRadiusForCompute(capsule) * 6, capsule.end.y + getCapsuleRadiusForCompute(capsule) * 4, capsule.end.z)
    return getGirlBoxCenter(state).add(
        new Vector3(-getBoxSizeForCompute(state) * 6, getBoxSizeForCompute(state) * 2, 0)
    )
}

let _limitDistance = (distance, state) => {
    // let minDistance = _getMinDistance(state)

    // if (distance > _getMaxDistance(state) || distance < minDistance) {
    //     throw new Error("err")
    // }

    // return distance

    return NumberUtils.clamp(distance,
        _getMinDistance(state), _getMaxDistance(state))
}

let _computeTargetToCameraDistance = (camera, orbitControlsTarget): number => {
    return camera.position.clone().sub(orbitControlsTarget).length()
}

let _computeTargetToCameraDirection = (camera, orbitControlsTarget) => {
    return camera.position.clone().sub(orbitControlsTarget).normalize()
}

let _computeDistanceRate = (state, camera, orbitControlsTarget) => {
    return _computeTargetToCameraDistance(camera, orbitControlsTarget) / (_getMaxDistance(state) - _getMinDistance(state))
}

let _updateDistanceRate = (state, camera, orbitControlsTarget) => {
    return _setState(state, {
        ..._getState(state),
        distanceRate: _computeDistanceRate(state, camera, orbitControlsTarget)
    })
}

export let updateDistanceRate = (state) => {
    return _updateDistanceRate(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))
}

let _updateTargetToCameraDirection = (state, camera, orbitControlsTarget) => {
    return _setState(state, {
        ..._getState(state),
        targetToCameraDirection: _computeTargetToCameraDirection(camera, orbitControlsTarget)
    })
}



let _computeDistance = (state) => {
    return _getState(state).distanceRate * (_getMaxDistance(state) - _getMinDistance(state))
}

// let _getCameraPosition = (state, camera, orbitControls, orbitControlsTarget, scaleIncreasement) => {
// let _getCameraPosition = (state, camera, oldOrbitControlsTarget, newOrbitControlsTarget, scaleIncreasement) => {
let _getCameraPosition = (state, camera, oldOrbitControlsTarget, newOrbitControlsTarget) => {
    // let targetToCameraDirection = camera.position.clone().sub(oldOrbitControlsTarget)

    // let oldTargetToCameraDistance = camera.position.clone().sub(oldOrbitControlsTarget)

    // return NumberUtils.clamp(distance,
    //     _getMinDistance(state), _getMaxDistance(state))

    // let distanceRate = oldTargetToCameraDistance / (_getMaxDistance(state) - _getMinDistance(state))

    // Console.log(
    //     oldOrbitControlsTarget.clone(),
    //     newOrbitControlsTarget.clone()
    // )

    // let targetToCameraDirection = _computeTargetToCameraDirection(camera, oldOrbitControlsTarget)
    let targetToCameraDirection = _getState(state).targetToCameraDirection

    // let distance = targetToCameraDirection.length() * scaleIncreasement

    // let distanceRate = _getState(state).distanceRate

    // distance = _limitDistance(distance, state)

    // return newOrbitControlsTarget.clone().add(targetToCameraDirection.normalize().multiplyScalar(distance))
    return newOrbitControlsTarget.clone().add(targetToCameraDirection.multiplyScalar(_computeDistance(state)))
}

let _getMinDistance = (state) => {
    // let capsule = getGirlState(state).capsule

    if (getIsDebug(state)) {
        return 0
    }

    // return getCapsuleRadiusForCompute(capsule) * 2
    return getBoxSizeForCompute(state) * 2
}

let _getMaxDistance = (state: state) => {
    // let capsule = getGirlState(state).capsule

    if (getIsDebug(state)) {
        // return +Infinity

        return getBoxSizeForCompute(state) * 96
    }

    // return getCapsuleRadiusForCompute(capsule) * 16
    return getBoxSizeForCompute(state) * 16
}

export let isCameraCollision = (state) => {
    // TODO open camera collision

    // return getThirdPersonCameraTarget(state) !== thirdPersonCameraTarget.Foot
    return false
}

let _getCameraNearForThirdPerson = (girlScale, thirdPersonCameraTarget_: thirdPersonCameraTarget) => {
    let near
    if (thirdPersonCameraTarget_ == thirdPersonCameraTarget.Foot) {
        near = 1
    }
    else {
        if (girlScale < 50) {
            near = 1
        }
        else {
            near = 10
        }
    }

    return near
}

let _getCameraNearForFirstPerson = (girlScale, firstPersonCameraTarget_: firstPersonCameraTarget) => {
    let near
    if (firstPersonCameraTarget_ == firstPersonCameraTarget.Leg) {
        if (girlScale < 100) {
            near = 0.5
        }
        else {
            near = 1
        }
    }
    else {
        if (girlScale < 50) {
            near = 1
        }
        else {
            near = 10
        }
    }

    return near
}

let _getCameraFar = (state: state, girlScale) => {
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

    let factor = getFarFactorByScale(girlScale)

    return far * factor
}

let _disableAllControls = (state: state) => {
    NullableUtils.forEach(controls => {
        controls.enabled = false
    }, getOrbitControls(getAbstractState(state)))
    NullableUtils.forEach(controls => {
        controls.enabled = false
    }, getFirstPersonControls(getAbstractState(state)))

    return state
}

export let updateThirdPersonControlsForChangeScale = (state: state) => {
    let abstractState = getAbstractState(state)

    let camera = Camera.getCurrentCamera(abstractState)

    abstractState = ThirdPersonControls.updateControls(abstractState,
        [
            _getCameraNearForThirdPerson(getScale(state), getThirdPersonCameraTarget(state)),
            _getCameraFar(state, getScale(state))
        ],
        isCameraCollision(state),
        getOrbitControls(abstractState), camera, getOrbitControlsTarget(state),
        // NullableUtils.return_(_getCameraPosition(state, camera, getOrbitControls(abstractState), getOrbitControlsTarget(state), scaleIncreasement)),
        NullableUtils.return_(_getCameraPosition(state, camera, getOrbitControls(abstractState).target, getOrbitControlsTarget(state))),
        _getMinDistance(state),
        _getMaxDistance(state),
    )

    return setAbstractState(state, abstractState)
}

let _initThirdPersonControlsWhenUse = (state: state, controls, camera, isDebug) => {
    state = _disableAllControls(state)
    getOrbitControls(getAbstractState(state)).enabled = true

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _getCameraNearForThirdPerson(getScale(state), getThirdPersonCameraTarget(state)),
            _getCameraFar(state, getScale(state))
        ],
        isCameraCollision(state),
        controls, camera, getOrbitControlsTarget(state),
        _getCameraInitialPosition(state),
        _getMinDistance(state),
        _getMaxDistance(state),
        isDebug ? Math.PI : Math.PI / 2,
        isDebug)
    abstractState = CameraControls.initWhenUse(abstractState)

    // state = _updateDistanceRate(state, camera, getOrbitControlsTarget(state))
    state = _updateTargetToCameraDirection(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))


    let { hideMaterialNames } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state))

    let girlMesh = getGirlMesh(state)
    hideMaterialNames.forEach(name => {
        setMaterialVisibleByName(girlMesh, name, true)
    })



    return setAbstractState(state, abstractState)
}

let _initOribitControls = (controls, camera, { position, target }) => {
    camera.position.copy(position)

    controls.object = camera

    controls.target = target

    controls.minDistance = 1
    // controls.maxDistance = 150
    controls.maxDistance = 2000

    controls.maxPolarAngle = Math.PI / 2
    // controls.maxPolarAngle = Math.PI 

    controls.enableZoom = true
    // controls.enablePan = true
    controls.enablePan = false
}


let _getFirstPersonControlsData = (firstPersonControlsData: firstPersonControlsData, mmdCharacter) => {
    return NullableUtils.getExn(firstPersonControlsData.find(d => {
        return d.mmdCharacter == mmdCharacter
    })).data
}

let _getCameraPositionForFirstPersonControls = (state: state) => {
    switch (getFirstPersonCameraTarget(state)) {
        case firstPersonCameraTarget.Eye:
            let { getCameraPositionForFirstPersonControlsFunc } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state))

            return getCameraPositionForFirstPersonControlsFunc(getGirl(state))
        case firstPersonCameraTarget.Leg:
            let girl = getGirl(state)

            let bone1 = girl.getObjectByName("右ひざ")
            let p1 = bone1.getWorldPosition(_v1)
            let bone2 = girl.getObjectByName("左ひざ")
            let p2 = bone2.getWorldPosition(_v2)

            return p2.clone().add(p1.clone().sub(p2).multiplyScalar(0.5))
        default:
            throw new Error("err")
    }

}

let _handleHideMaterialForFirstPerson = (state: state) => {
    let { hideMaterialNames } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state))
    let girlMesh = getGirlMesh(state)
    switch (getFirstPersonCameraTarget(state)) {
        case firstPersonCameraTarget.Eye:
            hideMaterialNames.forEach(name => {
                setMaterialVisibleByName(girlMesh, name, false)
            })
            break
        case firstPersonCameraTarget.Leg:
            hideMaterialNames.forEach(name => {
                setMaterialVisibleByName(girlMesh, name, true)
            })
            break
        default:
            throw new Error("err")
    }

    return state
}

let _initFirstPersonControlsWhenUse = (state: state, controls, camera) => {
    state = _disableAllControls(state)
    getFirstPersonControls(getAbstractState(state)).enabled = true



    state = setAbstractState(state, CameraControls.initWhenUse(getAbstractState(state)))

    camera.fov = 60

    camera.position.copy(_getCameraPositionForFirstPersonControls(state))

    controls.lookSpeed = 0.125 * 50
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

    controls.setLookat(0, 90)


    if (Device.isMobile()) {
    }
    else {
        state = setAbstractState(state, CameraControls.initKeyState(getAbstractState(state)))
    }


    state = _handleHideMaterialForFirstPerson(state)

    return state
}


export let updateFirstPersonControls = (state: state) => {
    let camera = getCurrentCamera(getAbstractState(state))

    camera.position.copy(_getCameraPositionForFirstPersonControls(state))

    state = _updateFirstPersonCameraDistance(state)



    let controlRotationAngle = FirstPersonControls.computeTransformForCamera(getAbstractState(state), Camera.getFirstPersonControls(getAbstractState(state)))

    state = setGirlRotation(state,
        new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            Math.PI + controlRotationAngle
        )
    )

    return state
}

export let setCameraType = (state: state, cameraType_) => {
    return _setState(state, {
        ..._getState(state),
        cameraType: cameraType_
    })
}

export let useOrbitControls = (state: state) => {
    state = setCameraType(state, cameraType.Orbit)

    _initOribitControls(Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), NullableUtils.getExn(_getState(state).orbitControlsConfig))

    return state
}

export let useThirdPersonControls = (state: state) => {
    state = setCameraType(state, cameraType.ThirdPerson)

    state = _initThirdPersonControlsWhenUse(state, Camera.getOrbitControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)), getIsDebug(state))

    return state

}

export let useFirstPersonControls = (state: state) => {
    state = setCameraType(state, cameraType.FirstPerson)

    state = _initFirstPersonControlsWhenUse(state, Camera.getFirstPersonControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)))

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

    // state = _updateDistanceRate(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))

    return state
}

export let zoomOut = (state: state) => {
    getOrbitControls(getAbstractState(state)).zoomOut()

    // state = _updateDistanceRate(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))

    return state
}

export let update = (state: state) => {
    // state = _updateDistanceRate(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))
    state = _updateTargetToCameraDirection(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))


    return Promise.resolve(state)
}

export let getDefaultCameraType = () => cameraType.ThirdPerson
// export let getDefaultCameraType = () => cameraType.FirstPerson

let _getDefaultThirdPersonCameraTarget = () => thirdPersonCameraTarget.Chest

let _getDefaultFirstPersonCameraTarget = () => firstPersonCameraTarget.Eye

export let dispose = (state: state) => {
    state = setAbstractState(state, CameraControls.dispose(getAbstractState(state)))

    state = _disableAllControls(state)

    state = _setState(state, {
        ..._getState(state),

        cameraType: getDefaultCameraType(),
        thirdPersonCameraTarget: _getDefaultThirdPersonCameraTarget(),
        firstPersonCameraTarget: _getDefaultFirstPersonCameraTarget(),
        cameraZoom: _getDefaultZoom(),
    })

    return state
}


export let createState = (): camera => {
    return {
        cameraType: getDefaultCameraType(),
        thirdPersonCameraTarget: _getDefaultThirdPersonCameraTarget(),
        firstPersonCameraTarget: _getDefaultFirstPersonCameraTarget(),
        cameraZoom: _getDefaultZoom(),
        distanceRate: 0,
        targetToCameraDirection: new Vector3(0, 0, 0),


        orbitControlsConfig: null,
        // thirdPersonControlsConfig: null,
    }
}

export let getCameraType = (state: state) => {
    return _getState(state).cameraType
}

// export let isThirdPersonCamera = (state: state) => {
//     return getCameraType(state) == cameraType.ThirdPerson
// }

export let getCameraPosition = (state: state) => {
    return getCurrentCamera(getAbstractState(state)).position
}

export let computeTransformForCamera = (state: state, road_: road): [number, number, number] => {
    let [forward, side] = CameraControls.computeTransformForCamera(getAbstractState(state), road_)

    let controlRotationAngle
    switch (getCameraType(state)) {
        case cameraType.ThirdPerson:
            controlRotationAngle = ThirdPersonControls.computeTransformForCamera(getAbstractState(state), getOrbitControls(getAbstractState(state)), road_)
            break
        case cameraType.FirstPerson:
            controlRotationAngle = FirstPersonControls.computeTransformForCamera(getAbstractState(state), Camera.getFirstPersonControls(getAbstractState(state)))
            break
        default:
            throw new Error("err")
    }

    return [controlRotationAngle, forward, side]
}
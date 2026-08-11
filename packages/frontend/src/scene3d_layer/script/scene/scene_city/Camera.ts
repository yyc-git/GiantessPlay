import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getConfigData, getGirlScale, getState, isGiantessCharacterType, setState } from "./CityScene"
import { Euler, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three"
import { getAbstractState, getBlockState, readState, setAbstractState, writeState } from "../../../state/State"
import { getCurrentMMDCharacterName, getGirl, getGirlMesh, hasGirl, isUseGirl, isPlayerGirl } from "./girl/Girl"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getFirstPersonControls, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { camera, thirdPersonCameraTarget, collisionPart, firstPersonCameraTarget, pose, cameraRotateSpeed, usedGirlEnum, usedGirl } from "./type/StateType"
import { getBoxSizeForCompute, getGirlBox, getGirlBoxCenter, getScale, setGirlRotation } from "./girl/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { getSceneState, setSceneState } from "meta3d-jiehuo-abstract/src/state/State"
// import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls"
import { Render } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { FirstPersonControls } from "meta3d-jiehuo-abstract"
import { setMaterialVisibleByName } from "./utils/MMDUtils"
// import { getLittleManThirdPersonControlOrbitControlsTarget, useShootControls } from "./LittleManCamera"
import * as ShootControls from "./ShootControls"
import { firstPersonControlsData } from "mmd-character-protocol/src/service/ServiceType"
import { buildAPI } from "../../../mod/Mod"
import { getRenderSetting } from "../../../mod/SettingMod"
import { renderAccuracyLevel } from "setting-default/src/Type"
import { getCameraFarByRenderAccuracy } from "./manage/city1/WholeScene"
import { Flow } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getRemainCameraType } from "./utils/CameraUtils"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getCameraCache, setCameraCache } from "meta3d-jiehuo-abstract/src/storage/Storage"
import { Scene } from "meta3d-jiehuo-abstract"
import { getModAPI } from "./Mod"
import { getCurrentModelName } from "./little_man/LittleMan"
import { getCurrentPose } from "./girl/Pose"
import { getCurrentAnimationName } from "./girl/Animation"
import { getAllStompAnimations, getStompBlockService } from "../../../mod/SkillGiantessMod"
import { getGiantessLevel } from "./utils/UpgradeUtils"
import { getShankLength } from "./utils/CollisionUtils"

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

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).camera)
}

let _setState = (state: state, cameraState: camera) => {
    return setState(state, {
        ...getState(state),
        camera: NullableUtils.return_(cameraState)
    })
}

export let getThirdPersonCameraTarget = (state: state) => {
    return _getState(state).thirdPersonCameraTarget
}

export let setThirdPersonCameraTarget = (state: state, thirdPersonCameraTarget_: thirdPersonCameraTarget) => {
    let usedGirl = usedGirlEnum.PlayerGirl;

    (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera).near = _getCameraNearForThirdPerson(getScale(state, usedGirl), thirdPersonCameraTarget_)


    state = _setState(state, {
        ..._getState(state),
        thirdPersonCameraTarget: thirdPersonCameraTarget_
    })

    return state
}


export let getFreeThirdPersonCameraTargetYOffset = (state: state) => {
    return _getState(state).freeThirdPersonCameraTargetYOffset
}

export let setFreeThirdPersonCameraTargetYOffset = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        freeThirdPersonCameraTargetYOffset: value
    })
}

let _updateFirstPersonCameraNearAndFar = (state: state, usedGirl) => {
    let girlScale = getScale(state, usedGirl)

    let camera = (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera)
    camera.near = _getCameraNearForFirstPerson(girlScale, _getState(state).firstPersonCameraTarget)
    camera.far = buildCameraFar(state, girlScale)

    return state
}

let _updateThirdPersonCameraNearAndFar = (state: state, usedGirl) => {
    let girlScale = getScale(state, usedGirl)

    let camera = (getCurrentCamera(getAbstractState(state)) as PerspectiveCamera)
    camera.near = _getCameraNearForThirdPerson(girlScale, _getState(state).thirdPersonCameraTarget)
    camera.far = buildCameraFar(state, girlScale)

    return state
}

export let updateCameraNearAndFar = (state: state) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            state = _updateFirstPersonCameraNearAndFar(state, usedGirl)
            break
        case cameraType.ThirdPerson:
            state = _updateThirdPersonCameraNearAndFar(state, usedGirl)
            break
    }

    return state
}

export let getFirstPersonCameraTarget = (state: state) => {
    return _getState(state).firstPersonCameraTarget
}

export let setFirstPersonCameraTarget = (state: state, firstPersonCameraTarget_: firstPersonCameraTarget) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    state = _setState(state, {
        ..._getState(state),
        firstPersonCameraTarget: firstPersonCameraTarget_
    })

    state = _handleHideMaterialForFirstPerson(state, usedGirl)

    state = _updateFirstPersonCameraNearAndFar(state, usedGirl)

    return state
}

export let getOrbitControlsTarget = (state: state): Vector3 => {
    let usedGirl = usedGirlEnum.PlayerGirl
    // let capsule = getUsedGirlData(state, usedGirl).capsule
    let center = getGirlBoxCenter(state, usedGirl)

    switch (getThirdPersonCameraTarget(state)) {
        case thirdPersonCameraTarget.Chest:
            return center.setY(center.y + getBoxSizeForCompute(state, usedGirl))

        // return _getTarget(state, collisionPart.LeftBreast, collisionPart.RightBreast)
        case thirdPersonCameraTarget.Foot:
            // return capsule.start.clone().setY(capsule.start.y - getCapsuleRadiusForCompute(capsule) / 2)

            // return _getTarget(state, collisionPart.LeftFoot, collisionPart.RightFoot)

            // return center.setY(0 + getBoxSizeForCompute(state, usedGirl) / 2)
            return center.setY(0)
        case thirdPersonCameraTarget.Free:
            return center.setY(center.y + getFreeThirdPersonCameraTargetYOffset(state) / 50 * (center.y)
            )
        default:
            throw new Error("err")
    }
}

// let _getCameraInitialPosition = (state) => {
//     // let capsule = getUsedGirlData(state, usedGirl).capsule

//     // return getBoxSizeForCompute(state, usedGirl) * 2

//     // return new Vector3(capsule.end.x - getCapsuleRadiusForCompute(capsule) * 6, capsule.end.y + getCapsuleRadiusForCompute(capsule) * 4, capsule.end.z)
//     return getGirlBoxCenter(state).add(
//         new Vector3(-getBoxSizeForCompute(state, usedGirl) * 6, getBoxSizeForCompute(state, usedGirl) * 2, 0)
//     )
// }

// let _limitDistance = (distance, state) => {
//     // let minDistance = _getMinDistance(state, usedGirl)

//     // if (distance > _getMaxDistance(state, usedGirl) || distance < minDistance) {
//     //     throw new Error("err")
//     // }

//     // return distance

//     return NumberUtils.clamp(distance,
//         _getMinDistance(state, usedGirl), _getMaxDistance(state, usedGirl))
// }

let _computeTargetToCameraDistance = (camera, orbitControlsTarget): number => {
    return camera.position.clone().sub(orbitControlsTarget).length()
}

export let computeTargetToCameraDirection = (camera, orbitControlsTarget) => {
    return camera.position.clone().sub(orbitControlsTarget).normalize()
}

let _computeDistanceRate = (state, usedGirl, camera, orbitControlsTarget) => {
    return _computeTargetToCameraDistance(camera, orbitControlsTarget) / (_getMaxDistance(state, usedGirl) - _getMinDistance(state, usedGirl))
}

let _updateDistanceRate = (state, usedGirl, camera, orbitControlsTarget) => {
    return _setState(state, {
        ..._getState(state),
        distanceRateData: [Flow.getFrameIndex(getAbstractState(state)), _computeDistanceRate(state, usedGirl, camera, orbitControlsTarget)]
    })
}

export let updateDistanceRateOnlyOnceInOneFrame = (state) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    let [frameIndex, _] = _getState(state).distanceRateData

    if (frameIndex == Flow.getFrameIndex(getAbstractState(state))
        || !isGiantessCharacterType(state)
    ) {
        return state
    }

    return _updateDistanceRate(state, usedGirl, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))
}

export let setTargetToCameraDirection = (state, direction) => {
    return _setState(state, {
        ..._getState(state),
        targetToCameraDirection: direction
    })
}

let _updateTargetToCameraDirection = (state, camera, orbitControlsTarget) => {
    return setTargetToCameraDirection(state, computeTargetToCameraDirection(camera, orbitControlsTarget))
}


let _computeDistance = (state, usedGirl) => {
    return TupleUtils.getTuple2Last(_getState(state).distanceRateData) * (_getMaxDistance(state, usedGirl) - _getMinDistance(state, usedGirl))
}

// let _getCameraPosition = (state, camera, orbitControls, orbitControlsTarget, scaleIncrease) => {
// let _getCameraPosition = (state, camera, oldOrbitControlsTarget, newOrbitControlsTarget, scaleIncrease) => {
let _getCameraPosition = (state, usedGirl, camera, oldOrbitControlsTarget, newOrbitControlsTarget) => {
    // let targetToCameraDirection = camera.position.clone().sub(oldOrbitControlsTarget)

    // let oldTargetToCameraDistance = camera.position.clone().sub(oldOrbitControlsTarget)

    // return NumberUtils.clamp(distance,
    //     _getMinDistance(state, usedGirl), _getMaxDistance(state, usedGirl))

    // let distanceRate = oldTargetToCameraDistance / (_getMaxDistance(state, usedGirl) - _getMinDistance(state, usedGirl))

    // Console.log(
    //     oldOrbitControlsTarget.clone(),
    //     newOrbitControlsTarget.clone()
    // )

    // let targetToCameraDirection = computeTargetToCameraDirection(camera, oldOrbitControlsTarget)
    let targetToCameraDirection = _getState(state).targetToCameraDirection

    // let distance = targetToCameraDirection.length() * scaleIncrease

    // let distanceRate = _getState(state).distanceRate

    // distance = _limitDistance(distance, state)

    // return newOrbitControlsTarget.clone().add(targetToCameraDirection.normalize().multiplyScalar(distance))
    return newOrbitControlsTarget.clone().add(targetToCameraDirection.multiplyScalar(_computeDistance(state, usedGirl)))
}

let _getMinDistance = (state, usedGirl) => {
    // let capsule = getUsedGirlData(state, usedGirl).capsule

    // if (getIsDebug(state)) {
    //     return 0
    // }

    // return getCapsuleRadiusForCompute(capsule) * 2
    return getBoxSizeForCompute(state, usedGirl) * 2
}

let _getMaxDistance = (state: state, usedGirl) => {
    // let capsule = getUsedGirlData(state, usedGirl).capsule

    // if (getIsDebug(state)) {
    //     // return +Infinity

    //     return getBoxSizeForCompute(state, usedGirl) * 96
    // }

    // return getCapsuleRadiusForCompute(capsule) * 16
    return getBoxSizeForCompute(state, usedGirl) * 16
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
        else if (girlScale <= 400) {
            near = 10
        }
        else if (girlScale <= 1000) {
            near = 20
        }
        else if (girlScale <= 2000) {
            near = 30
        }
        else {
            near = 100
        }
    }

    return near
}

let _getCameraNearForFirstPerson = (girlScale, firstPersonCameraTarget_: firstPersonCameraTarget) => {
    let near
    if (firstPersonCameraTarget_ == firstPersonCameraTarget.Leg) {
        if (girlScale < 100) {
            near = 0.1
        }
        else if (girlScale <= 400) {
            near = 1
        }
        else if (girlScale <= 1000) {
            near = 2
        }
        else if (girlScale <= 2000) {
            near = 5
        }
        else {
            near = 10
        }
    }
    else {
        if (girlScale < 50) {
            near = 1
        }
        else if (girlScale <= 400) {
            near = 10
        }
        else if (girlScale <= 1000) {
            near = 20
        }
        else if (girlScale <= 2000) {
            near = 30
        }
        else {
            near = 100
        }
    }

    return near
}

export let buildCameraFar = (state: state, girlScale) => {
    // let far 
    // switch (getRenderSetting(state).renderAccuracy) {
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

    // let factor = getFarFactorByScale(girlScale)

    // return far * factor

    // return getNewestFarDistance(state)
    return getCameraFarByRenderAccuracy(state)
}

export let disableAllControls = (state: state) => {
    NullableUtils.forEach(controls => {
        controls.enabled = false
    }, getOrbitControls(getAbstractState(state)))
    NullableUtils.forEach(controls => {
        controls.enabled = false
    }, getFirstPersonControls(getAbstractState(state)))

    return state
}

export let updateThirdPersonControlsForChangeScale = (state: state) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    let abstractState = getAbstractState(state)

    let camera = Camera.getCurrentCamera(abstractState)

    abstractState = ThirdPersonControls.updateControls(abstractState,
        [
            _getCameraNearForThirdPerson(getScale(state, usedGirl), getThirdPersonCameraTarget(state)),
            buildCameraFar(state, getScale(state, usedGirl))
        ],
        isCameraCollision(state),
        getOrbitControls(abstractState), camera, getOrbitControlsTarget(state),
        // NullableUtils.return_(_getCameraPosition(state, camera, getOrbitControls(abstractState), getOrbitControlsTarget(state), scaleIncrease)),
        NullableUtils.return_(_getCameraPosition(state, usedGirl, camera, getOrbitControls(abstractState).target, getOrbitControlsTarget(state))),
        _getMinDistance(state, usedGirl),
        _getMaxDistance(state, usedGirl),
    )

    return setAbstractState(state, abstractState)
}

let _initThirdPersonControlsWhenUse = (state: state, controls, camera, isDebug) => {
    let usedGirl = usedGirlEnum.PlayerGirl

    state = disableAllControls(state)
    getOrbitControls(getAbstractState(state)).enabled = true


    state = _setState(state, {
        ..._getState(state),
        distanceRateData: [Flow.getFrameIndex(getAbstractState(state)), 0.5]
    })
    // state = _updateTargetToCameraDirection(state, Camera.getCurrentCamera(getAbstractState(state)),
    //     // getLittleManThirdPersonControlOrbitControlsTarget(state)
    //     getOrbitControlsTarget(state)
    // )

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _getCameraNearForThirdPerson(getScale(state, usedGirl), getThirdPersonCameraTarget(state)),
            buildCameraFar(state, getScale(state, usedGirl))
        ],
        isCameraCollision(state),
        controls, camera, getOrbitControlsTarget(state),
        // _getCameraInitialPosition(state),
        _getCameraPosition(state, usedGirl, camera, getOrbitControls(getAbstractState(state)).target, getOrbitControlsTarget(state)),
        _getMinDistance(state, usedGirl),
        _getMaxDistance(state, usedGirl),
        // isDebug ? Math.PI : Math.PI / 2,
        Math.PI,
        isDebug,
        getCameraRotateSpeedRatio(state, characterType.Giantess)
    )
    abstractState = CameraControls.initWhenUse(abstractState)

    // state = _updateDistanceRate(state, camera, getOrbitControlsTarget(state))
    state = _updateTargetToCameraDirection(state, Camera.getCurrentCamera(getAbstractState(state)), getOrbitControlsTarget(state))


    state = _handleShowMaterialForFirstPerson(state, usedGirl)


    return setAbstractState(state, abstractState)
}

let _initOribitControls = (controls, camera, { position, target }) => {
    camera = Camera.updatePosition(camera, position)

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
    // return NullableUtils.getExn(firstPersonControlsData.find(d => {
    //     return d.mmdCharacter == mmdCharacter
    // })).data

    return NullableUtils.getWithDefault(firstPersonControlsData.find(d => {
        return d.mmdCharacter == mmdCharacter
    }), {
        data: {
            getCameraPositionForFirstPersonControlsFunc: (api, girl) => new Vector3(0, 0, 0),
            hideMaterialNames: []
        }
    } as any).data
}

let _getCameraPositionForFirstPersonControls = (state: state, usedGirl) => {
    switch (getFirstPersonCameraTarget(state)) {
        case firstPersonCameraTarget.Eye:
            let { getCameraPositionForFirstPersonControlsFunc } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state, usedGirl))

            return getCameraPositionForFirstPersonControlsFunc(getModAPI(state), getGirl(state, usedGirl))
        case firstPersonCameraTarget.Leg:
            let girl = getGirl(state, usedGirl)

            // let bone1 = girl.getObjectByName("右ひざ")
            // let p1 = bone1.getWorldPosition(_v1)
            // let bone2 = girl.getObjectByName("左ひざ")
            // let p2 = bone2.getWorldPosition(_v2)
            // return p2.clone().add(p1.clone().sub(p2).multiplyScalar(0.5))

            let bone1 = girl.getObjectByName("右足")
            let p1 = bone1.getWorldPosition(_v1)
            let bone2 = girl.getObjectByName("左足")
            let p2 = bone2.getWorldPosition(_v2)

            let subY = getShankLength(state, usedGirl)

            return p2.clone().add(p1.clone().sub(p2).multiplyScalar(0.5)).sub(_v1.set(0, subY, 0))
        default:
            throw new Error("err")
    }

}

let _handleHideMaterialForFirstPerson = (state: state, usedGirl) => {
    let { hideMaterialNames } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state, usedGirl))
    let girlMesh = getGirlMesh(state, usedGirl)
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

let _handleShowMaterialForFirstPerson = (state: state, usedGirl) => {
    let { hideMaterialNames } = _getFirstPersonControlsData(getConfigData(state).firstPersonControlsData, getCurrentMMDCharacterName(state, usedGirl))

    let girlMesh = getGirlMesh(state, usedGirl)
    hideMaterialNames.forEach(name => {
        setMaterialVisibleByName(girlMesh, name, true)
    })

    return state
}

let _initFirstPersonControlsWhenUse = (state: state, usedGirl, controls, camera) => {
    state = disableAllControls(state)
    getFirstPersonControls(getAbstractState(state)).enabled = true



    state = setAbstractState(state, CameraControls.initWhenUse(getAbstractState(state)))

    camera.fov = 60


    // let targetToCameraDirection = computeTargetToCameraDirection(camera, getOrbitControlsTarget(state))

    camera = Camera.updatePosition(camera, _getCameraPositionForFirstPersonControls(state, usedGirl))

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

    controls.lookSpeed = 0.125 * 50 * getCameraRotateSpeedRatio(state, characterType.Giantess)

    if (Device.isMobileByState(getAbstractState(state))) {
        controls.lookSpeed *= 2
    }
    else {
        // controls.lookSpeed *= 0.8
        controls.lookSpeed *= 1.2

        // state = setAbstractState(state, CameraControls.initKeyState(getAbstractState(state)))
    }


    state = _handleHideMaterialForFirstPerson(state, usedGirl)

    return state
}


export let updateFirstPersonControls = (state: state) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    let camera = getCurrentCamera(getAbstractState(state))

    Camera.updatePosition(camera, _getCameraPositionForFirstPersonControls(state, usedGirl))

    state = _updateFirstPersonCameraNearAndFar(state, usedGirl)

    let api = getModAPI(state)


    if (
        (getCurrentPose(state, usedGirl) == pose.Sit
            && api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-sit-rotate") == 0
        )
        || (
            getAllStompAnimations(state).includes(getCurrentAnimationName(state, usedGirl))
            && api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-stomp-rotate") == 0
        )
    ) {
        return state
    }

    let controlRotationAngle = FirstPersonControls.computeTransformForCamera(getAbstractState(state), Camera.getFirstPersonControls(getAbstractState(state)))

    state = setGirlRotation(state, usedGirl,
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
    let usedGirl = usedGirlEnum.PlayerGirl
    state = setCameraType(state, cameraType.FirstPerson)

    state = _initFirstPersonControlsWhenUse(state, usedGirl, Camera.getFirstPersonControls(getAbstractState(state)), Camera.getCurrentCamera(getAbstractState(state)))

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

// export let getOrbitControlsZoom = (state: state) => {
//     return getOrbitControls(getAbstractState(state)).getZoom()
// }

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

// export let initWhenImportScene = (state: state) => {
export let updateCameraTargetFromSavedData = (state: state, cameraType_ = getCameraType(state)) => {
    if (isGiantessCharacterType(state)) {
        switch (cameraType_) {
            case cameraType.FirstPerson:
                state = NullableUtils.getWithDefault(
                    NullableUtils.map(target => {
                        return setFirstPersonCameraTarget(state, target)
                    }, getSavedCameraTarget(state, characterType.Giantess, cameraType.FirstPerson)),
                    state
                )
                // state = setFirstPersonCameraTarget(state, NullableUtils.getWithDefault(
                //     getSavedCameraTarget(state, characterType.Giantess, cameraType.FirstPerson),
                //     getFirstPersonCameraTarget(state)
                // ))
                break
            case cameraType.ThirdPerson:
                state = NullableUtils.getWithDefault(
                    NullableUtils.map(target => {
                        return setThirdPersonCameraTarget(state, target)
                    }, getSavedCameraTarget(state, characterType.Giantess, cameraType.ThirdPerson)),
                    state
                )
                // state = setThirdPersonCameraTarget(state, NullableUtils.getWithDefault(
                //     getSavedCameraTarget(state, characterType.Giantess, cameraType.ThirdPerson),
                //     getThirdPersonCameraTarget(state)
                // ))


                state = setFreeThirdPersonCameraTargetYOffset(state, getSavedFreeThirdPersonCameraTargetYOffset(state))
                break
        }


        // return getSavedCameraTarget(cameraType.ThirdPerson, characterType.Giantess).then((target: any) => {
        //     return NullableUtils.getWithDefault(
        //         NullableUtils.map(target => {
        //             return setThirdPersonCameraTarget(state, target)
        //         }, getSavedCameraTarget(cameraType.ThirdPerson, characterType.Giantess)),
        //         state
        //     )
        // }).then(state => {
        //     return readCameraTarget(cameraType.FirstPerson, characterType.Giantess).then((target: any) => {
        //         return NullableUtils.getWithDefault(
        //             NullableUtils.map(target => {
        //                 return setFirstPersonCameraTarget(state, target)
        //             }, target),
        //             state
        //         )
        //     })
        // })
    }

    return state
}

export let update = (state: state) => {
    // if (!hasGirl(state)) {
    if (!isGiantessCharacterType(state)) {
        return Promise.resolve(state)
    }

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

    state = disableAllControls(state)

    state = _setState(state, {
        ..._getState(state),

        cameraType: getRemainCameraType(getDefaultCameraType, _getState(state).cameraType),
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


        freeThirdPersonCameraTargetYOffset: 0,

        cameraZoom: _getDefaultZoom(),
        distanceRateData: [0, 0],
        targetToCameraDirection: new Vector3(0, 0, 0),

        savedCameraTarget: MutableRecordUtils.create(),
        savedCameraType: MutableRecordUtils.create(),
        savedFreeThirdPersonCameraTargetYOffset: 0,

        // savedCameraRotateSpeed: savedCameraRotateSpeed.Middle,
        savedCameraRotateSpeed: MutableRecordUtils.create(),

        savedThirdPersonCameraToTargetDistance: MutableRecordUtils.create(),

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

export let computeTransformForCamera = (state: state, usedGirl: usedGirl, characterType_: characterType, cameraType_): [number, number, number] => {
    let [forward, side] = CameraControls.computeTransformForCamera(getAbstractState(state), usedGirl, characterType_)

    let controlRotationAngle
    if (usedGirl == usedGirlEnum.PlayerGirl || usedGirl == usedGirlEnum.None) {
        switch (cameraType_) {
            case cameraType.ThirdPerson:
                controlRotationAngle = ThirdPersonControls.computeTransformForCamera(getAbstractState(state), getOrbitControls(getAbstractState(state)), characterType_)
                break
            case cameraType.FirstPerson:
                controlRotationAngle = FirstPersonControls.computeTransformForCamera(getAbstractState(state), Camera.getFirstPersonControls(getAbstractState(state)))
                break
            case cameraType.Shoot:
                controlRotationAngle = ShootControls.computeTransformForCamera(getOrbitControls(getAbstractState(state)))
                break
            case cameraType.No:
                controlRotationAngle = 0
                break
            default:
                throw new Error("err")
        }
    }
    else {
        controlRotationAngle = 0
    }

    return [controlRotationAngle, forward, side]
}

export let isFirstPersonCamera = (state: state) => {
    return getCameraType(state) == cameraType.FirstPerson
}

export let getSavedCameraType = (state: state, characterType_) => {
    return MutableRecordUtils.get(_getState(state).savedCameraType, characterType_)
}

// export let setSavedCameraType = (state: state, characterType_, cameraType_) => {
//     return _setState(state, {
//         ..._getState(state),
//         savedCameraType: MutableRecordUtils.set(_getState(state).savedCameraType, characterType_, cameraType_)
//     })
// }

let _setSavedCameraType = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedCameraType: value
    })
}

export let setSavedCameraType = (state: state, characterType_, cameraType_) => {
    // MutableRecordUtils.set(

    // NullableUtils.getWithDefault(
    //     MutableRecordUtils.get(_getState(state).savedCameraType, characterType_),
    //     MutableRecordUtils.create()
    // )
    // )

    return _setState(state, {
        ..._getState(state),
        savedCameraType: MutableRecordUtils.set(_getState(state).savedCameraType, characterType_, cameraType_)
    })
}

export let getSavedCameraTarget = (state: state, characterType_, cameraType_) => {
    return NullableUtils.bind(
        map => {
            return MutableRecordUtils.get(map, cameraType_)
        },
        MutableRecordUtils.get(_getState(state).savedCameraTarget, characterType_)
    )
}

export let setSavedCameraTarget = (state: state, characterType_, cameraType_, cameraTarget) => {
    return _setState(state, {
        ..._getState(state),
        savedCameraTarget: MutableRecordUtils.set(
            _getState(state).savedCameraTarget,
            characterType_,
            MutableRecordUtils.set(
                NullableUtils.getWithDefault(
                    MutableRecordUtils.get(_getState(state).savedCameraTarget, characterType_),
                    MutableRecordUtils.create()
                ),
                cameraType_,
                cameraTarget
            )
        )
    })
}

export let getSavedFreeThirdPersonCameraTargetYOffset = (state: state) => {
    return _getState(state).savedFreeThirdPersonCameraTargetYOffset
}

export let setSavedFreeThirdPersonCameraTargetYOffset = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedFreeThirdPersonCameraTargetYOffset: value
    })
}

let _setSavedCameraTarget = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedCameraTarget: value
    })
}

export let getSavedThirdPersonCameraToTargetDistance = (state: state, characterType_) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    let characterName
    if (isGiantessCharacterType(state)) {
        characterName = getCurrentMMDCharacterName(state, usedGirl)
    }
    else {
        characterName = getCurrentModelName(state)
    }

    // return MutableRecordUtils.get(_getState(state).savedThirdPersonCameraToTargetDistance, characterType_)
    return NullableUtils.bind(
        map => {
            return MutableRecordUtils.get(map, characterName)
        },
        MutableRecordUtils.get(_getState(state).savedThirdPersonCameraToTargetDistance, characterType_)
    )
}

let _setSavedThirdPersonCameraToTargetDistance = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedThirdPersonCameraToTargetDistance: value
    })
}

export let setSavedThirdPersonCameraToTargetDistance = (state: state, characterType_, value) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    let characterName
    if (isGiantessCharacterType(state)) {
        characterName = getCurrentMMDCharacterName(state, usedGirl)
    }
    else {
        characterName = getCurrentModelName(state)
    }

    return _setState(state, {
        ..._getState(state),
        // savedThirdPersonCameraToTargetDistance: MutableRecordUtils.set(_getState(state).savedThirdPersonCameraToTargetDistance, characterType_, value)
        savedThirdPersonCameraToTargetDistance: MutableRecordUtils.set(
            _getState(state).savedThirdPersonCameraToTargetDistance,
            characterType_,
            MutableRecordUtils.set(
                NullableUtils.getWithDefault(
                    MutableRecordUtils.get(_getState(state).savedThirdPersonCameraToTargetDistance, characterType_),
                    MutableRecordUtils.create()
                ),
                characterName,
                value
            )
        )
    })
}



let _buildCameraTypeCacheKey = () => `camera_cache_cameraType`

let _buildCameraTargetCacheKey = () => `camera_cache_cameraTarget`

let _buildFreeThirdPersonCameraTargetYOffsetCacheKey = () => `camera_cache_freeThirdPersonCameraTargetYOffsetCacheKey`

let _buildCameraRotateSpeedCacheKey = () => `camera_cache_cameraRotateSpeed`

let _buildThirdPersonCameraZoom = () => `_buildThirdPersonCameraZoom`

export let getCameraDataFromBackend = (state: state) => {
    return getCameraCache(_buildCameraTypeCacheKey()).then(cameraType_ => {
        return NullableUtils.getWithDefault(NullableUtils.map(cameraType_ => {
            return _setSavedCameraType(state, cameraType_)
        }, cameraType_), state)
    }).then(state => {
        return getCameraCache(_buildCameraTargetCacheKey()).then(cameraTarget => {
            return NullableUtils.getWithDefault(NullableUtils.map(cameraTarget => {
                return _setSavedCameraTarget(state, cameraTarget)
            }, cameraTarget), state)
        })
    }).then(state => {
        return getCameraCache(_buildFreeThirdPersonCameraTargetYOffsetCacheKey()).then(value => {
            return NullableUtils.getWithDefault(NullableUtils.map(value => {
                return setSavedFreeThirdPersonCameraTargetYOffset(state, value)
            }, value), state)
        })
    }).then(state => {
        return getCameraCache(_buildCameraRotateSpeedCacheKey()).then(savedCameraRotateSpeed => {
            return NullableUtils.getWithDefault(NullableUtils.map(savedCameraRotateSpeed => {
                return _setCameraRotateSpeed(state, savedCameraRotateSpeed)
            }, savedCameraRotateSpeed), state)
        })
    }).then(state => {
        return getCameraCache(_buildThirdPersonCameraZoom()).then(value => {
            return NullableUtils.getWithDefault(NullableUtils.map(value => {
                return _setSavedThirdPersonCameraToTargetDistance(state, value)
            }, value), state)
        })
    })
}

export let saveCameraType = (state: state) => {
    return setCameraCache(_buildCameraTypeCacheKey(), _getState(state).savedCameraType)
}

export let saveCameraTarget = (state: state) => {
    return setCameraCache(_buildCameraTargetCacheKey(), _getState(state).savedCameraTarget)
}

export let saveFreeThirdPersonCameraTargetYOffset = (state: state) => {
    return setCameraCache(_buildFreeThirdPersonCameraTargetYOffsetCacheKey(), _getState(state).savedFreeThirdPersonCameraTargetYOffset)
}

export let saveCameraRotateSpeed = (state: state) => {
    return setCameraCache(_buildCameraRotateSpeedCacheKey(), _getState(state).savedCameraRotateSpeed)
}

export let saveThirdPersonCameraZoom = (state: state) => {
    return setCameraCache(_buildThirdPersonCameraZoom(), _getState(state).savedThirdPersonCameraToTargetDistance)
}


export let getCameraRotateSpeed = (state: state, characterType_) => {
    return MutableRecordUtils.getWithDefault(_getState(state).savedCameraRotateSpeed, characterType_, cameraRotateSpeed.Middle)
}

let _setCameraRotateSpeed = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedCameraRotateSpeed: value
    })
}

export let setCameraRotateSpeed = (state: state, characterType_, value) => {
    return _setState(state, {
        ..._getState(state),
        savedCameraRotateSpeed: MutableRecordUtils.set(_getState(state).savedCameraRotateSpeed, characterType_, value)
    })
}

export let getCameraRotateSpeedRatio = (state: state, characterType_) => {
    return getCameraRotateSpeed(state, characterType_) / cameraRotateSpeed.Middle
}


export let getGiantessCameraTarget = (state: state, cameraType_) => {
    switch (cameraType_) {
        case cameraType.FirstPerson:
            return getFirstPersonCameraTarget(state)
        case cameraType.ThirdPerson:
            return getThirdPersonCameraTarget(state)
        default:
            throw new Error("err")
    }
}

// export let moveThirdPersonCameraForScreenShake = (state: state, offset: Vector3) => {
//     let camera = getCurrentCamera(getAbstractState(state))

//     let target = getOrbitControlsTarget(state)
//     camera.lookAt(target.clone().add(offset))
// }

// export let moveFirstPersonCameraForScreenShake = (state: state, offset: Vector3) => {
//     let camera = getCurrentCamera(getAbstractState(state))

//     let target = getOrbitControlsTarget(state)
//     camera.lookAt(target.clone().add(offset))
// }

// export let moveCameraForScreenShake = (state: state, offset: Vector3) => {
//     switch (getCameraType(state)) {
//         case cameraType.ThirdPerson:
//             moveThirdPersonCameraForScreenShake(state, offset)
//             break
//         case cameraType.FirstPerson:
//             moveFirstPersonCameraForScreenShake(state, offset)
//             break
//         default:
//             return
//     }
// }


export let getCameraNear = (state: state) => {
    return Camera.getCurrentCamera(getAbstractState(state)).near
}

export let getCameraFar = (state: state) => {
    return Camera.getCurrentCamera(getAbstractState(state)).far
}

export let setCameraFar = (state: state, far) => {
    Camera.getCurrentCamera(getAbstractState(state)).far = far

    return state
}

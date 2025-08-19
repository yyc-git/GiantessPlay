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
import { getCameraFar, getMaxDistance, getMinDistance, isCameraCollision, updateThirdPersonControlsByCameraData } from "./utils/LittleManCameraUtils"


export let getOrbitControlsTarget = (state: state, targetDirection): Vector3 => {
    let center = LittleMan.getBoxCenter(state)

    if (NullableUtils.isNullable(targetDirection)) {
        return center.setX(center.x - LittleMan.getBoxSizeForCompute(state) * 0.1)
            .setY(center.y + LittleMan.getBoxSizeForCompute(state) * 2)
    }

    // return NullableUtils.getExn(targetDirection)

    // return center.add(NullableUtils.getExn(targetDirection))
    return _getCameraInitialPosition(state).add(NullableUtils.getExn(targetDirection))
}

let _getCameraInitialPosition = (state) => {
    return LittleMan.getBoxCenter(state).add(
        new Vector3(LittleMan.getBoxSizeForCompute(state) * 0, LittleMan.getBoxSizeForCompute(state) * 2, 0)
    )
}

export let updateForTargetDirection = (state: state, targetDirection) => {
    Camera.getCurrentCamera(getAbstractState(state)).position.copy(
        _getCameraInitialPosition(state)
    )
    Camera.getCurrentCamera(getAbstractState(state)).lookAt(
        getOrbitControlsTarget(state, targetDirection)
    )

    return state
}

let _getCameraNear = () => {
    return 1
}

export let initFirstPersonControlsWhenUse = (state: state, controls, camera, isDebug, targetDirection) => {
    getOrbitControls(getAbstractState(state)).enabled = true

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _getCameraNear(),
            getCameraFar(state)
        ],
        isCameraCollision(state),
        controls, camera, getOrbitControlsTarget(state, targetDirection),
        _getCameraInitialPosition(state),
        getMinDistance(state),
        getMaxDistance(state),
        Math.PI,
        isDebug)
    abstractState = CameraControls.initWhenUse(abstractState)

    return setAbstractState(state, abstractState)
}

export let updateFirstPersonControls = updateThirdPersonControlsByCameraData

export let updateCamera = (state: state, velocity, targetDirection) => {
    return setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state, targetDirection),
        isCameraCollision(state)
    )
    )
}
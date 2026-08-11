import { Camera, Layer, NullableUtils, ThirdPersonControls, View } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../type/StateType"
import { getGirlScale, getState, setState } from "./CityScene"
import { Object3D, PerspectiveCamera, Vector3 } from "three"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State"
import { getIsDebug } from "../Scene"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { camera, littleManCamera, littleManThirdPersonCameraTarget, objectStateName } from "./type/StateType"
import * as LittleMan from "./little_man/LittleMan"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { markAllMeshesNotVisible } from "meta3d-jiehuo-abstract/src/utils/Object3DUtils"
import { getMaxDistance, getMinDistance, isCameraCollision, updateThirdPersonControlsByCameraData } from "./utils/LittleManCameraUtils"
import { getLittleManThirdPersonControlOrbitControlsTarget } from "./LittleManCamera"
import { disableAllControls, getCameraFar, getCameraRotateSpeedRatio } from "./Camera"
import { Scene } from "meta3d-jiehuo-abstract"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"

const _v1 = new Vector3();

let _computeTargetDirectionDistance = (state: state) => {
    let camera = getCurrentCamera(getAbstractState(state))

    let initialPosition = camera.position

    let target = getLittleManThirdPersonControlOrbitControlsTarget(state)

    return target.clone().sub(initialPosition)

}

let _computeTargetDirection = (state: state) => {
    return _computeTargetDirectionDistance(state).clone().normalize()
}

let _getShootCameraData = (state: state) => {
    // let camera = getCurrentCamera(getAbstractState(state))

    // let initialPosition = camera.position

    // let target = getLittleManThirdPersonControlOrbitControlsTarget(state)

    // let targetDirectionDistance = target.clone().sub(initialPosition)

    // let targetDirection = targetDirectionDistance.clone().normalize()


    // let rightVector = targetDirection.cross(
    //     _v1.set(0, 1, 0)
    // ).multiplyScalar(1)


    // let rightOffsetPosition = initialPosition.clone().add(rightVector)

    // let rightOffsetTarget = target.clone().add(rightVector)

    // let targetDirectionRatio = 0.1

    // let zoomInVector = targetDirectionDistance.clone().multiplyScalar(targetDirectionRatio)

    // let zoomInPosition = rightOffsetPosition.clone().add(zoomInVector)

    // let zoomInTarget = rightOffsetTarget.clone().add(zoomInVector)

    // let newTarget = target.clone().add(rightVector)
    // let newTarget = target

    // let cameraPosition = initialPosition.clone().add(targetDirectionDistance.clone().multiplyScalar(0.5))



    let cameraPosition = getOrbitControlsTarget(state).clone().add(_computeTargetDirection(state).clone().negate().multiplyScalar(1.5))



    // return [initialPosition, target, rightOffsetPosition, rightOffsetTarget]
    // return [initialPosition, rightOffsetPosition, rightOffsetTarget, targetDirectionDistance, targetDirectionRatio]
    // return [initialPosition, rightOffsetPosition, rightOffsetTarget, zoomInPosition, zoomInTarget]
    return cameraPosition
}

let _getCameraInitialPosition = (state: state) => {
    // return LittleMan.getBoxCenter(state).add(
    //     new Vector3(LittleMan.getBoxSizeForCompute(state, usedGirl) * 0, LittleMan.getBoxSizeForCompute(state, usedGirl) * 2, 0)
    // )
    let cameraPosition = _getShootCameraData(state)

    return cameraPosition
}

export let getOrbitControlsTarget = (state: state): Vector3 => {
    // let center = LittleMan.getBoxCenter(state)

    // // if (NullableUtils.isNullable(targetDirection)) {
    //     return center.setX(center.x - LittleMan.getBoxSizeForCompute(state, usedGirl) * 0.1)
    //         .setY(center.y + LittleMan.getBoxSizeForCompute(state, usedGirl) * 2)
    // // }

    // // return NullableUtils.getExn(targetDirection)

    // // return center.add(NullableUtils.getExn(targetDirection))
    // return _getCameraInitialPosition(state).add(NullableUtils.getExn(targetDirection))

    // let target = getOrbitControls(getAbstractState(state)).target.clone()

    // let [cameraPosition, newTarget] = _getShootCameraData(state)

    // return newTarget

    // return getLittleManThirdPersonControlOrbitControlsTarget(state)

    let center = LittleMan.getBoxCenter(state)

    return center.setY(center.y + LittleMan.getBoxSizeForCompute(state) * 3)

}

// export let updateForTargetDirection = (state: state, targetDirection) => {
//     Camera.getCurrentCamera(getAbstractState(state)).position.copy(
//         _getCameraInitialPosition(state)
//     )
//     Camera.getCurrentCamera(getAbstractState(state)).lookAt(
//         getOrbitControlsTarget(state, targetDirection)
//     )

//     return state
// }

let _getCameraNear = () => {
    return 1
}

export let initShootControlsWhenUse = (state: state, controls, camera, isDebug) => {
    state = disableAllControls(state)
    getOrbitControls(getAbstractState(state)).enabled = true

    let abstractState = ThirdPersonControls.initControls(getAbstractState(state),
        [
            _getCameraNear(),
            getCameraFar(state)
        ],
        isCameraCollision(state),
        controls, camera, getOrbitControlsTarget(state),
        _getCameraInitialPosition(state),
        getMinDistance(state),
        getMaxDistance(state),
        Math.PI,
        isDebug,
        getCameraRotateSpeedRatio(state, characterType.LittleMan)
    )
    abstractState = CameraControls.initWhenUse(abstractState)

    state = LittleMan.show(state)

    return setAbstractState(state, abstractState)
}

// export let updateShootControls = updateThirdPersonControlsByCameraData

// export let updateCamera = (state: state, velocity, targetDirection) => {
export let updateCamera = (state: state, velocity) => {
    return setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
        isCameraCollision(state)
    )
    )
}

// export let computeTransformForCamera = (): number => {
//     return 0
// }
export let computeTransformForCamera = (orbitControls): number => {
    return orbitControls.getAzimuthalAngle()
}

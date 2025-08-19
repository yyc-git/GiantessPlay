import { Quaternion, Ray, Vector3 } from "three"
import { state } from "../../../../../../type/StateType"
import { isPlayingAnimationByWeight, updateAnimation } from "../../../little_man/Animation"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { getOrbitControlsTarget, updateCamera, updateControlsWhenZoomOutToThirdPersonControls } from "../../../LittleManCamera"
import { getIsDebug } from "../../../../Scene"
import { getBox, getBoxCenter, getBoxSizeForCompute, getLittleManState, getStateMachine, setGunInititalTransform, setLittleManState, updateFsmState, updateStatus } from "../../../little_man/LittleMan"
import * as InitWhenImportScene from "../../../little_man/InitWhenImportScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCurrentGun } from "../../../little_man/Gun"
import { hideAim, showAim, updateAimHud } from "../../../little_man/Shoot"
import { updateAnimationCollision } from "../../../little_man/Collision"
import { animationName } from "../../../little_man_data/DataType"
import { getClimbState, move } from "../../../little_man/climb/ClimbManager"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { climbPlane, objectStateName } from "../../../type/StateType"

export let initWhenImportScene = state => {
    state = setLittleManState(state, {
        ...getLittleManState(state),
        updateControlsWhenZoomOutToThirdPersonControlsFunc: state => {
            return updateControlsWhenZoomOutToThirdPersonControls(state,
                getBoxCenter(state).add(
                    new Vector3(getBoxSizeForCompute(state) * 6, getBoxSizeForCompute(state) * 2, 0).multiplyScalar(3)
                ),
                getBoxCenter(state)
            )
        },
    })

    return InitWhenImportScene.initWhenImportScene(state)
}

export let update = (state: state) => {
    let promise
    if (
        isPlayingAnimationByWeight(state, animationName.Run, 0.5)
    ) {
        promise = move(state)
    }
    else {
        promise = Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    return promise.then(([state, velocity]) => {
        state = updateCamera(state, velocity)


        if (getIsDebug(state)) {
            setGunInititalTransform(state, NullableUtils.getExn(getCurrentGun(state)), getIsDebug(state))
        }

        if (StateMachine.isState(getStateMachine(state), objectStateName.Climb)) {
            if (getClimbState(state).climbPlane == climbPlane.Horrizon) {
                state = showAim(state)
            }
            else {
                state = hideAim(state)
            }
        }
        state = updateAimHud(state)

        return updateAnimation(state)
            .then(updateAnimationCollision)
            .then(updateFsmState)
            .then(updateStatus)
    })
}
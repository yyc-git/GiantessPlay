import { Quaternion, Ray, Vector3 } from "three"
import { state } from "../../../../../../type/StateType"
import { isPlayingAnimation, isPlayingAnimationByWeight, updateAnimation } from "../../../little_man/Animation"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { getOrbitControlsTarget, updateCamera, updateControlsWhenZoomOutToThirdPersonControls } from "../../../LittleManCamera"
import { getIsDebug } from "../../../../Scene"
import { getBox, getBoxCenter, getBoxSizeForCompute, getLittleManState, getMovableRanges, getStateMachine, isCanMove, setGunInititalTransform, setLittleManState, updateFsmState, updateStatus } from "../../../little_man/LittleMan"
import * as InitWhenImportScene from "../../../little_man/InitWhenImportScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCurrentGun, update as updateGun } from "../../../little_man/Gun"
import { updateAnimationCollision } from "../../../little_man/Collision"
import { animationName } from "../../../little_man_data/DataType"
import { getClimbState, move } from "../../../little_man/climb/ClimbManager"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { climbPlane, collisionPart, objectStateName } from "../../../type/StateType"
import { hideAim, showAim } from "../../../little_man/AimUtils"
import { isCurrentMainEventName } from "../../../game_event/GameEvent"
import { eventName } from "../../../data/biwu/level3/GameEventData"
import { getPosition, setPosition, setPositionAndComputeBox } from "../../../little_man/Transform"
import { isInXZRange } from "../../city1/soldier/utils/CommanderUtils"
import { isNotInMovableRanges } from "../../../little_man/Utils"
import { isCanMove as isCanMoveManageScene } from "./ManageScene"
import { getUsedGirl } from "../Utils"

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

// /*! 
// fix: boss关卡半空了
// fix: Also I want to report a bug on the 3rd boss, when I climbed on her for the first time and reach her belly, I was teleported mid air and couldn't do any action or shoot so I had to restart, yet the next time I reached 3rd boss, I decided not to climb her and to her... panties and then I was teleported to her belly but I was able to shoot her that time
// * 
// */
// let _fixMaybeDropToGroundBug = (state: state) => {
//     if (!isCurrentMainEventName(state, eventName.GoToTrigone)
//         /*! consider height will decrease when to front breast zone or cloth is destory, so decrease 5
//         * 
//         */
//         && (getPosition(state).y < getPositionYOnTorsor() - 5
//             ||
//             getPosition(state).y > getPositionYOnTorsor() * 1.1
//             || isNotInMovableRanges(getPosition(state), getMovableRanges(state))
//         )
//     ) {
//         state = setPositionAndComputeBox(state, getLevelData(state, usedGirl).getLittleManInitPosition(state))
//     }

//     return state
// }

export let update = (state: state) => {
    let promise

    let usedGirl = getUsedGirl()
    if (
        isCanMove(state)
        && isCanMoveManageScene(state)
    ) {
        promise = move(state, usedGirl)
    }
    else {
        promise = Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    return promise.then(([state, velocity]) => {
        state = updateCamera(state, velocity)

        state = updateGun(state)

        if (StateMachine.isState(getStateMachine(state), objectStateName.Climb)) {
            if (getClimbState(state).climbPlane == climbPlane.Horrizon) {
                state = showAim(state)
            }
            else {
                state = hideAim(state)
            }
        }

        return updateAnimation(state)
            .then(updateAnimationCollision)
            .then(state => {
                return updateFsmState(state, ([collisionPart_, shape]) => {
                    switch (collisionPart_) {
                        case collisionPart.RightHand:
                        case collisionPart.LeftHand:
                            return true
                        default:
                            return false
                    }
                })
            })
            .then(updateStatus)
    })
    // .then(_fixMaybeDropToGroundBug)
}
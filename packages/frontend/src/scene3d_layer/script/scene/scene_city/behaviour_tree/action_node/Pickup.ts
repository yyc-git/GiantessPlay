import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getTarget, hasTarget, markFinish } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, isSmallGiantess } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../manage/city1/PathFind"
import { getIsDebug } from "../../../Scene"
import { getGirlScale, setGirlPosition } from "../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { characterType, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"

import { isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { isMoveCollisioned } from "../../girl/Move"
import { actionName } from "../../data/DataType"
import { getCurrentPose, isPose } from "../../girl/Pose"
import { lookatTarget, triggerAction, triggerActionWithCompleteFunc } from "./Utils"
import { hasPickData } from "../../girl/PickPoseUtils"
import { getValue, triggerAction as triggerGirlAction } from "../../girl/Girl"
import { Console } from "meta3d-jiehuo-abstract"
// import { isCanPickup } from "../../../../../mod/PropOtherMod"

let _isTargetValid = (state: state, usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ type }) => {
            switch (type) {
                case targetType.Building:
                    return false
                case targetType.MilltaryVehicle:
                    // return getGirlScale(state, usedGirl) > getValue(state).minScaleAsSmallGiantess
                    return !isSmallGiantess(state, usedGirl)
                default:
                    return true
            }
        }, getTarget(state, usedGirl)),
        false
    )
}

export let pickup: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("pickup")

    // if (!isCanPickup(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }


    if (hasPickData(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    }

    if (!_isTargetValid(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    if (!hasTarget(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }


    // let actionName_
    // switch (getCurrentPose(state, usedGirl)) {
    //     case pose.Stand:
    //         actionName_ = actionName.Pickup
    //         break
    //     case pose.Pick:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }
    let actionName_ = actionName.Pickup

    // if (hasPickData(state, usedGirl)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    // }

    state = lookatTarget(state, (state, lookatQuaternion) => lookatQuaternion, usedGirl)

    // return judgeAttackRangeAndTriggerActionWithCompleteFunc(state,
    //     [
    //         triggerGirlAction,
    //         (state, id) => {
    //             if (!hasPickData(state, usedGirl)) {
    //                 return markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Fail)
    //             }

    //             return markFinish(state, usedGirl,  id, behaviourTreeNodeExecuteResult.Success)
    //         },
    //     ],
    //     // actionName_, id, attackRange.Small)
    //     actionName_, id, attackRange.PickRange)
    return triggerActionWithCompleteFunc(state, [
        triggerGirlAction,
        state => {
            if (!hasPickData(state, usedGirl)) {
                return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Fail)
            }

            return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success)
        }
    ], usedGirl, actionName_, id)
}

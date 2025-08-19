import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getTarget, markFinish } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation } from "../../girl/Utils"
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
import { road, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"

import { isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { isMoveCollisioned } from "../../girl/Move"
import { actionName } from "../../data/DataType"
import { getCurrentPose, isPose } from "../../girl/Pose"
import { judgeAttackRangeAndTriggerAction, judgeAttackRangeAndTriggerActionWithCompleteFunc, lookatTarget, triggerAction } from "./Utils"
import { hasPickData } from "../../girl/PickPose"
import { getName, getValue, triggerAction as triggerGirlAction } from "../../girl/Girl"
import { Console } from "meta3d-jiehuo-abstract"

let _isTargetValid = (state: state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ type }) => {
            switch (type) {
                case targetType.Building:
                    return false
                case targetType.MilltaryVehicle:
                    return getGirlScale(state) > getValue(state).minScaleAsSmallGiantess
                default:
                    return true
            }
        }, getTarget(state)),
        false
    )
}

export let pickup: actionNodeFunc = (state, id) => {
    Console.log("pickup")

    if (hasPickData(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    }

    if (!_isTargetValid(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    let actionName_
    switch (getCurrentPose(state)) {
        case pose.Stand:
            actionName_ = actionName.Pickup
            break
        case pose.Pick:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
        case pose.Crawl:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    // if (hasPickData(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
    // }

    state = lookatTarget(state)

    return judgeAttackRangeAndTriggerActionWithCompleteFunc(state,
        [
            triggerGirlAction,
            (state, id) => {
                if (!hasPickData(state)) {
                    return markFinish(state, id, behaviourTreeNodeExecuteResult.Fail)
                }

                return markFinish(state, id, behaviourTreeNodeExecuteResult.Success)
            },
        ],
        // actionName_, id, attackRange.Small)
        actionName_, id, attackRange.Middle)
}

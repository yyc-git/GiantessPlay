import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getTarget, hasTarget, markFinish } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, getPivotWorldPosition } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../manage/city1/PathFind"
import { actionName, animationName } from "../../data/DataType"
import { judgeAttackRangeAndTriggerAction, lookatTarget as lookatTargetUtils, triggerAction } from "./Utils"
import { getCurrentPose } from "../../girl/Pose"
import { Console } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"

const _v1 = /*@__PURE__*/ new Vector3();

export let lookatTarget = (state: state) => {
    return lookatTargetUtils(state, (state, lookatQuaternion) => {
        return TransformUtils.rotateOnWorldAxis(
            lookatQuaternion, Math.PI / 18, _v1.set(0, 1, 0)
        )
    })
}

export let stomp: actionNodeFunc = (state, id) => {
    Console.log("stomp")

    let actionName_
    switch (getCurrentPose(state)) {
        case pose.Stand:
        case pose.Pick:
            actionName_ = actionName.Stomp
            break
        case pose.Crawl:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }


    if (!hasTarget(state)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    state = lookatTarget(state)

    // return judgeAttackRangeAndTriggerAction(state, actionName_, id, attackRange.Big)
    return triggerAction(state, actionName_, id)
}

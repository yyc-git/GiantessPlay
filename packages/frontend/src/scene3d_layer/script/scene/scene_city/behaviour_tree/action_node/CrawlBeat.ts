import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { getId, getTarget, hasTarget, markFinish, setId } from "../BehaviourTreeManager"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation, getPivotWorldPosition } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getStep } from "../../manage/city1/PathFind"
import { actionName, animationName } from "../../data/DataType"
import { finish, lookatTarget as lookatTargetUtils, triggerAction, triggerActionAndNotMarkFinish } from "./Utils"
import { getCurrentPose } from "../../girl/Pose"
import { Console } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getCrawlBeatBlockService } from "../../../../../mod/SkillGiantessMod"

const _v1 = /*@__PURE__*/ new Vector3();

let _lookatTarget = (state: state, usedGirl) => {
    return lookatTargetUtils(state, (state, lookatQuaternion) => {
        return TransformUtils.rotateOnWorldAxis(
            lookatQuaternion, Math.PI / 18, _v1.set(0, 1, 0)
        )
    }, usedGirl)
}


export let crawlBeat: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("crawlBeat")

    if (!hasTarget(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    state = _lookatTarget(state, usedGirl)

    let actionName_ = getCrawlBeatBlockService(state).getActionName()

    return triggerAction(state, usedGirl, actionName_, id)
}
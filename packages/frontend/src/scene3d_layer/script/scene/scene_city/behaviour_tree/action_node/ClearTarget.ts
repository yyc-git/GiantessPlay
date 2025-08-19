import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, attackRange, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import {  getStep } from "../../manage/city1/PathFind"
import { actionName, animationName } from "../../data/DataType"
import { judgeAttackRangeAndTriggerAction, triggerAction } from "./Utils"
import { getCurrentPose } from "../../girl/Pose"
import * as BehaviourTreeManager from "../BehaviourTreeManager"
import { Console } from "meta3d-jiehuo-abstract"

export let clearTarget: actionNodeFunc = (state, id) => {
    Console.log("clearTarget")

    state = BehaviourTreeManager.clearTarget(state)

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Success])
}

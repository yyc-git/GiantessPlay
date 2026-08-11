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
import { getBreastPressBlockService } from "../../../../../mod/SkillGiantessMod"
import { Event } from "meta3d-jiehuo-abstract"
import { getEndBreastPressBackEventName } from "../../../../../utils/EventUtils"
import { markIsRunning } from "../../utils/BehaviourManagerUtils"
// import { isCanBreastPress } from "../../../../../mod/PropOtherMod"
// import { getGiantessControllerBlockState } from "../../../../../mod/PropOtherMod"
// import { actionPrior } from "prop-artifact-giantesscontroller/src/script/State"

// export let breastPress: actionNodeFunc = (state, usedGirl, id ) => {
//     Console.log("breastPress")

//     // if (getTarget(state, usedGirl).type == targetType.Building) {
//     //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//     // }

//     // if (!isCanBreastPress(state)) {
//     //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//     // }


//     // let actionName_
//     // switch (getCurrentPose(state, usedGirl)) {
//     //     case pose.Stand:
//     //     case pose.Pick:
//     //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
//     //     case pose.Crawl:
//     //         actionName_ = actionName.BreastPress
//     //         break
//     // }
//     let actionName_ = actionName.BreastPress

//     state = lookatTarget(state, (state, lookatQuaternion)=>lookatQuaternion, usedGirl)

//     // return judgeAttackRangeAndTriggerAction(state, actionName_, id, attackRange.Middle)
//     return triggerAction(state, usedGirl, actionName_, id)
// }


export let breastPress: actionNodeFunc = (state, usedGirl, id) => {
    Console.log("breastPress")

    // if (state.config.littleManConfig.isOnlyPickup) {
    // if (!isCanBreastPress(state)) {
    //     return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }


    // let actionName_
    // switch (getCurrentPose(state, usedGirl)) {
    //     case pose.Stand:
    //     case pose.Pick:
    //         actionName_ = actionName.BreastPress
    //         break
    //     case pose.Crawl:
    //         return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    // }
    // let actionName_ = actionName.BreastPress
    if (!hasTarget(state, usedGirl)) {
        return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
    }

    let actionName_ = getBreastPressBlockService(state).getActionName()

    state = setId(state, usedGirl, actionName_, id)
    // state = markIsRunning(state, usedGirl,true)

    // state = lookatTarget(state, (state, lookatQuaternion)=>lookatQuaternion, usedGirl)

    // return judgeAttackRangeAndTriggerAction(state, actionName_, id, attackRange.Big)
    // return triggerAction(state, usedGirl, actionName_, id)
    return triggerActionAndNotMarkFinish(state, usedGirl, actionName_, id, state => {
        return finish(state, usedGirl, id, actionName_)
    })
}

let _breastPressBackEndHandler = (state: state, { userData }) => {
    let { usedGirl } = userData
    let actionName_ = getBreastPressBlockService(state).getActionName()

    return NullableUtils.getWithDefault(
        NullableUtils.map(id => {
            return markFinish(state, usedGirl, id, behaviourTreeNodeExecuteResult.Success)
        }, getId(state, usedGirl, actionName_)),
        Promise.resolve(state)
    )
}


export let initWhenImportScene = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getEndBreastPressBackEventName(), _breastPressBackEndHandler))

    return state
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getEndBreastPressBackEventName(), _breastPressBackEndHandler))

    return state
}
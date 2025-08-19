import { state } from "../../../../../type/StateType"
import { actionName } from "../../data/biwu/level2/DataType"
import { playBiggerAnimation, playSmallerToHalfSizeAnimation } from "../../girl/Animation"
import { isActionTriggering, isDamageAction, isTriggerAction, resetIsTriggerAction, setTriggerAction } from "../../girl/Girl"
import { result } from "../../type/StateType"

let _isActionValid = (state: state, name: actionName) => {
    // if (!hasGirlMesh(state)) {
    //     return false
    // }

    // if (name == actionName.Smaller
    //     // && (
    //     //     isChangeScaling(state) || getGirlScale(state) <= getValue(name).minScale
    //     // )
    //     && getGirlScale(state) > getValue(name).minScale
    // ) {
    //     return true
    // }

    // if (name == actionName.Bigger
    //     && (
    //         isChangeScaling(state) || (!getIsBiggerNoLimit(state) && getGirlScale(state) >= getValue(name).maxScale)
    //     )
    // ) {
    //     return false
    // }


    // if (!_isBelongToCurrentPoseAndScaleState(state, name)) {
    //     return false
    // }


    // let { excitement } = getSkillData(state, name)

    // if (isSubExcitement && !isExcitementEnough(state, excitement)) {
    //     return false
    // }


    if (isActionTriggering(state, name as any)) {
        return false
    }


    // if (name == actionName.Bigger) {
    //     return true
    // }

    // if (!isNotDamageState(getStateMachine(state))) {
    //     return false
    // }

    // if (isKeepPoseAnimation(getCurrentAnimationName(state))) {
    //     return true
    // }

    // switch (name) {
    //     case actionName.Run:
    //         if (isTriggerAction(state, actionName.Bigger)
    //         ) {
    //             return false
    //         }

    //         return getCurrentAnimationName(state) == animationName.Walk
    //     case actionName.Stomp:
    //         return getCurrentAnimationName(state) == animationName.Walk || isActionState(state, actionState.Run)
    //     default:
    //         return false
    // }

    return true
}

export let triggerAction = (state, name: actionName): Promise<[state, result]> => {
    if (isDamageAction(name as any)) {
        state = setTriggerAction(state, name)
        return Promise.resolve([state, result.Success])
    }


    // if (isJudgeRun && name == actionName.Run) {
    //     if (isActionTriggering(state, actionName.Run)) {
    //         state = setActionState(state, actionState.Initial)
    //     }
    //     else {
    //         state = setActionState(state, actionState.Run)
    //     }


    //     // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //     return Promise.resolve([state, result.Success])
    // }




    if (!_isActionValid(state, name)) {
        // return Promise.resolve([state, result.Fail])
        return Promise.resolve([state, result.Success])
    }


    // if (isSubExcitement) {
    //     let { excitement } = getSkillData(state, name)

    //     state = subExcitement(state, excitement)
    // }



    state = setTriggerAction(state, name)

    // switch (name) {
    //     case actionName.Bigger:
    //         // state = setActionState(state, actionState.Initial)

    //         state = playBiggerAnimation(state, (state) => {
    //             // state = setScaleState(state, scaleState.Big)
    //             // state = setNeedUpdateSkillBar(state, true)
    //             // state = InitWhenImportScene.refreshBiggerTime(state)

    //             if (isTriggerAction(state, actionName.Bigger)) {
    //                 state = resetIsTriggerAction(state)
    //             }

    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve([state, result.Success])
    //         })
    //         break
    //     case actionName.Smaller:
    //         // state = setActionState(state, actionState.Initial)

    //         state = playSmallerToHalfSizeAnimation(state, (state) => {
    //             // state = setScaleState(state, scaleState.Normal)
    //             // state = setNeedUpdateSkillBar(state, false)

    //             if (isTriggerAction(state, actionName.Smaller)) {
    //                 state = resetIsTriggerAction(state)
    //             }


    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve([state, result.Success])
    //         })
    //         break
    //     // case actionName.Run:
    //     //     state = setActionState(state, actionState.Run)
    //     //     break
    // }

    return Promise.resolve([state, result.Success])
}
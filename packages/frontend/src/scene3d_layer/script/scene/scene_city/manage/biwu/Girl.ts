import { Vector3 } from "three"
import { state } from "../../../../../type/StateType"
import { animationName } from "../../data/biwu/DataType"
import { actionName } from "../../data/biwu/level2/DataType"
import { isPlayingAnimation, playBiggerAnimation, playSmallerAnimation, updateAnimation } from "../../girl/Animation"
import { getAllUsedMMDData, isActionTriggering, isDamageAction, isTriggerAction, resetIsTriggerAction, setTriggerAction } from "../../girl/Girl"
import { move } from "../../girl/Move"
import { result } from "../../type/StateType"
import { updateAnimationCollision } from "../../girl/Collision"
import * as GirlFSMState from "../../girl/FSMState"
import { createDestroyingState } from "./FSMState"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { getAbstractState } from "../../../../../state/State"
import { buildBossStatusUpdateEventNameEventData } from "../../../../../utils/EventUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as InitWhenImportScene from "../../girl/InitWhenImportScene"
import { updateUtils } from "../../girl/utils/LevelGirlUtils"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { getUsedGirl } from "./Utils"

let _isActionValid = (state: state, usedGirl, name: actionName) => {
    // if (!hasGirlMesh(state)) {
    //     return false
    // }

    // if (name == actionName.Smallest
    //     // && (
    //     //     isChangeScaling(state, usedGirl) || getGirlScale(state, usedGirl) <= getValue(name).scaleIncrease
    //     // )
    //     && getGirlScale(state, usedGirl) > getValue(name).scaleIncrease
    // ) {
    //     return true
    // }

    // if (name == actionName.Bigger
    //     && (
    //         isChangeScaling(state, usedGirl) || (!getIsBiggerNoLimit(state) && getGirlScale(state, usedGirl) >= getValue(name).maxScale)
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


    if (isActionTriggering(state, usedGirl, name as any)) {
        return false
    }


    // if (name == actionName.Bigger) {
    //     return true
    // }

    // if (!isNotDamageState(getStateMachine(state))) {
    //     return false
    // }

    // if (isKeepPoseAnimation(state, name, getCurrentAnimationName(state, usedGirl))) {
    //     return true
    // }

    // switch (name) {
    //     case actionName.Run:
    //         if (isTriggerAction(state, actionName.Bigger)
    //         ) {
    //             return false
    //         }

    //         return getCurrentAnimationName(state, usedGirl) == animationName.Walk
    //     case actionName.Stomp:
    //         return getCurrentAnimationName(state, usedGirl) == animationName.Walk || isActionState(state, actionState.Run)
    //     default:
    //         return false
    // }

    return true
}

export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    if (isDamageAction(state, name as any)) {
        state = setTriggerAction(state, usedGirl, name)
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




    if (!_isActionValid(state, usedGirl, name)) {
        // return Promise.resolve([state, result.Fail])
        return Promise.resolve([state, result.Success])
    }


    // if (isSubExcitement) {
    //     let { excitement } = getSkillData(state, name)

    //     state = subExcitement(state,usedGirl, excitement)
    // }



    state = setTriggerAction(state, usedGirl, name)

    // switch (name) {
    //     case actionName.Bigger:
    //         // state = setActionState(state, actionState.Initial)

    //         state = playBiggerAnimation(state, (state) => {
    //             // state = setLastScaleChangeTime(state, scaleState.Big)
    //             // state = setNeedShowSkillBar(state, usedGirl, true)
    //             // state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)

    //             if (isTriggerAction(state, actionName.Bigger)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
    //             }

    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve([state, result.Success])
    //         })
    //         break
    //     case actionName.Smallest:
    //         // state = setActionState(state, actionState.Initial)

    //         state = playSmallerAnimation(state, (state) => {
    //             // state = setLastScaleChangeTime(state, scaleState.Normal)
    //             // state = setNeedShowSkillBar(state, usedGirl, false)

    //             if (isTriggerAction(state, actionName.Smallest)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
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

export let update = (state: state) => {
    let usedGirl = getUsedGirl()

    return updateUtils(state, usedGirl, state => {
        return GirlFSMState.update(state, createDestroyingState, usedGirl)
    })
}

export let initWhenImportScene = state => InitWhenImportScene.initWhenImportScene(state, getAllUsedMMDData(state))
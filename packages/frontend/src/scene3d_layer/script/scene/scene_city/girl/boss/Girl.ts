import { cameraType, state } from "../../../../../type/StateType"
import { setCamp } from "../../manage/city1/Army"
import { camp, result, usedGirlEnum } from "../../type/StateType"
import { damageUtils, setGirlScale, getValue, hasGirlMesh, isActionTriggering, isDamageAction, setTriggerAction, changeToInitialScale, setNeedUpdateStatusName, isSmallerAction, addCurrentUsedGirl, buildNameByUsedGirl } from "../Girl"
import { addGirl, removeGirl } from "../InitWhenImportScene"
import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
import { isCloth, updateHpData } from "../Cloth"
import { setExcitement } from "../Excitement"
import { updateGirlValue } from "../../difficulty/DifficultyUtils"
import { actionName, animationName } from "../../data/DataType"
import { isControlledState, isNotDamageState } from "../../utils/FSMStateUtils"
import { getStateMachine } from "../FSMState"
import { getCurrentAnimationName, isKeepPoseAnimation } from "../Animation"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { getEnhenceBossGiantessBossLevel } from "../../difficulty/HeatImplementer"
import { applyUpgradeFuncsByRandomLevel } from "../../build/Upgrade"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getUpgradeFuncs } from "../../../../../mod/UpgradeMod"
import { girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAutoDifficulty } from "../../difficulty/Difficulty"
import { getIsDebug } from "../../../Scene"
import { getMMDName } from "../../../../../mod/MMDMod"
import { isActionValid as isActionValidMod, triggerAction as triggerActionMod } from "../../../../../mod/SkillGiantessMod"

let _addUpgradeFuncs = (state: state) => {
    let enhenceBossGiantessLevel = getEnhenceBossGiantessBossLevel(state)
    // let countFactor = getAutoDifficulty(state)
    // let countFactor = Math.round(getAutoDifficulty(state) / 3)
    let countFactor = Math.round(getAutoDifficulty(state) / 2)

    // let upgradeFuncCount = Math.round(enhenceBossGiantessLevel / 2) + countFactor
    let upgradeFuncCount = Math.round(enhenceBossGiantessLevel / 1.5) + countFactor
    // let upgradeFuncCount = enhenceBossGiantessLevel

    if (getIsDebug(state)) {
        upgradeFuncCount = +Infinity
    }

    return applyUpgradeFuncsByRandomLevel(
        state,
        NumberUtils.randomSelectCount(
            getUpgradeFuncs(state, girlType.BossGiantess),
            upgradeFuncCount
        ),
        usedGirlEnum.BossGiantess
    )
}

export let addBossGiantess = (state: state, usedMMDData, worldPosition, worldQuaternion) => {
    let usedGirl = usedGirlEnum.BossGiantess
    // state = setCurrentUsedGirl(state, usedGirlEnum.BossGiantess)
    state = addCurrentUsedGirl(state, usedGirl)
    // state = setCamp(state, getName(), camp.Giantess)
    state = setCamp(state, buildNameByUsedGirl(usedGirl), camp.Enemy)
    // state = setCurrentStudyActionsUtils(state)

    state = updateGirlValue(state, usedGirl)

    state = setExcitement(state, usedGirl, 0)

    state = changeToInitialScale(state, usedGirl)

    return addGirl(state, usedGirl, usedMMDData, worldPosition, worldQuaternion).then(state => {
        return setNeedUpdateStatusName(state, usedGirl, `${getLanguageTextData(state, languageKey.Giantess)} ${getMMDName(state, usedGirl)}`)
    }).then(_addUpgradeFuncs)
}

let _isActionValid = (state: state, usedGirl, name: actionName) => {
    if (!hasGirlMesh(state, usedGirl)) {
        return false
    }

    // if (!getCurrentStudyActionNames(state).includes(name)) {
    //     return false
    // }

    // if (name == actionName.Smallest
    //     // && (
    //     //     isChangeScaling(state, usedGirl) || getGirlScale(state, usedGirl) <= getValue(state).scaleIncrease
    //     // )
    //     && getGirlScale(state, usedGirl) > getValue(state).scaleIncrease
    // ) {
    //     return true
    // }

    // if (name == actionName.Bigger
    //     && (
    //         isChangeScaling(state, usedGirl)

    //         // || (!getIsBiggerNoLimit(state) && getGirlScale(state, usedGirl) >= getMaxScale(state, getValue(state)))
    //         || getGirlScale(state, usedGirl) >= getMaxScale(state, getValue(state))
    //         // || (isGiantessCharacterType(state) && PlayerGirl.getBiggerCount(state, usedGirl) >= PlayerGirl.getMaxBiggerCount(state))
    //         // || (getBiggerCount(state, usedGirl) >= getMaxBiggerCount(state))
    //     )
    // ) {
    //     return false
    // }


    // if (name == actionName.Reborn) {
    //     return true
    // }


    // if (!isBelongToCurrentPoseAndScaleState(state, name)) {
    //     return false
    // }


    // if (isCheckExcitement) {
    // let { excitement } = getSkillData(state, name)

    // if (!isExcitementEnough(state, excitement)) {
    //     return false
    // }
    // }


    // if (!isActionValidMod(state, name)) {
    //     return false
    // }


    if (isActionTriggering(state, usedGirl, name)) {
        return false
    }


    // if (name == actionName.Bigger) {
    //     return true
    // }

    if (!isNotDamageState(getStateMachine(state, usedGirl)) || isControlledState(state, getStateMachine(state, usedGirl))) {
        return false
    }

    if (isKeepPoseAnimation(state, name, getCurrentAnimationName(state, usedGirl))) {
        return true
    }

    switch (name) {
        // case actionName.Run:
        //     if (isTriggerAction(state, actionName.Bigger)
        //     ) {
        //         return false
        //     }

        //     return getCurrentAnimationName(state, usedGirl) == animationName.Walk
        // case actionName.Stomp:
        //     // return getCurrentAnimationName(state, usedGirl) == animationName.Walk || isActionState(state, actionState.Run)
        //     return getCurrentAnimationName(state, usedGirl) == animationName.Walk
        default:
            if (isActionValidMod(state, usedGirl, name)) {
                return true
            }

            return false
    }
}

// export let triggerAction = (state, name: actionName, isJudgeRun = false, isSubExcitement = true): Promise<[state, result]> => {
export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    if (isDamageAction(state, name)) {
        state = setTriggerAction(state, usedGirl, name)
        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }


    // if (isJudgeRun && name == actionName.Run) {
    // if (name == actionName.Run) {
    //     if (isActionTriggering(state, actionName.Run)) {
    //         state = setActionState(state, actionState.Initial)
    //     }
    //     else {
    //         state = setActionState(state, actionState.Run)
    //     }


    //     // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //     return Promise.resolve([state, result.Success])
    // }




    // if (!_isActionValid(state, name, isSubExcitement)) {
    if (!_isActionValid(state, usedGirl, name)) {
        return Promise.resolve([state, result.Fail])
    }


    // if (isSubExcitement) {
    // let { excitement } = getSkillData(state, name)

    // state = subExcitement(state,usedGirl, excitement)
    // }



    if (!isSmallerAction(name)) {
        state = setTriggerAction(state, usedGirl, name)
    }


    // switch (name) {
    //     case actionName.Bigger:
    //         state = setActionState(state, actionState.Initial)

    //         // if (isGiantessCharacterType(state)) {
    //         state = setBiggerCount(state,usedGirl,  getBiggerCount(state, usedGirl) + 1)
    //         // }
    //         // else if (isWildGiantess(state, usedGirl)) {
    //         //     state = WildGiantess.setBiggerCount(state,usedGirl,  WildGiantess.getBiggerCount(state, usedGirl) + 1)
    //         // }
    //         // else if (isEnemyGiantess(state, usedGirl)) {
    //         //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  EnemyGiantess.getBiggerCount(state, usedGirl) + 1)
    //         // }
    //         // else if (isPlayerGoddess(state, usedGirl)) {
    //         //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  PlayerGoddess.getBiggerCount(state, usedGirl) + 1)
    //         // }

    //         state = playBiggerAnimation(state, [(state) => {
    //             state = setLastScaleChangeTime(state, scaleState.Big)
    //             state = setNeedShowSkillBar(state, usedGirl, true)
    //             state = refreshBiggerTime(state, usedGirl)

    //             if (isTriggerAction(state, actionName.Bigger)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
    //             }

    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve(state)
    //         },
    //         state => {
    //             let currentScale = getScale(state, usedGirl)

    //             let increaseScale
    //             // if (currentScale < 100) {
    //             //     increaseScale = getValue(state).scaleIncrease * 3
    //             // }
    //             // else if (currentScale < 400) {
    //             //     increaseScale = getValue(state).scaleIncrease * 6
    //             // }
    //             // else {
    //             //     increaseScale = getValue(state).scaleIncrease * 10
    //             // }
    //             increaseScale = getActiveBiggerIncreaseScale(state)



    //             // if (isGiantessCharacterType(state)) {
    //             // increaseScale = getEnhanceIncreaseScale(state, increaseScale, getBiggerEnhanceLevel(state))
    //             // }

    //             return [
    //                 currentScale + increaseScale,
    //                 1
    //             ]
    //         },
    //         ])
    //         break
    //     case actionName.Smallest:
    //         state = setActionState(state, actionState.Initial)

    //         state = playSmallerAnimation(state, (state) => {
    //             // if (InitWhenImportScene.isSmallestToZeroBiggerCount(state)) {
    //             //     state = setNeedShowSkillBar(state, usedGirl, false)
    //             //     state = setLastScaleChangeTime(state, scaleState.Normal)
    //             // }
    //             // else {
    //             //     state = setLastScaleChangeTime(state, scaleState.Big)
    //             //     state = setNeedShowSkillBar(state, usedGirl, true)
    //             //     state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)
    //             // }
    //             state = setNeedShowSkillBar(state, usedGirl, false)
    //             state = setLastScaleChangeTime(state, scaleState.Normal)

    //             // if (isGiantessCharacterType(state)) {
    //             state = setBiggerCount(state,usedGirl,  0)
    //             // }
    //             // else if (isWildGiantess(state, usedGirl)) {
    //             //     state = WildGiantess.setBiggerCount(state,usedGirl,  0)
    //             // }
    //             // else if (isEnemyGiantess(state, usedGirl)) {
    //             //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  0)
    //             // }
    //             // else if (isPlayerGoddess(state, usedGirl)) {
    //             //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  0)
    //             // }

    //             if (isTriggerAction(state, actionName.Smallest)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
    //             }


    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve(state)
    //         },
    //             getValue(state).initialScale,
    //         )
    //         break
    //     // case actionName.Run:
    //     //     state = setActionState(state, actionState.Run)
    //     //     break
    // }

    // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)

    return triggerActionMod(state, usedGirl, name)
}
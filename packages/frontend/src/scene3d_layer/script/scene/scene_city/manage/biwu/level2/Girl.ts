import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { bossStateStatusName, collisionPart, damageType, objectStateName, result, usedGirlEnum } from "../../../type/StateType"
import { Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { buildFakeGirlWeaponValue, computeHeight, getDamagePartFactor, getDamageTypeFactor, getForceFactor, getGirlBox, getGirlPosition, getScale, getScaleFactor, getScaleIncreaseTimes, getStressingFactorByJudgeLastStressingTime, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth } from "../../../girl/Cloth"
import { buildNameByUsedGirl, damageUtils, getBodyHp, getDefenseData, getHp, getLabelTime, getValue, getValueByUsedGirl, isActionTriggering, isDamageAction, isTriggerAction, setHp, setTriggerAction } from "../../../girl/Girl"
import * as DamageUtils from "../../../utils/DamageUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { createStressingState } from "./FSMState"
import { getPhase } from "../../../data/biwu/level2/behaviour_tree_data/action_node/LightStomp"
import { getCurrentAnimationName, playBiggerAnimation } from "../../../girl/Animation"
import { weaponType } from "../../../data/ValueType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { handleRemoveShoe } from "../../../data/mmd/Shoe"
import { phase } from "../../../data/biwu/level2/behaviour_tree_data/BehaviourTreeData"
import * as BiwuGirl from "../Girl"
import { generateReward } from "../../../reward/RewardGenerator"
import { getName as getLittleName } from "../../../little_man/LittleMan"
import { getRewardPropPosition } from "../Reward"
import { getRewardPropOffset } from "./Reward"
import { getNow } from "../../../Time"
import { handleAfterComputeDamage, handleDamageForceSize } from "../../../StaticDynamic"
import { handleLightStressing } from "../../../utils/LightStressingGiantessUtils"
import { addHitEffectForGirl } from "../../../utils/HitEffectUtils"
import { isHard } from "./ManageScene"
import { addOrUpdateStatus, removeStatus } from "../../../BossStateStatus"
import BossStatus from "../../../../../../../ui_layer/index/scene/city/boss_status/components/BossStatus"
import { computeCrit } from "../../../utils/WeaponUtils"
import { getAttackFactor, getCritRatioFactor } from "../../../StaticDynamicUnit"
// import { computeMiss } from "../../../utils/ValueUtils"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../../state/State"
import { buildAPI } from "../../../../../../mod/Mod"
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { getDamagePositionForLabel } from "../Utils"
import { getStompBlockService } from "../../../../../../mod/SkillGiantessMod"

// let _isHitLeg = (collisionPart_) => {
//     switch (collisionPart_) {
//         case collisionPart.LeftFoot:
//         case collisionPart.RightFoot:
//         case collisionPart.LeftShank:
//         case collisionPart.RightShank:
//         case collisionPart.LeftThigh:
//         case collisionPart.RightThigh:
//             return true
//         default:
//             return false
//     }
// }


let _computeForce = (state, usedGirl, force: number, collisionPart_: collisionPart) => {
    let factor
    switch (collisionPart_) {
        case collisionPart.RightThigh:
        case collisionPart.LeftThigh:
            factor = 1.5
            break
        case collisionPart.RightFoot:
        case collisionPart.LeftFoot:
        case collisionPart.RightShank:
        case collisionPart.LeftShank:
            factor = 1
            break
        default:
            factor = 0
            break
    }

    // return force * 5 * factor
    return force * factor
}

// let _isPlayLightStompAnimation = (state: state) => {
//     switch (getCurrentAnimationName(state, usedGirl)) {
//         // case animationName.KeepRightLightStomp:
//         // case animationName.KeepLeftLightStomp:
//         case animationName.HangRightLightStomp:
//         case animationName.HangLeftLightStomp:
//         case animationName.KeepRightLightStomp:
//         case animationName.KeepLeftLightStomp:
//         case animationName.BackRightLightStomp:
//         case animationName.BackLeftLightStomp:
//             return true
//         default:
//             return false
//     }
// }

let _isCanStressing = (state: state, usedGirl, stateMachine) => {
    if (StateMachine.isState(stateMachine, objectStateName.Stressing)) {
        return false
    }

    if (getPhase(state) == phase.Begin) {
        return false
    }

    switch (getCurrentAnimationName(state, usedGirl)) {
        case animationName.PickdownFromIdle:

        case animationName.HangRightLightStomp:
        case animationName.HangLeftLightStomp:
        case animationName.BackRightLightStomp:
        case animationName.BackLeftLightStomp:
            return false
        case animationName.KeepRightLightStomp:
        case animationName.KeepLeftLightStomp:
            switch (getPhase(state)) {
                case phase.Fllow:
                case phase.Down:
                case phase.Up:
                    return true
                default:
                    return false
            }
        default:
            return true
    }
    // if (_isPlayLightStompAnimation(state)) {
    //     switch (getPhase(state)) {
    //         // case phase.Hang:
    //         case phase.Fllow:
    //         case phase.Down:
    //         case phase.Up:
    //             return true
    //         default:
    //             return false
    //     }
    // }

    // return true
}

let _getSkillStateFactor = (state, usedGirl) => {
    let lowValue = 0.4
    let highValue = 0.8

    switch (getCurrentAnimationName(state, usedGirl)) {
        case animationName.KeepLeftLightStomp:
        case animationName.KeepRightLightStomp:
            return highValue
        // case animationName.Stomp:
        case getStompBlockService(state).getForceAnimationName():
            return lowValue
        default:
            return 1
    }
}

let _isStressingByRate = (state: state, usedGirl, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    let collisionPartFactor
    switch (collisionPart_) {
        case collisionPart.LeftThigh:
        case collisionPart.RightThigh:
            collisionPartFactor = 2.8
            break
        case collisionPart.LeftShank:
        case collisionPart.RightShank:
            collisionPartFactor = 1
            break
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
            collisionPartFactor = 1.5
            break
        default:
            throw new Error("err")
    }

    let forceFactor = getForceFactor(getBodyHp(state, usedGirl), damage, 0.0025)


    // let settingFactor

    let scaleFactor = getScaleFactor(state, usedGirl)


    // const factor = 0.2 * 0.3
    // const factor = 0.5
    // const factor = 0.2
    const factor = 0.12

    let damagePartFactor = getDamagePartFactor(state, usedGirl, damagePart)

    let timeFactor = getStressingFactorByJudgeLastStressingTime(state, usedGirl)

    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * damagePartFactor * _getSkillStateFactor(state, usedGirl) * getValue(state, usedGirl).stressingRateFactor, 0, 1) * timeFactor

    // Console.warn(rate,
    //     damage, collisionPart_, rate
    // )

    return Math.random() < rate
}

let _updateDamageType = (damageType_, collisionPart_) => {
    if (damageType_ == damageType.Range) {
        return damageType_
    }

    switch (collisionPart_) {
        case collisionPart.RightThigh:
        case collisionPart.LeftThigh:
            return damageType.Weakness
        default:
            // return damageType_
            return damageType.Normal
    }
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>,
    weaponValue_,
    // critRatioFactor,
    // attackFactor,
) => {
    return damageUtils(state,
        [
            (state, collisionPart_) => {
                let damagePartByCollisionPart, actuallyDamagePartsByCollisionPart,
                    damagePartByJudge, actuallyDamagePartsByJudge

                let d1 = getDamagePartByCollisionPart(state, usedGirl, collisionPart_)
                damagePartByCollisionPart = d1[0]
                actuallyDamagePartsByCollisionPart = d1[1]

                let d2 = getDamagePartByJudgeWithoutJudgeScale(state, usedGirl, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)
                damagePartByJudge = d2[0]
                actuallyDamagePartsByJudge = d2[1]

                return [damagePartByCollisionPart, damagePartByJudge, actuallyDamagePartsByJudge]
            },
            _updateDamageType,
            _computeForce,
            (state, damagePosition, height, damageType) => {
                return getDamagePositionForLabel(damagePosition, damageType, 6)
            },
            (state, stateMachine, damage, weaponType, collisionPart_, damagePartByCollisionPart, fromName) => {
                state = handleLightStressing(state, usedGirl, damage, collisionPart_, false)
                // let isStressingByRateFunc = isGiantessCharacterType(state) ? GiantessGirl.isStressingByRate : LittleManGirl.isStressingByRate

                if (
                    // isCanStressing(state, isChangePoseState, stateMachine)
                    _isCanStressing(state, usedGirl, stateMachine)
                    && _isStressingByRate(state, usedGirl, damage, damageType, collisionPart_, damagePartByCollisionPart)
                ) {
                    return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                        return setStateMachine(usedGirl)(state, stateMachine)
                    }, stateMachine, createStressingState(usedGirl), buildNameByUsedGirl(usedGirl), [collisionPart_, fromName, damagePosition])
                }

                return state
            },
            createStressingState,
        ], usedGirl,
        [force, damageType, weaponType],
        fromName,
        collisionPart_, damagePosition, weaponValue_,
        // critRatioFactor,
        // attackFactor,
    )
}

export let update = BiwuGirl.update

export let updateStatus = (state: state, usedGirl) => {
    if (isHard(state, usedGirl)) {
        state = addOrUpdateStatus(state, usedGirl,
            bossStateStatusName.Hard,
            NullableUtils.getEmpty(),
            true,
            getLanguageTextData(state, languageKey.Hard)
        )
    }
    else {
        state = removeStatus(state, usedGirl, bossStateStatusName.Hard)
    }

    // state = addStatusFromBuffs(state, usedGirlEnum.BossGiantess)

    return state
}

export let initWhenImportScene = BiwuGirl.initWhenImportScene
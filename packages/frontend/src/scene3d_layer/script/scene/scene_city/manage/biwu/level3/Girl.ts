import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { cameraType, state } from "../../../../../../type/StateType"
import { actionName, animationName, heavyStressingLiePhase } from "../../../data/biwu/level3/DataType"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { bossStateStatusName, damageType, objectStateName, result, usedGirlEnum } from "../../../type/StateType"
import { Box3, Vector2, Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { buildFakeGirlWeaponValue, computeHeight, getDamagePartFactor, getDamageTypeFactor, getForceFactor, getGirlBox, getGirlPosition, getScale, getScaleFactor, getScaleIncreaseTimes, getStressingFactorByJudgeLastStressingTime, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth, isClothsDestroyed } from "../../../girl/Cloth"
import { getHp, getLabelTime, getAllUsedMMDData, isActionTriggering, isDamageAction, isTriggerAction, setHp, setTriggerAction, getDefenseData, getValue, damageUtils, getBodyHp, setUsedGirlData, getUsedGirlData, buildNameByUsedGirl } from "../../../girl/Girl"
import * as InitWhenImportScene from "../../../girl/InitWhenImportScene"
import * as DamageUtils from "../../../utils/DamageUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { fontType, labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { createInitialState, createStressingState } from "./FSMState"
import { changePose } from "../../../girl/Pose"
import { collisionPart, pose } from "../../../data/biwu/level3/CollisionShapeData"
import { getPreviousAnimationName } from "../../../girl/Animation"
import { weaponType } from "../../../data/ValueType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Console } from "meta3d-jiehuo-abstract"
import { isCurrentSubEventName, isSubEventNameTriggering, triggerSubEvent, triggerSubEventWhenNotTrigger } from "../../../game_event/GameEvent"
import { eventName } from "../../../data/biwu/level3/GameEventData"
import { buildDownDirection } from "../../../../../../utils/DirectionUtils"
import { getLevelData } from "../../../data/biwu/level3/LevelData"
import { getBoneNameForLightStressing, getDamageParts } from "../../../data/biwu/level3/mmd/MMDData"
import * as Soldier from "../../city1/soldier/Soldier"
import { getAbstractState } from "../../../../../../state/State"
import { removeBlood } from "../../../utils/CharacterUtils"
import { LODQueue } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getCameraType } from "../../../LittleManCamera"
import { ScreenUtils } from "meta3d-jiehuo-abstract"
import { getHeight, getWidth } from "meta3d-utils/src/View"
import { Camera } from "meta3d-jiehuo-abstract"
import * as BiwuGirl from "../Girl"
import { generateReward } from "../../../reward/RewardGenerator"
import { getNow } from "../../../Time"
import { handleAfterComputeDamage, handleDamageForceSize } from "../../../StaticDynamic"
import { buildNippleStressingName } from "../../../data/biwu/level3/reward/RewardData"
import { getRewardPropOffset, getRewardPropPosition } from "./Reward"
import { handleLightStressing } from "../../../utils/LightStressingGiantessUtils"
import { addHitEffectForGirl } from "../../../utils/HitEffectUtils"
import { addOrUpdateStatus, removeStatus } from "../../../BossStateStatus"
import { getIsNotDamage } from "../../../Status"
import { computeCrit } from "../../../utils/WeaponUtils"
import { getAttackFactor, getCritRatioFactor } from "../../../StaticDynamicUnit"
// import { computeMiss } from "../../../utils/ValueUtils"
import { getBloodDecalQueue } from "../../../../../../mod/EliteGiantessMod"
import { Event } from "meta3d-jiehuo-abstract"
import { buildAPI } from "../../../../../../mod/Mod"
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { getDamagePositionForLabel, getUsedGirl } from "../Utils"

const _v1_1 = new Vector2();


export let initWhenImportScene = state => {
    let usedGirl = getUsedGirl()
    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        computeBoxFunc: (state, usedGirl) => {
            // return setUsedGirlData(state, usedGirl,{
            //     ...getUsedGirlData(state, usedGirl),
            //     box: new Box3(
            //         new Vector3(-10000, -10000, -10000),
            //         new Vector3(10000, 10000, 10000)
            //     )
            // })
            return new Box3(
                new Vector3(-10000, -10000, -10000),
                new Vector3(10000, 10000, 10000)
            )
        },
        // createFSMStateByCurrentAnimationNameFunc: (state, nextBlendingAnimationName) => {
        //     return [state, NullableUtils.getEmpty()]
        // },
        createFSMStateByChangeAnimationNameFunc: (state, usedGirl, nextBlendingAnimationName) => {
            let fsm_state
            switch (nextBlendingAnimationName) {
                case animationName.HeavyStressingLie:
                    fsm_state = NullableUtils.getEmpty()
                    state = changePose(state, usedGirl, pose.HeavyStressingLie)
                    break
                case animationName.KeepLie:
                    if (
                        NullableUtils.getWithDefault(
                            NullableUtils.map(
                                previousAnimationName => {
                                    return previousAnimationName == animationName.HeavyStressingLie
                                },
                                getPreviousAnimationName(state, usedGirl) as any
                            ),
                            false
                        )
                    ) {
                        fsm_state = NullableUtils.return_(createInitialState(usedGirl))
                        state = changePose(state, usedGirl, pose.Lie)
                        break
                    }
                default:
                    fsm_state = NullableUtils.getEmpty()
                    state = changePose(state, usedGirl, pose.Lie)
                    break
            }

            return [state, fsm_state]
        },
        computeForceDirectionFunc: (state, usedGirl, animationName_, velocity, phase) => {
            switch (animationName_) {
                case animationName.HeavyStressingLie:
                    return buildDownDirection()
                default:
                    throw new Error("err")
            }
        },
        computeDamageTypeFunc: (state, animationName_, phase) => {
            switch (animationName_) {
                case animationName.HeavyStressingLie:
                    return damageType.Direct
                default:
                    throw new Error("err")
            }
        },
    })

    return InitWhenImportScene.initWhenImportScene(state, getAllUsedMMDData(state))
}


// let _isHitUnDamagePart = (collisionPart_) => {
//     switch (collisionPart_) {
//         case collisionPart.:
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
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            // factor = 3
            factor = 2
            break
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            factor = 4
            break
        case collisionPart.Head:
            factor = 1.5
            break
        case collisionPart.LowBreast:
            factor = 1
            break
        default:
            factor = 0.4
            break
    }

    // return Math.round(force * 5 * factor)
    return Math.round(force * factor)
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

    if (!isClothsDestroyed(state, usedGirl, getDamageParts(state, usedGirl))) {
        return false
    }

    return true
}

// let _getSkillStateFactor = (state) => {
//     let lowValue = 0.4
//     let highValue = 0.8

//     switch (getCurrentAnimationName(state, usedGirl)) {
//         case animationName.KeepLeftLightStomp:
//         case animationName.KeepRightLightStomp:
//             return highValue
//         case animationName.Stomp:
//             return lowValue
//         default:
//             return 1
//     }
// }

let _isStressingByRate = (state: state, usedGirl, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    let collisionPartFactor
    switch (collisionPart_) {
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            collisionPartFactor = 1.3
            break
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            collisionPartFactor = 4
            break
        case collisionPart.LowBreast:
            collisionPartFactor = 0.4
            break
        default:
            collisionPartFactor = 0.1
            break
    }

    let forceFactor = getForceFactor(getBodyHp(state, usedGirl), damage, 0.0025)


    // let settingFactor

    // let scaleFactor = getScaleFactor(state, usedGirl)
    let scaleFactor = 1


    // const factor = 0.2 * 0.3

    const factor = 0.5 * 0.1 * 0.5
    // const factor = 0.5 * 0.1 * 0.5 * 0.3

    // let damagePartFactor = getDamagePartFactor(state, usedGirl, damagePart)
    let damagePartFactor = 1

    let timeFactor = getStressingFactorByJudgeLastStressingTime(state, usedGirl)

    // let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * damagePartFactor * _getSkillStateFactor(state, usedGirl), 0, 1)
    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * damagePartFactor * timeFactor * getValue(state, usedGirl).stressingRateFactor, 0, 1)

    // Console.warn(rate,
    //     damage, collisionPart_, rate
    // )

    return Math.random() < rate
}

// let _computeFontType = (collisionPart_) => {
//     switch (collisionPart_) {
//         case collisionPart.LeftBreast:
//         case collisionPart.RightBreast:
//             return fontType.HeavyAttack
//         case collisionPart.LeftNipple:
//         case collisionPart.RightNipple:
//             return fontType.WeaknessAttack
//         default:
//             return fontType.NormalAttack
//     }
// }

let _isTriggerHitNippleSubGameEvent = (state: state, usedGirl) => {
    return isClothsDestroyed(state, usedGirl, getDamageParts(state, usedGirl))
        && NumberUtils.isRandomRate(getLevelData(state, usedGirl).triggerHitNippleSubGameEventRate)
}

let _handle = (state: state, usedGirl, eventName_, damagePosition, fromName): Promise<[state, boolean]> => {
    if (
        _isTriggerHitNippleSubGameEvent(state, usedGirl)
        // true
    ) {
        state = generateReward(state, fromName, buildNippleStressingName(), buildNameByUsedGirl(usedGirl), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))

        return triggerSubEventWhenNotTrigger(state, eventName_).then(state => [state, true])
    }

    return Promise.resolve([state, false])
}

let _handleTriggerHitNippleSubGameEvent = (state: state, usedGirl, collisionPart_, damagePosition, fromName): Promise<[state, boolean]> => {
    switch (collisionPart_) {
        case collisionPart.LeftNipple:
            return _handle(state, usedGirl, eventName.HitLeftNipple, damagePosition, fromName)
        case collisionPart.RightNipple:
            return _handle(state, usedGirl, eventName.HitRightNipple, damagePosition, fromName)
        default:
            return Promise.resolve([state, false])
    }
}

let _handleAllClothDestroyed = (state: state) => {
    state = Soldier.getBloodDecalQueue(state).getValidData(getAbstractState(state))
        .concat(
            getBloodDecalQueue(state).getValidData(getAbstractState(state))
        )
        .reduce((state, [_, b, name]) => {
            return removeBlood(state, name)
        }, state)

    return state
}

let _updateDamageType = (damageType_, collisionPart_) => {
    if (damageType_ == damageType.Range) {
        return damageType_
    }

    switch (collisionPart_) {
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            return damageType.Weakness
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
        case collisionPart.Head:
            return damageType.Heavy
        default:
            return damageType.Normal
    }
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: any, damagePosition: nullable<Vector3>, weaponValue_,
    // critRatioFactor,
    // attackFactor,
) => {
    // return Promise.resolve(state)

    // let stateMachine = getStateMachine(state)

    // return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
    //     return setStateMachine(state, stateMachine)
    // }, stateMachine, createStressingState(), getName(), collisionPart_)

    return damageUtils(state,
        [
            (state, collisionPart_) => {

                let damagePartByCollisionPart, actuallyDamagePartsByCollisionPart,
                    damagePartByJudge, actuallyDamagePartsByJudge
                // if (!_isHitUnDamagePart(collisionPart_)) {
                //     damage = 0
                //     damage = 0
                // }
                // else {
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
                let minDamage
                switch (collisionPart_) {
                    case collisionPart.TrigoneAndButt:
                    case collisionPart.Torso:
                        minDamage = 100
                        break
                    default:
                        minDamage = 30
                        break
                }

                state = handleLightStressing(state, usedGirl, damage, collisionPart_, true, minDamage)


                return _handleTriggerHitNippleSubGameEvent(state, usedGirl, collisionPart_, damagePosition, fromName).then(([state, isTriggerHitNippleSubGameEvent]) => {
                    if (
                        _isCanStressing(state, usedGirl, stateMachine)
                        && _isStressingByRate(state, usedGirl, damage, damageType, collisionPart_, damagePartByCollisionPart)
                    ) {
                        // if (!isTriggerHitNippleSubGameEvent) {
                        //     state = generateReward(state, fromName, buildStressingName(), getName(), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))
                        // }

                        return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                            return setStateMachine(usedGirl)(state, stateMachine)
                        }, stateMachine, createStressingState(usedGirl), buildNameByUsedGirl(usedGirl), [collisionPart_, fromName, damagePosition])
                    }

                    return state
                })
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
    if (getIsNotDamage(state, buildNameByUsedGirl(usedGirl))) {
        state = addOrUpdateStatus(state, usedGirl,
            bossStateStatusName.UnDamage,
            NullableUtils.getEmpty(),
            true,
            getLanguageTextData(state, languageKey.UnDamage)
        )
    }
    else {
        state = removeStatus(state, usedGirl, bossStateStatusName.UnDamage)
    }

    // state = addStatusFromBuffs(state, usedGirlEnum.BossGiantess)

    return state
}

import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { bossStateStatusName, collisionPart, damageType, objectStateName, result, usedGirlEnum } from "../../../type/StateType"
import { Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { buildFakeGirlWeaponValue, computeHeight, getBaseFactor, getCollisionPartFactor, getDamagePartFactor, getDamageTypeFactor, getForceFactor, getGirlBox, getGirlPosition, getScale, getScaleFactor, getScaleIncreaseTimes, getSkillStateFactor, getStressingFactorByJudgeLastStressingTime, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth } from "../../../girl/Cloth"
import { computeForce, getDefenseData, getHp, getLabelTime, getValueByUsedGirl, isActionTriggering, isDamageAction, isTriggerAction, setHp, setTriggerAction, updateDamageType, getValue, damageUtils, getBodyHp, buildNameByUsedGirl } from "../../../girl/Girl"
import * as DamageUtils from "../../../utils/DamageUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { weaponType } from "../../../data/ValueType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getBody } from "../../../data/mmd/MMDData"
import * as BiwuGirl from "../Girl"
import { generateReward } from "../../../reward/RewardGenerator"
import { getName as getLittleName } from "../../../little_man/LittleMan"
import { buildStressingName } from "../../../data/biwu/level1/reward/RewardData"
import { getRewardPropPosition } from "../Reward"
import { getRewardPropOffset } from "./Reward"
import { getNow } from "../../../Time"
import { handleAfterComputeDamage, handleDamageForceSize } from "../../../StaticDynamic"
import { createStressingState } from "./FSMState"
import { handleLightStressing } from "../../../utils/LightStressingGiantessUtils"
import { addHitEffectForGirl } from "../../../utils/HitEffectUtils"
import { addOrUpdateStatus, removeStatus } from "../../../BossStateStatus"
import { getIsNotDamage } from "../../../Status"
import { computeCrit } from "../../../utils/WeaponUtils"
import { getAttackFactor, getCritRatioFactor } from "../../../StaticDynamicUnit"
// import { computeMiss } from "../../../utils/ValueUtils"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../../state/State"
import { buildAPI } from "../../../../../../mod/Mod"
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { getDamagePositionForLabel } from "../Utils"

// let _isStressingByRate = (state: state, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart) => {
let _isStressingByRate = (state: state, usedGirl, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    let collisionPartFactor = getCollisionPartFactor(collisionPart_)

    let forceFactor = getForceFactor(getBodyHp(state, usedGirl), damage, 0.0025)

    let scaleFactor = getScaleFactor(state, usedGirl)


    const factor = getBaseFactor()

    let damagePartFactor = getDamagePartFactor(state, usedGirl, damagePart)

    let timeFactor = getStressingFactorByJudgeLastStressingTime(state, usedGirl)

    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * damagePartFactor * getSkillStateFactor(state, usedGirl) * getValue(state, usedGirl).stressingRateFactor, 0, 1) * timeFactor

    return Math.random() < rate
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>, weaponValue_,
    // critRatioFactor,
    // attackFactor,
) => {
    return damageUtils(state,
        [
            (state, collisionPart_) => {
                let damagePart = getBody()

                return [damagePart, damagePart, []]
            },
            updateDamageType,
            computeForce,
            (state, damagePosition, height, damageType) => {
                return getDamagePositionForLabel(damagePosition, damageType)
            },
            (state, stateMachine, damage, weaponType, collisionPart_, damagePartByCollisionPart, fromName) => {
                state = handleLightStressing(state, usedGirl, damage, collisionPart_, false)

                if (
                    isCanStressing(state, usedGirl, stateMachine)
                    && _isStressingByRate(state, usedGirl, damage, damageType, collisionPart_, damagePartByCollisionPart)
                ) {
                    // state = generateReward(state, fromName, buildStressingName(), getName(), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))

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

export let initWhenImportScene = BiwuGirl.initWhenImportScene
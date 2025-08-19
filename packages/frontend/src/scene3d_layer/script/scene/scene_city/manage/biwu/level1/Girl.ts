import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { createStressingState, getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { collisionPart, objectStateName, result } from "../../../type/StateType"
import { Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { computeHeight, getCollisionPartFactor, getDamagePartFactor, getForceFactor, getGirlBox, getScale, getScaleFactor, getScaleIncreaseTimes, getSkillStateFactor, getWeaponTypeFactor, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth } from "../../../girl/Cloth"
import { computeForce, getDefenseFactor, getGirlState, getHp, getLabelTime, getName, isActionTriggering, isDamageAction, isTriggerAction, setGirlState, setHp, setTriggerAction } from "../../../girl/Girl"
import * as DamageUtils from "../../../utils/DamageUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { weaponType } from "../../../data/ValueType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getBody } from "../../../data/mmd/MMDData"
import { isGirlNotDamage } from "./ManageScene"

let _isStressingByRate = (state: state, damage, weaponType_: weaponType, collisionPart_: collisionPart, damagePart) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let collisionPartFactor = getCollisionPartFactor(collisionPart_)

    let forceFactor = getForceFactor(damage)

    let scaleFactor = getScaleFactor(state)


    const factor = 0.2 * 0.3

    let damagePartFactor = getDamagePartFactor(state, damagePart)


    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * weaponTypeFactor * collisionPartFactor * factor * damagePartFactor * getSkillStateFactor(state), 0, 1)

    return Math.random() < rate
}

export let damage = (state: state, [force, damageType, weaponType], collisionPart_: collisionPart, damagePosition: nullable<Vector3>) => {
    if (state.config.isNotDamage || isGirlNotDamage(state)) {
        return Promise.resolve(state)
    }


    let stateMachine = getStateMachine(state)

    if (isDestoryRelatedStates(stateMachine)) {
        return Promise.resolve(state)
    }


    let box = getGirlBox(state)

    let actuallyDamage, damage, remainedHp

    let damagePart = getBody()

    let defenseFactor = getDefenseFactor(state, getName(), damagePart)
    let height = computeHeight(state)

    let hp = getHp(state, damagePart)

    let d3 = DamageUtils.computeActuallyDamage(defenseFactor, height, computeForce(force, collisionPart_), hp)
    actuallyDamage = d3[0]
    damage = d3[1]
    remainedHp = d3[2]

    state = setHp(state, damagePart, remainedHp)


    state = DamageUtils.addLabel(state, actuallyDamage, box,
        DamageUtils.computeFontType(true, damageType, weaponType),
        NullableUtils.map(
            damagePosition => {
                return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
            },
            damagePosition
        ),
        getName(),
        getLabelTime(damage),
        // true,
        NullableUtils.getEmpty(),
        labelAnimation.None)


    if (damage <= 0) {
        return Promise.resolve(state)
    }


    state = setGirlState(state, {
        ...getGirlState(state),
        lastDamageTime: performance.now()
    })



    if (remainedHp > 0) {
        if (
            isCanStressing(state, stateMachine)
            && _isStressingByRate(state, actuallyDamage, weaponType, collisionPart_, damagePart)
        ) {
            return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                return setStateMachine(state, stateMachine)
            }, stateMachine, createStressingState(), getName(), collisionPart_)
        }

        return Promise.resolve(state)
    }

    return Promise.resolve(state)
}
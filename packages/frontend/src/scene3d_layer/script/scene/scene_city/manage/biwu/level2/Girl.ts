import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level2/DataType"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { collisionPart, objectStateName, result } from "../../../type/StateType"
import { Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { computeHeight, getDamagePartFactor, getForceFactor, getGirlBox, getScale, getScaleFactor, getScaleIncreaseTimes, getWeaponTypeFactor, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth } from "../../../girl/Cloth"
import { getDefenseFactor, getGirlState, getHp, getLabelTime, getName, isActionTriggering, isDamageAction, isTriggerAction, setGirlState, setHp, setTriggerAction } from "../../../girl/Girl"
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
import { isShoe } from "../../../data/mmd/MMDData"
import { phase } from "../../../data/biwu/level2/behaviour_tree_data/BehaviourTreeData"

let _isHitLeg = (collisionPart_) => {
    switch (collisionPart_) {
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
        case collisionPart.LeftShank:
        case collisionPart.RightShank:
        case collisionPart.LeftThigh:
        case collisionPart.RightThigh:
            return true
        default:
            return false
    }
}


let _computeForce = (force: number, collisionPart_: collisionPart) => {
    let factor
    switch (collisionPart_) {
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
            // factor = 0.5
            factor = 0.8
            break
        default:
            factor = 1
            break
    }

    return force * 5 * factor
}

// let _isPlayLightStompAnimation = (state: state) => {
//     switch (getCurrentAnimationName(state)) {
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

let _isCanStressing = (state: state, stateMachine) => {
    if (StateMachine.isState(stateMachine, objectStateName.Stressing)) {
        return false
    }

    if (getPhase(state) == phase.Begin) {
        return false
    }

    switch (getCurrentAnimationName(state)) {
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

let _getSkillStateFactor = (state) => {
    let lowValue = 0.4
    let highValue = 0.8

    switch (getCurrentAnimationName(state)) {
        case animationName.KeepLeftLightStomp:
        case animationName.KeepRightLightStomp:
            return highValue
        case animationName.Stomp:
            return lowValue
        default:
            return 1
    }
}

let _isStressingByRate = (state: state, damage, weaponType_: weaponType, collisionPart_: collisionPart, damagePart) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let collisionPartFactor
    switch (collisionPart_) {
        case collisionPart.LeftThigh:
        case collisionPart.RightThigh:
            collisionPartFactor = 2.5
            break
        case collisionPart.LeftShank:
        case collisionPart.RightShank:
            collisionPartFactor = 1
            break
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
            collisionPartFactor = 1.2
            break
        default:
            throw new Error("err")
    }

    let forceFactor = getForceFactor(damage)


    // let settingFactor

    let scaleFactor = getScaleFactor(state)


    // const factor = 0.2 * 0.3
    const factor = 0.5

    let damagePartFactor = getDamagePartFactor(state, damagePart)


    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * weaponTypeFactor * collisionPartFactor * factor * damagePartFactor * _getSkillStateFactor(state), 0, 1)

    Console.warn(rate,
        damage, collisionPart_, rate
    )

    return Math.random() < rate
}

export let damage = (state: state, [force, damageType, weaponType], collisionPart_: collisionPart, damagePosition: nullable<Vector3>) => {
    if (state.config.isNotDamage) {
        return Promise.resolve(state)
    }


    let stateMachine = getStateMachine(state)

    if (isDestoryRelatedStates(stateMachine)) {
        return Promise.resolve(state)
    }


    let box = getGirlBox(state)

    let actuallyDamage, damage, remainedHp, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart,
        damagePartByJudge, actuallyDamagePartsByJudge
    if (!_isHitLeg(collisionPart_)) {
        actuallyDamage = 0
        damage = 0
    }
    else {
        let d1 = getDamagePartByCollisionPart(state, collisionPart_)
        damagePartByCollisionPart = d1[0]
        actuallyDamagePartsByCollisionPart = d1[1]

        let d2 = getDamagePartByJudgeWithoutJudgeScale(state, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)
        damagePartByJudge = d2[0]
        actuallyDamagePartsByJudge = d2[1]


        let defenseFactor = getDefenseFactor(state, getName(), damagePartByCollisionPart)
        // let height = box.getSize(_v1).y
        let height = computeHeight(state)

        let hp = getHp(state, damagePartByJudge)

        let d3 = DamageUtils.computeActuallyDamage(defenseFactor, height, _computeForce(force, collisionPart_), hp)
        actuallyDamage = d3[0]
        damage = d3[1]
        remainedHp = d3[2]

        state = setHp(state, damagePartByJudge, remainedHp)
    }

    state = DamageUtils.addLabel(state, actuallyDamage, box,
        DamageUtils.computeFontType(true, damageType, weaponType),
        NullableUtils.map(
            damagePosition => {
                // if (isLittleRoad(state)) {
                return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
                // }

                // return new Vector3(damagePosition.x, damagePosition.y + height / 10, damagePosition.z)
            },
            damagePosition
        ),
        getName(),
        getLabelTime(damage),
        // getSceneChapter(state) == scene.Biwu ? true : (
        //     isLittleRoad(state) ? true : false
        // ),
        NullableUtils.getEmpty(),
        labelAnimation.None)


    if (damage <= 0) {
        return Promise.resolve(state)
    }


    state = setGirlState(state, {
        ...getGirlState(state),
        lastDamageTime: performance.now()
    })


    if (remainedHp <= 0 && isCloth(damagePartByJudge)) {
        if (isShoe(damagePartByJudge)) {
            state = handleRemoveShoe(state)
        }

        return handleClothDestroyed(state,
            [createStressingState, _isCanStressing],
            NullableUtils.getExn(damagePosition), collisionPart_, actuallyDamagePartsByJudge)
    }


    if (remainedHp > 0) {
        // let isStressingByRateFunc = isGiantessRoad(state) ? GiantessGirl.isStressingByRate : LittleManGirl.isStressingByRate

        if (
            // isCanStressing(state, isChangePoseState, stateMachine)
            _isCanStressing(state, stateMachine)
            && _isStressingByRate(state, actuallyDamage, weaponType, collisionPart_, damagePartByCollisionPart)
            // && true
        ) {
            return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                return setStateMachine(state, stateMachine)
            }, stateMachine, createStressingState(), getName(), collisionPart_)
        }

        return Promise.resolve(state)
    }

    return Promise.resolve(state)
}
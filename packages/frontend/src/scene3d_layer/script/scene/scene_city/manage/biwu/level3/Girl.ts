import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { cameraType, state } from "../../../../../../type/StateType"
import { actionName, animationName, heavyStressingLiePhase } from "../../../data/biwu/level3/DataType"
import { getStateMachine, setStateMachine } from "../../../girl/FSMState"
import { damageType, objectStateName, result } from "../../../type/StateType"
import { Box3, Vector2, Vector3 } from "three"
import { isDestoryRelatedStates } from "../../../utils/FSMStateUtils"
import { computeHeight, getDamagePartFactor, getForceFactor, getGirlBox, getScale, getScaleFactor, getScaleIncreaseTimes, getWeaponTypeFactor, isCanStressing } from "../../../girl/Utils"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getDamagePartByJudgeWithoutJudgeScale, handleClothDestroyed, isCloth, isClothsDestroyed } from "../../../girl/Cloth"
import { getDefenseFactor, getGirlState, getHp, getLabelTime, getName, isActionTriggering, isDamageAction, isTriggerAction, setGirlState, setHp, setTriggerAction } from "../../../girl/Girl"
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
import { getDamageParts } from "../../../data/biwu/level3/mmd/MMDData"
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

const _v1_1 = new Vector2();


export let initWhenImportScene = state => {
    state = setGirlState(state, {
        ...getGirlState(state),
        computeBoxFunc: state => {
            return setGirlState(state, {
                ...getGirlState(state),
                box: new Box3(
                    new Vector3(-10000, -10000, -10000),
                    new Vector3(10000, 10000, 10000)
                )
            })
        },
        createFSMStateByAnimationNameFunc: (state, nextBlendingAnimationName) => {
            let fsm_state
            switch (nextBlendingAnimationName) {
                case animationName.HeavyStressingLie:
                    fsm_state = NullableUtils.getEmpty()
                    state = changePose(state, pose.HeavyStressingLie)
                    break
                case animationName.KeepLie:
                    if (
                        NullableUtils.getWithDefault(
                            NullableUtils.map(
                                previousAnimationName => {
                                    return previousAnimationName == animationName.HeavyStressingLie
                                },
                                getPreviousAnimationName(state) as any
                            ),
                            false
                        )
                    ) {
                        fsm_state = NullableUtils.return_(createInitialState())
                        state = changePose(state, pose.Lie)
                        break
                    }
                default:
                    fsm_state = NullableUtils.getEmpty()
                    state = changePose(state, pose.Lie)
                    break
            }

            return [state, fsm_state]
        },
        computeForceDirectionFunc: (state, animationName_, velocity, phase) => {
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

    return InitWhenImportScene.initWhenImportScene(state)
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


let _computeForce = (force: number, collisionPart_: collisionPart) => {
    let factor
    switch (collisionPart_) {
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            factor = 2
            break
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            factor = 3
            break
        case collisionPart.Head:
            factor = 1
            break
        case collisionPart.LowBreast:
            factor = 1
            break
        default:
            factor = 0.5
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

    if (!isClothsDestroyed(state, getDamageParts(state))) {
        return false
    }

    return true
}

// let _getSkillStateFactor = (state) => {
//     let lowValue = 0.4
//     let highValue = 0.8

//     switch (getCurrentAnimationName(state)) {
//         case animationName.KeepLeftLightStomp:
//         case animationName.KeepRightLightStomp:
//             return highValue
//         case animationName.Stomp:
//             return lowValue
//         default:
//             return 1
//     }
// }

let _isStressingByRate = (state: state, damage, weaponType_: weaponType, collisionPart_: collisionPart, damagePart) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let collisionPartFactor
    switch (collisionPart_) {
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            collisionPartFactor = 1
            break
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            collisionPartFactor = 3
            break
        case collisionPart.LowBreast:
            collisionPartFactor = 0.3
            break
        default:
            collisionPartFactor = 0.1
            break
    }

    let forceFactor = getForceFactor(damage)


    // let settingFactor

    // let scaleFactor = getScaleFactor(state)
    let scaleFactor = 1


    // const factor = 0.2 * 0.3
    const factor = 0.5 * 0.1 * 0.5

    // let damagePartFactor = getDamagePartFactor(state, damagePart)
    let damagePartFactor = 1


    // let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * weaponTypeFactor * collisionPartFactor * factor * damagePartFactor * _getSkillStateFactor(state), 0, 1)
    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * weaponTypeFactor * collisionPartFactor * factor * damagePartFactor, 0, 1)

    // Console.warn(rate,
    //     damage, collisionPart_, rate
    // )

    return Math.random() < rate
}

let _computeFontType = (collisionPart_) => {
    switch (collisionPart_) {
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            return fontType.HeavyAttack
        case collisionPart.LeftNipple:
        case collisionPart.RightNipple:
            return fontType.WeaknessAttack
        default:
            return fontType.NormalAttack
    }
}

let _isTriggerHitNippleSubGameEvent = (state: state) => {
    return isClothsDestroyed(state, getDamageParts(state))
        && NumberUtils.isRandomRate(getLevelData(state).triggerHitNippleSubGameEventRate)
}

let _handle = (state: state, eventName_) => {
    if (
        _isTriggerHitNippleSubGameEvent(state)
        // true
    ) {
        return triggerSubEventWhenNotTrigger(state, eventName_)
    }

    return Promise.resolve(state)
}

let _handleTriggerHitNippleSubGameEvent = (state: state, collisionPart_) => {
    switch (collisionPart_) {
        case collisionPart.LeftNipple:
            return _handle(state, eventName.HitLeftNipple)
        case collisionPart.RightNipple:
            return _handle(state, eventName.HitRightNipple)
        default:
            return Promise.resolve(state)
    }
}

let _handleAllClothDestroyed = (state: state) => {
    state = Soldier.getBloodDecalQueue(state).getValidData(getAbstractState(state)).reduce((state, [_, b, name]) => {
        return removeBlood(state, name)
    }, state)

    return state
}

let _getDamagePositionForLabel = (damagePosition) => {
    // switch (getCameraType(state)) {
    //     case cameraType.FirstPerson:
    //         return ScreenUtils.convertScreenCoordniateToWorldCoordniate(
    //             _v1_1.set(
    //                 getWidth() / 2,
    //                 getHeight() / 2 * 0.3
    //             ),
    //             Camera.getCurrentCamera(getAbstractState(state)),
    //             false
    //         )
    //     case cameraType.ThirdPerson:
    //         // switch (damageType_) {
    //         //     case damageType.Direct:
    //         //         return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
    //         //     default:
    //         //         return new Vector3(damagePosition.x, damagePosition.y + 6, damagePosition.z)
    //         // }
    return new Vector3(damagePosition.x, damagePosition.y + 6, damagePosition.z)
    // default:
    //     throw new Error("err")
    // }
}

export let damage = (state: state, [force, damageType, weaponType], collisionPart_: any, damagePosition: nullable<Vector3>) => {
    // return Promise.resolve(state)

    // let stateMachine = getStateMachine(state)

    // return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
    //     return setStateMachine(state, stateMachine)
    // }, stateMachine, createStressingState(), getName(), collisionPart_)


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
    // if (!_isHitUnDamagePart(collisionPart_)) {
    //     actuallyDamage = 0
    //     damage = 0
    // }
    // else {
    let d1 = getDamagePartByCollisionPart(state, collisionPart_)
    damagePartByCollisionPart = d1[0]
    actuallyDamagePartsByCollisionPart = d1[1]

    let d2 = getDamagePartByJudgeWithoutJudgeScale(state, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)
    damagePartByJudge = d2[0]
    actuallyDamagePartsByJudge = d2[1]


    // let defenseFactor = getDefenseFactor(state, getName(), damagePartByCollisionPart)
    // let defenseFactor = getDefenseFactor(state, getName(), damagePartByCollisionPart) / 6
    let defenseFactor = getDefenseFactor(state, getName(), damagePartByCollisionPart) / 5



    // let height = box.getSize(_v1).y
    let height = computeHeight(state)

    let hp = getHp(state, damagePartByJudge)

    let d3 = DamageUtils.computeActuallyDamage(defenseFactor, height, _computeForce(force, collisionPart_), hp)
    actuallyDamage = d3[0]
    damage = d3[1]
    remainedHp = d3[2]

    state = setHp(state, damagePartByJudge, remainedHp)
    // }

    state = DamageUtils.addLabel(state, actuallyDamage, box,
        _computeFontType(collisionPart_),
        // damageType, weaponType,
        NullableUtils.map(
            damagePosition => {
                return _getDamagePositionForLabel(damagePosition)
            },
            damagePosition
        ),
        getName(),
        getLabelTime(damage),
        // getSceneChapter(state) == scene.Biwu ? true : (
        //     isLittleRoad(state) ? true : false
        // ),
        // true,

        NullableUtils.getEmpty(),
        labelAnimation.None
    )


    if (damage <= 0) {
        return Promise.resolve(state)
    }


    state = setGirlState(state, {
        ...getGirlState(state),
        lastDamageTime: performance.now()
    })


    if (remainedHp <= 0 && isCloth(damagePartByJudge)) {
        if (isClothsDestroyed(state, getDamageParts(state))) {
            state = _handleAllClothDestroyed(state)
        }


        return handleClothDestroyed(state,
            [createStressingState, _isCanStressing],
            NullableUtils.getExn(damagePosition), collisionPart_, actuallyDamagePartsByJudge)
    }


    if (remainedHp > 0) {
        return _handleTriggerHitNippleSubGameEvent(state, collisionPart_).then(state => {
            if (
                _isCanStressing(state, stateMachine)
                && _isStressingByRate(state, actuallyDamage, weaponType, collisionPart_, damagePartByCollisionPart)
            ) {
                return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                    return setStateMachine(state, stateMachine)
                }, stateMachine, createStressingState(), getName(), collisionPart_)
            }

            return Promise.resolve(state)
        })
    }

    return Promise.resolve(state)

}
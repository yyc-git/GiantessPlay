import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"
import { getConfigData, getState, isLittleCharacterType, setState } from "../CityScene"
import { getLevel, getLevelByCharacter } from "../build/Upgrade"
import { armyValue, eliteGiantessValue, emitSpeed, girlValue } from "../data/ValueType"
import { autoDifficulty, difficulty_, missionFinishStatus, usedGirlEnum } from "../type/StateType"
import { getAutoDifficulty, setAutoDifficulty } from "./Difficulty"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getWholeGameTimeMinutes } from "../manage/mission/Mission"
import { setAttribute, setFullHp } from "../utils/build/GiantessBuildUtils"
import { buildFuncData } from "../data/FuncData"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { isLevelGiantess, limitInitialScale, updateGirlValue as updateGirlValueMod } from "../../../../mod/LevelGiantessMod"
import { getIsDebug } from "../../Scene"
import { getEnhenceArmyLevel, getEnhenceBossGiantessBossLevel, getEnhenceEliteGiantessLevel, getEnhenceLevelGiantessLevel, updateBossGiantessValue, updateEnemyGiantessValue, updateLevelGiantessValue, updateWildGiantessValue } from "./HeatImplementer"
import { getMaxScale } from "../girl/Utils"
import { limitScale } from "../../../../mod/EliteGiantessMod"

export let getDifficultyState = (state): difficulty_ => {
    return getState(state).difficulty
}

export let setDifficultyState = (state, difficultyState: difficulty_) => {
    return setState(state, {
        ...getState(state),
        difficulty: difficultyState
    })
}

let _addAutoDifficulty = (autoDifficulty1, autoDifficulty2) => {
    return NumberUtils.clamp(autoDifficulty.VeryEasy, autoDifficulty1 + autoDifficulty2, autoDifficulty.VeryHard5)
}

let _computeAutoDifficultyByLevel = (level) => {
    let levelFactor = level - 1

    let autoDifficulty1
    // if (levelFactor <= 3) {
    // if (levelFactor <= 6) {
    if (levelFactor <= 4) {
        autoDifficulty1 = autoDifficulty.VeryEasy
    }
    // else if (levelFactor <= 9) {
    // else if (levelFactor <= 12) {
    else if (levelFactor <= 14) {
        // else if (levelFactor <= 20) {
        autoDifficulty1 = autoDifficulty.Easy
    }
    // else if (levelFactor <= 14) {
    // else if (levelFactor <= 20) {
    else if (levelFactor <= 26) {
        // else if (levelFactor <= 36) {
        autoDifficulty1 = autoDifficulty.Middle
    }
    // else if (levelFactor <= 19) {
    // else if (levelFactor <= 30) {
    else if (levelFactor <= 36) {
        // else if (levelFactor <= 54) {
        autoDifficulty1 = autoDifficulty.Hard
    }
    // else if (levelFactor <= 50) {
    // else if (levelFactor <= 45) {
    else if (levelFactor <= 46) {
        // else if (levelFactor <= 75) {
        autoDifficulty1 = autoDifficulty.VeryHard
    }
    // else if (levelFactor <= 70) {
    // else if (levelFactor <= 65) {
    else if (levelFactor <= 55) {
        // else if (levelFactor <= 100) {
        autoDifficulty1 = autoDifficulty.VeryHard1
    }
    // else if (levelFactor <= 90) {
    // else if (levelFactor <= 85) {
    else if (levelFactor <= 64) {
        // else if (levelFactor <= 130) {
        autoDifficulty1 = autoDifficulty.VeryHard2
    }
    // else if (levelFactor <= 105) {
    else if (levelFactor <= 73) {
        // else if (levelFactor <= 160) {
        autoDifficulty1 = autoDifficulty.VeryHard3
    }
    // else if (levelFactor <= 150) {
    // else if (levelFactor <= 120) {
    else if (levelFactor <= 82) {
        // else if (levelFactor <= 200) {
        autoDifficulty1 = autoDifficulty.VeryHard4
    }
    else {
        autoDifficulty1 = autoDifficulty.VeryHard5
    }
    // if (levelFactor <= 1) {
    //     autoDifficulty1 = autoDifficulty.VeryEasy
    // }
    // else if (levelFactor <= 2) {
    //     autoDifficulty1 = autoDifficulty.Easy
    // }
    // else if (levelFactor <= 3) {
    //     autoDifficulty1 = autoDifficulty.Middle
    // }
    // else if (levelFactor <= 4) {
    //     autoDifficulty1 = autoDifficulty.Hard
    // }
    // else {
    //     autoDifficulty1 = autoDifficulty.VeryHard
    // }

    return autoDifficulty1
}

export let computeAutoDifficulty = (state: state) => {
    // if (getIsDebug(state)
    //     && !NullableUtils.isNullable(globalThis["debug_autoDifficulty"])
    // ) {
    //     return NullableUtils.getExn(globalThis["debug_autoDifficulty"])
    // }
    if (getIsDebug(state)) {
        return getAutoDifficulty(state)
    }


    // // let levelFactor = Math.max((getLevelByCharacter(state, characterType.LittleMan) - 1), (getLevelByCharacter(state, characterType.Giantess) - 1) * 2)
    // let levelFactor = Math.max((getLevelByCharacter(state, characterType.LittleMan) - 1), (getLevelByCharacter(state, characterType.Giantess) - 1))

    // let autoDifficulty1
    // if (levelFactor <= 3) {
    //     autoDifficulty1 = autoDifficulty.VeryEasy
    // }
    // // else if (levelFactor <= 9) {
    // else if (levelFactor <= 12) {
    //     autoDifficulty1 = autoDifficulty.Easy
    // }
    // // else if (levelFactor <= 14) {
    // else if (levelFactor <= 20) {
    //     autoDifficulty1 = autoDifficulty.Middle
    // }
    // // else if (levelFactor <= 19) {
    // else if (levelFactor <= 30) {
    //     autoDifficulty1 = autoDifficulty.Hard
    // }
    // else {
    //     autoDifficulty1 = autoDifficulty.VeryHard
    // }
    // // if (levelFactor <= 1) {
    // //     autoDifficulty1 = autoDifficulty.VeryEasy
    // // }
    // // else if (levelFactor <= 2) {
    // //     autoDifficulty1 = autoDifficulty.Easy
    // // }
    // // else if (levelFactor <= 3) {
    // //     autoDifficulty1 = autoDifficulty.Middle
    // // }
    // // else if (levelFactor <= 4) {
    // //     autoDifficulty1 = autoDifficulty.Hard
    // // }
    // // else {
    // //     autoDifficulty1 = autoDifficulty.VeryHard
    // // }
    // let autoDifficulty1 = _computeAutoDifficultyByLevel(Math.max((getLevelByCharacter(state, characterType.LittleMan)), (getLevelByCharacter(state, characterType.Giantess))))
    let autoDifficulty1 = _computeAutoDifficultyByLevel(getLevel(state))




    let wholeGameTimeMinutes = getWholeGameTimeMinutes(state)
    let autoDifficulty2
    if (wholeGameTimeMinutes <= 15) {
        autoDifficulty2 = autoDifficulty.VeryEasy
    }
    // else if (wholeGameTimeMinutes <= 20) {
    //     autoDifficulty2 = autoDifficulty.Easy
    // }
    // else if (wholeGameTimeMinutes <= 30) {
    //     autoDifficulty2 = autoDifficulty.Middle
    // }
    // else if (levelFactor <= 40) {
    //     autoDifficulty2 = autoDifficulty.Hard
    // }
    else {
        // autoDifficulty2 = autoDifficulty.Middle
        if (autoDifficulty1 <= autoDifficulty.Easy) {
            autoDifficulty2 = autoDifficulty.Easy
        }
        else {
            autoDifficulty2 = autoDifficulty.VeryEasy
        }
    }

    // return autoDifficulty.VeryHard
    return _addAutoDifficulty(autoDifficulty1, autoDifficulty2)
}

export let updateAutoDifficultyWhenMissionFinish = (state: state, missionFinishStatus_) => {
    switch (missionFinishStatus_) {
        case missionFinishStatus.Fail:
        case missionFinishStatus.FailByDestoyed:
        case missionFinishStatus.End:
            return setDifficultyState(state, {
                ...getDifficultyState(state),
                autoDifficultyForLittleMan: autoDifficulty.VeryEasy,
                autoDifficultyForGiantess: autoDifficulty.VeryEasy
            })
        case missionFinishStatus.Complete:
            return setAutoDifficulty(state, computeAutoDifficulty(state))
    }
}

export let computeNewValueByMultiply = (oldValue, factor1, factor2 = 1) => {
    return oldValue * (1 + factor1 * factor2)
}

export let computeNewValueByDivid = (oldValue, factor1, factor2 = 1, min = -Infinity) => {
    return Math.max(oldValue / (1 + factor1 * factor2), min)
}

export let updateArmyValueByAutoDifficultyAndEnhenceLevel = <value extends armyValue>(state: state, armyValue: armyValue): value => {
    // let enhenceArmyLevel = getEnhenceArmyLevel(state)
    // let autoDifficulty = getAutoDifficulty(state)

    let autoDifficultyOrigin = getAutoDifficulty(state)
    let autoDifficulty = getEnhenceAutoDifficulty(state, getEnhenceArmyLevel(state))

    // let factor = autoDifficulty + enhenceArmyLevel
    let factor = autoDifficulty

    return {
        ...armyValue,
        // defenseFactor: computeNewValueByMultiply(armyValue.defenseFactor, factor, 1),
        // defenseFactor: computeNewValueByMultiply(armyValue.defenseFactor, factor, 0.3),
        defenseFactor: computeNewValueByMultiply(armyValue.defenseFactor, factor, 0.1),
        // attackFactor: computeNewValueByMultiply(armyValue.attackFactor, factor, 0.1),
        attackFactor: computeNewValueByMultiply(armyValue.attackFactor, factor, 0.3),

        hp: Math.round(computeNewValueByMultiply(armyValue.hp, autoDifficultyOrigin, 0.5)),
        // hp: Math.round(computeNewValueByMultiply(armyValue.hp, autoDifficultyOrigin, 0.4)),

        // moveSpeed: computeNewValueByMultiply(armyValue.moveSpeed, factor, 0.2),
        moveSpeed: computeNewValueByMultiply(armyValue.moveSpeed, factor, 0.07),

        emitSpeedFactor: computeNewValueByDivid(armyValue.emitSpeedFactor, factor, 0.2),
        critRatioFactor: computeNewValueByMultiply(armyValue.critRatioFactor, factor, 0.2),
        //missRatio: computeNewValueByMultiply(armyValue.missRatio, factor, 0.2),

        // emitSpeed: Math.round(computeNewValueByDivid(armyValue.emitSpeed, factor, 0.2, emitSpeed.VeryFast)),
        emitPrecision: computeNewValueByDivid(armyValue.emitPrecision, factor, 0.2),
    } as value
}

export let getEnhenceAutoDifficulty = (state: state, enhenceLevel) => {
    let autoDifficulty_ = getAutoDifficulty(state)

    enhenceLevel = enhenceLevel >= 0 ? NumberUtils.greaterThan(enhenceLevel * 0.4, 1)
        : NumberUtils.lessThan(-(2 / enhenceLevel), 1)

    autoDifficulty_ *= enhenceLevel

    return autoDifficulty_
}

export let updateEliteGiantessValueByAutoDifficulty = <value extends armyValue & eliteGiantessValue>(state: state, armyValue: value): value => {
    let autoDifficultyOrigin = getAutoDifficulty(state)
    let autoDifficulty_ = getEnhenceAutoDifficulty(state, getEnhenceEliteGiantessLevel(state))

    if (getAutoDifficulty(state) == autoDifficulty.VeryEasy) {
        return armyValue
    }

    return {
        ...armyValue,
        // scale: computeNewValueByMultiply(armyValue.scale, autoDifficulty, 0.2),
        // scale: computeNewValueByMultiply(armyValue.scale, autoDifficulty, 0.4),
        // scale: computeNewValueByMultiply(armyValue.scale, autoDifficulty, 0.3),
        // scale: computeNewValueByMultiply(armyValue.scale, autoDifficulty, 0.5),
        // scale: limitScale(armyValue.scale, computeNewValueByMultiply(armyValue.scale, autoDifficulty_, 0.3)),
        scale: limitScale(armyValue.scale, computeNewValueByMultiply(armyValue.scale, autoDifficultyOrigin, 0.5)),

        defenseFactor: computeNewValueByMultiply(armyValue.defenseFactor, autoDifficulty_, 0.04),
        attackFactor: computeNewValueByMultiply(armyValue.attackFactor, autoDifficulty_, 0.02),

        // hp: Math.round(computeNewValueByMultiply(armyValue.hp, autoDifficultyOrigin, 0.3)),
        hp: Math.round(computeNewValueByMultiply(armyValue.hp, autoDifficultyOrigin, 0.6)),

        // moveSpeed: computeNewValueByMultiply(armyValue.moveSpeed, autoDifficulty, 0.2),
        // moveSpeed: computeNewValueByMultiply(armyValue.moveSpeed, autoDifficulty, 0.3),

        // emitSpeedFactor: computeNewValueByMultiply(armyValue.emitSpeedFactor, autoDifficulty, 0.1),
        emitSpeedFactor: computeNewValueByDivid(armyValue.emitSpeedFactor, autoDifficulty_, 0.05),
        critRatioFactor: computeNewValueByMultiply(armyValue.critRatioFactor, autoDifficulty_, 0.1),
        //missRatio: computeNewValueByMultiply(armyValue.missRatio, autoDifficulty_, 0.1),

        emitPrecision: computeNewValueByDivid(armyValue.emitPrecision, autoDifficulty_, 0.2),
    } as value
}

let _updateWildGiantessValueByAutoDifficulty = (state: state, usedGirl, value: girlValue) => {
    let autoDifficultyOrigin = getAutoDifficulty(state)
    let autoDifficulty_ = getEnhenceAutoDifficulty(state, getEnhenceLevelGiantessLevel(state))

    if (getAutoDifficulty(state) == autoDifficulty.VeryEasy) {
        return value
    }


    return {
        ...value,

        // initialScale: Math.round(computeNewValueByMultiply(value.initialScale, autoDifficulty_, 0.25)),
        // initialScale: limitInitialScale(state, value, Math.round(computeNewValueByMultiply(value.initialScale, autoDifficulty_, 0.5))),
        initialScale: limitInitialScale(state, usedGirl, Math.round(computeNewValueByMultiply(value.initialScale, autoDifficultyOrigin, 0.5))),

        // scaleIncrease: Math.round(computeNewValueByMultiply(value.scaleIncrease, autoDifficulty_, 0.25)),
        scaleIncrease: Math.round(computeNewValueByMultiply(value.scaleIncrease, autoDifficultyOrigin, 0.25)),
        // minScaleAsSmallGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsSmallGiantess, autoDifficulty_, 0.25)),
        // minScaleAsMiddleGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsMiddleGiantess, autoDifficulty_, 0.25)),
        // minScaleAsBigGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsBigGiantess, autoDifficulty_, 0.25)),


        // defenseFactor: computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.1),
        defenseFactor: computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.02),
        // attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.1),
        attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.01),
        critRatioFactor: computeNewValueByMultiply(value.critRatioFactor, autoDifficulty_, 0.2),
        //missRatio: computeNewValueByMultiply(value.missRatio, autoDifficulty_, 0.2),

        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.3)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.8)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 1.3)),
        hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 2.2)),

        restoreHpTime: Math.round(computeNewValueByDivid(value.restoreHpTime, autoDifficulty_, 0.1)),
        restoreHpSpeedRate: computeNewValueByMultiply(value.restoreHpSpeedRate, autoDifficulty_, 0.1),

        abstorbHpRate: computeNewValueByMultiply(value.abstorbHpRate, autoDifficulty_, 0.25),
    }
}

// let _updateEnemyGiantessValueByAutoDifficulty = _updateWildGiantessValueByAutoDifficulty

let _updateEnemyGiantessValueByAutoDifficulty = (state: state, usedGirl, value: girlValue) => {
    let autoDifficultyOrigin = getAutoDifficulty(state)
    let autoDifficulty_ = getEnhenceAutoDifficulty(state, getEnhenceLevelGiantessLevel(state))

    if (getAutoDifficulty(state) == autoDifficulty.VeryEasy) {
        return value
    }

    return {
        ...value,

        // initialScale: Math.round(computeNewValueByMultiply(value.initialScale, autoDifficulty_, 0.25)),
        // initialScale: value.initialScale >= getMaxScale(state, value) ? value.initialScale : Math.round(computeNewValueByMultiply(value.initialScale, autoDifficulty_, 0.5)),
        initialScale: limitInitialScale(state, usedGirl, Math.round(computeNewValueByMultiply(value.initialScale, autoDifficultyOrigin, 0.5))),

        // scaleIncrease: Math.round(computeNewValueByMultiply(value.scaleIncrease, autoDifficulty_, 0.25)),
        // scaleIncrease: Math.round(computeNewValueByMultiply(value.scaleIncrease, autoDifficulty_, 0.5)),
        scaleIncrease: Math.round(computeNewValueByMultiply(value.scaleIncrease, autoDifficultyOrigin, 0.25)),
        // minScaleAsSmallGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsSmallGiantess, autoDifficulty_, 0.25)),
        // minScaleAsMiddleGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsMiddleGiantess, autoDifficulty_, 0.25)),
        // minScaleAsBigGiantess: Math.round(computeNewValueByMultiply(value.minScaleAsBigGiantess, autoDifficulty_, 0.25)),


        // defenseFactor: computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.1),
        defenseFactor: computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.02),
        // attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.1),
        // attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.3),
        attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.03),
        critRatioFactor: computeNewValueByMultiply(value.critRatioFactor, autoDifficulty_, 0.2),
        //missRatio: computeNewValueByMultiply(value.missRatio, autoDifficulty_, 0.2),

        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.3)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.5)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 1)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 1.5)),
        hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficultyOrigin, 2.5)),

        restoreHpTime: Math.round(computeNewValueByDivid(value.restoreHpTime, autoDifficulty_, 0.1)),
        restoreHpSpeedRate: computeNewValueByMultiply(value.restoreHpSpeedRate, autoDifficulty_, 0.1),

        abstorbHpRate: computeNewValueByMultiply(value.abstorbHpRate, autoDifficulty_, 0.25),
    }

}

let _updateBossGiantessValueByAutoDifficulty = (state: state, value: girlValue) => {
    let autoDifficulty_ = getAutoDifficulty(state)
    // let autoDifficulty_ = getEnhenceAutoDifficulty(state, getEnhenceBossGiantessBossLevel(state))

    if (autoDifficulty_ == autoDifficulty.VeryEasy) {
        return value
    }

    return {
        ...value,

        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.3)),
        // hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 0.8)),
        hp: Math.round(computeNewValueByMultiply(value.hp, autoDifficulty_, 1.5)),

        defenseFactor: computeNewValueByMultiply(value.defenseFactor, autoDifficulty_, 0.1),
        attackFactor: computeNewValueByMultiply(value.attackFactor, autoDifficulty_, 0.1),
        critRatioFactor: computeNewValueByMultiply(value.critRatioFactor, autoDifficulty_, 0.2),
        //missRatio: computeNewValueByMultiply(value.missRatio, autoDifficulty_, 0.2),


        restoreHpTime: Math.round(computeNewValueByDivid(value.restoreHpTime, autoDifficulty_, 0.1)),
        restoreHpSpeedRate: computeNewValueByMultiply(value.restoreHpSpeedRate, autoDifficulty_, 0.1),

        abstorbHpRate: computeNewValueByMultiply(value.abstorbHpRate, autoDifficulty_, 0.25),
    }
}

// export let updateGirlValueByAutoDifficulty = (state, usedGirl) => {
//     let func
//     switch (usedGirl) {
//         case usedGirlEnum.WildGiantess:
//             func = NullableUtils.return_(_updateWildGiantessValueByAutoDifficulty)
//             break
//         case usedGirlEnum.EnemyGiantess:
//             func = NullableUtils.return_(_updateEnemyGiantessValueByAutoDifficulty)
//             break
//         case usedGirlEnum.BossGiantess:
//             func = NullableUtils.return_(_updateBossGiantessValueByAutoDifficulty)
//             break
//         case usedGirlEnum.PlayerGoddess:
//             func = NullableUtils.getEmpty()
//             break
//         default:
//             if (isLevelGiantess(state, usedGirl)) {
//                 func = updateGirlValueMod(state)
//             }
//             else {
//                 throw new Error("err")
//             }
//             break
//     }


//     state = NullableUtils.getWithDefault(
//         NullableUtils.map(func => {
//             state = setAttribute(state, buildFuncData(state), (girlValue) => {
//                 return func(state, girlValue)
//             }, usedGirl)
//         }, func),
//         state
//     )
//     state = setFullHp(state, buildFuncData(state), (state, hp) => hp, true, usedGirl)

//     return state
// }
export let updateGirlValue = (state, usedGirl) => {
    let func
    switch (usedGirl) {
        case usedGirlEnum.WildGiantess:
            func = NullableUtils.return_((state, value) => {
                return updateWildGiantessValue(state, usedGirl, _updateWildGiantessValueByAutoDifficulty(state, usedGirl, value))
            })
            break
        case usedGirlEnum.EnemyGiantess:
            func = NullableUtils.return_((state, value) => {
                return updateEnemyGiantessValue(state, usedGirl, _updateEnemyGiantessValueByAutoDifficulty(state, usedGirl, value))
            })
            break
        case usedGirlEnum.BossGiantess:
            func = NullableUtils.return_((state, value) => {
                return updateBossGiantessValue(state, _updateBossGiantessValueByAutoDifficulty(state, value))
            })
            break
        case usedGirlEnum.PlayerGoddess:
            func = NullableUtils.getEmpty()
            break
        default:
            if (isLevelGiantess(state, usedGirl)) {
                func = NullableUtils.return_((state, value) => {
                    // return updateLevelGiantessValue(state, updateGirlValueMod(state)(state, value))
                    return updateGirlValueMod(state, usedGirl)(state, value)
                })
            }
            else {
                throw new Error("err")
            }
            break
    }

    state = NullableUtils.getWithDefault(
        NullableUtils.map(func => {
            state = setAttribute(state, buildFuncData(state), (girlValue) => {
                return func(state, girlValue)
            }, usedGirl)
        }, func),
        state
    )
    state = setFullHp(state, buildFuncData(state), (state, hp) => hp, true, usedGirl)

    return state
}

export let isIncreaseAutoDifficulty = (oldAutoDifficulty, newAutoDifficulty) => {
    return newAutoDifficulty > oldAutoDifficulty
}

export let convertAutoDifficultyToRate = (state: state) => {
    return getAutoDifficulty(state) / autoDifficulty.VeryHard5
}
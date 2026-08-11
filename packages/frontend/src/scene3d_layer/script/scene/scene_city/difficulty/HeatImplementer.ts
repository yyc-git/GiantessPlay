import { maxUnitCount } from "setting-default/src/Type"
import { getRenderSetting } from "../../../../mod/SettingMod"
import { state } from "../../../../type/StateType"
import { buildFuncData } from "../data/FuncData"
import { armyValue, eliteGiantessValue, girlValue } from "../data/ValueType"
import { getCampWithDefault, getCampExn, getCamp } from "../manage/city1/Army"
import { camp, forceSize, usedGirlEnum } from "../type/StateType"
import { getDifficultyState, setDifficultyState, updateArmyValueByAutoDifficultyAndEnhenceLevel, updateEliteGiantessValueByAutoDifficulty } from "./DifficultyUtils"
import { getSceneChapter, isGiantessCharacterType } from "../CityScene"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { updateArmyValue as updateArmyValueMod, updateEliteGiantessValue as updateEliteGiantessValueMod } from "../../../../mod/SceneMod"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { limitScale } from "../../../../mod/EliteGiantessMod"
import { getMaxScale } from "../girl/Utils"
import { limitInitialScale } from "../../../../mod/LevelGiantessMod"
import { computeForceFactor } from "../utils/WeaponUtils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getEnhenceArmyFactor, getEnhenceEliteGiantessFactor, getEnhenceLevelGiantessFactor } from "./Difficulty"
import { getBuffLittleManIncreaseDefenseBlockName } from "buff-emit-defense-increasedefense/src/script/Utils"
import { getIsDebug } from "../../Scene"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getCurrentUsedGirls, isPlayerGiantess } from "../girl/Girl"
import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"

let _computeNewValueByMutiply = (value, ratio) => {
    return value * (1 + ratio)
}

let _computeNewValueByDivid = (value, ratio) => {
    return value / (1 + ratio)
}


export let getArmyCountRatio = (state: state) => {
    return getDifficultyState(state).armyCountRatio
}

export let setArmyCountRatio = (state: state, value) => {
    return setDifficultyState(state, {
        ...getDifficultyState(state),
        armyCountRatio: value
    })
}

export let getEliteArmyCountRatio = (state: state) => {
    return getDifficultyState(state).eliteArmyCountRatio
}

export let setEliteArmyCountRatio = (state: state, value) => {
    return setDifficultyState(state, {
        ...getDifficultyState(state),
        eliteArmyCountRatio: value
    })
}

export let isNotGenerateArmy = (state) => {
    return getArmyCountRatio(state) == -1
}

export let isNotGenerateEliteArmy = (state) => {
    return getEliteArmyCountRatio(state) == -1
}

export let computeArmyCount = (state: state, count) => {
    return Math.round(_computeNewValueByMutiply(count, getArmyCountRatio(state)))
}

// export let computeTotalArmyCount = computeArmyCount
export let computeTotalArmyCount = (state, count) => {
    if (getIsDebug(state)) {
        return Infinity
    }

    switch (getRenderSetting(state).maxUnitCount) {
        case maxUnitCount.Small:
            count *= 0.5
            break
        case maxUnitCount.Middle:
            break
        case maxUnitCount.Big:
            count *= 2
            break
        case maxUnitCount.VeryBig:
            count *= 4
            break
    }

    return count
}

export let computeEliteArmyCount = (state: state, count) => {
    return Math.round(_computeNewValueByMutiply(count, getEliteArmyCountRatio(state)))
}

export let setEnemyDamageRatio = (state: state, ratio) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enemyDamageRatio: ratio
    })

    return state
}


export let handleEnemyDamage = (state: state, fromName, weaponType, armorType, forceSize: forceSize) => {
    forceSize *= computeForceFactor(weaponType, armorType)

    if (
        getDifficultyState(state).enemyDamageRatio == 0
        ||
        NullableUtils.getWithDefault(
            NullableUtils.map(camp_ => camp_ == camp.Player, getCamp(state, fromName)),
            true
        )
    ) {
        return forceSize
    }

    return _computeNewValueByMutiply(forceSize, getDifficultyState(state).enemyDamageRatio)
}



export let setRestoreHpRatio = (state: state, ratio) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        restoreHpRatio: ratio
    })

    return state
}

export let computeRestoreHpSpeedRate = (state: state, restoreHpSpeedRate, characterType_) => {
    if (characterType_ == characterType.Giantess && isPlayerGiantess(state, usedGirlEnum.PlayerGirl)) {
        return restoreHpSpeedRate
    }

    return _computeNewValueByMutiply(restoreHpSpeedRate, -getDifficultyState(state).restoreHpRatio)
}


export let setEnemyHpRatio = (state: state, ratio) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enemyHpRatio: ratio
    })

    return state
}

export let getEnhenceArmyLevel = (state) => {
    return getDifficultyState(state).enhenceArmyLevel
}

export let setEnhenceArmyLevel = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceArmyLevel: level
    })

    return state
}


export let getEnhenceEliteGiantessLevel = (state) => {
    return getDifficultyState(state).enhenceEliteGiantessLevel
}

export let setEnhenceEliteGiantessLevel = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceEliteGiantessLevel: level
    })

    return state
}

export let getEnhenceLevelGiantessLevel = (state) => {
    return getDifficultyState(state).enhenceLevelGiantessLevel
}

export let setEnhenceLevelGiantessLevel = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceLevelGiantessLevel: level
    })

    return state
}

export let getEnhenceBossGiantessBossLevel = (state) => {
    return getDifficultyState(state).enhenceBossGiantessLevel
}

export let setEnhenceBossGiantessBossLevel = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceBossGiantessLevel: level
    })

    return state
}

export let getMaxMMDGiantessCountLevel = (state) => {
    return getDifficultyState(state).maxMMDGiantessCountLevel
}

export let setMaxMMDGiantessCountLevel = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        maxMMDGiantessCountLevel: level
    })

    return state
}

let _getMaxMMDGiantessCount = (state: state) => {
    let returnVal = getMaxMMDGiantessCountLevel(state) + 2

    return ensureCheck(returnVal, (r) => {
        test("should between [1,3]", () => {
            return NumberUtils.between(r, 1, 3)
        })
    }, getIsDebug(state))
}

export let isExceedMaxMMDGiantessCountAfterAdd = (state: state) => {
    return (getCurrentUsedGirls(state).length + 1) > _getMaxMMDGiantessCount(state)
}

export let updateArmyValue = <value extends armyValue>(state: state, armyValue: value): value => {
    let enhenceArmyLevel = getEnhenceArmyLevel(state)
    let factor = getEnhenceArmyFactor(state)
    let limitFactor = NumberUtils.lessThan(factor, 10)
    let attackLimitFactor = NumberUtils.lessThan(factor, 20)

    switch (getSceneChapter(state)) {
        case scene.Play:
        case scene.Biwu:
            let result: value = {
                ...armyValue,
                hp: Math.round(_computeNewValueByMutiply(
                    _computeNewValueByMutiply(
                        _computeNewValueByMutiply(armyValue.hp, getDifficultyState(state).enemyHpRatio),
                        enhenceArmyLevel * 0.5
                    ), factor)
                ),


                moveSpeed: _computeNewValueByMutiply(armyValue.moveSpeed, limitFactor * 0.1),

                defenseFactor: _computeNewValueByMutiply(armyValue.defenseFactor, limitFactor * 0.3),
                attackFactor: _computeNewValueByMutiply(armyValue.attackFactor, attackLimitFactor * 0.3),

                // emitSpeedFactor: _computeNewValueByMutiply(armyValue.emitSpeedFactor, limitFactor * 0.1),
                emitSpeedFactor: _computeNewValueByDivid(armyValue.emitSpeedFactor, limitFactor * 0.1),
                critRatioFactor: _computeNewValueByMutiply(armyValue.critRatioFactor, limitFactor * 0.3),
                //missRatio: _computeNewValueByMutiply(armyValue.missRatio, limitFactor * 0.2),

                emitPrecision: _computeNewValueByDivid(armyValue.emitPrecision, limitFactor * 0.5),
            }

            result = updateArmyValueByAutoDifficultyAndEnhenceLevel(state, result)

            return result
        default:
            return updateArmyValueMod(state, getSceneChapter(state), armyValue)
    }
}

export let updateEliteGiantessValueDefault = <value extends armyValue & eliteGiantessValue>(state: state, value: value): value => {
    let enhenceEliteGiantessLevel = getEnhenceEliteGiantessLevel(state)
    let factor = getEnhenceEliteGiantessFactor(state)
    let limitFactor = NumberUtils.lessThan(factor, 10)
    let attackLimitFactor = NumberUtils.lessThan(factor, 20)

    let result: value = {
        ...value,
        hp: Math.round(
            _computeNewValueByMutiply(
                _computeNewValueByMutiply(
                    _computeNewValueByMutiply(value.hp, getDifficultyState(state).enemyHpRatio),
                    enhenceEliteGiantessLevel >= 0 ? enhenceEliteGiantessLevel * 0.5
                        : enhenceEliteGiantessLevel / 10
                ),
                factor
            )
        ),
        scale: limitScale(value.scale, Math.round(_computeNewValueByMutiply(value.scale, 0.5 *
            (
                enhenceEliteGiantessLevel >= 0 ? enhenceEliteGiantessLevel * 0.5
                    : enhenceEliteGiantessLevel / 5
            )
        ))),


        defenseFactor: _computeNewValueByMutiply(value.defenseFactor, limitFactor * 0.3),
        // attackFactor: _computeNewValueByMutiply(value.attackFactor, factor * 0.5),
        attackFactor: _computeNewValueByMutiply(value.attackFactor, attackLimitFactor * 0.3),


        // emitSpeedFactor: _computeNewValueByMutiply(value.emitSpeedFactor, limitFactor * 0.1),
        emitSpeedFactor: _computeNewValueByDivid(value.emitSpeedFactor, limitFactor * 0.1),
        critRatioFactor: _computeNewValueByMutiply(value.critRatioFactor, limitFactor * 0.3),
        //missRatio: _computeNewValueByMutiply(value.missRatio, limitFactor * 0.2),

        emitPrecision: _computeNewValueByDivid(value.emitPrecision, limitFactor * 0.5),
    }

    result = updateEliteGiantessValueByAutoDifficulty(state, result)

    return result
}

export let updateEliteGiantessValue = <value extends armyValue & eliteGiantessValue>(state: state, eliteGiantessValue: value): value => {
    switch (getSceneChapter(state)) {
        case scene.Play:
        case scene.Biwu:
            return updateEliteGiantessValueDefault(state, eliteGiantessValue)
        default:
            return updateEliteGiantessValueMod(state, getSceneChapter(state), eliteGiantessValue)
    }
}

export let updateWildGiantessValue = (state: state, usedGirl, value: girlValue) => {
    let enhenceLevelGiantessLevel = getEnhenceLevelGiantessLevel(state)
    let factor = getEnhenceLevelGiantessFactor(state)
    let limitFactor = NumberUtils.lessThan(factor, 10)
    let attackLimitFactor = NumberUtils.lessThan(factor, 20)

    let result = {
        ...value,
        hp: Math.round(
            _computeNewValueByMutiply(
                _computeNewValueByMutiply(
                    _computeNewValueByMutiply(value.hp, getDifficultyState(state).enemyHpRatio),
                    enhenceLevelGiantessLevel / 2
                ),
                // factor)
                factor * 2)
        ),
        initialScale: limitInitialScale(state, usedGirl, Math.round(
            _computeNewValueByMutiply(
                _computeNewValueByMutiply(value.initialScale, enhenceLevelGiantessLevel / 2),
                limitFactor * 0.3
            )
        )),

        // scaleIncrease: Math.round(_computeNewValueByMutiply(value.scaleIncrease, enhenceLevelGiantessLevel / 3)),
        scaleIncrease: Math.round(_computeNewValueByMutiply(value.scaleIncrease, enhenceLevelGiantessLevel / 4)),

        // defenseFactor: _computeNewValueByMutiply(value.defenseFactor, 0.1 * enhenceLevelGiantessLevel),

        // defenseFactor: _computeNewValueByMutiply(value.defenseFactor, limitFactor * 0.3),
        defenseFactor: _computeNewValueByMutiply(value.defenseFactor, limitFactor * 0.6),
        attackFactor: _computeNewValueByMutiply(value.attackFactor, attackLimitFactor * 0.5),
        critRatioFactor: _computeNewValueByMutiply(value.critRatioFactor, limitFactor * 0.3),
        //missRatio: _computeNewValueByMutiply(value.missRatio, limitFactor * 0.2),

        restoreHpTime: _computeNewValueByDivid(value.restoreHpTime, limitFactor * 0.5),
        restoreHpSpeedRate: _computeNewValueByMutiply(value.restoreHpSpeedRate, limitFactor * 0.4),

        abstorbHpRate: _computeNewValueByMutiply(value.abstorbHpRate, limitFactor * 0.5),
    }

    // result = updateWildGiantessValueByAutoDifficulty(state, result)

    return result
}

export let updateEnemyGiantessValue = updateWildGiantessValue

export let updateLevelGiantessValue = updateWildGiantessValue

export let updateBossGiantessValue = (state: state, value: girlValue) => {
    let enhenceBossGiantessBossLevel = getEnhenceBossGiantessBossLevel(state)

    let result = {
        ...value,
        // hp: Math.round(_computeNewValueByMutiply(value.hp, getDifficultyState(state).enemyHpRatio))
        hp: Math.round(
            _computeNewValueByMutiply(
                _computeNewValueByMutiply(value.hp, getDifficultyState(state).enemyHpRatio),
                enhenceBossGiantessBossLevel / 2
            )
        ),

        // defenseFactor: Math.round(_computeNewValueByMutiply(value.defenseFactor, enhenceBossGiantessBossLevel / 3)),
        // attackFactor: Math.round(_computeNewValueByMutiply(value.attackFactor, enhenceBossGiantessBossLevel / 2)),
        // critRatioFactor: Math.round(_computeNewValueByMutiply(value.critRatioFactor, enhenceBossGiantessBossLevel / 2)),
        defenseFactor: _computeNewValueByMutiply(value.defenseFactor, enhenceBossGiantessBossLevel / 3),
        // attackFactor: _computeNewValueByMutiply(value.attackFactor, enhenceBossGiantessBossLevel / 2),
        // attackFactor: _computeNewValueByMutiply(value.attackFactor, enhenceBossGiantessBossLevel / 4),
        attackFactor: _computeNewValueByMutiply(value.attackFactor, enhenceBossGiantessBossLevel / 3),
        critRatioFactor: _computeNewValueByMutiply(value.critRatioFactor, enhenceBossGiantessBossLevel / 2),
    }

    // result = updateBossGiantessValueByAutoDifficulty(state, result)

    return result
}




// export let apply = (state: state) => {
//     if (getDifficultyState(state).enemyHpRatio != 0) {
//         state = setHp(state, buildFuncData(state), (state, hp) => {
//             return Math.round(_computeNewValueByMutiply(hp, getDifficultyState(state).enemyHpRatio))
//         }, true, usedGirlEnum.WildGiantess)
//     }

//     return state
// }


export let getDecreaseGenerateArmyIntervalRatio = (state) => {
    return getDifficultyState(state).decreaseGenerateArmyIntervalRatio
}

export let setDecreaseGenerateArmyIntervalRatio = (state: state, level) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        decreaseGenerateArmyIntervalRatio: level
    })

    return state
}


export let getIsAllowFriendDamage = (state) => {
    return getDifficultyState(state).isAllowFriendDamage
}

export let setIsAllowFriendDamage = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        isAllowFriendDamage: value
    })

    return state
}

export let getIsRemoveMapEdgeZone = (state) => {
    return getDifficultyState(state).isRemoveMapEdgeZone
}

export let setIsRemoveMapEdgeZone = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        isRemoveMapEdgeZone: value
    })

    return state
}
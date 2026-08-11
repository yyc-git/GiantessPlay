import { Vector3 } from "three";
import { armyDirector, autoDifficulty, camp, usedGirlEnum } from "../type/StateType";
import { getConfigData, getGirlScale, getState, isGiantessCharacterType, isLittleCharacterType, setConfigData, setState } from "../CityScene";
import { state } from "../../../../type/StateType";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Flow } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { generateArmy, generateMilltaryBuildings, generateMilltaryVehicles, generateSoldiers, isNoValidCrowdPositions, showNoValidCrowdPositionsTip } from "../manage/city1/generator/ArmyGenerator";
import { generateCommanders, generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateTanks } from "../manage/city1/ArmyManager";
import * as ShellTurret from "../manage/city1/milltary_building/ShellTurret";
import * as MissileTurret from "../manage/city1/milltary_building/MissileTurret";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getArmyDirectorState, setArmyDirectorState } from "./ArmyDirectorUtils";
import { getIsDebug, getIsProduction } from "../../Scene";
import { getAutoDifficulty } from "../difficulty/Difficulty";
import { getAllAliveArmyCount, getAllAliveArmyCountExceptCamp } from "../utils/ArmyUtils";
import { computeArmyCount, computeTotalArmyCount, getDecreaseGenerateArmyIntervalRatio, getEnhenceEliteGiantessLevel, isNotGenerateArmy, isNotGenerateEliteArmy } from "../difficulty/HeatImplementer";
import { generateEliteGiantesses, generateMagicGiantesses, generateMeleeGiantesses } from "../../../../mod/EliteGiantessMod";
import { getMapSparseFactor } from "../manage/city1/map/MapUtils";
import { hasLevelGiantessExceptPlayer, isLevelGiantess, isLevelGiantessExceptPlayer } from "../girl/Girl";
import { getLevel, getLevelByCharacter } from "../build/Upgrade";
import { Event } from "meta3d-jiehuo-abstract";
import { buildShowUITipEventData, getShowUITipEventName } from "../../../../utils/EventUtils";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { getPassTimeFromNow } from "../Time";
import { getStartNowForLevel } from "../manage/mission/Mission";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getPlayerCamp } from "../utils/PlayerUtils";


const _v1 = new Vector3();
const _v2 = new Vector3();

// type levelData = {

// 1: Array[ {
//                                             generateFunc: generateSoldiers,
//                                             funcs: [
//                                                 generateRocketeers
//                                             ],
//                                             count,
//                                             offset: offset
//                                         } ],
// }

export let createState = (): armyDirector => {
    return {
        // armyCountRatio: 0,
    }
}

let _getLevelGenerateNormalArmyData = (state: state) => {
    const smallOffset = 10
    const bigOffset = 15

    return {
        1: [
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateInfantrys
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees
                ],
                count: 1,
                offset: smallOffset
            },
            // {
            //     generateFunc: generateEliteGiantesses,
            //     funcs: [
            //         generateMagicGiantesses(state)
            //     ],
            //     count: 0.1,
            //     offset: smallOffset
            // },
        ],
        2: [
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state)
                ],
                count: 0.3,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateTanks
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees,
                    generateInfantrys
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees,
                    // generateInfantrys
                ],
                count: 2,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    // generateRocketeers,
                    generateInfantrys
                ],
                count: 3,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateLaserers,
                ],
                count: 1,
                offset: smallOffset
            },
        ],
        3: [
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMeleeGiantesses(state)
                ],
                count: 0.5,
                offset: smallOffset
            },
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state)
                ],
                count: 0.5,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateTanks
                ],
                count: 2,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateTanks, generateFlameVehicles
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateMissileVehicles
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees,
                    generateInfantrys,
                    generateRocketeers,
                    generateCommanders
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryBuildings,
                funcs: [
                    ShellTurret.generateTurrets,
                ],
                count: 1,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryBuildings,
                funcs: [
                    MissileTurret.generateTurrets,
                ],
                count: 1,
                offset: smallOffset
            },
        ],
        4: [
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state),
                    generateMeleeGiantesses(state)
                ],
                count: 0.3,
                offset: bigOffset
            },
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMeleeGiantesses(state)
                ],
                count: 0.7,
                offset: bigOffset
            },
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state)
                ],
                count: 0.7,
                offset: bigOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateTanks,
                    generateFlameVehicles,
                    generateMissileVehicles
                ],
                count: 1,
                offset: bigOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees,
                    generateInfantrys,
                    generateRocketeers,
                    generateLaserers,
                    generateCommanders
                ],
                count: 1,
                offset: bigOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateRocketeers,
                ],
                count: 5,
                offset: smallOffset
            },
            {
                generateFunc: generateMilltaryBuildings,
                funcs: [
                    ShellTurret.generateTurrets,
                    MissileTurret.generateTurrets,
                    // generateMelees,
                    // generateRocketeers,
                    // generateTanks,
                ],
                count: 1,
                offset: bigOffset
            },
            // {
            //     generateFunc: generateMilltaryBuildings,
            //     funcs: [
            //         MissileTurret.generateTurrets,
            //         // generateLaserers,
            //         // generateCommanders,
            //         // generateMissileVehicles,
            //     ],
            //     count: 2,
            //     offset
            // },
        ],
        5: [
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state),
                    generateMeleeGiantesses(state)
                ],
                count: 0.7,
                offset: bigOffset
            },
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMeleeGiantesses(state)
                ],
                count: 1.5,
                offset: bigOffset
            },
            {
                generateFunc: generateEliteGiantesses,
                funcs: [
                    generateMagicGiantesses(state)
                ],
                count: 1.5,
                offset: bigOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateTanks,
                    generateFlameVehicles,
                    generateMissileVehicles
                ],
                count: 2,
                offset: bigOffset
            },
            {
                generateFunc: generateMilltaryVehicles,
                funcs: [
                    generateMissileVehicles
                ],
                count: 5,
                offset: bigOffset
            },
            {
                generateFunc: generateSoldiers,
                funcs: [
                    generateMelees,
                    // generateInfantrys,
                    generateRocketeers,
                    generateLaserers,
                    // generateCommanders
                ],
                count: 3,
                offset: bigOffset
            },
            {
                generateFunc: generateMilltaryBuildings,
                funcs: [
                    ShellTurret.generateTurrets,
                    MissileTurret.generateTurrets,
                ],
                count: 2,
                offset: bigOffset
            },
        ],
    }
}

// export let getMaxCount = () => 150
export let getMaxCount = () => 100
// export let getMaxCount = () => 10

export let isCanGenerateMax = (state: state, aliveCount, maxCount) => {
    // let count = getMaxCount()

    return aliveCount < computeTotalArmyCount(state, maxCount)
}

export let isCanGenerate = (state: state) => {
    if (!getIsDebug(state) && getPassTimeFromNow(state, NullableUtils.return_(getStartNowForLevel(state))) <= 10000) {
        return false
    }

    // let count
    let factor
    // switch (getAutoDifficulty(state)) {
    //     case autoDifficulty.VeryEasy:
    //         count = 5
    //         break
    //     case autoDifficulty.Easy:
    //         // count = 15
    //         count = 10
    //         break
    //     case autoDifficulty.Middle:
    //         // count = 35
    //         count = 20
    //         break
    //     case autoDifficulty.Hard:
    //         // count = 60
    //         count = 35
    //         // count = 50
    //         break
    //     case autoDifficulty.VeryHard:
    //         count = 50
    //         break
    //     case autoDifficulty.VeryHard1:
    //         // count = 90
    //         count = 70
    //         // count = 70
    //         break
    //     case autoDifficulty.VeryHard2:
    //         // count = 100
    //         // count = 90
    //         count = 80
    //         // count = 85
    //         break
    //     case autoDifficulty.VeryHard3:
    //         // count = 120
    //         // count = 110
    //         count = 90
    //         break
    //     case autoDifficulty.VeryHard4:
    //     // // count = 130
    //     // count = 130
    //     // break
    //     case autoDifficulty.VeryHard5:
    //         count = getMaxCount()
    //         break
    // }
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            factor = 20
            break
        case autoDifficulty.Easy:
            factor = 10
            break
        case autoDifficulty.Middle:
            factor = 5
            break
        case autoDifficulty.Hard:
            factor = 3.5
            break
        case autoDifficulty.VeryHard:
            factor = 2
            break
        case autoDifficulty.VeryHard1:
            factor = 1.5
            break
        case autoDifficulty.VeryHard2:
            factor = 1.2
            break
        case autoDifficulty.VeryHard3:
            factor = 1.1
            break
        case autoDifficulty.VeryHard4:
        case autoDifficulty.VeryHard5:
            factor = 1
            break
    }

    let count = getMaxCount() / factor

    // return getAllAliveArmyCount(state) < computeTotalArmyCount(state, count)
    return getAllAliveArmyCountExceptCamp(state, getPlayerCamp()) < computeTotalArmyCount(state, count)
}

export let generate = (state: state, getFunc, level, countFactor) => {
    let data = _getLevelGenerateNormalArmyData(state)

    let oneLevelData = MutableRecordUtils.getExn(
        data,
        // NumberUtils.getRandomInteger(1, maxLevel)

        level
    )

    if (isNotGenerateArmy(state)) {
        oneLevelData = oneLevelData.filter(d => {
            return d.generateFunc === generateEliteGiantesses
        })

        // TODO remove
        if (oneLevelData.length == 0) {
            oneLevelData = [
                {
                    generateFunc: generateEliteGiantesses,
                    funcs: [
                        generateMagicGiantesses(state)
                    ],
                    count: 0.1,
                    offset: 10
                },
            ]
        }
    }
    if (isNotGenerateEliteArmy(state)) {
        oneLevelData = oneLevelData.filter(d => {
            return d.generateFunc !== generateEliteGiantesses
        })
    }

    if (oneLevelData.length == 0) {
        return []
    }

    return getFunc(oneLevelData).map(result => {
        return {
            ...result,
            count: NumberUtils.greaterThan(Math.round(result.count * countFactor), 1)
        }
    })
    // let resultLevelData = oneLevelData[NumberUtils.getRandomInteger(0, oneLevelData.length - 1)]
    // resultLevelData = {
    //     ...resultLevelData,
    //     count: Math.round(resultLevelData.count * countFactor)
    // }

    // return resultLevelData
}

export let getArmyCountFactorByAutoDifficulty = (state) => {
    let countFactor
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            countFactor = 1
            break
        case autoDifficulty.Easy:
            countFactor = 1.1
            // countFactor = 1.2
            break
        case autoDifficulty.Middle:
            // countFactor = 2
            // countFactor = 1.5
            countFactor = 1.4
            break
        case autoDifficulty.Hard:
            // countFactor = 2.8
            // countFactor = 1.8
            countFactor = 1.5
            break
        case autoDifficulty.VeryHard:
            // countFactor = 2.4
            // countFactor = 2.1
            countFactor = 1.8
            break
        // default:
        case autoDifficulty.VeryHard1:
            // countFactor = 4
            // countFactor = 3.5
            // countFactor = 3.3
            // countFactor = 3
            // countFactor = 2.5
            // countFactor = 1.8
            countFactor = 2.2
            break
        case autoDifficulty.VeryHard2:
            // countFactor = 3.5
            // countFactor = 2.9
            countFactor = 2.6
            break
        case autoDifficulty.VeryHard3:
            // countFactor = 4.5
            // countFactor = 4
            // countFactor = 3.3
            countFactor = 2.7
            break
        case autoDifficulty.VeryHard4:
            // countFactor = 4.5
            // countFactor = 3.7
            countFactor = 3.3
            break
        case autoDifficulty.VeryHard5:
            // countFactor = 5
            // countFactor = 4.1
            countFactor = 4
            break
    }

    return countFactor
}

let _generate = (state: state) => {
    if (isNoValidCrowdPositions(state)) {
        return showNoValidCrowdPositionsTip(state)
    }

    let maxLevel, countFactor, rangeFactor

    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            maxLevel = 1
            rangeFactor = 0.5
            break
        case autoDifficulty.Easy:
            maxLevel = 2
            rangeFactor = 0.8
            break
        case autoDifficulty.Middle:
            maxLevel = 2
            rangeFactor = 1.2
            break
        case autoDifficulty.Hard:
            maxLevel = 3
            // rangeFactor = 1.4
            rangeFactor = 1.7
            break
        case autoDifficulty.VeryHard:
            maxLevel = 3
            rangeFactor = 2.0
            break
        case autoDifficulty.VeryHard1:
            maxLevel = 4
            // rangeFactor = 1.6
            rangeFactor = 2.4
            break
        case autoDifficulty.VeryHard2:
            maxLevel = 4
            rangeFactor = 2.8
            break
        case autoDifficulty.VeryHard3:
            maxLevel = 5
            rangeFactor = 3.2
            break
        case autoDifficulty.VeryHard4:
            maxLevel = 5
            rangeFactor = 3.6
            break
        case autoDifficulty.VeryHard5:
            maxLevel = 5
            rangeFactor = 4
            break
    }

    rangeFactor *= 2

    countFactor = getArmyCountFactorByAutoDifficulty(state)
    if (isLittleCharacterType(state)) {
        // if (isLevelGiantessExceptPlayer(state, usedGirl)) {
        if (hasLevelGiantessExceptPlayer(state)) {
            countFactor *= 0.3
        }
        else {
            countFactor *= 0.6
        }
    }

    let levelData = generate(
        state,
        oneLevelData => {
            return [oneLevelData[NumberUtils.getRandomInteger(0, oneLevelData.length - 1)]]
        },
        NumberUtils.getRandomInteger(NumberUtils.greaterThan(Math.round(maxLevel / 2), 1), maxLevel),
        countFactor)

    if (levelData.length == 0) {
        return Promise.resolve(state)
    }

    let resultLevelData: any = ArrayUtils.getExn(levelData, 0)

    let minRange, maxRange
    if (isLittleCharacterType(state)) {
        minRange = 15
        // minRange = 30
        maxRange = 60
        // maxRange = 100


        minRange *= rangeFactor
        maxRange *= rangeFactor
    }
    else {
        // minRange = 20
        // minRange = 50
        // minRange = 40
        minRange = 25
        maxRange = 100
        // maxRange = 150


        let minRangeFactor, maxRangeFactor
        let scale = getGirlScale(state, usedGirlEnum.PlayerGirl)
        // if (scale <= 30) {
        if (scale <= 15) {
            minRangeFactor = 1
            maxRangeFactor = 1
        }
        else if (scale <= 30) {
            minRangeFactor = 2
            maxRangeFactor = 1
        }
        else if (scale <= 100) {
            // minRangeFactor = 2
            minRangeFactor = 3
            maxRangeFactor = 2
        }
        else if (scale <= 200) {
            // minRangeFactor = 4
            minRangeFactor = 6
            maxRangeFactor = 4
        }
        else if (scale <= 400) {
            // minRangeFactor = 8
            minRangeFactor = 12
            maxRangeFactor = 8
        }
        else if (scale <= 1000) {
            // minRangeFactor = 8
            // minRangeFactor = 24
            minRangeFactor = 20
            maxRangeFactor = 20
        }
        else {
            // minRangeFactor = 10
            // maxRangeFactor = 30
            // minRangeFactor = 30
            minRangeFactor = 20
            maxRangeFactor = 30
        }

        minRange *= minRangeFactor
        maxRange *= maxRangeFactor
    }

    let mapSparseFactor = getMapSparseFactor(state)

    // minRange *= mapSparseFactor * rangeFactor
    // // maxRange *= NumberUtils.greaterThan(rangeFactor, 1)
    // maxRange *= mapSparseFactor * rangeFactor
    minRange *= mapSparseFactor
    maxRange *= mapSparseFactor


    if (resultLevelData.generateFunc === generateEliteGiantesses) {
        let rangeFactor = NumberUtils.clamp(
            2 + NumberUtils.greaterThan(Math.round(getEnhenceEliteGiantessLevel(state) / 5), 1) +
            NumberUtils.greaterThan(Math.round(getAutoDifficulty(state) / 5), 1),
            2,
            6
        )

        minRange *= rangeFactor
        maxRange *= rangeFactor
    }

    minRange = NumberUtils.lessThan(minRange, 500)
    maxRange = NumberUtils.greaterThan(maxRange, minRange)


    const maxCountOfOneCrowd = 5

    // return generateArmy(state, [
    //     resultLevelData
    // ], minRange, maxRange, maxCountOfOneCrowd)
    return generateArmy(state, resultLevelData, minRange, maxRange, maxCountOfOneCrowd)
}

let _computeGenerateInterval = (state: state) => {
    let base = 3
    // let base = 2

    let ratio = getDecreaseGenerateArmyIntervalRatio(state)

    // return NumberUtils.clamp(Math.round(getAllAliveArmyCount(state) / 10) * base, base, base * 10)
    // return NumberUtils.clamp(Math.round(getAllAliveArmyCount(state) / 20) * base, base, base * 5)
    // return NumberUtils.clamp(Math.round(getAllAliveArmyCount(state) / 30) * base, base, base * 5)
    let value = NumberUtils.clamp(Math.round(getAllAliveArmyCount(state) / 30) * base, base, base * 3)

    let factor
    if (isGiantessCharacterType(state)) {
        factor = 0.5
    }
    else {
        factor = 1
    }

    let adFactor = NumberUtils.lessThan(2 / (getAutoDifficulty(state) + 1), 1)

    return Math.round(value * factor * adFactor * (1 - ratio))
}

let _exec = (state: state) => {
    // if (!getIsProduction(state)) {
    //     return state
    // }

    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
        if (getIsDebug(state)) {
            return Promise.resolve(_exec(state))
        }

        let promise
        if (isCanGenerate(state)) {
            promise = _generate(state)
        }
        else {
            promise = Promise.resolve(state)
        }

        return promise.then(_exec)
    }, _computeGenerateInterval(state)))

    return state
}

export let initWhenImportScene = (state: state) => {
    state = _exec(state)

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    return setArmyDirectorState(state, createState())
}
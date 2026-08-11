import { Vector3 } from "three";
import { state } from "../../../../../../type/StateType";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getState, setState, setValidCrowdPositions } from "../Army";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { attackTarget, camp } from "../../../type/StateType";
import { getLevelData, isLittleCharacterType, setLevelData } from "../../../CityScene";
import { getWorldPosition } from "../../../little_man/Transform";
import { getGirlPosition } from "../../../girl/Utils";
import { getPlayerPosition, isNearObject } from "../../../utils/PlayerUtils";
import { getAllAliveMilltaryBuildingData, getAllAliveMilltaryVehicleData, getAllAliveSoldierData } from "../../../behaviour_tree/action_node/utils/GiantessSelectTargetUtils";
import { findValidPoints } from "../../../utils/GeneratorUtils";
import { getIsDebug } from "../../../../Scene";
import { getAbstractState } from "../../../../../../state/State";
import { computeArmyCount, computeEliteArmyCount, computeTotalArmyCount, getEnhenceEliteGiantessLevel } from "../../../difficulty/HeatImplementer";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getRenderSetting } from "../../../../../../mod/SettingMod";
import { maxUnitCount } from "setting-default/src/Type";
import { Event } from "meta3d-jiehuo-abstract";
import { buildShowUILightTipEventData, buildShowUITipEventData, getShowUILightTipEventName, getShowUITipEventName } from "../../../../../../utils/EventUtils";
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getAllAliveArmyCount, hasNoEnemy } from "../../../utils/ArmyUtils";
import { getNow, getPassTimeFromNow } from "../../../Time";
import { getAutoDifficulty } from "../../../difficulty/Difficulty";
import { getEnhenceAutoDifficulty } from "../../../difficulty/DifficultyUtils";


// export enum armyCategory {
//     Soldier,
//     Vehicle,
//     Building,
// }


// type data = Array<{
//     // armyCategory: armyCategory,
//     generateFunc: (...args) => Promise<state>,
//     funcs: Array<any>,
//     // func: any,

//     count: number,
//     offset: number,
// }>

type data = {
    // armyCategory: armyCategory,
    generateFunc: (...args) => Promise<state>,
    funcs: Array<any>,
    // func: any,

    count: number,
    offset: number,
}


// export let generateArmyInSpecificPosition = (state: state, data: data, position) => {
//     return ArrayUtils.reducePromise(data, (state, { generateFunc, funcs, count, offset }) => {
//         return ArrayUtils.reducePromise(funcs, (state, func) => {
//             return generateFunc(state, func, count, position, offset)
//         }, state)
//     }, state)
// }

export let isNoValidCrowdPositions = (state: state) => {
    let { validCrowdPositions } = getState(state)

    return validCrowdPositions.length == 0
}

export let showNoValidCrowdPositionsTip = (state: state) => {
    if (getState(state).isShowNoValidCrowdPositionsTip) {
        return Promise.resolve(state)
    }

    state = setState(state, {
        ...getState(state),
        isShowNoValidCrowdPositionsTip: true
    })

    return Event.trigger<state>(state, getAbstractState, getShowUITipEventName(), buildShowUITipEventData(
        getLanguageTextData(state, languageKey.NoValidCrowdPositionsTip),
        () => {
            return Promise.resolve()
        }
    ))
}

export let findValidArmyPoints = (state: state, playerPosition, minRange, maxRange, isConsiderGeneratedCrowdPositions = true) => {
    let { crowdPositions, validCrowdPositions } = getState(state)

    // let playerPosition = getPlayerPosition(state)

    // let notGeneratedCrowdPositions
    // if (isConsiderGeneratedCrowdPositions) {
    //     notGeneratedCrowdPositions = crowdPositions.filter(d => {
    //         return !generatedCrowdPositions.includes(d)
    //     })
    // }
    // else {
    //     notGeneratedCrowdPositions = crowdPositions
    // }

    return findValidPoints(isConsiderGeneratedCrowdPositions ? validCrowdPositions : crowdPositions, playerPosition, minRange, maxRange, true)
}

export let findValidArmyPoint = (state: state, playerPosition, minRange, maxRange, isConsiderGeneratedCrowdPositions) => {
    let result = findValidArmyPoints(state, playerPosition, minRange, maxRange, isConsiderGeneratedCrowdPositions)

    if (result.length == 0) {
        return playerPosition
    }

    return result[0]
}

let _buildShowNoInRangeCrowdPositionsTipTimeKey = () => "_buildShowNoInRangeCrowdPositionsTipTimeKey"

export let generateArmy = (state: state, data: data,
    // targetPosition: Vector3,
    minRange: number,
    maxRange: number,
    maxCountOfOneCrowd: number,
    // isNotDuplicateGenerateInCrowd: boolean
) => {
    let inRangeCrowdPositions = findValidArmyPoints(state, getPlayerPosition(state), minRange, maxRange)


    if (inRangeCrowdPositions.length == 0) {
        // if (NumberUtils.isRandomRate(0.3) && hasNoEnemy(state)) {
        if (hasNoEnemy(state)
            &&
            getPassTimeFromNow(
                state,
                getLevelData(state, _buildShowNoInRangeCrowdPositionsTipTimeKey())
            ) > 10000
        ) {
            state = setLevelData(state, _buildShowNoInRangeCrowdPositionsTipTimeKey(), getNow(state))

            return Event.trigger<state>(state, getAbstractState, getShowUILightTipEventName(), buildShowUILightTipEventData(
                getLanguageTextData(state, languageKey.NoInRangeCrowdPositionsTip),
            ))
        }

        return Promise.resolve(state)
    }


    // return ArrayUtils.reducePromise<[state, any, number, number], any>(data, ([state, inRangeCrowdPositions, index, generatedCount], { generateFunc, funcs, count, offset }) => {
    // }, [state, inRangeCrowdPositions, 0, 0])
    let index = 0
    let generatedCount = 0
    let { generateFunc, funcs, count, offset } = data

    if (generatedCount > maxCountOfOneCrowd && index < inRangeCrowdPositions.length - 1) {
        index += 1
        generatedCount = 0
    }
    // else {
    //     generatedCount += count
    // }


    return ArrayUtils.reducePromise<any, any>(funcs, ([state, inRangeCrowdPositions, index, generatedCount], func) => {
        // if (generatedCount > maxCountOfOneCrowd && index < inRangeCrowdPositions.length - 1) {
        //     index += 1
        //     generatedCount = 0
        // }
        // else {
        generatedCount += count
        // }

        return generateFunc(state, func, count, inRangeCrowdPositions[index], offset).then(state => {
            return [state, inRangeCrowdPositions, index, generatedCount]
        })
    }, [state, inRangeCrowdPositions, index, generatedCount])
        .then(
            ([state, inRangeCrowdPositions, index, generatedCount]) => {
                let { validCrowdPositions } = getState(state)

                let value = inRangeCrowdPositions.slice(0, index + 1)

                state = setValidCrowdPositions(state,
                    validCrowdPositions.filter(crowdPosition => {
                        return NullableUtils.isNullable(value.find(v => v.equals(crowdPosition)))
                    })
                )

                return state
            }
        )
}

export let generateSoldiers = (state, func, count, point, offset = 5, camp_ = camp.Enemy) => {
    return func(state,
        [
            (state) => {
                // if (getIsDebug(state)) {
                //     return 500
                // }

                let crowdCount = 50

                return computeTotalArmyCount(state, crowdCount)
            },
            (state) => computeArmyCount(state, count),
            (state) => offset,
        ],
        // [point.clone().setY(0)],
        [point],
        1,
        camp_
        // attackTarget.LittleMan
    )
}

export let generateMilltaryVehicles = generateSoldiers

export let generateMilltaryBuildingsDirectly = (state, func, count, point, offset, camp_ = camp.Enemy) => {
    return func(state,
        // [point.clone().setY(0)],
        count,
        offset,
        [point],
        camp_,
        // attackTarget.LittleMan
    ).then(([state, _]) => state)
}

export let generateMilltaryBuildings = (state, func, count, point, offset, camp_ = camp.Enemy) => {
    return generateMilltaryBuildingsDirectly(state, func, computeArmyCount(state, count), point, offset, camp_)
}

export let generateEliteGiantesses = (state, func, count, point, offset = 5, camp_ = camp.Enemy) => {
    return func(state,
        [
            (state) => {
                // if (getIsDebug(state)) {
                //     return 500
                // }

                let crowdCount = 50

                return computeTotalArmyCount(state, crowdCount)
            },
            (state) => computeEliteArmyCount(state, count),
            (state) => offset,
        ],
        // [point.clone().setY(0)],
        [point],
        1,
        camp_,
        // attackTarget.LittleMan
    )
}


export let isGenerateComplete = (state: state) => {
    let { validCrowdPositions } = getState(state)

    return validCrowdPositions.length == 0
}


// export let markNearPlayerRangeNotGenerateArmy = (state: state) => {
//     let { validCrowdPositions } = getState(state)

//     let playerPosition = getPlayerPosition(state)
//     let distance
//     if (isLittleCharacterType(state)) {
//         distance = 10
//     }
//     else {
//         distance = 30
//     }

//     validCrowdPositions = validCrowdPositions.filter(crowdPosition => {
//         return !isNearObject(playerPosition, crowdPosition, distance)
//     })

//     return setValidCrowdPositions(state,
//         validCrowdPositions
//     )
// }

import { Vector3 } from "three";
import { build, talent, usedGirlEnum } from "../type/StateType";
import { getConfigData, getState, isGiantessCharacterType, isLittleCharacterType, setConfigData, setState } from "../CityScene";
import { state } from "../../../../type/StateType";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import * as Backend from "backend/src/Main"
import { getTalentData as getTalentDataData, singleTalentData, talentData, talentDataBackend } from "../data/build/TalentData";
import { getBuildState, mutableSetBuildState, setBuildState } from "./Build";
import { buildFuncData } from "../data/FuncData";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCurrentMMDCharacterName, hasCurrentMMDCharacterByUsedGirl } from "../girl/Girl";
import { getCurrentModelName } from "../little_man/LittleMan";

export let createData = (): talent => {
    return {
        talentData: [],
        // affectedUsedGirls: []
    }
}

let _getState = (state): talent => {
    return getBuildState(state).talent
}

let _setState = (state, talentState: talent) => {
    return setBuildState(state, {
        ...getBuildState(state),
        talent: talentState
    })
}

let _handleTalentDataToBackend = (talentData: talentData): talentDataBackend => {
    return talentData.map(data => {
        return {
            name: data.name,
            level: data.level,
            character: data.character,
        }
    })
}

let _handleTalentDataFromBackend = (state, talentData: talentDataBackend): talentData => {
    let originData = getTalentDataData(state)

    return talentData.filter(data => {
        return !NullableUtils.isNullable(originData.find(d => d.name == data.name))
    }).map(data => {
        return {
            ...NullableUtils.getExn(originData.find(d => d.name == data.name)),
            level: data.level,
            character: data.character,
        }
    })
    // return talentData.map(data => {
    //     return {
    //         ...NullableUtils.getExn(originData.find(d => d.name == data.name)),
    //         level: data.level,
    //         character: data.character,
    //     }
    // })
}


export let getTalentDataFromBackend = (state: state) => {
    return Backend.getTalentData<talentData>().then(talentData => {
        // if (Math.random() < 0.5) {
        //     // if (Math.random() < 0.99) {
        //     throw new Error("network request error")
        // }
        if (NullableUtils.isNullable(talentData)) {
            return state
        }

        // return setBuildState(state, {
        return mutableSetBuildState(state,
            {
                ...getBuildState(state),
                talent: {
                    ..._getState(state),
                    talentData: _handleTalentDataFromBackend(state, NullableUtils.getExn(talentData))
                }
            }
        )
    })
}

export let getTalentData = (state: state, character) => {
    return _getState(state).talentData.filter(d => NullableUtils.getExn(d.character) == character)
}

let _filterGiantess = (state: state, usedGirl, d: singleTalentData) => {
    if (hasCurrentMMDCharacterByUsedGirl(state, usedGirlEnum.PlayerGirl) && d.characterType == characterType.Giantess) {
        return NullableUtils.getExn(
            d.character
        ) == getCurrentMMDCharacterName(state, usedGirl)
    }

    return true
}

export let applyTalent = (state: state, usedGirl, isSkipGiantess, isSkipLittleMan) => {
    let funcData = buildFuncData(state)

    return ArrayUtils.reducePromise(_getState(state).talentData.filter(d => {
        if (d.level <= 0) {
            return false
        }

        if (d.characterType == characterType.LittleMan) {
            return isSkipLittleMan ? false : NullableUtils.getExn(
                d.character
            ) == getCurrentModelName(state)
        }

        return isSkipGiantess ? false : _filterGiantess(state, usedGirl, d)
    }
    ),
        (state, d) => {
            return d.applyFunc(state, funcData, usedGirl, d.level)
        }, state
    )
}

export let computeTalentTotalLevel = (data: talentData) => {
    return data.reduce((result, d) => {
        return result + d.level
    }, 0)
}

export let getEnablePhaseData = (data: talentData): Array<number> => {
    const minSelectedTalentCountToEnterNextPhase = 5

    let data2 = data.reduce<[any, number, number]>(([result, phase, selectedTalentCountToEnterNextPhase], d) => {
        if (d.phase == phase - 1 && d.level > 0) {
            selectedTalentCountToEnterNextPhase += d.level

            if (selectedTalentCountToEnterNextPhase >= minSelectedTalentCountToEnterNextPhase) {
                return [
                    ArrayUtils.push(
                        result, phase
                    ),
                    phase + 1,
                    0
                ]
            }
        }

        return [result, phase, selectedTalentCountToEnterNextPhase]
    }, [[1], 2, 0])

    return data2[0]
}

export let getMaxPhase = (data: talentData) => {
    return data.reduce((result, d) => {
        if (result < d.phase) {
            return d.phase
        }

        return result
    }, 1)
}

let _updateOldValue = (oldTalentData, newTalentData, character) => {
    return oldTalentData.map(d => {
        if (d.character == character) {
            return NullableUtils.getWithDefault(newTalentData.find(d2 => d2.name == d.name), d)
        }

        return d
    })
}

let _addNewOnes = (oldTalentData, newTalentData, character) => {
    return oldTalentData.concat(
        newTalentData.filter(d => {
            return NullableUtils.isNullable(oldTalentData.find(d2 => d2.character == character && d2.name == d.name))
        })
    )
}

export let addOrUpdateCharacterTalentDataAndUpdateBackend = (state: state, data: talentData, character) => {
    // let hasCharacterTalentData = false
    // let talentData = getBuildState(state).talentData.map(d => {
    //     if (d.character == character) {
    //         hasCharacterTalentData = true

    //         // return NullableUtils.getExn(data.find(d2 => d2.name == d.name))
    //         return NullableUtils.getWithDefault(data.find(d2 => d2.name == d.name), d)
    //     }

    //     return d
    // })
    // if (!hasCharacterTalentData) {
    //     talentData = getBuildState(state).talentData.concat(data)
    // }
    // else {
    //     talentData = talentData.concat(
    //         data.filter(d2 => {
    //             return NullableUtils.isNullable(getBuildState(state).talentData.find(d => d.name == d2.name))
    //         })
    //     )
    // }
    let talentData = _addNewOnes(
        _updateOldValue(_getState(state).talentData, data, character),
        data,
        character
    )

    state = _setTalentData(state, talentData)

    return Backend.setTalentData(_handleTalentDataToBackend(talentData)).then(_ => state)
}

export let resetTalentAndUpdateBackend = (state: state, character) => {
    state = _setTalentData(state, _getState(state).talentData.map(d => {
        if (NullableUtils.getExn(d.character == character)) {
            return {
                ...d,
                level: 0
            }
        }

        return d
    }))

    return Backend.setTalentData(_handleTalentDataToBackend(_getState(state).talentData)).then(_ => state)
}

export let clearTalentData = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        talentData: [],
        // affectedUsedGirls: [],
    })
}

let _setTalentData = (state, value) => {
    return _setState(state, {
        ..._getState(state),
        talentData: value
    })
}

// export let getAffectedUsedGirls = (state) => {
//     return _getState(state).affectedUsedGirls
// }

// export let setAffectedUsedGirls = (state, value) => {
//     return _setState(state, {
//         ..._getState(state),
//         affectedUsedGirls: value
//     })
// }

// export let removeAffectedUsedGirls = (state) => {
//     return setAffectedUsedGirls(state, [])
// }


export let disposeButKeepTalentData = (state: state) => {
    return {
        ...createData(),
        talentData: _getState(state).talentData
    }
}
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, setState } from "./CityScene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { forceSize, statistic } from "./type/StateType";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { isLittleMan } from "./little_man/LittleMan";
import { getUsedGirlByName, isGirl, isPlayerGiantess, isPlayerGirl } from "./girl/Girl";
import { getNamePrefix as getNamePrefixLODQueueObjectUtils } from "./utils/LODQueueObjectUtils";
import { getNamePrefix as getNamePrefixOctreeObjectUtils } from "./utils/OctreeObjectUtils";
import { getLanguageTextData, languageKey } from "../../../internation/Data";

export let createState = (): statistic => {
    return {
        littleMan: {
            totalDamageForce: 0,
            destroyUnitCountMap: MutableRecordUtils.create()
        },
        giantess: {
            totalDamageForce: 0,
            destroyUnitCountMap: MutableRecordUtils.create()
        },
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).statistic)
}

let _setState = (state: state, statisticState: statistic) => {
    return setState(state, {
        ...getState(state),
        statistic: NullableUtils.return_(statisticState)
    })
}

let _getLittleManData = (state: state) => {
    return _getState(state).littleMan
}

let _setLittleManData = (state: state, data) => {
    return _setState(state, {
        ..._getState(state),
        littleMan: data
    })
}

let _getGiantessData = (state: state) => {
    return _getState(state).giantess
}

let _setGiantessData = (state: state, data) => {
    return _setState(state, {
        ..._getState(state),
        giantess: data
    })
}


export let getLittleManTotalDamageForce = (state: state) => {
    return _getLittleManData(state).totalDamageForce
}

export let setLittleManTotalDamageForce = (state: state, value) => {
    return _setLittleManData(state, {
        ..._getLittleManData(state),
        totalDamageForce: value
    })
}

export let getGiantessTotalDamageForce = (state: state) => {
    return _getGiantessData(state).totalDamageForce
}

export let setGiantessTotalDamageForce = (state: state, value) => {
    return _setGiantessData(state, {
        ..._getGiantessData(state),
        totalDamageForce: value
    })
}

export let getLittleManDestroyUnitCountMap = (state: state) => {
    return _getLittleManData(state).destroyUnitCountMap
}

export let getLittleManDestroyUnitCount = (state: state, key) => {
    return MutableRecordUtils.getWithDefault(
        _getLittleManData(state).destroyUnitCountMap,
        key,
        0
    )
}

export let setLittleManDestroyUnitCount = (state: state, key, value) => {
    return _setLittleManData(state, {
        ..._getLittleManData(state),
        destroyUnitCountMap: MutableRecordUtils.set(
            _getLittleManData(state).destroyUnitCountMap,
            key,
            value
        )
    })
}

export let getGiantessDestroyUnitCountMap = (state: state) => {
    return _getGiantessData(state).destroyUnitCountMap
}

export let getGiantessDestroyUnitCount = (state: state, key) => {
    return MutableRecordUtils.getWithDefault(
        _getGiantessData(state).destroyUnitCountMap,
        key,
        0
    )
}

export let setGiantessDestroyUnitCount = (state: state, key, value) => {
    return _setGiantessData(state, {
        ..._getGiantessData(state),
        destroyUnitCountMap: MutableRecordUtils.set(
            _getGiantessData(state).destroyUnitCountMap,
            key,
            value
        )
    })
}

export let addDamageForce = (state: state, fromName: name, damage: forceSize) => {
    if (isLittleMan(fromName)) {
        state = setLittleManTotalDamageForce(state, getLittleManTotalDamageForce(state) + damage)
    }
    else if (isGirl(fromName) && isGiantessCharacterTypeByUsedGirl(state, getUsedGirlByName(fromName))) {
        state = setGiantessTotalDamageForce(state, getGiantessTotalDamageForce(state) + damage)
    }

    return state
}

export let addDestoryUnit = (state: state, fromName: name, toName: name, mmdCharacter) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            namePrefix => {
                if (isLittleMan(fromName)) {
                    state = setLittleManDestroyUnitCount(state, namePrefix, getLittleManDestroyUnitCount(state, namePrefix) + 1)
                }
                else if (isGirl(fromName) && isGiantessCharacterTypeByUsedGirl(state, getUsedGirlByName(fromName))) {
                    state = setGiantessDestroyUnitCount(state, namePrefix, getGiantessDestroyUnitCount(state, namePrefix) + 1)
                }

                return state
            },

            NullableUtils.getWithNullableDefaultFunc(
                NullableUtils.getWithNullableDefaultFunc(
                    getNamePrefixLODQueueObjectUtils(state, toName),
                    () => getNamePrefixOctreeObjectUtils(state, toName)
                ),
                () => {
                    if (isGirl(toName) && !isPlayerGiantess(state, getUsedGirlByName(toName))) {
                        // return NullableUtils.return_(getLanguageTextData(state, languageKey.GiantessBoss))
                        return NullableUtils.return_(mmdCharacter)
                    }

                    return NullableUtils.getEmpty()
                }
            )
        ),
        state
    )

}

export let dispose = (state: state) => {
    return _setState(state, createState())
}

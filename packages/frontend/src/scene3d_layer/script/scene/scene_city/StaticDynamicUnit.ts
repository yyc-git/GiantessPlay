import { NullableUtils } from "meta3d-jiehuo-abstract"
import { staticDynamicUnit } from "./type/StateType"
import { Map } from "immutable"
import { getState, setState } from "./CityScene"
import { state } from "../../../type/StateType"
import { isLittleMan, getValue as getLittleManValue } from "./little_man/LittleMan"
import { isGirl, getValue as getGirlValue, getUsedGirlByName } from "./girl/Girl"
import { name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { attackFactor, critRatioFactor, speed } from "./data/DataType"
import { isEliteGiantess } from "../../../mod/EliteGiantessMod"
import { getHeight } from "./utils/DamageUtils"
import { getAnimationDurationFactor } from "meta3d-jiehuo-abstract/src/gpu_skin/GPUSkinAnimation"
import { getAbstractState } from "../../../../business_layer/State"
import { NumberUtils } from "meta3d-jiehuo-abstract"

export let createState = (): staticDynamicUnit => {
    return {
        defenseFactorMap: Map(),
        moveSpeedMap: Map(),
        attackFactorMap: Map(),
        emitSpeedFactorMap: Map(),
        // emitterLifeFactorMap: Map(),
        critRatioFactorMap: Map(),
        // missRatioMap: Map(),
    }
}

let _getState = (state: state): staticDynamicUnit => {
    return getState(state).staticDynamicUnit
}

let _setState = (state: state, staticDynamicUnitState) => {
    return setState(state, {
        ...getState(state),
        staticDynamicUnit: staticDynamicUnitState
    })
}

export let getDefenseFactor = (state, name) => {
    if (isLittleMan(name)) {
        return getLittleManValue(state).defenseFactor
    }
    if (isGirl(name)) {
        return getGirlValue(state, getUsedGirlByName(name)).defenseFactor
    }

    return NullableUtils.getExn(_getState(state).defenseFactorMap.get(name))
}

export let setDefenseFactor = (state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        defenseFactorMap: _getState(state).defenseFactorMap.set(name, value)
    })
}

export let computeEliteGiantessMoveSpeed = (state, name, box) => {
    let moveSpeed = NullableUtils.getExn(_getState(state).moveSpeedMap.get(name))

    let speed = getHeight(box) * moveSpeed

    speed /= NumberUtils.greaterThan(getAnimationDurationFactor(getAbstractState(state), name) * 0.5, 1)

    return speed
}

export let getMoveSpeed = (state, name) => {
    if (isLittleMan(name)) {
        return getLittleManValue(state).moveSpeed
    }


    let moveSpeed = NullableUtils.getExn(_getState(state).moveSpeedMap.get(name))

    return moveSpeed
}

export let setMoveSpeed = (state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        moveSpeedMap: _getState(state).moveSpeedMap.set(name, value)
    })
}

export let getAttackFactor = (state, name) => {
    if (isLittleMan(name)) {
        return getLittleManValue(state).attackFactor
    }
    if (isGirl(name)) {
        return getGirlValue(state, getUsedGirlByName(name)).attackFactor
    }

    return NullableUtils.getWithDefault(_getState(state).attackFactorMap.get(name), attackFactor.Zero)
}

export let setAttackFactor = (state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        attackFactorMap: _getState(state).attackFactorMap.set(name, value)
    })
}

export let getEmitSpeedFactor = (state, name) => {
    if (isLittleMan(name)) {
        return getLittleManValue(state).emitSpeedFactor
    }

    return NullableUtils.getExn(_getState(state).emitSpeedFactorMap.get(name))
}

export let setEmitSpeedFactor = (state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        emitSpeedFactorMap: _getState(state).emitSpeedFactorMap.set(name, value)
    })
}

export let getCritRatioFactor = (state, name) => {
    if (isLittleMan(name)) {
        return getLittleManValue(state).critRatioFactor
    }
    if (isGirl(name)) {
        return getGirlValue(state, getUsedGirlByName(name)).critRatioFactor
    }

    return NullableUtils.getWithDefault(_getState(state).critRatioFactorMap.get(name), critRatioFactor.Zero)
}

export let setCritRatioFactor = (state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        critRatioFactorMap: _getState(state).critRatioFactorMap.set(name, value)
    })
}

// export let getMissRatio = (state, name) => {
//     if (isLittleMan(name)) {
//         return getLittleManValue(state).missRatio
//     }
//     if (isGirl(name)) {
//         return getGirlValue(state, usedGirl).missRatio
//     }

//     return NullableUtils.getWithDefault(_getState(state).missRatioMap.get(name),.Zero)
// }

// export let setMissRatio = (state, name, value) => {
//     return _setState(state, {
//         ..._getState(state),
//         missRatioMap: _getState(state).missRatioMap.set(name, value)
//     })
// }

export let disposeDataForStatic = (state: state, name: name) => {
    state = _setState(state, {
        ..._getState(state),
        defenseFactorMap: _getState(state).defenseFactorMap.remove(name),
    })

    return state
}

export let disposeData = (state: state, name: name) => {
    state = _setState(state, {
        ..._getState(state),
        defenseFactorMap: _getState(state).defenseFactorMap.remove(name),
        moveSpeedMap: _getState(state).moveSpeedMap.remove(name),
        attackFactorMap: _getState(state).attackFactorMap.remove(name),
        emitSpeedFactorMap: _getState(state).emitSpeedFactorMap.remove(name),
        critRatioFactorMap: _getState(state).critRatioFactorMap.remove(name),
        // missRatioMap: _getState(state).missRatioMap.remove(name),
    })

    return state
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}
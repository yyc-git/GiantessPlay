import { name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../type/StateType"
import { funcData } from "../../data/FuncData"

export let setEmitSpeedFactor = (state: state, funcData: funcData, computeFunc, name: name) => {
    return funcData.setEmitSpeedFactor(state, name, computeFunc(state, funcData.getEmitSpeedFactor(state, name)))
}

export let setCritRatioFactor = (state: state, funcData: funcData, computeFunc, name: name) => {
    return funcData.setCritRatioFactor(state, name, computeFunc(state, funcData.getCritRatioFactor(state, name)))
}

export let setAttackFactor = (state: state, funcData: funcData, computeFunc, name: name) => {
    return funcData.setAttackFactor(state, name, computeFunc(state, funcData.getAttackFactor(state, name)))
}

export let setDefenseFactor = (state: state, funcData: funcData, computeFunc, name: name) => {
    return funcData.setDefenseFactor(state, name, computeFunc(state, funcData.getDefenseFactor(state, name)))

    // if (funcData.isSoldier(name)) {
    //     return funcData.setSoldierDefenseFactor(state, name, computeFunc(funcData.getSoldierDefenseFactor(state, name)))
    // }
    // if (funcData.isMilltaryBuilding(name)) {
    //     return funcData.setMilltaryBuildingDefenseFactor(state, name, computeFunc(funcData.getMilltaryBuildingDefenseFactor(state, name)))
    // }
    // if (funcData.isMilltaryVehicle(name)) {
    //     return funcData.setMilltaryVehicleDefenseFactor(state, name, computeFunc(funcData.getMilltaryVehicleDefenseFactor(state, name)))
    // }

    // return state
}

export let setMoveSpeed = (state: state, funcData: funcData, computeFunc, name: name) => {
    state = funcData.setMoveSpeed(state, name, computeFunc(state, funcData.getMoveSpeed(state, name)))
    state = funcData.setIsNeedRefindPath(state, name, true)

    return state
}

// export let setHp = (state: state, funcData: funcData, computeFunc, name: name) => {
//     state = funcData.setHp(state, name, computeFunc(state, funcData.getHp(state, name)))

//     return state
// }

// export let damageWithMultipleData = (state: state, funcData: funcData, computeFunc, name: name) => {
//     // state = funcData.setHp(state, name, computeFunc(state, funcData.getHp(state, name)))

//     return state
// }

// export let setArmyCountRatio = (state: state, funcData: funcData, ratio) => {
//     state = funcData.setArmyCountRatio(state, ratio)

//     return Promise.resolve(state)
// }


// export let setInstanceColor = (state: state, funcData: funcData, computeFunc, name: name) => {
//     return funcData.setInstanceColor(state, currentColor => {
//         return computeFunc(state, currentColor)
//     }, name)
// }
export let setInstanceColor = (state: state, funcData: funcData, name: name, newColorArr, value) => {
    return funcData.setInstanceColor(state, name, newColorArr, value)
}
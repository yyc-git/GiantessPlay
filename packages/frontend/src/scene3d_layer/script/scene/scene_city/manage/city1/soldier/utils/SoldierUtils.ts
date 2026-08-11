import { state } from "../../../../../../../type/StateType"
import { attackTarget, soldier } from "../../../../type/StateType"
// import { setAttackTarget } from "../../Army"
import { getScene, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getLanguageTextData, languageKey } from "../../../../../../../internation/Data"
import { readState } from "../../../../../../../state/State"
import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../../../../business_layer/State"
import { getStateMachineUtils } from "../../../../utils/ArmyUtils2"

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).soldier)
}

export let setState = (state: state, soldierState: soldier) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        soldier: NullableUtils.return_(soldierState)
    })
}


export let getNamePrefix = () => "soldier"

export let getNamePrefixInfantry = () => `${getNamePrefix()}_infantry`
// export let getNamePrefixInfantry = () => getLanguageTextData(readState(), languageKey.Infantry)

export let getAllModelQueues = (state: state) => {
    return getState(state).soldierMap.valueSeq().toArray()
}



export let isInfantryUtils = (name: string) => {
    return name.includes(getNamePrefixInfantry())
}


export let getNamePrefixMelee = () => `${getNamePrefix()}_melee`
// export let getNamePrefixMelee = () => getLanguageTextData(readState(), languageKey.Melee)

export let getFlameVehicleNamePrefix = () => `flameVehicle`

export let isMeleeUtils = (name: string) => {
    return name.includes(getNamePrefixMelee())
}

// export let isMeleeOrFlameVehicle = (name: string) => {
//     return name.includes(getNamePrefixMelee()) || name.includes(getFlameVehicleNamePrefix())
// }


export let getNamePrefixRocketeer = () => `${getNamePrefix()}_rocketeer`
// export let getNamePrefixRocketeer = () => getLanguageTextData(readState(), languageKey.Rocketeer)


export let isRocketeerUtils = (name: string) => {
    return name.includes(getNamePrefixRocketeer())
}

export let getNamePrefixLaserer = () => `${getNamePrefix()}_laserer`
// export let getNamePrefixLaserer = () => getLanguageTextData(readState(), languageKey.Laserer)

export let isLasererUtils = (name: string) => {
    return name.includes(getNamePrefixLaserer())
}


export let getNamePrefixCommander = () => `${getNamePrefix()}_commander`
// export let getNamePrefixCommander = () => getLanguageTextData(readState(), languageKey.Commander)

export let isCommanderUtils = (name: string) => {
    return name.includes(getNamePrefixCommander())
}

// export let initialAttributes = (state, name) => {
// return setAttackTarget(state, name, attackTarget.None)
// }


export let isSoldier = (name: string) => {
    return isInfantryUtils(name) || isLasererUtils(name) || isCommanderUtils(name) || isRocketeerUtils(name) || isMeleeUtils(name)
}


// export let getStateMachine = (state: state, name: string) => {
//     // console.log(
//     //     "getStateMachine:",
//     //     Flow.getFrameIndex(getAbstractState(state)),
//     //     getState(state).stateMachineMap.toArray(),
//     //     name
//     // )
//     return NullableUtils.getExn(getState(state).stateMachineMap.get(name))
// }
export let getStateMachine = (state: state, name: string) => {
    return getStateMachineUtils(name, getState(state).stateMachineMap.get(name))
}


export let setStateMachine = (state: state, name: string, stateMachine) => {
    // console.log(
    //     "setStateMachine:",
    //     Flow.getFrameIndex(getAbstractState(state)),
    //     getState(state).stateMachineMap.toArray(),
    //     name,
    //     stateMachine
    // )
    return setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.set(name, stateMachine)
    })
}

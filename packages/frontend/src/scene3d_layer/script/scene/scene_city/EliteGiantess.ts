import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { eliteGiantess, forceSize } from "./type/StateType";

export let createState = (): eliteGiantess => {
    return {
        animationDurationFactor: 1
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).eliteGiantess)
}

let _setState = (state: state, fastPropState: eliteGiantess) => {
    return setState(state, {
        ...getState(state),
        eliteGiantess: NullableUtils.return_(fastPropState)
    })
}

export let getAnimationDurationFactor = (state: state) => {
    return _getState(state).animationDurationFactor
}

export let setAnimationDurationFactor = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        animationDurationFactor: value
    })
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}

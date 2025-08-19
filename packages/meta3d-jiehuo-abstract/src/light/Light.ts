import { getLightState, setLightState } from "../state/State";
import { light, state } from "../type/StateType";
import { forEach } from "../utils/NullableUtils";

export let createState = (): light => {
    return {
        directionLightShadowMapViewer: null,
        csm: null
    }
}

export let dispose = (state: state) => {
    forEach((csm) => {
        csm.dispose()
    }, getLightState(state).csm)

    return setLightState(state, createState())
}
import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
// import { getStompLightData } from "../json/Data";
import { TupleUtils } from "meta3d-jiehuo-abstract";

let _handleStompLightHit = (api: api, state: state, handleFunc, position: [number, number, number]) => {
    // let { emitterVolume } = getStompLightData(api, state)

    // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
    //     api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    // ))

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleStompLightHitLittleMan = (api: api) => (
    state: state, handleFunc,
    position) => {
    return _handleStompLightHit(api, state, handleFunc, position)
}

export let handleStompLightHitGirl = (api: api) => (
    state: state, handleFunc, usedGirl,
    position) => {
    return _handleStompLightHit(api, state, handleFunc, position)
}

export let handleStompLightHitStatic = (api: api) => (
    state: state, handleFunc,
    position) => {
    return _handleStompLightHit(api, state, handleFunc, position)
}


export let handleStompLightHitArmy = (api: api) => api.handleHitArmy(handleStompLightHitLittleMan(api))

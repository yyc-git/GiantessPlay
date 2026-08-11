import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
// import { getStompHeavyData } from "../json/Data";
import { TupleUtils } from "meta3d-jiehuo-abstract";

let _handleStompHeavyHit = (api: api, state: state, handleFunc, position: [number, number, number]) => {
    // let { emitterVolume } = getStompHeavyData(api, state)

    // state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
    //     api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    // ))

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleStompHeavyHitLittleMan = (api: api) => (
    state: state, handleFunc,
    position) => {
    return _handleStompHeavyHit(api, state, handleFunc, position)
}

export let handleStompHeavyHitGirl = (api: api) => (
    state: state, handleFunc, usedGirl,
    position) => {
    return _handleStompHeavyHit(api, state, handleFunc, position)
}

export let handleStompHeavyHitStatic = (api: api) => (
    state: state, handleFunc,
    position) => {
    return _handleStompHeavyHit(api, state, handleFunc, position)
}


export let handleStompHeavyHitArmy = (api: api) => api.handleHitArmy(handleStompHeavyHitLittleMan(api))

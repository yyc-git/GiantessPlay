import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getKickLightSoundResourceId, getKickLightData } from "../json/Data";
import { TupleUtils } from "meta3d-jiehuo-abstract";

let _handleKickLightHit = (api: api, state: state, handleFunc, soundResourceId, position: [number, number, number]) => {
    let { emitterVolume } = getKickLightData(api, state)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    ))

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleKickLightHitGirl = (api: api) => (
    state: state, handleFunc, usedGirl,
    position) => {
    return _handleKickLightHit(api, state, handleFunc, getKickLightSoundResourceId(), position)
}
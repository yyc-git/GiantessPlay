import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type";
import { service } from "buff-protocol/src/service/ServiceType";
import { getSoundResourceId } from "../json/Data";

export let use = (api: api, state: state, name: string) => {
    let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(
            getSoundResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    state = api.resetCloth(state, usedGirl)
    // state = api.restoreShoe(state)

    return Promise.resolve(state)
}
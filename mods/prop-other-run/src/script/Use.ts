import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { getName } from "../json/Data";
import { getBuffProtocolName, getBuffRunBlockName, getShareBlockName, getShareProtocolName } from "./Utils";
import { service } from "buff-protocol/src/service/ServiceType";
import { service as shareService } from "prop-share-protocol/src/service/ServiceType";

export let use = (api: api, state: state, name: string) => {
    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).getUseWaterResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffRunBlockName()).addBuff(api, state)
}
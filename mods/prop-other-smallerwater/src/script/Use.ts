import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { getBuffBlockName, getBuffProtocolName, getShareBlockName, getShareProtocolName } from "./Utils";
import { service } from "buff-protocol/src/service/ServiceType";
import { service as shareService } from "prop-share-protocol/src/service/ServiceType";
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";

export let use = (api: api, state: state, name: string) => {
    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).getUseWaterResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    let usedGirl = usedGirlEnum.PlayerGirl

    return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(api, state, api.girl.buildNameByUsedGirl(usedGirl), usedGirl).then(state => {
        state = api.setUIUpdateLoopCount(state, 0)

        return api.execLoop(state)
    })
}
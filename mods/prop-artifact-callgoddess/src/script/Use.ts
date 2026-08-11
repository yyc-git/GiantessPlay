import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type";
import { getEventGameProtocolName, getProtocolName, getBuffProtocolName, getBuffCallGoddessBlockName } from "./Utils";
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { service } from "event-game-protocol/src/service/ServiceType";
import { service as buffService } from "buff-protocol/src/service/ServiceType";
import { getSoundResourceId, hasPlayerGoddess } from "../json/Data";

export let use = (api: api, state: state, name: string) => {
    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(
            getSoundResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    let promise
    if (hasPlayerGoddess(api, state)) {
        promise = Promise.resolve(state)
    }
    else {
        state = api.GiantessBuildUtils.setAttribute(state, api.buildFuncData(state), (girlValue) => {
            return {
                ...girlValue,
                // maxScale: api.NumberUtils.greaterThan(getMaxScale(state, girlValue), 500),
                maxScale: Infinity,
                hp: girlValue.hp * 5,
                initialScale: girlValue.initialScale * 5,
                scaleIncrease: girlValue.scaleIncrease * 5,
            }
        }, usedGirlEnum.PlayerGoddess)

        // promise = api.triggerGameEvent(state, api.blockAPI.getBlockService<service>(state, getEventGameProtocolName(), getEventGameBlockName()).getName())
        promise = api.triggerGameEventByFilter(state, service => service.getName(), getEventGameProtocolName(), "callgoddess")
    }

    return promise.then(state => {
        return api.blockAPI.getBlockService<buffService>(state, getBuffProtocolName(), getBuffCallGoddessBlockName()).addBuff(api, state, usedGirlEnum.PlayerGoddess)
    })
}
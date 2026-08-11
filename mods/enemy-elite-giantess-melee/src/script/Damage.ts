import { api } from "type-api/src/Type"
import { getShakeClipIndex, getDeathClipIndex, getIdleClipIndex, getLieClipIndex, getStandupClipIndex, getValue } from "../json/Data"
import { createInitialState } from "./FSMState"
import { getShareBlockName, getShareProtocolName } from "./Utils"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"

export let damage = (api: api, state) => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return shareService.damage(
        api,
        [
            getShakeClipIndex,
            getDeathClipIndex(api, state),
            getIdleClipIndex,
            getLieClipIndex,
            getStandupClipIndex,
            createInitialState(api, state),
            state => getValue(api, state)
        ],
    )
}

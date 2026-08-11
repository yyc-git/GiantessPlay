import { api } from "type-api/src/Type";
import { getControlledClipIndex, getIdleClipIndex, getValue } from "../json/Data"
import { getShareBlockName, getShareProtocolName } from "./Utils"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";

export let getHpRatio = (api: api) => (state, name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getHpWithDefault(api, state, name) / getValue(api, state).hp
}

export let handleRepel = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handleRepel(api, getIdleClipIndex, getControlledClipIndex
    )
}

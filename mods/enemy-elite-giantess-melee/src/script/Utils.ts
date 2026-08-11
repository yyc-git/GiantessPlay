import { api } from "type-api/src/Type"
import { buildCategoryName, getNamePrefixEliteGiantess } from "./Event"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"

export let getProtocolName = () => "enemy-elite-giantess-protocol"

export let getShareProtocolName = () => "enemy-elite-giantess-share-protocol"

export let getWeaponProtocolName = () => "weapon-protocol"

export let getBlockName = () => "enemy-elite-giantess-melee"

export let getShareBlockName = () => "enemy-elite-giantess-share-default"

export let getWeaponKickLightBlockName = () => "weapon-kicklight"

export let getWeaponStompLightBlockName = () => "weapon-stomplight"


export let getPropBulletProtocolName = () => "prop-bullet-protocol"

export let getPropBulletBiggerBlockName = () => "prop-bullet-bigger"

export let getPropBulletSmallerBlockName = () => "prop-bullet-smaller"

export let getPropOtherProtocolName = () => "prop-other-protocol"

export let getPropStrongBiggerBlockName = () => "prop-other-strong"


export let hasModelQueue = (api: api, state) => {
    return api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).hasQueue(api, state, buildCategoryName(api, state))
}

export let getModelQueue = (api: api, state) => {
    // return api.NullableUtils.getExn(api.blockAPI.getBlockService(state, getShareProtocolName(), getShareBlockName()).getState(api, state).eliteGiantessMap.get(buildCategoryName()))
    return api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).getQueue(api, state, buildCategoryName(api, state))
}

export let isEliteGiantess = (api: api, state, name: string) => {
    return name.includes(getNamePrefixEliteGiantess(api, state))
}

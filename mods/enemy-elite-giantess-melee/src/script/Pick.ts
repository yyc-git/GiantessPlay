import { api } from "type-api/src/Type"
import { getShareBlockName, getShareProtocolName } from "./Utils"
import { buildCategoryName } from "./Event"
import { createBreastControlledState, createInitialState, createPickedControlledState, createShoeControlledState, createUBControlledState } from "./FSMState"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getIdleClipIndex, getLieClipIndex, getStandupClipIndex } from "../json/Data";

export let getPickedTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getPickedTransform(api, buildCategoryName(api, state))
}

export let getUBControlledTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getUBControlledTransform(api, buildCategoryName(api, state))
}

export let getPutToBreastTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getPutToBreastTransform(api, buildCategoryName(api, state))
}

export let getPutToShoeTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getPutToShoeTransform(api, buildCategoryName(api, state))
}


export let handlePickup = (api: api) => (state: state, usedGirl, name: name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handlePickup(api, state, createPickedControlledState(api, state), name)
}

export let updateTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.updateTransform(api)
}

export let handlePickdown = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handlePickdown(api, createInitialState(api, state))
}

export let handleFall = (api: api, state, name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handleFall(api, getIdleClipIndex, getStandupClipIndex,
        getLieClipIndex(name),
    )
}

export let handleUBControl = (api: api) => (state: state, usedGirl, name: name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handleUBControl(api, state, createUBControlledState(api, state), name)
}

export let handlePutToBreast = (api: api) => (state: state, usedGirl, name: name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handlePutToBreast(api, state, createBreastControlledState(api, state), name)
}

export let handlePutToShoe = (api: api) => (state: state, usedGirl, name: name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.handlePutToShoe(api, state, createShoeControlledState(api, state), name)
}


export let updateUBControlledTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.updateUBControlledTransform(api)
}

export let updatePutToBreastTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.updatePutToBreastTransform(api)
}

export let updatePutToShoeTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.updatePutToShoeTransform(api)
}


export let getLocalTransform = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getLocalTransform(api)
}

export let getBoxForPick = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getBoxForPick(api)
}

export let getModelQueueIndex = (api: api, state) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getModelQueueIndex(api)
}

export let getHp = (api: api) => (state, name) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.getHp(api)(state, name)
}

export let updateHp = (api: api, state, name, hp) => {
    let service = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return service.updateHp(api)(state, name, hp)
}

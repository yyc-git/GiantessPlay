import { state } from "frontend/src/scene3d_layer/type/StateType"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { api } from "type-api/src/Type"
import { service } from "buff-protocol/src/service/ServiceType"
import { getCommandName } from "../json/Data"
import { findNeedHardUsedGirl, getBuffBlockName, getBuffProtocolName, setLastHardTime } from "./Utils"

export enum command {
    markBegin,
    markFinish,
    realtimeSay,
}

export let hard = (api: api) => (state: state, onCompleteFunc, data) => {
    let usedGirl = findNeedHardUsedGirl(api, state)

    if (usedGirl == usedGirlEnum.None) {
        // return Promise.resolve(state)
        throw new Error("error")
    }

    state = setLastHardTime(api, state, api.getNow(state))

    let service = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName())

    return service.addBuff(api, state, usedGirl)
}

export let getCommand = (api: api) => (state: state, command_: command | string) => {
    switch (command_) {
        case command.markBegin:
            return api.markBegin
        case command.markFinish:
            return api.markFinish

        case getCommandName():
            return hard(api)

        case command.realtimeSay:
            return api.realtimeSay

        default:
            throw new Error("err")
    }
}
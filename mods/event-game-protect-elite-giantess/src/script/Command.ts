import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { getEliteMagicBlockName, getEliteMeleeBlockName, getEliteProtocolName, getTriggerCount } from "./Utils"
import { service } from "enemy-elite-giantess-protocol/src/service/ServiceType"
import { getCommandName } from "../json/Data"
import { camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum command {
    // enterScenario,

    markBegin,
    markFinish,

    // exitScenario,
}

let _getFuncsByTriggerCount = (api: api, state: state) => {
    if (getTriggerCount(api, state) % 5 == 0) {
        return [
            api.blockAPI.getBlockService<service>(state, getEliteProtocolName(), getEliteMagicBlockName()).generateEliteGiantesses(api),
            api.blockAPI.getBlockService<service>(state, getEliteProtocolName(), getEliteMeleeBlockName()).generateEliteGiantesses(api),
        ]
    }

    if (api.NumberUtils.isRandomRate(0.6)) {
        return [
            api.blockAPI.getBlockService<service>(state, getEliteProtocolName(), getEliteMagicBlockName()).generateEliteGiantesses(api),
        ]
    }

    return [
        api.blockAPI.getBlockService<service>(state, getEliteProtocolName(), getEliteMeleeBlockName()).generateEliteGiantesses(api),
    ]
}

let _getCountByTriggerCount = (api: api, state: state) => {
    return api.NumberUtils.clamp(Math.ceil(getTriggerCount(api, state) / 8), 1, 5)
}

export let appear = (api: api) => (state: state, onCompleteFunc, data) => {
    // let pos = api.selectValidGTSPoint(state, 10, 30)
    // let pos = api.vector3.create(0, 0, 0)
    // let pos = api.findValidArmyPoint(state, api.vector3.create(100, 0, 100), 0, 50, false)
    // let pos = api.findValidArmyPoint(state, api.vector3.create(300, 0, 300), 0, 200, false)
    let pos = api.findValidArmyPoint(state, api.vector3.create(200, 0, 200), 0, 100, false)

    return api.generateArmyInSpecificPosition(state, [
        {
            generateFunc: api.generateEliteGiantesses,
            funcs: _getFuncsByTriggerCount(api, state),
            count: _getCountByTriggerCount(api, state) * api.getArmyCountFactorByAutoDifficulty(state),
            offset: 20,
            camp_: camp.Giantess,
        },
    ], pos)
}

export let getCommand = (api: api) => (state: state, command_: command | string) => {
    switch (command_) {
        // case command.enterScenario:
        //     return enterScenario

        case command.markBegin:
            return api.markBegin
        case command.markFinish:
            return api.markFinish

        case getCommandName():
            return appear(api)

        default:
            throw new Error("err")
    }
}
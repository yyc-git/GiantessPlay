import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { service } from "enemy-elite-giantess-protocol/src/service/ServiceType"
import { getCommandName } from "../json/Data"
import { camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum command {
    // enterScenario,

    markBegin,
    markFinish,

    // exitScenario,
}


export let appear = (api: api) => (state: state, onCompleteFunc, data) => {
    let pos = api.findValidArmyPoint(state, api.getPlayerPosition(state), api.NumberUtils.getRandomInteger(20, 100), +Infinity, false)

    return api.generateArmyInSpecificPosition(state,
        [
            api.NumberUtils.randomSelect(
                [
                    {
                        generateFunc: api.generateSoldiers,
                        funcs: [
                            api.generateMelees,
                            api.generateInfantrys,
                        ],
                        count: 2 * api.getArmyCountFactorByAutoDifficulty(state),
                        offset: 10,
                        camp_: camp.Player,
                    },
                    {
                        generateFunc: api.generateSoldiers,
                        funcs: [
                            api.generateRocketeers,
                            api.generateCommanders,
                            api.generateLaserers,
                        ],
                        count: 1 * api.getArmyCountFactorByAutoDifficulty(state),
                        offset: 5,
                        camp_: camp.Player,
                    },

                    {
                        generateFunc: api.generateMilltaryVehicles,
                        funcs: [
                            api.generateTanks,
                            api.generateMissileVehicles,
                            api.generateFlameVehicles,
                        ],
                        count: 1 * api.getArmyCountFactorByAutoDifficulty(state),
                        offset: 10,
                        camp_: camp.Player,
                    },
                ]
            )
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
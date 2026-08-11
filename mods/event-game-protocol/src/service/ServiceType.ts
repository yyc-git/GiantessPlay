import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { particleType } from "particle-protocol/src/state/StateType";

export type service = {
    init?: (api: api, state: state) => Promise<state>,
    dispose?: (api: api, state: state) => Promise<state>,

    getName: any,
    getCommandName: any,
    getCommand: any,
    getGameEventDirectorData: any,
    getGameEventData: any,
    getScenarioData: any,
}
import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";

export type service = {
    init?: (api: api, state: state) => Promise<state>,
    dispose?: (api: api, state: state) => Promise<state>,

    getName: any,
    getValue: any,
    getRewardData: any,
    getUsedGirl: any,
    updateGiantessValue: any,
    getCamp: any,

    addGiantess: any,
    removeGiantess: any,
    update: any,
    damage: any,
    // dispose: any,
    triggerAction: any,
}
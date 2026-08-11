import { state } from "frontend/src/scene3d_layer/type/StateType"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getName, getSoundResourceId } from "../json/Data"
import { api } from "type-api/src/Type"
import { service } from "buff-protocol/src/service/ServiceType"
import { getBuffBlockName, getBuffProtocolName, getSitHeavyStressingBreastBlockName, getSitHeavyStressingTrigoneAndButtBlockName, getSkillGiantessProtocolName } from "./Utils"
import { collisionPart, pose } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { buildRewardName } from "../json/RewardData"

export let createState = (api: api) => (usedGirl): fsm_state<state> => {
    return {
        name: getName(),
        enterFunc: (state) => {
            state = api.markWhetherNotExecuteGiantessAI(state, usedGirl, true)

            return Promise.resolve(state)
        },
        executeFunc: (state, [collisionPart_, fromName, damagePosition]) => api.executeExcitement(api, state, usedGirl, collisionPart_, damagePosition, fromName, getSoundResourceId()),
        exitFunc: (state: state) => {
            // state = GirlFSMState.handleStressingStateExit(state, usedGirl)
            state = api.markWhetherNotExecuteGiantessAI(state, usedGirl, false)

            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(api, state, usedGirl)
        }
    }
}
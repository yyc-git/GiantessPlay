import { state } from "frontend/src/scene3d_layer/type/StateType"
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getName, getSoundResourceId } from "../json/Data"
import { api } from "type-api/src/Type"
import { service } from "buff-protocol/src/service/ServiceType"
import { getBuffBlockName, getBuffProtocolName, getSkillGiantessProtocolName, getSitHeavyStressingBreastBlockName, getSitHeavyStressingTrigoneAndButtBlockName } from "./Utils"
import { collisionPart, pose } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"

export let createState = (api: api) => (usedGirl): fsm_state<state> => {
    return {
        name: getName(),
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, [collisionPart_, fromName, damagePosition]) => api.executeExcitement(api, state, usedGirl, collisionPart_, damagePosition, fromName, getSoundResourceId()),
        exitFunc: (state: state) => {
            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(api, state, usedGirl)
        }
    }
}
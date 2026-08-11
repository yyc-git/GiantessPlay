import { actionName, animationName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { actionState, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { pose } from "frontend/src/scene3d_layer/script/scene/scene_city/data/biwu/level3/CollisionShapeData"

export let isActionValid = (api: api, state: state,usedGirl, name: actionName) => {
    switch (name) {
        case getActionName():
            // return api.girl.getCurrentAnimationName(state, usedGirl) == animationName.Idle
            return api.getCurrentPose(state, usedGirl) == pose.Stand
                && api.getPutToBreastObjectData(state, usedGirl).size > 0
        default:
            return false
    }
}

export let triggerAction = (api: api, state, usedGirl,  name: actionName) => {
    return Promise.resolve([state, result.Success])
}
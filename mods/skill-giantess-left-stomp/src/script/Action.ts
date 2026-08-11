import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { actionState, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationName } from "skill-giantess-stomp/src/json/Data"

export let isActionValid = (api: api, state: state,usedGirl, name: actionName) => {
    switch (name) {
        case getActionName():
            return api.girl.getCurrentAnimationName(state, usedGirl) ==
                animationName.KeepStomp
        default:
            return false
    }
}

export let triggerAction = (api: api, state, usedGirl,  name: actionName) => {
    return Promise.resolve([state, result.Success])
}
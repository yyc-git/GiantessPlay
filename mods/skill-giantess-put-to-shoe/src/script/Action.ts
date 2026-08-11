import { actionName, animationName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { actionState, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getProtocolName } from "../script/Utils"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { shoeType } from "mmd-character-protocol/src/service/ServiceType"

export let isActionValid = (api: api, state: state,usedGirl, name: actionName) => {
    switch (name) {
        case getActionName():
            return (!api.getIsDebug(state) ? api.isBigGiantess(state, usedGirl) : true) && api.girl.getCurrentAnimationName(state, usedGirl) == animationName.KeepPick
                // && api.getShoeType(state, usedGirl) != shoeType.None
                && !api.isRemoveShoe(state, usedGirl)
        default:
            return false
    }
}

export let triggerAction = (api: api, state, usedGirl,  name: actionName) => {
    return Promise.resolve([state, result.Success])
}
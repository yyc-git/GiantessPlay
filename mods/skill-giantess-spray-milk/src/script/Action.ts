import { actionName, animationName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { actionState, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let isActionValid = (api: api, state: state, usedGirl, name: actionName) => {
    switch (name) {
        case getActionName():
            if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)
                &&
                (
                    api.getExcitementBuffSuperPositionCount(api, state, usedGirl) < 1
                    && api.getExcitement(state, usedGirl) < 50
                )
            ) {
                return false
            }

            // return api.girl.getCurrentAnimationName(state, usedGirl) != animationName.Walk && !api.girl.isActionState(state,  usedGirl, actionState.Run)
            return !api.girl.isActionState(state, usedGirl, actionState.Run)
                && api.girl.getBodyHp(state, usedGirl) > api.girl.getFullHp(state, usedGirl) * 0.3
        default:
            // return true
            return false
    }
}

export let triggerAction = (api: api, state, usedGirl, name: actionName) => {
    return Promise.resolve([state, result.Success])
}
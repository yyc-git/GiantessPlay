import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { getIsMissionFinish, setIsMissionFinish } from "./Utils"
import { missionFinishStatus } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

let _isMissionComplete = (api: api, state: state) => {
    return api.getGameTime(state).asMinutes() >= 6
}

export let update = (api: api) => (state: state) => {
    // TODO restore
    // if (
    //     !api.getIsDebug(state)

    // && api.getDestroyRate(state) > 80

    //     && !getIsMissionFinish(api, state)
    // ) {
    //     state = setIsMissionFinish(api, state, true)
    //     return api.handleMissionFail(state, missionFinishStatus.Fail)
    // }

    if (
        !api.getIsDebug(state)
        && _isMissionComplete(api, state)
        && !getIsMissionFinish(api, state)
    ) {
        state = setIsMissionFinish(api, state, true)
        state = api.showDoor(state)
    }

    return api.handleDoor(state)
}
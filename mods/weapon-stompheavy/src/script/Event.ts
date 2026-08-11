import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { getStompHeavySoundResourceId, getSoundPath } from "../json/Data"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            // {
            //     id: getStompHeavySoundResourceId(),
            //     path: [getSoundPath(getStompHeavySoundResourceId())],
            //     type: resourceType.Audio
            // },

        ]
    )

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())

    return state
}

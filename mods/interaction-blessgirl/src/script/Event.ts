import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getAddBuffResourceId, getBlessGirlResourceId, getBlessGirlResourcePath, getOpenBuffGirlResourceId, getSoundPath } from "../json/Data"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getOpenBuffGirlResourceId(),
                path: [getSoundPath(getOpenBuffGirlResourceId())],
                type: resourceType.Audio
            },
            {
                id: getAddBuffResourceId(),
                path: [getSoundPath(getAddBuffResourceId())],
                type: resourceType.Audio
            },
            {
                id: getBlessGirlResourceId(),
                path: getBlessGirlResourcePath(),
                type: resourceType.ArrayBuffer
            },
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

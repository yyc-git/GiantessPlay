import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"

export let buildScene = (api: api, state: state, renderer, levelNumber) => {
    return api.buildScenePlayLevel(state, renderer)
}
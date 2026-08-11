import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";

export let dispose = (api: api, state: state) => {
    return api.disposePlayLevel(state)
    // .then(api.gameEventDirector.dispose)
}
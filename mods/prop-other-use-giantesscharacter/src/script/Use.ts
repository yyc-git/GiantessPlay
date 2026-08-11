import { language, state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";

export let use = (api: api, state: state, name: string) => {
    return Promise.resolve(state)
}
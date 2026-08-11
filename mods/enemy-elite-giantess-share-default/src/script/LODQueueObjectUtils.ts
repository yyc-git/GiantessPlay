import { getState } from "./Utils"

export let getHpWithDefault =  (api, state, name) => {
    return api.NullableUtils.getWithDefault(getState(api, state).hpMap.get(name), 0)
}

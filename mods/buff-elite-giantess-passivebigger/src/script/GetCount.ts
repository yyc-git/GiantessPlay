import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "buff-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getState } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    // return api.NullableUtils.return_(Math.round(getState(api, state).customData.sumIncreaseHeight))
    return api.NullableUtils.getEmpty()
}
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "buff-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getBlockName, getProtocolName } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    return api.NullableUtils.getEmpty()
}
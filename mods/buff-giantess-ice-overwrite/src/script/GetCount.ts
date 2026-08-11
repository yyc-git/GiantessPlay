import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "buff-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getBlockName, getProtocolName } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    let { startTime, customData } = api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName())

    let count = api.NumberUtils.lessThan(customData.lastTime - Math.round((api.getNow(state) - api.MutableRecordUtils.getWithDefault(startTime, usedGirl, -Infinity)) / 1000), customData.lastTime)

    return count < 0 ? api.NullableUtils.getEmpty():api.NullableUtils.return_(count)
}
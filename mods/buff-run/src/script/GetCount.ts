import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "buff-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getLastTime } from "../json/Data";
import { getBlockName, getProtocolName } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    let count = api.formatSecondUnit(api.NumberUtils.lessThan(getLastTime() - Math.round((api.getNow(state) - api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime) / 1000), getLastTime()))
    return count < 0 ? api.NullableUtils.getEmpty() : api.NullableUtils.return_(count)
}
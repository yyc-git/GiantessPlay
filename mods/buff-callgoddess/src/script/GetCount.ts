import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "buff-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getComputedLastTime, getLastTime, getName, getTargetName } from "../json/Data";
import { getBlockName, getProtocolName } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    // return api.formatSecondUnit(api.NumberUtils.lessThan(getLastTime() - Math.round((api.getNow(state) - api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime) / 1000), getLastTime()))

    let { startTime, customData } = api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName())

    let lastTime = getComputedLastTime(api, state, usedGirl, false)

    // return api.NullableUtils.getWithDefault(
    //     api.NullableUtils.map(({ superPositionCount }) => {
    //         let { startTime } = api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName())

    //         let lastTime = getLastTime() * superPositionCount

    //         return api.NumberUtils.lessThan(lastTime - Math.round((api.getNow(state) - startTime) / 1000), lastTime)
    //     }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
    //     0
    // )

    let count = api.formatSecondUnit(api.NumberUtils.lessThan(lastTime - Math.round((api.getNow(state) - api.MutableRecordUtils.getWithDefault(startTime, usedGirl, -Infinity)) / 1000), lastTime))

    return count < 0 ? api.NullableUtils.getEmpty() : api.NullableUtils.return_(count)
}
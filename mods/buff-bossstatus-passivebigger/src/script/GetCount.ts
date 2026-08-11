import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "upgrade-protocol/src/state/StateType";
import { api } from "type-api/src/Type";
import { getLastTime } from "../json/Data";
import { getBlockName, getProtocolName, getUpgradeBlockName, getUpgradeProtocolName } from "./Utils";

export let getCount = (api: api, usedGirl) => (state: state) => {
    if (!api.isLevelGiantess(state, usedGirl)) {
        return api.NullableUtils.getEmpty()
    }

    return api.NullableUtils.map(
        data => Math.round(data.sumIncreaseScale),
        api.MutableRecordUtils.get(
            api.blockAPI.getBlockState<blockState>(state, getUpgradeProtocolName(), getUpgradeBlockName()).dataMap,
            usedGirl
        )
    )
}
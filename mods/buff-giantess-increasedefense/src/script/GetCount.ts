import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { getName } from "../json/Data";

export let getCount = (api: api, usedGirl) => (state: state) => {
    return api.NullableUtils.map(buff => buff.superPositionCount,
        api.findBuff(state, getName(), api.girl.buildNameByUsedGirl(usedGirl), usedGirl)
    )
}
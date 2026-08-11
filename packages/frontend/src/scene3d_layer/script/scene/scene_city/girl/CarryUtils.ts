import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"

export let isFull = (api: api, state: state, usedGirl, objectData, box, factor) => {
    return api.getPickObjectData(state, usedGirl).concat(objectData).toArray().reduce((selectedVolumn, data) => {
        return selectedVolumn + api.NullableUtils.getWithDefault(
            api.NullableUtils.map(box => {
                return api.box3.getBoxVolumn(box)
            }, data.getBoxFunc(state, data.queue, data.index, data.name)),
            0
        )
    }, 0) > api.box3.getBoxVolumn(
        box
    ) * factor
}
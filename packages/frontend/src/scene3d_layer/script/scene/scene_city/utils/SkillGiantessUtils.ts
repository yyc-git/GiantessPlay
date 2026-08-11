import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"

export let computeRepelDirection = (api: api, rangeBox) => (state: state, box) => {
    return api.computeDirectionInXZ(
        api.box3.getCenter(rangeBox, api.vector3.getTempVector1()),
        api.box3.getCenter(box, api.vector3.getTempVector2()),
    )
}
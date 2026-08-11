import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

export let computeColor = (color, state: state, value: number, maxFactor = 1) => {
    requireCheck(() => {
        test("value should in [ 0,1 ]", () => {
            return value >= 0 && value <= 1
        })
    }, getIsDebug(state))


    return ArrayUtils.multiplyScalar(color, maxFactor * value)
}
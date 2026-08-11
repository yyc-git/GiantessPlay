import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import { camp } from "../../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"

export let generateArmyInSpecificPosition = (state: state, data: any, position) => {
    return ArrayUtils.reducePromise(data, (state, { generateFunc, funcs, count, offset, camp_ }) => {
        return ArrayUtils.reducePromise(funcs, (state, func) => {
            return generateFunc(state, func, count, position, offset, NullableUtils.getWithDefault(camp_, camp.Enemy))
        }, state)
    }, state)
}

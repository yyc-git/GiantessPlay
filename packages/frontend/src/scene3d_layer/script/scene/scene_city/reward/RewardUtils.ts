import { propName } from "../type/StateType";
import { getPropCount } from "./Prop";

export let getRateByHasCount = (state, name: propName, [lowCount, rateForLow], [highCount, rateForHigh], rateForMiddle) => {
    let count = getPropCount(state, name)

    if (count <= lowCount) {
        return rateForLow
    }
    else if (count >= highCount) {
        return rateForHigh
    }

    return rateForMiddle
}
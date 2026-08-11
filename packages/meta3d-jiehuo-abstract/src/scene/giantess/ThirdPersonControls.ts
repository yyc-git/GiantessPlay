import { isMobile } from "../../Device"
import { characterType, state } from "../../type/StateType"

export let judgeIsMoveInMobile = (state: state) => {
    return isMobile()
}

// export let compute = (state: state) => {
//     return getDirectionDataFromState(state)
// }
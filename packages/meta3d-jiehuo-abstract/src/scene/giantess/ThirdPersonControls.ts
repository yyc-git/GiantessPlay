import { isMobile } from "../../Device"
import { road, state } from "../../type/StateType"
import { getDirectionDataFromState } from "../utils/CameraControlsUtils"

export let judgeIsMoveInMobile = (state: state) => {
    return isMobile()
}

// export let compute = (state: state) => {
//     return getDirectionDataFromState(state)
// }
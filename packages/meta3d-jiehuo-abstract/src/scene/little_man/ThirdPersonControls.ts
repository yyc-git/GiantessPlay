import { isMobile } from "../../Device"
import { road, state } from "../../type/StateType"
import { getDirectionDataFromKeyState, getDirectionDataFromState } from "../utils/CameraControlsUtils"

export let judgeIsMoveInMobile = (state: state, road_: road) => {
    return isMobile() && (
        road_ == road.LittleMan
    )
}

// export let compute = (state: state, road_) => {
//     let forward = 0
//     let side = 0
//     if (road_ == road.Giantess) {
//         let data = getDirectionDataFromState(state)
//         forward = data[0]
//         side = data[1]
//     }
//     else if (road_ == road.LittleMan) {
//         let data = getDirectionDataFromKeyState(state, road_)
//         forward = data[0]
//         side = data[1]
//     }
//     else {
//         throw new Error("err")
//     }

//     return [forward, side]
// }
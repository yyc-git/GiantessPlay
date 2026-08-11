import { isMobile } from "../../Device"
import { characterType, state } from "../../type/StateType"

export let judgeIsMoveInMobile = (state: state, characterType_: characterType) => {
    return isMobile() && (
        characterType_ == characterType.LittleMan
    )
}

// export let compute = (state: state, characterType_) => {
//     let forward = 0
//     let side = 0
//     if (characterType_ == characterType.Giantess) {
//         let data = getDirectionDataFromState(state)
//         forward = data[0]
//         side = data[1]
//     }
//     else if (characterType_ == characterType.LittleMan) {
//         let data = getDirectionDataFromKeyState(state, characterType_)
//         forward = data[0]
//         side = data[1]
//     }
//     else {
//         throw new Error("err")
//     }

//     return [forward, side]
// }
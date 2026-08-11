import { getRenderSettingState, setRenderSettingState } from "../state/State"
import { renderSetting, state } from "../type/StateType"

export let createState = (): renderSetting => {
    return {
        // isRenderAccuracyIncrease: false
    }
}

export let dispose = (state: state) => {
    // return setRenderSettingState(state, createState())
    return state
}

// export let getIsRenderAccuracyIncrease = (state: state) => {
//     return getRenderSettingState(state).isRenderAccuracyIncrease
// }

// export let setIsRenderAccuracyIncrease = (state: state, value) => {
//     return setRenderSettingState(state, {
//         ...getRenderSettingState(state),
//         isRenderAccuracyIncrease: value
//     })
// }

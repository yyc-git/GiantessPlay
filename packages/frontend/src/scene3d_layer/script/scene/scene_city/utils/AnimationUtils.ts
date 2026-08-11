import { getAnimationDurationFactor } from "meta3d-jiehuo-abstract/src/gpu_skin/GPUSkinAnimation"
import { state } from "../../../../type/StateType"
import { getAbstractState } from "../../../../state/State"

export let computeTimeSecond = (state: state, frameCount: number, name) => {
    // return (frameCount * 30 / 60) / 1000
    // return (frameCount * 60 / 30) / 1000

    // return frameCount / 30 
    return frameCount * getAnimationDurationFactor(getAbstractState(state), name) / 30
}
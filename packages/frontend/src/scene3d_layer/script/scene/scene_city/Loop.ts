import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../state/State"
import { state } from "../../../type/StateType"
import { isStop, start, stop } from "./Time"
import { Flow } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"

export let stopLoop = (state: state) => {
    state = stop(state)

    state = setAbstractState(state, ArticluatedAnimation.pauseAllTweens(getAbstractState(state)))

    return setAbstractState(state, Flow.stopLoop(getAbstractState(state)))
}

export let startLoop = (state: state) => {
    if (isStop(state)) {
        state = start(state)
    }

    state = setAbstractState(state, ArticluatedAnimation.resumeAllTweens(getAbstractState(state)))

    return setAbstractState(state, Flow.startLoop(getAbstractState(state)))
}

export let isStopLoop = (state: state) => {
    return isStop(state)
}
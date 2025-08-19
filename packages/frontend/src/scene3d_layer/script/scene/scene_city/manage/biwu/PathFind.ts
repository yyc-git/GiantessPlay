import { state } from "../../../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { range, setStep } from "meta3d-jiehuo-abstract/src/ai/PathFind"
import { createGrid, destroyedHandler, setGrid, setGridForGirl } from "../city1/PathFind"
import { getDestroyedEventName } from "../../utils/EventUtils"
import { Event } from "meta3d-jiehuo-abstract"

export let initWhenImportScene = (state: state) => {
    // let step = getStepByRenderAccuracy(state)
    let step = 2

    const range: range = {
        min: [-190, -52],
        max: [50, 67]
    }

    state = setAbstractState(state, setStep(getAbstractState(state), step))

    state = setGrid(state, createGrid(state, range, step))

    state = setGridForGirl(state, range)

    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), destroyedHandler))

    return Promise.resolve(state)
}
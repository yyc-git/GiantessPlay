import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { actionName } from "../data/DataType"
import { isTriggerAction, restorePhysics } from "../girl/Girl"
import { command } from "../type/StateType"
import { playAnimationLoop, restore } from "../girl/Animation"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { markEnter } from "../scenario/ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { buildShowDialogueEventData, getExitScenarioEventName, getShowDialogueEventName } from "../../../../utils/EventUtils"
// import { useCameraControl } from "../scenario/Command"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { useCamera } from "../CityScene"
import { getDefaultCameraType } from "../Camera"

let _trigger = (state: state, completeFunc, actionName_) => {
    if (!isTriggerAction(state, actionName_)) {
        return completeFunc(state)
    }

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return _trigger(state, completeFunc, actionName_)
    }, 5)))
}

let _triggerAction = <actionName>(state: state, [triggerGirlActionFunc, completeFunc,], actionName_: actionName) => {
    return triggerGirlActionFunc(state, actionName_).then(([state, _]) => {
        return _trigger(state, completeFunc, actionName_)
    })
}

export let triggerAction = <actionName>(state: state, [triggerGirlActionFunc, onCompleteFunc], actionName_: actionName,
): Promise<state> => {
    return _triggerAction(state,
        [
            triggerGirlActionFunc,
            onCompleteFunc,
        ],
        actionName_)
}



export let exitScenario = (defaultAnimationName): command<null> => {
    return (state: state, _, data) => {
        state = restorePhysics(state)

        state = playAnimationLoop(state, defaultAnimationName, false)
        state = restore(state)

        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

        getOrbitControls(getAbstractState(state)).enabled = true

        return markEnter(state, false).then(state => {
            return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData("", "", false))
        }).then(state => {
            // return useCameraControl(state, NullableUtils.getEmpty(), null)
            return useCamera(state, getDefaultCameraType())
        }).then(state => {
            return Event.trigger(state, getAbstractState, getExitScenarioEventName(), null)
        })
    }
} 

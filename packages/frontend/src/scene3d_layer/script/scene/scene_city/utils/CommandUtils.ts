import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { actionName } from "../data/DataType"
import { isTriggerAction, isUseGirl, restorePhysics } from "../girl/Girl"
import { command, usedGirlEnum } from "../type/StateType"
import { playAnimationLoop, restore } from "../girl/Animation"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { markEnter } from "../scenario/ScenarioManager"
import { Event } from "meta3d-jiehuo-abstract"
import { buildShowDialogueEventData, getExitScenarioEventName, getShowDialogueEventName } from "../../../../utils/EventUtils"
// import { useCameraControl } from "../scenario/Command"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { restoreCameraFromSavedData, useCamera } from "../CityScene"
import { getDefaultCameraType } from "../Camera"
import { exitScenarioData, getUsedGirlIndexFromData } from "../scenario/Command"

let _trigger = (state: state, completeFunc, usedGirl, actionName_) => {
    if (!isTriggerAction(state, usedGirl, actionName_)) {
        return completeFunc(state)
    }

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
        return _trigger(state, completeFunc, usedGirl, actionName_)
    }, 5)))
}

let _triggerAction = <actionName>(state: state, [triggerGirlActionFunc, completeFunc,], usedGirl, actionName_: actionName) => {
    return triggerGirlActionFunc(state, usedGirl, actionName_).then(([state, _]) => {
        return _trigger(state, completeFunc, usedGirl, actionName_)
    })
}

export let triggerAction = <actionName>(state: state, [triggerGirlActionFunc, onCompleteFunc], usedGirl, actionName_: actionName,
): Promise<state> => {
    return _triggerAction(state,
        [
            triggerGirlActionFunc,
            onCompleteFunc,
        ], usedGirl,
        actionName_)
}



export let exitScenario = (defaultAnimationName): command<exitScenarioData> => {
    return (state: state, _, data) => {
        // let usedGirl = usedGirlEnum.PlayerGirl
        let usedGirl = getUsedGirlIndexFromData(state, data)

        if (isUseGirl(state, usedGirl)) {
            state = restorePhysics(state, usedGirl)

            state = playAnimationLoop(state, usedGirl, defaultAnimationName, false)

            state = restore(state, usedGirl)
        }


        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

        getOrbitControls(getAbstractState(state)).enabled = true

        return markEnter(state, false).then(state => {
            return Event.trigger(state, getAbstractState, getShowDialogueEventName(), buildShowDialogueEventData("", "", false))
        }).then(state => {
            // return useCameraControl(state, NullableUtils.getEmpty(), null)

            // return useCamera(state, getDefaultCameraType())
            return restoreCameraFromSavedData(state)
        }).then(state => {
            return Event.trigger(state, getAbstractState, getExitScenarioEventName(), null)
        })
    }
} 

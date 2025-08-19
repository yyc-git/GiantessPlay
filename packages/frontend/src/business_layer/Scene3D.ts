import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import * as Scene from "../scene3d_layer/script/scene/Scene"
import { getAbstractState, readState, setAbstractState } from "./State"
import { Render } from "meta3d-jiehuo-abstract"
import { state } from "../scene3d_layer/type/StateType"
import { startLoop, stopLoop } from "./Loop"
import { CameraControls } from "meta3d-jiehuo-abstract"

export let switchScene = Scene.switchScene

export let setIsDebug = Scene.setIsDebug

export let getIsProduction = () => {
    return Scene.getIsProduction(readState())
}

export let setIsProduction = Scene.setIsProduction

export let setIsNotTestPerf = Scene.setIsNotTestPerf

export let setIsSkipScenario = Scene.setIsSkipScenario

export let setIsSkipGameEvent = Scene.setIsSkipGameEvent

export let getCurrentCameraType = Scene.getCurrentCameraType

export let getCameraControlsJoystickZoneDomSize = CameraControls.getSize

// export let markIsNeedLandscape = state => {
//     return setAbstractState(state, Render.markIsNeedLandscape(getAbstractState(state)))
// } 

export let start = (state: state) => {
    return startLoop(state)
}

export let stop = (state: state) => {
    return stopLoop(state)
}

export let exit = (state: state) => {
    state = stopLoop(state)

    return Scene.disposeCurrentScene(state)
}
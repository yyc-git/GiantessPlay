import { Camera } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { getIsDebug, getIsProduction } from "../../Scene"
import { getBoxSizeForCompute } from "../little_man/LittleMan"

// export let getCameraNear = (state: state) => {
//     return Camera.getCurrentCamera(getAbstractState(state)).near
// }

// export let getCameraFar = (state: state) => {
//     return Camera.getCurrentCamera(getAbstractState(state)).far
// }

// export let setCameraFar = (state: state, far) => {
//     Camera.getCurrentCamera(getAbstractState(state)).far = far

//     return state
// }


export let updateThirdPersonControlsByCameraData = (state: state, near, far, cameraPosition, controlsTarget) => {
    let abstractState = getAbstractState(state)

    let camera = Camera.getCurrentCamera(abstractState)

    abstractState = ThirdPersonControls.updateControls(abstractState,
        [
            // getCameraNear(state),
            // getCameraFar(state)
            near,
            far
        ],
        isCameraCollision(state),
        Camera.getOrbitControls(abstractState), camera,
        controlsTarget,
        cameraPosition,
        getMinDistance(state),
        getMaxDistance(state),
    )

    return setAbstractState(state, abstractState)
}

export let getMinDistance = (state) => {
    // if (getIsDebug(state)) {
    //     return 0
    // }

    return getBoxSizeForCompute(state) * 2
}

export let getMaxDistance = (state: state) => {
    if (getIsDebug(state)) {
        // return getBoxSizeForCompute(state, usedGirl) * 100
        return getBoxSizeForCompute(state) * 600
    }

    // return getCapsuleRadiusForCompute(capsule) * 16
    return getBoxSizeForCompute(state) * 38
}

export let isCameraCollision = (state) => {
    // if (StateMachine.isState(LittleMan.getStateMachine(state), objectStateName.Attack)) {
    //     return true
    // }

    // TODO open camera collision

    return false
}
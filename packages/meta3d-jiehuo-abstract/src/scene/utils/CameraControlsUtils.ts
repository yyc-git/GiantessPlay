import { NullableUtils } from "../../Main"
import { getSceneState, setSceneState } from "../../state/State"
import { state, cameraControls } from "../../type/StateType"

export let getState = (state: state) => {
    return getSceneState(state).camera.cameraControls
}

export let setState = (state: state, thirdPersonControlsState: cameraControls) => {
    return setSceneState(state, {
        ...getSceneState(state),
        camera: {
            ...getSceneState(state).camera,
            cameraControls: thirdPersonControlsState
        }
    })
}

export let getKeyState = (state: state, road) => {
    return NullableUtils.getExn(getSceneState(state).camera.cameraControls.keyState.get(road))
}

export let setKeyState = (state: state, road, keyState) => {
    return setState(state, {
        ...getState(state),
        keyState: getState(state).keyState.set(road, keyState)
    })
}


export let getDirectionDataFromState = (state: state, road_): [number, number] => {
    let directionData = NullableUtils.getExn(getState(state).directionData.get(road_))

    let forward = directionData[0] > 0 ? directionData[0] : -directionData[1]
    let side = directionData[3] > 0 ? directionData[3] : -directionData[2]

    return [forward, side]
}

export let getDirectionDataFromKeyState = (state: state, road_): [number, number] => {
    let keyState = getKeyState(state, road_)

    return keyState.reduce(([forward, side], isPress, key) => {
        if (isPress) {
            switch (key) {
                case "KeyW":
                    forward += 1
                    break
                case "KeyA":
                    side -= 1
                    break
                case "KeyD":
                    side += 1
                    break
                case "KeyS":
                    forward -= 1
                    break
            }
        }

        if (Math.abs(forward) == 1 && Math.abs(side) == 1) {
            forward = forward / Math.sqrt(2)
            side = side / Math.sqrt(2)
        }

        return [forward, side]
    }, [0, 0])
}

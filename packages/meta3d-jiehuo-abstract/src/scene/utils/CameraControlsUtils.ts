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

// export let getKeyState = (state: state, characterType) => {
//     return NullableUtils.getExn(getSceneState(state).camera.cameraControls.keyState.get(characterType))
// }

// export let setKeyState = (state: state, characterType, keyState) => {
//     // console.log(keyState)
//     return setState(state, {
//         ...getState(state),
//         keyState: getState(state).keyState.set(characterType, keyState)
//     })
// }

export let getLittleManKeyState = (state: state) => {
    return getSceneState(state).camera.cameraControls.littleManKeyState
}

export let setLittleManKeyState = (state: state, keyState) => {
    // console.log(keyState)
    return setState(state, {
        ...getState(state),
        littleManKeyState: keyState
    })
}

export let getGiantessKeyState = (state: state, usedGirl) => {
    return NullableUtils.getExn(getSceneState(state).camera.cameraControls.giantessKeyState.get(usedGirl))
}

export let setGiantssKeyState = (state: state, usedGirl, keyState) => {
    return setState(state, {
        ...getState(state),
        giantessKeyState: getState(state).giantessKeyState.set(usedGirl, keyState)
    })
}

// export let getDirectionDataFromState = (state: state, characterType_): [number, number] => {
//     let directionData = NullableUtils.getExn(getState(state).directionData.get(characterType_))


//     let forward = directionData[0] > 0 ? directionData[0] : -directionData[1]
//     let side = directionData[3] > 0 ? directionData[3] : -directionData[2]

//     return [forward, side]
// }

let _getForwardAndSide = (directionData): [number, number] => {
    let forward = directionData[0] > 0 ? directionData[0] : -directionData[1]
    let side = directionData[3] > 0 ? directionData[3] : -directionData[2]

    return [forward, side]
}

export let getLittleManDirectionDataFromState = (state: state) => {
    let directionData = NullableUtils.getExn(getState(state).littleManDirectionData)

    return _getForwardAndSide(directionData)
}

export let getGiantessDirectionDataFromState = (state: state, usedGirl) => {
    let directionData = NullableUtils.getExn(getState(state).giantessDirectionDataMap.get(usedGirl))

    return _getForwardAndSide(directionData)
}

// export let getDirectionDataFromKeyState = (state: state, characterType_): [number, number] => {
//     let keyState = getKeyState(state, characterType_)

//     return keyState.reduce(([forward, side], isPress, key) => {
//         if (isPress) {
//             switch (key) {
//                 case "KeyW":
//                     forward += 1
//                     break
//                 case "KeyA":
//                     side -= 1
//                     break
//                 case "KeyD":
//                     side += 1
//                     break
//                 case "KeyS":
//                     forward -= 1
//                     break
//             }
//         }

//         if (Math.abs(forward) == 1 && Math.abs(side) == 1) {
//             forward = forward / Math.sqrt(2)
//             side = side / Math.sqrt(2)
//         }

//         return [forward, side]
//     }, [0, 0])
// }

let _getDirectionDataFromKeyState = (keyState) => {
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

export let getLitleManDirectionDataFromKeyState = (state: state): [number, number] => {
    let keyState = getLittleManKeyState(state)

    return _getDirectionDataFromKeyState(keyState)
}

export let getGiantessDirectionDataFromKeyState = (state: state, usedGirl): [number, number] => {
    let keyState = getGiantessKeyState(state, usedGirl)

    return _getDirectionDataFromKeyState(keyState)
}


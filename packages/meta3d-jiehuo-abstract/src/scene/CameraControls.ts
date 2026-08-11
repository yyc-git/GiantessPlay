import { Vector3, Object3D, Euler, Ray, PerspectiveCamera } from "three"
import { characterType, state, cameraControls, usedGirlEnum, usedGirl } from "../type/StateType"
import { Map, isCollection } from "immutable"
import { getEmpty, getExn, getWithDefault, isNullable, map, return_ } from "../utils/NullableUtils"
import { getIsDebug, getPickState, getRenderState, getSceneState, readSpecificState, readState, setSceneState, writeSpecificState, writeState } from "../state/State"
import { getKeyDownEventName, getKeyUpEventName, on, off } from "../Event"
import { getCurrentCamera, getCurrentControls, getDomElement, getOrbitControls, isCanLock } from "./Camera"
import { isMobile } from "../Device"
import * as nipplejs from 'nipplejs'
import { getCharacterType, getCurrentScene, isCharacterType, isGiantessCharacterType, isLittleCharacterType, isPlayerCharacterType } from "./Scene"
import { findTerrainGeometry } from "../terrain/Terrain"
import { computeAfterAddVelocity, handleCameraCollision } from "../collision/CameraCollision"
import { getWeight } from "../animation/SkinBlendAnimation"
import { getFrameIndex } from "../animation/SkinAnimation"
import { between } from "../utils/NumberUtils"
import { addDeferExecFuncData } from "../Flow"
import { NullableUtils, NumberUtils, Render } from "../Main"
import { nullable } from "../utils/nullable"
import { getGiantessDirectionDataFromKeyState, getGiantessDirectionDataFromState, getGiantessKeyState, getLitleManDirectionDataFromKeyState, getLittleManDirectionDataFromState, getLittleManKeyState, getState, setGiantssKeyState, setLittleManKeyState, setState } from "./utils/CameraControlsUtils"
import * as LittleManThirdPersonControls from "./little_man/ThirdPersonControls"
import * as GiantessThirdPersonControls from "./giantess/ThirdPersonControls"
import { ensureCheck, test } from "../utils/Contract"

let _getZoneDom = () => {
    return document.querySelector<HTMLElement>("#meta3d_joystick_zone")
}

export let setZoneDomPosition = () => {
    _getZoneDom().style.bottom = "5%"
    _getZoneDom().style.left = "5%"
}

let _showZoneDom = () => {
    _getZoneDom().style.display = "block"
}

export let hideZoneDom = () => {
    _getZoneDom().style.display = "none"
}

let _isUsed = () => {
    return _getZoneDom().style.display == "block"
}

export let createDefaultKeyState = () => Map({
    "KeyW": false,
    "KeyA": false,
    "KeyS": false,
    "KeyD": false,
})


// let _initKeyState = () => {
//     return Map<any, any>().set(characterType.Giantess, createDefaultKeyState()).set(characterType.LittleMan, createDefaultKeyState())
// }


export let createDefaultDirectionData = (): [number, number, number, number] => [0, 0, 0, 0]

let _isUseDirectionData = (state: state, usedGirl, characterType_: characterType) => {
    // return (
    //     isMobile() && (
    //         isGiantessCharacterType(state)
    //         || (isLittleCharacterType(state) && characterType_ == characterType.LittleMan)
    //     )
    // )
    //     ||
    //     (
    //         !isMobile() && (isLittleCharacterType(state) && characterType_ == characterType.Giantess)
    //     )
    // if (isMobile()) {
    //     if (isGiantessCharacterType(state)) {
    //         return false
    //     }

    //     return characterType_ == characterType.Giantess
    // }

    if (isMobile()) {
        // if (isGiantessCharacterType(state)) {
        //     return true
        // }

        return true
    }

    // if (isGiantessCharacterType(state)) {
    //     return false
    // }
    if (usedGirl == usedGirlEnum.PlayerGirl) {
        return false
    }

    return characterType_ == characterType.Giantess
}

let _getKeyState = (state: state, usedGirl: usedGirl, characterType_: characterType) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return getLittleManKeyState(state)
        case characterType.Giantess:
            return getGiantessKeyState(state, usedGirl)
        default:
            throw new Error("error")
    }
}

let _getKey = (state: state, usedGirl: usedGirl, characterType_: characterType, key: string) => {
    return _getKeyState(state, usedGirl, characterType_).get(key)
}

let _setKeyState = (state: state, usedGirl: usedGirl, characterType_: characterType, value) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return setLittleManKeyState(state, value)
        case characterType.Giantess:
            return setGiantssKeyState(state, usedGirl, value)
        default:
            throw new Error("error")
    }
}

export let isMoveFront = (state: state, usedGirl: usedGirl, characterType_: characterType) => {
    // console.log(getExn(getKeyState(state, characterType).get('KeyW')))
    if (_isUseDirectionData(state, usedGirl, characterType_)) {
        // return getState(state).forward > 0
        // return getDirectionDataFromState(state, characterType)[0] > 0
        switch (characterType_) {
            case characterType.LittleMan:
                return getLittleManDirectionDataFromState(state)[0] > 0
            case characterType.Giantess:
                return getGiantessDirectionDataFromState(state, usedGirl)[0] > 0
            default:
                throw new Error("error")
        }
    }

    return _getKey(state, usedGirl, characterType_, "KeyW")
}

export let isMoveBack = (state: state, usedGirl: usedGirl, characterType_) => {
    if (_isUseDirectionData(state, usedGirl, characterType_)) {
        // return getState(state).back > 0
        // return getDirectionDataFromState(state, characterType)[0] < 0
        switch (characterType_) {
            case characterType.LittleMan:
                return getLittleManDirectionDataFromState(state)[0] < 0
            case characterType.Giantess:
                return getGiantessDirectionDataFromState(state, usedGirl)[0] < 0
            default:
                throw new Error("error")
        }
    }

    return _getKey(state, usedGirl, characterType_, "KeyS")
}

export let isMoveLeft = (state: state, usedGirl, characterType_) => {
    if (_isUseDirectionData(state, usedGirl, characterType_)) {
        // return getState(state).left > 0
        // return getDirectionDataFromState(state, characterType)[1] > 0
        switch (characterType_) {
            case characterType.LittleMan:
                return getLittleManDirectionDataFromState(state)[1] > 0
            case characterType.Giantess:
                return getGiantessDirectionDataFromState(state, usedGirl)[1] > 0
            default:
                throw new Error("error")
        }
    }

    return _getKey(state, usedGirl, characterType_, "KeyA")
}

export let isMoveRight = (state: state, usedGirl, characterType_) => {
    if (_isUseDirectionData(state, usedGirl, characterType_)) {
        // return getState(state).right > 0
        // return getDirectionDataFromState(state, characterType)[1] < 0
        switch (characterType_) {
            case characterType.LittleMan:
                return getLittleManDirectionDataFromState(state)[1] < 0
            case characterType.Giantess:
                return getGiantessDirectionDataFromState(state, usedGirl)[1] < 0
            default:
                throw new Error("error")
        }
    }

    return _getKey(state, usedGirl, characterType_, "KeyD")
}


export let createState = (): cameraControls => {
    return {
        littleManKeyState: createDefaultKeyState(),
        giantessKeyState: Map(),

        joystickManager: null,
        moveHandlerFunc: null,
        endHandlerFunc: null,

        littleManDirectionData: createDefaultDirectionData(),
        giantessDirectionDataMap: Map<any, any>(),

        distanceBeforeCameraCollision: null,
        lastExitPointerLockTime: NullableUtils.getEmpty(),
        isEnablePointerlock: false,
    }
}

// export let initKeyState = (state: state) => {
//     return setState(state, {
//         ...getState(state),
//         keyState: _initKeyState()
//     })
// }
export let initLittleManKeyState = (state: state) => {
    return setState(state, {
        ...getState(state),
        littleManKeyState: createDefaultKeyState()
    })
}

export let initGiantessKeyState = (state: state, usedGirl) => {
    return setState(state, {
        ...getState(state),
        giantessKeyState: getState(state).giantessKeyState.set(usedGirl, createDefaultKeyState())
    })
}


export let resetLittleManKey = (state: state) => {
    return setLittleManKeyState(state, createDefaultKeyState())
}

export let resetGiantessKey = (state: state, usedGirl) => {
    return setGiantssKeyState(state, usedGirl, createDefaultKeyState())
}


let _resetKey = (state: state, usedGirl, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return resetLittleManKey(state)
        case characterType.Giantess:
            return resetGiantessKey(state, usedGirl)
        default:
            throw new Error("error")
    }
}

export let resetLittleManDirectionData = (state: state) => {
    return setLittleManDirectionData(state, createDefaultDirectionData())
}

export let resetGiantessDirectionData = (state: state, usedGirl) => {
    return setGiantessDirectionData(state, usedGirl, createDefaultDirectionData())
}

// export let setDirectionData = (state: state, characterType_, [
//     forward,
//     back,
//     left,
//     right,
// ]) => {
//     return setState(state, {
//         ...getState(state),
//         directionData: getState(state).directionData.set(characterType_, [
//             forward,
//             back,
//             left,
//             right
//         ])
//     })
// }
export let setLittleManDirectionData = (state: state, [
    forward,
    back,
    left,
    right,
]) => {
    return setState(state, {
        ...getState(state),
        littleManDirectionData: [
            forward,
            back,
            left,
            right
        ]
    })
}

export let setGiantessDirectionData = (state: state, usedGirl, [
    forward,
    back,
    left,
    right,
]) => {
    return setState(state, {
        ...getState(state),
        giantessDirectionDataMap: getState(state).giantessDirectionDataMap.set(usedGirl, [
            forward,
            back,
            left,
            right
        ])
    })
}



let _bindJoystickEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
    let joystickManager = getExn(getState(state).joystickManager)

    let moveHandlerFunc = function (evt, data) {
        let specificState = readSpecificStateFunc()
        let state = getAbstractStateFunc(specificState)

        let forward = data.vector.y
        let turn = data.vector.x

        let fwdValue = 0
        let bkdValue = 0
        let lftValue = 0
        let rgtValue = 0

        if (forward > 0) {
            fwdValue = Math.abs(forward)
            bkdValue = 0
        } else if (forward < 0) {
            fwdValue = 0
            bkdValue = Math.abs(forward)
        }

        if (turn > 0) {
            lftValue = 0
            rgtValue = Math.abs(turn)
        } else if (turn < 0) {
            lftValue = Math.abs(turn)
            rgtValue = 0
        }

        if (isLittleCharacterType(state)) {
            state = setLittleManDirectionData(state, [
                fwdValue,
                bkdValue,
                lftValue,
                rgtValue,
            ])
        }
        else {
            state = setGiantessDirectionData(state, usedGirlEnum.PlayerGirl, [
                fwdValue,
                bkdValue,
                lftValue,
                rgtValue,
            ])
        }

        writeSpecificStateFunc(setAbstractStateFunc(specificState,
            state
        ))
    }

    let endHandlerFunc = function (evt) {
        let specificState = readSpecificStateFunc()
        let state = getAbstractStateFunc(specificState)

        if (isLittleCharacterType(state)) {
            state = resetLittleManDirectionData(state)
        }
        else {
            state = resetGiantessDirectionData(state, usedGirlEnum.PlayerGirl)
        }


        writeSpecificStateFunc(setAbstractStateFunc(
            specificState,
            state
        ))
    }

    joystickManager.on("move", moveHandlerFunc)
    joystickManager.on("end", endHandlerFunc)

    return setState(state, {
        ...getState(state),
        moveHandlerFunc: return_(moveHandlerFunc),
        endHandlerFunc: return_(endHandlerFunc)
    })
}

let _isAllowCode = (keyState, code: string) => {
    return keyState.has(code)
}

// let _isOrbitControls = (state: state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(controls => {
//             return controls.type == "OrbitControls"
//         }, getCurrentControls(state)),
//         false
//     )
// }

export let isEnablePointerLock = (state: state) => {
    return getState(state).isEnablePointerlock
}

let _setIsEnablePointerLock = (state: state, value) => {
    state = setState(state, {
        ...getState(state),
        isEnablePointerlock: value
    })

    getOrbitControls(state).isEnablePointerlock = value

    return state
}

let _pointerlockchangeHandler = () => {
    let state = readState()

    // if (NullableUtils.isNullable(state.render)) {
    //     return
    // }

    if (document.pointerLockElement == getDomElement(state)) {
    } else {
        getState(state).lastExitPointerLockTime = NullableUtils.return_(performance.now())

        state = _setIsEnablePointerLock(state, false)
    }

    // if (_isOrbitControls(state)) {
    getOrbitControls(state).pointerlockchangeHandler()
    // }

    writeState(state)
}

export let lock = (state: state) => {
    if (!isCanLock(state)) {
        return state
    }

    /*!
    to avoid "The user has exited the lock before this request was completed" error

    refer to:
    https://discourse.threejs.org/t/how-to-avoid-pointerlockcontrols-error/33017
    */

    // let lastExitPointerLockTime = getState(state).lastExitPointerLockTime

    let isEnablePointerlock = getState(state).isEnablePointerlock

    if (isEnablePointerlock) {
        return state
    }

    state = _setIsEnablePointerLock(state, true)

    // if (lastExitPointerLockTime !== null
    //     && performance.now() - lastExitPointerLockTime < 1500) {
    //     return state
    // }

    try {
        (getDomElement(state).requestPointerLock() as any).catch(e => {
            console.error(e);
        });
    }
    catch (e) {
        console.error(e)
    }

    return state
}
export let unlock = (state: state) => {
    if (typeof document.exitPointerLock === "function") {
        document.exitPointerLock()
    }

    state = _setIsEnablePointerLock(state, false)

    return state
}


let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc, isResetKeyStateFunc]) => {
    if (!isMobile()) {
        if (isCanLock(state)) {
            document.addEventListener('pointerlockchange', _pointerlockchangeHandler, false);
            document.addEventListener('pointerlockerror', event => {
                console.error("Unable to use Pointer Lock API: ", event);
            });
        }

        // state = on(state, getKeyDownEventName(), (specficState, { userData }) => {
        //     let event = getExn(userData)
        //     // console.log("down:", event.code)

        //     let state = getAbstractStateFunc(specficState)

        //     let characterType = getCharacterType(state)

        //     if (_isAllowCode(getKeyState(state, characterType), event.code)) {
        //         // state = _resetKey(state)

        //         state = setKeyStateUtils(state, characterType, getKeyState(state, characterType).set(event.code, true))
        //     }

        //     if (isResetKeyStateFunc(specficState)) {
        //         state = resetKey(state, characterType)
        //     }


        //     if (isCanLock(state)) {
        //         switch (event.code) {
        //             case "KeyG":
        //                 if (getState(state).isEnablePointerlock) {
        //                     state = unlock(state)
        //                 }
        //                 else {
        //                     state = lock(state)
        //                 }

        //                 // if (_isOrbitControls(state)) {
        //                 //     if (getOrbitControls(state).isEnablePointerlock) {
        //                 //         getOrbitControls(state).unlock()
        //                 //     }
        //                 //     else {
        //                 //         getOrbitControls(state).lock()
        //                 //     }
        //                 // }

        //                 break
        //         }
        //     }


        //     specficState = setAbstractStateFunc(specficState, state)

        //     return Promise.resolve(specficState)
        // })
        // state = on(state, getKeyUpEventName(), (specficState, { userData }) => {
        //     let event = getExn(userData)
        //     // console.log("up:", event.code)

        //     let state = getAbstractStateFunc(specficState)

        //     let characterType = getCharacterType(state)

        //     if (_isAllowCode(getKeyState(state, characterType), event.code)) {
        //         state = setKeyStateUtils(state, characterType, getKeyState(state, characterType).set(event.code, false))
        //     }

        //     if (isResetKeyStateFunc(specficState)) {
        //         state = resetKey(state, characterType)
        //     }

        //     specficState = setAbstractStateFunc(specficState, state)

        //     return Promise.resolve(specficState)
        // })

        /*! directly use document.addEventListener so can trigger keyup accurately for multiple keys
        * 
        */
        document.addEventListener("keydown", (event) => {
            let specficState = readSpecificState()

            let state = getAbstractStateFunc(specficState)



            if (isPlayerCharacterType(state)) {
                let characterType = getCharacterType(state)

                if (_isAllowCode(_getKeyState(state, usedGirlEnum.PlayerGirl, characterType), event.code)) {
                    // console.log("keydown: ", event.code, true)
                    // state = _resetKey(state)

                    state = _setKeyState(state, usedGirlEnum.PlayerGirl, characterType, _getKeyState(state, usedGirlEnum.PlayerGirl, characterType).set(event.code, true))
                }

                if (isResetKeyStateFunc(specficState)) {
                    state = _resetKey(state, usedGirlEnum.PlayerGirl, characterType)
                }
            }



            if (isCanLock(state)) {
                switch (event.code) {
                    case "KeyG":
                        if (getState(state).isEnablePointerlock) {
                            state = unlock(state)
                        }
                        else {
                            state = lock(state)
                        }

                        // if (_isOrbitControls(state)) {
                        //     if (getOrbitControls(state).isEnablePointerlock) {
                        //         getOrbitControls(state).unlock()
                        //     }
                        //     else {
                        //         getOrbitControls(state).lock()
                        //     }
                        // }

                        break
                }
            }


            specficState = setAbstractStateFunc(specficState, state)

            // return Promise.resolve(specficState)

            writeSpecificState(specficState)
        })
        document.addEventListener("keyup", (event) => {
            let specficState = readSpecificState()

            let state = getAbstractStateFunc(specficState)

            if (isPlayerCharacterType(state)) {
                // console.log("keyup: ", event.code, false)
                let characterType = getCharacterType(state)

                if (_isAllowCode(_getKeyState(state, usedGirlEnum.PlayerGirl, characterType), event.code)) {
                    state = _setKeyState(state, usedGirlEnum.PlayerGirl, characterType, _getKeyState(state, usedGirlEnum.PlayerGirl, characterType).set(event.code, false))
                }

                if (isResetKeyStateFunc(specficState)) {
                    state = _resetKey(state, usedGirlEnum.PlayerGirl, characterType)
                }
            }

            specficState = setAbstractStateFunc(specficState, state)

            // return Promise.resolve(specficState)
            writeSpecificState(specficState)

        })
    }

    return state
}

export let getSize = () => 100
// export let getSize = () => 200

export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc, isResetKeyStateFunc]) => {
    state = _bindEvent(state, [getAbstractStateFunc, setAbstractStateFunc, isResetKeyStateFunc])

    if (isMobile()) {
        state = setState(state, {
            ...getState(state),
            joystickManager: return_(nipplejs.create({
                zone: _getZoneDom(),
                size: getSize(),
                multitouch: true,
                maxNumberOfNipples: 2,
                mode: 'static',
                restJoystick: true,
                shape: 'circle',
                position: { top: '50%', right: '50%' },
                dynamicPage: true,
                restOpacity: 0.2
            }))
        })

        state = _bindJoystickEvent(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
    }

    return Promise.resolve(state)
}

export let initWhenUse = (state: state) => {
    if (isMobile()) {
        // _createAndInsertZoneDom()
        setZoneDomPosition()
        _showZoneDom()

        // state = setState(state, {
        //     ...getState(state),
        //     joystickManager: return_(nipplejs.create({
        //         zone: _getZoneDom(),
        //         size: getSize(),
        //         multitouch: true,
        //         maxNumberOfNipples: 2,
        //         mode: 'static',
        //         restJoystick: true,
        //         shape: 'circle',
        //         position: { top: '50%', right: '50%' },
        //         dynamicPage: true,
        //     }))
        // })

        // state = _bindJoystickEvent(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
    }
    else {
        // state = on(state, getKeyDownEventName(), _keydownHandler)
    }

    return state
}

export let disposeState = (state: cameraControls): cameraControls => {

    return {
        ...state,
        littleManKeyState: createDefaultKeyState(),
        giantessKeyState: Map(),

        // forward: 0,
        // back: 0,
        // left: 0,
        // right: 0,
        // directionData: Map<any, any>().set(characterType.Giantess, createDefaultDirectionData()).set(characterType.LittleMan, createDefaultDirectionData()),
        littleManDirectionData: createDefaultDirectionData(),
        giantessDirectionDataMap: Map<any, any>(),

        distanceBeforeCameraCollision: null
    }
}

export let dispose = (state: state) => {
    if (isMobile()) {
        // if (!isNullable(getState(state).joystickManager)) {
        //     // getExn(getState(state).joystickManager).destroy()
        //     let joystickManager = getExn(getState(state).joystickManager)
        //     joystickManager.off("move", getExn(getState(state).moveHandlerFunc))
        //     joystickManager.off("end", getExn(getState(state).endHandlerFunc))
        //     // _removeZoneDom()
        //     hideZoneDom()
        //     // state = setState(state, {
        //     //     ...getState(state),
        //     //     joystickManager: null
        //     // })
        // }
        // getExn(getState(state).joystickManager).destroy()
        if (_isUsed()) {
            // let joystickManager = getExn(getState(state).joystickManager)
            // joystickManager.off("move", getExn(getState(state).moveHandlerFunc))
            // joystickManager.off("end", getExn(getState(state).endHandlerFunc))

            hideZoneDom()
        }

    }
    else {
        // state = off(state, getKeyDownEventName(), _keydownHandler)
    }

    return state
}

// export let setKeyState = setKeyStateUtils

export let computeTransformForCamera = (state: state, usedGirl: usedGirl, characterType_: characterType): [number, number] => {
    let forward = 0
    let side = 0

    if (isMobile()) {
        let data
        switch (characterType_) {
            case characterType.LittleMan:
                data = getLittleManDirectionDataFromState(state)
                break
            case characterType.Giantess:
                data = getGiantessDirectionDataFromState(state, usedGirl)
                break
            default:
                throw new Error("error")
        }

        forward = data[0]
        side = data[1]
    }
    else {
        // if (isLittleCharacterType(state) && characterType_ == characterType.Giantess) {
        if (usedGirl != usedGirlEnum.PlayerGirl && characterType_ == characterType.Giantess) {
            let data = getGiantessDirectionDataFromState(state, usedGirl)
            forward = data[0]
            side = data[1]
        }
        else {
            // let data = getDirectionDataFromKeyState(state, characterType_)
            let data
            switch (characterType_) {
                case characterType.LittleMan:
                    data = getLitleManDirectionDataFromKeyState(state)
                    break
                case characterType.Giantess:
                    data = getGiantessDirectionDataFromKeyState(state, usedGirl)
                    break
                default:
                    throw new Error("error")
            }

            forward = data[0]
            side = data[1]
        }
    }

    return [forward, side]
}
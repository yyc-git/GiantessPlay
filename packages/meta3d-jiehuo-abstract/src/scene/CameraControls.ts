import { Vector3, Object3D, Euler, Ray, PerspectiveCamera } from "three"
import { road, renderAccuracyLevel, state, cameraControls } from "../type/StateType"
import { Map, isCollection } from "immutable"
import { getEmpty, getExn, getWithDefault, isNullable, map, return_ } from "../utils/NullableUtils"
import { getIsDebug, getPickState, getRenderState, getSceneState, readState, setSceneState, writeState } from "../state/State"
import { getKeyDownEventName, getKeyUpEventName, on, off } from "../Event"
import { getCurrentCamera, getCurrentControls, getOrbitControls, isCanLock } from "./Camera"
import { isMobile } from "../Device"
import * as nipplejs from 'nipplejs'
import { getRoad, getCurrentScene, isRoad, isGiantessRoad, isLittleRoad } from "./Scene"
import { findTerrainGeometry } from "../terrain/Terrain"
import { computeAfterAddVelocity, handleCameraCollision } from "../collision/CameraCollision"
import { getWeight } from "../animation/SkinBlendAnimation"
import { getFrameIndex } from "../animation/SkinAnimation"
import { between } from "../utils/NumberUtils"
import { getRenderSetting } from "../setting/RenderSetting"
import { addDeferExecFuncData } from "../Flow"
import { NullableUtils, NumberUtils, Render } from "../Main"
import { nullable } from "../utils/nullable"
import { getDirectionDataFromKeyState, getDirectionDataFromState, getKeyState, getState, setKeyState as setKeyStateUtils, setState } from "./utils/CameraControlsUtils"
import * as LittleManThirdPersonControls from "./little_man/ThirdPersonControls"
import * as GiantessThirdPersonControls from "./giantess/ThirdPersonControls"
import { ensureCheck, test } from "../utils/Contract"

let _getZoneDom = () => {
    return document.querySelector<HTMLElement>("#meta3d_joystick_zone")
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


let _initKeyState = () => {
    return Map<any, any>().set(road.Giantess, createDefaultKeyState()).set(road.LittleMan, createDefaultKeyState())
}


export let createDefaultDirectionData = (): [number, number, number, number] => [0, 0, 0, 0]

let _isUseDirectionData = (state: state, road_: road) => {
    // return (
    //     isMobile() && (
    //         isGiantessRoad(state)
    //         || (isLittleRoad(state) && road_ == road.LittleMan)
    //     )
    // )
    //     ||
    //     (
    //         !isMobile() && (isLittleRoad(state) && road_ == road.Giantess)
    //     )
    // if (isMobile()) {
    //     if (isGiantessRoad(state)) {
    //         return false
    //     }

    //     return road_ == road.Giantess
    // }

    if (isMobile()) {
        if (isGiantessRoad(state)) {
            return true
        }

        return true
    }

    if (isGiantessRoad(state)) {
        return false
    }

    return road_ == road.Giantess
}

export let isMoveFront = (state: state, road) => {
    if (_isUseDirectionData(state, road)) {
        // return getState(state).forward > 0
        return getDirectionDataFromState(state, road)[0] > 0
    }

    return getExn(getKeyState(state, road).get('KeyW'))
}

export let isMoveBack = (state: state, road) => {
    if (_isUseDirectionData(state, road)) {
        // return getState(state).back > 0
        return getDirectionDataFromState(state, road)[0] < 0
    }

    return getExn(getKeyState(state, road).get('KeyS'))
}

export let isMoveLeft = (state: state, road) => {
    if (_isUseDirectionData(state, road)) {
        // return getState(state).left > 0
        return getDirectionDataFromState(state, road)[1] > 0
    }

    return getExn(getKeyState(state, road).get('KeyA'))
}

export let isMoveRight = (state: state, road) => {
    if (_isUseDirectionData(state, road)) {
        // return getState(state).right > 0
        return getDirectionDataFromState(state, road)[1] < 0
    }

    return getExn(getKeyState(state, road).get('KeyD'))
}


export let createState = (): cameraControls => {
    return {
        keyState: _initKeyState(),
        joystickManager: null,
        moveHandlerFunc: null,
        endHandlerFunc: null,

        directionData: Map<any, any>().set(road.Giantess, createDefaultDirectionData()).set(road.LittleMan, createDefaultDirectionData()),

        distanceBeforeCameraCollision: null,
        lastExitPointerLockTime: NullableUtils.getEmpty(),
        isEnablePointerlock: false,
    }
}

export let initKeyState = (state: state) => {
    return setState(state, {
        ...getState(state),
        keyState: _initKeyState()
    })
}

export let resetKey = (state: state, road) => {
    return setKeyStateUtils(state, road, createDefaultKeyState())
}

export let resetDirectionData = (state: state, road_) => {
    return setDirectionData(state, road_, createDefaultDirectionData())
}



export let setDirectionData = (state: state, road_, [
    forward,
    back,
    left,
    right,
]) => {
    return setState(state, {
        ...getState(state),
        directionData: getState(state).directionData.set(road_, [
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

        writeSpecificStateFunc(setAbstractStateFunc(specificState,
            setDirectionData(state,
                getRoad(state),
                [
                    fwdValue,
                    bkdValue,
                    lftValue,
                    rgtValue,
                ])
        ))
    }

    let endHandlerFunc = function (evt) {
        let specificState = readSpecificStateFunc()
        let state = getAbstractStateFunc(specificState)

        writeSpecificStateFunc(setAbstractStateFunc(
            specificState,
            resetDirectionData(state, getRoad(state))
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

let _getDomElement = (state: state) => {
    // return getRenderState(state).renderer.domElement
    return getOrbitControls(state).domElement as HTMLElement
}

let _isOrbitControls = (state: state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(controls => {
            return controls.type == "OrbitControls"
        }, getCurrentControls(state)),
        false
    )
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

    if (document.pointerLockElement == _getDomElement(state)) {
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

    _getDomElement(state).requestPointerLock()

    return state
}
export let unlock = (state: state) => {
    document.exitPointerLock()

    state = _setIsEnablePointerLock(state, false)

    return state
}


let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc, isResetKeyStateFunc]) => {
    if (!isMobile()) {
        document.addEventListener('pointerlockchange', _pointerlockchangeHandler, false);
        document.addEventListener('pointerlockerror', event => {
            console.error("Unable to use Pointer Lock API: ", event);
        });

        state = on(state, getKeyDownEventName(), (specficState, { userData }) => {
            let event = getExn(userData)

            let state = getAbstractStateFunc(specficState)

            let road = getRoad(state)

            if (_isAllowCode(getKeyState(state, road), event.code)) {
                // state = _resetKey(state)

                state = setKeyStateUtils(state, road, getKeyState(state, road).set(event.code, true))
            }

            if (isResetKeyStateFunc(specficState)) {
                state = resetKey(state, road)
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

            return Promise.resolve(specficState)
        })
        state = on(state, getKeyUpEventName(), (specficState, { userData }) => {
            let event = getExn(userData)

            let state = getAbstractStateFunc(specficState)

            let road = getRoad(state)

            if (_isAllowCode(getKeyState(state, road), event.code)) {
                state = setKeyStateUtils(state, road, getKeyState(state, road).set(event.code, false))
            }

            if (isResetKeyStateFunc(specficState)) {
                state = resetKey(state, road)
            }

            specficState = setAbstractStateFunc(specficState, state)

            return Promise.resolve(specficState)
        })
    }

    return state
}

export let getSize = () => 100

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
        keyState: _initKeyState(),
        // forward: 0,
        // back: 0,
        // left: 0,
        // right: 0,
        directionData: Map<any, any>().set(road.Giantess, createDefaultDirectionData()).set(road.LittleMan, createDefaultDirectionData()),

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

export let setKeyState = setKeyStateUtils

export let computeTransformForCamera = (state: state, road_: road): [number, number] => {
    let forward = 0
    let side = 0

    if (isMobile()) {
        let data = getDirectionDataFromState(state, road_)
        forward = data[0]
        side = data[1]
    }
    else {
        if (isLittleRoad(state) && road_ == road.Giantess) {
            let data = getDirectionDataFromState(state, road.Giantess)
            forward = data[0]
            side = data[1]
        }
        else {
            let data = getDirectionDataFromKeyState(state, road_)
            forward = data[0]
            side = data[1]
        }
    }

    return [forward, side]
}
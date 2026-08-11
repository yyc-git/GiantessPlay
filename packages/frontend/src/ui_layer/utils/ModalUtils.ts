import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../scene3d_layer/state/State"
import { readState, writeState } from "../../business_layer/State"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { startLoop, stopLoop } from "../../business_layer/Loop"
import { isLoopStart } from "meta3d-jiehuo-abstract/src/Flow"
import { addOpenedModalCount, subOpenedModalCount } from "../../scene3d_layer/script/scene/scene_city/UI"
import { Event } from "meta3d-jiehuo-abstract"
import { buildSceneUIEventData, getSceneUIEventName } from "../../scene3d_layer/utils/EventUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { clickDom } from "./DomUtils"
import { getActionState, resetAction as resetLittleManAction } from "../../scene3d_layer/script/scene/scene_city/little_man/Action"
import { resetAction as resetGirlAction } from "../../scene3d_layer/script/scene/scene_city/girl/Girl"
import { isGiantessCharacterType, isLittleCharacterType } from "../../scene3d_layer/script/scene/scene_city/CityScene"
import { littleManActionState, usedGirlEnum } from "../../scene3d_layer/script/scene/scene_city/type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
// import { actionState } from "../../scene3d_layer/script/scene/scene_city/type/StateType"

export let buildModalClassName = () => "opened-modal"

export let handleOpenModal = (state) => {
    // if (isStopLoop) {
    state = stopLoop(state)
    // }

    state = addOpenedModalCount(state)

    if (!Device.isMobileByState(getAbstractState(state))) {
        if (isLittleCharacterType(state)) {
            // switch (getActionState(state)) {
            //     case littleManActionState.Shoot:
            //     case littleManActionState.Swiping:
            //         break
            //     default:
            state = resetLittleManAction(state)
            //         break
            // }
        }
        else if (isGiantessCharacterType(state)) {
            state = resetGirlAction(state, usedGirlEnum.PlayerGirl)
        }
    }

    return state
}

// export let handleOpenModalWithoutStopLoop = (state) => {
//     return state
// }

let _getOpenedModalCount = () => {
    // return Array.from(document.querySelectorAll(`.${buildModalClassName()}`)).filter(node => (node as any).style.display != "none").length
    // return Array.from(document.querySelectorAll(`.adm-modal`)).filter(node => (node as any).style.display != "none").length
    // return Array.from(document.querySelectorAll(`.adm-modal`)).filter(node => (node as any).style.display != "none").length
    return Array.from(document.querySelectorAll(`.adm-modal,.${buildModalClassName()}`)).filter(node => (node as any).style.display != "none").length
    // + Array.from(document.querySelectorAll(`.adm-mask`)).filter(node => {
    //     let style = (node as any).style

    //     return style.display != "none" && !style.marginTop.includes("%")
    // }).length
}

export let hasOpenedModalDom = () => {
    return _getOpenedModalCount() > 0
}

// let _notHasOtherOpenedModal = () => {
//     return _getOpenedModalCount() <= 1
// }

export let handleCloseModal = () => {
    let state = readState()

    // if (!hasOtherOpenedModal(state)) {
    // if (_notHasOtherOpenedModal()) {
    // if (isStartLoop) {
    // if (!isLoopStart(getAbstractState(state))) {
    state = startLoop(state)
    // }
    // }

    state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

    state = subOpenedModalCount(state)

    writeState(state)
}

// export let handleCloseModalWithoutStartLoop = () => {
//     let state = readState()

//     state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

//     writeState(state)
// }

export let closeModal = () => {
    clickDom('adm-center-popup-close')
}

export let isCloseModal = (modalClassName) => {
    return document.querySelector<any>(`.${modalClassName}`).style.display == "none"
}

// /*! to make sure that _deferCloseModal: not duplicate closeModal
// * 
// */
// export let markIsCloseModal = (modalClassName) => {
//     return document.querySelector<any>(`.${modalClassName}`).style.display = "none"
// }


export let closePageModal = (handlerCloseFunc) => {
    return handlerCloseFunc().then(_ => {
        handleCloseModal()
        let state = readState()

        return Event.trigger(state, getAbstractState, getSceneUIEventName(), NullableUtils.return_(buildSceneUIEventData([])))
    })
}
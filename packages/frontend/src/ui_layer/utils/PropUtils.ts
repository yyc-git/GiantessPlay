import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager"
import { play } from "../../business_layer/Sound"
import { getAbstractState, readState, writeState } from "../../business_layer/State"
import { getClickSmallSoundResourceId } from "../../business_layer/Loader"
import { getIsDebug } from "../../scene3d_layer/script/scene/Scene"
import { getSoundSetting } from "../../scene3d_layer/mod/SettingMod"
import { closeModal } from "./ModalUtils"
import { update } from "../../business_layer/Loop"
import { Event } from "meta3d-jiehuo-abstract"
import { getModAPI } from "../../scene3d_layer/script/scene/scene_city/Mod"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { buildDispatchFunc } from "./PageForUIAPIUtils"

export let useProp = ([usePropFunc,
    handleUIFunc,
    dispatchFunc
],
    propName) => {
    let state = readState()

    state = play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

    return usePropFunc(state, propName)
        .then(([state, isCloseModal]) => {
            // return SoundManager.update(getAbstractState(state)).then(abstractState => {
            //     return setAbstractState(state, abstractState)
            // })

            let promise = handleUIFunc(state, isCloseModal)

            // let promise
            // if (isCloseModal) {
            //     promise = new Promise<void>((resolve, reject) => {
            //         writeState(state)

            //         closeModal()

            //         resolve()
            //     })
            // }
            // else {
            //     promise = update(state).then(state => {
            //         setRefresh(_ => Math.random())

            //         writeState(state)
            //     })
            // }

            return promise.then(_ => {
                return Event.trigger(readState(), getAbstractState, getModAPI(state).event.getHandleAfterUsePropEventName(), NullableUtils.return_({
                    name: propName,
                    dispatchEvent: buildDispatchFunc(dispatchFunc)
                })).then(writeState)
            })
        })
}

export let buildFastPropItemClassName = (index) => {
    return `fastProp_item_${index}`
}
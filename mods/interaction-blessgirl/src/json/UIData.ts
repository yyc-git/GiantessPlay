import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { modalUIData, uiData, uiType } from "frontend/src/ui_layer/index/scene/city/page_for_uiapi/components/Type"
import { getAddBuffResourceId } from "./Data"

export enum languageKey {
    GivePlayerRandomBuff,
    KnowInfo,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.KnowInfo]: "知道了",
            [languageKey.GivePlayerRandomBuff]: "给玩家随机Buff",
        },
        [language.English]: {
            [languageKey.KnowInfo]: "Get it",
            [languageKey.GivePlayerRandomBuff]: "Give Player Random Buff",
        },
    }
}

let _buildHandlerCloseFunc = (api) => {
    return () => {
        api.writeState(api.finishUse(api.readState()))

        return Promise.resolve()
    }
}


export let getModalChildrenUIData = (api: api, state: state, addBuffFunc, randomBuff): modalUIData => {
    return randomBuff.map(d => {
        return {
            type: uiType.ImageLabel,

            imageLabel: {
                image: {
                    style: {
                        "width": "4rem !important;",
                        "height": "4rem !important;",
                    },
                    src: d[3],
                },
                text: {
                    style: {
                        "font-size": "0.8rem !important;",
                        "color": "black;",
                    },
                    text: d[4],
                },

            },
        }
    }).concat(
        [
            {
                type: uiType.Button,

                button: {
                    text: api.getLanguageDataByData(state, getTextData(), languageKey.KnowInfo)
                },

                handlerFunc: (api: api, dispatchFunc, value) => {
                    let state = api.readState()

                    return addBuffFunc(api, state, randomBuff).then(state => {
                        // state = api.finishUse(state)


                        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                            api.SoundManager.buildNeedToPlaySoundData(getAddBuffResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
                        ))

                        return state
                    }).then(state => api.sceneUI.hideModal(state, _buildHandlerCloseFunc(api))).then(api.writeState)
                }
            },
        ]
    )
}

export let getModalUIData = (api: api, state: state,
    addBuffFunc,
    randomBuff,
): uiData => {
    return [
        {
            type: uiType.Modal,
            name: api.getLanguageDataByData(state, getTextData(), languageKey.GivePlayerRandomBuff),

            modal: {
                children: getModalChildrenUIData(api, state,
                    addBuffFunc,
                    randomBuff,
                ),
                handlerCloseFunc: _buildHandlerCloseFunc(api)
            },
        },
    ]
}
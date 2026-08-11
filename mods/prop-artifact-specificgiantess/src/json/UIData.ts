import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName, getMMDProtocolName, getProtocolName, getState, setState } from "../script/Utils"
import { uiData, uiType } from "frontend/src/ui_layer/index/page_for_uiapi/components/Type"
import { resourceLevel, service } from "mmd-character-protocol/src/service/ServiceType"
import { buildDefaultValue } from "../script/State"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum languageKey {
    SpecificCharacter,
    Default,

    Submit,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.SpecificCharacter]: "指定人物",
            [languageKey.Default]: "默认",

            [languageKey.Submit]: "提交",
        },
        [language.English]: {
            [languageKey.SpecificCharacter]: "SpecificCharacter",
            [languageKey.Default]: "Default",

            [languageKey.Submit]: "Submit",
        },
    }
}

let _buildDefaultLabel = (api, state) => api.getLanguageDataByData(state, getTextData(), languageKey.Default)

export let getUIData = (api: api, state: state): uiData => {
    return [
        {
            name: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificCharacter),
            type: uiType.SelectorImage,
            // key: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificCharacter),
            selectorImage: {
                options: [
                    { value: buildDefaultValue(), label: _buildDefaultLabel(api, state) }
                ].concat(api.getAllSelectCharacterData(state)
                    .filter(d => {
                        return d[1] != api.getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGirl)
                            && (api.getIsDebug(state) ? true : (d[4] == resourceLevel.White || d[4] == resourceLevel.Green))
                    })
                    .map(d => {
                        return {
                            value: d[1],

                            imageSrc: d[0],
                            imageWidth: "5rem",
                            imageHeight: "5rem",
                        }
                    }))

                ,
                getDefaultValueFunc: (api, state) => getState(api, state).mmdCharacter,
            },
            handlerFunc: (api, _, value) => {
                let state = api.readState()

                state = setState(api, state, {
                    ...getState(api, state),
                    mmdCharacter: value
                })

                api.writeState(state)

                return Promise.resolve()
            }
        },
        {
            name: api.getLanguageDataByData(state, getTextData(), languageKey.Submit),
            type: uiType.Button,
            // key: api.getLanguageDataByData(state, getTextData(), languageKey.Submit),
            handlerFunc: (api, dispatchFunc, value) => {
                state = api.ui.hide(dispatchFunc, api.readState(), [])
                api.writeState(state)

                return Promise.resolve()
            }
        },
    ]
}
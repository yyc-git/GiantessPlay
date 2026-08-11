import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { modalUIData, uiData, uiType } from "frontend/src/ui_layer/index/scene/city/page_for_uiapi/components/Type"
import { getBuyResourceId, getWeaponData } from "./Data"
import { getFieldValue, getState, setFieldValue } from "../script/Utils"
import { weaponSingleData, weaponSingleFieldData } from "interaction-protocol/src/service/ServiceType"
// import { getAddBuffResourceId } from "./Data"

export enum languageKey {
    Close,
    Upgrade,
    Coin,
    CoinNotEnough,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Close]: "关闭",
            [languageKey.Upgrade]: "武器升级",
            [languageKey.Coin]: "金币",
            [languageKey.CoinNotEnough]: "金币不足",
        },
        [language.English]: {
            [languageKey.Close]: "Close",
            [languageKey.Upgrade]: "Weapon Upgrade",
            [languageKey.Coin]: "Coin",
            [languageKey.CoinNotEnough]: "Coin Not Enough",
        },
    }
}

let _computeCoin = (api: api, state, baseCoin, coinFactor, currentFieldValue) => {
    if (currentFieldValue == 0) {
        return api.computeCoinByItemPriceFactor(baseCoin, state)
    }

    // return api.computeCoinByItemPriceFactor(baseCoin * coinFactor * currentFieldValue, state)
    // return api.computeCoinByItemPriceFactor(baseCoin * Math.pow(2, currentFieldValue) * coinFactor, state)
    return api.NumberUtils.lessThan(api.computeCoinByItemPriceFactor(baseCoin * Math.pow(coinFactor, currentFieldValue), state), 10000)
}

let _buildFieldText = (api: api, state, weaponName, f: weaponSingleFieldData) => {
    let fieldValue = getFieldValue(api, state, weaponName, f.name)

    return `${f.text}:${fieldValue} (${_computeCoin(api, state, f.baseCoin, f.coinFactor, fieldValue)} ${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)})`
}

export let getSelectedWeaponData = (api, state) => {
    return api.NumberUtils.randomSelectCount(
        getWeaponData(api, state),
        2
    )
}

let _buildHandlerCloseFunc = (api) => {
    return () => {
        api.writeState(api.finishUse(api.readState()))

        return Promise.resolve()
    }
}

export let getModalChildrenUIData = (api: api, state: state, weaponData): modalUIData => {
    return [
        {
            type: uiType.Button,
            button: {
                text: api.getLanguageDataByData(state, getTextData(), languageKey.Close)
            },

            handlerFunc: (api: api, dispatchFunc, value) => {
                let state = api.readState()

                return api.sceneUI.hideModal(state, _buildHandlerCloseFunc(api)).then(api.writeState)
            }
        },
        {
            type: uiType.Text,
            text: {
                top: 0,
                left: 0,

                getTextFunc: (api, state) => `${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)}:${api.getTotalCoin(state)}`,
            },
        },
    ].concat(
        weaponData.map((d: weaponSingleData) => {
            return {
                name: d.text,
                type: uiType.Selector,
                selector: {
                    options:
                        d.fields.filter(f => {
                            // return getFieldValue(api, state, d.name, f.name) <= api.NullableUtils.getWithDefault(
                            return getFieldValue(api, state, d.name, f.name) < api.NullableUtils.getWithDefault(
                                f.maxValue,
                                +Infinity
                            )
                        }).map(f => {
                            return { value: f.name, label: _buildFieldText(api, state, d.name, f) }
                        }),
                    // getDefaultValueFunc: (api, state) => String(getState(api, state).selectTargetPrior),
                    getDefaultValueFunc: (api, state) => "",
                },
                handlerFunc: (api, _, value) => {
                    let state = api.readState()

                    let fieldName = value

                    let field = api.NullableUtils.getExn(d.fields.find(f => f.name == fieldName))

                    let coin = _computeCoin(api, state, field.baseCoin, field.coinFactor, getFieldValue(api, state, d.name, field.name))
                    let currentCoin = api.getTotalCoin(state)


                    if (currentCoin < coin) {
                        api.sceneUI.alert(api.getLanguageDataByData(state, getTextData(), languageKey.CoinNotEnough))
                    }
                    else {
                        state = api.setTotalCoin(state, currentCoin - coin)

                        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                            api.SoundManager.buildNeedToPlaySoundData(getBuyResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
                        ))

                        state = setFieldValue(api, state, d.name, field.name, getFieldValue(api, state, d.name, field.name) + 1)

                    }

                    return api.updateUIAndSound(state).then(state => {
                        return api.sceneUI.hideModal(state, _buildHandlerCloseFunc(api))
                    }).then(state => {
                        return api.sceneUI.showModal(state, getModalUIData(api, state, weaponData))
                    }).then(api.writeState)
                }
            }
        })
    )
}

export let getModalUIData = (api: api, state: state,
    weaponData
): uiData => {
    return [
        {
            type: uiType.Modal,
            name: api.getLanguageDataByData(state, getTextData(), languageKey.Upgrade),

            modal: {
                children: getModalChildrenUIData(api, state, weaponData),
                handlerCloseFunc: _buildHandlerCloseFunc(api)
            },
        },
    ]
}
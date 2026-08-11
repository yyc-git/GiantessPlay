import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { modalUIData, uiData, uiType } from "frontend/src/ui_layer/index/scene/city/page_for_uiapi/components/Type"
import { camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBuyResourceId } from "./Data"

export enum unit {
    ShellTurret,
    MissileTurret,
}

// export enum coin {
//     ShellTurret = 30,
//     MissileTurret = 50,
// }

export let _getCoin = (api: api, state, unit_) => {
    let data = {
        [unit.ShellTurret]: 30,
        [unit.MissileTurret]: 50,
    }

    return api.computeCoinByItemPriceFactor(data[unit_], state)
}


export enum languageKey {
    Close,
    DestroyRate,
    PressC,
    Buy,
    ModalTitle,
    Turret,
    ShellTurret,
    MissileTurret,
    Coin,
    CoinNotEnough,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Close]: "关闭",
            [languageKey.DestroyRate]: "破坏率",
            [languageKey.PressC]: "按C",
            [languageKey.Buy]: "购买",
            [languageKey.ModalTitle]: "货物清单",
            [languageKey.Turret]: "防御塔",
            [languageKey.ShellTurret]: "炮塔",
            [languageKey.MissileTurret]: "导弹塔",
            [languageKey.Coin]: "金币",
            [languageKey.CoinNotEnough]: "金币不足",
        },
        [language.English]: {
            [languageKey.Close]: "Close",
            [languageKey.DestroyRate]: "Destroy Rate",
            [languageKey.PressC]: "Press C",
            [languageKey.Buy]: "Buy",
            [languageKey.ModalTitle]: "Trade List",
            [languageKey.Turret]: "Turret",
            [languageKey.ShellTurret]: "ShellTurret",
            [languageKey.MissileTurret]: "MissileTurret",
            [languageKey.Coin]: "Coin",
            [languageKey.CoinNotEnough]: "Coin Not Enough",
        },
    }
}

export let getPageUIData = (api: api, state: state): uiData => {
    return [
        // TODO restore
        // {
        //     type: uiType.Text,
        //     text: {
        //         // top: 0.2,
        //         // left: 15.5,

        //         top: 15,
        //         left: 0,

        //         getTextFunc: (api, state) => `${api.getLanguageDataByData(state, getTextData(), languageKey.DestroyRate)}:${api.getDestroyRate(state)}%`,
        //     },
        // },
        {
            type: uiType.Button,
            name: api.getLanguageDataByData(state, getTextData(), languageKey.Buy),

            button: {
                top: 17,
                left: 0,

                getTextFunc: (api, state) => api.Device.isMobileByState(api.getAbstractState(state)) ? `${api.getLanguageDataByData(state, getTextData(), languageKey.Buy)}` : `${api.getLanguageDataByData(state, getTextData(), languageKey.PressC)} ${api.getLanguageDataByData(state, getTextData(), languageKey.Buy)}`,
            },

            handlerFunc: (api, dispatchFunc, value) => {
                let state = api.readState()

                return api.sceneUI.showModal(state, getModalUIData(api, state)).then(api.writeState)
            }
        },
    ]
}

let _buy = (api: api, func, value) => {
    let state = api.readState()

    let unit_ = Number(value)

    let coin = _getCoin(api, state, unit_)
    let currentCoin = api.getTotalCoin(state)


    if (currentCoin < coin) {
        api.sceneUI.alert(api.getLanguageDataByData(state, getTextData(), languageKey.CoinNotEnough))

        return Promise.resolve()
    }
    else {
        state = api.setTotalCoin(state, currentCoin - coin)

        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(getBuyResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
        ))

        return func(state, unit_).then(state => api.sceneUI.hideModal(state, _buildHandlerCloseFunc(api))).then(api.writeState)
    }
}

let _buildHandlerCloseFunc = (api) => {
    return () => {
        return Promise.resolve()
    }
}


export let getModalChildrenUIData = (api: api, state: state): modalUIData => {
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
            type: uiType.Selector,
            name: api.getLanguageDataByData(state, getTextData(), languageKey.Turret),

            selector: {
                options: [
                    {
                        value: String(unit.ShellTurret),
                        label: `${api.getLanguageDataByData(state, getTextData(), languageKey.ShellTurret)}(${_getCoin(api, state, unit.ShellTurret)}${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)})`,
                        //  description: `${_getCoin(unit.ShellTurret)}${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)}`

                    },
                    {
                        value: String(unit.MissileTurret),
                        //  label: api.getLanguageDataByData(state, getTextData(), languageKey.MissileTurret),
                        // description: `${_getCoin(unit.MissileTurret)}${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)}`
                        label: `${api.getLanguageDataByData(state, getTextData(), languageKey.MissileTurret)}(${_getCoin(api, state, unit.MissileTurret)}${api.getLanguageDataByData(state, getTextData(), languageKey.Coin)})`,
                    },
                ],
                // getDefaultValueFunc: (api, state) => String(unit.ShellTurret),
                getDefaultValueFunc: (api, state) => "",
            },

            handlerFunc: (api, dispatchFunc, value) => {
                return _buy(api, (state, unit_) => {
                    let func
                    switch (unit_) {
                        case unit.ShellTurret:
                            func = api.generateShellTurrets
                            break
                        case unit.MissileTurret:
                            func = api.generateMissileTurrets
                            break
                        default:
                            throw new Error("err")
                    }

                    return api.generateArmyInSpecificPosition(
                        state, [
                        {
                            generateFunc: api.generateMilltaryBuildingsDirectly,
                            funcs: [
                                func
                            ],
                            count: 1,
                            offset: 0,
                            camp_: camp.Player,
                        }
                    ], api.getPlayerPosition(state)
                    )
                }, value)
            }
        },
    ]
}

export let getModalUIData = (api: api, state: state): uiData => {
    return [
        {
            type: uiType.Modal,
            name: api.getLanguageDataByData(state, getTextData(), languageKey.ModalTitle),

            modal: {
                children: getModalChildrenUIData(api, state),
                handlerCloseFunc: _buildHandlerCloseFunc(api)
            },
        },
    ]
}
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName, getProtocolName, getState, setState } from "../script/Utils"
import { uiData, uiType } from "frontend/src/ui_layer/index/page_for_uiapi/components/Type"
import { actionPrior, personalityPrior, targetPrior } from "../script/State"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { personality } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum languageKey {
    Name,

    SpecificPersonality,
    // Random,
    Strategic,
    Aggressive,
    Defensive,
    Playful,

    SpecificTarget,
    Default,
    Player,
    Building,
    Soldier,
    MilltaryVehicle,
    MilltaryBuilding,
    EliteGiantess,

    SpecificAction,
    Rest,
    Stomp,
    JumpStomp,
    LeftStomp,
    StompRub,
    SprayMilk,


    // Pickup,
    Pinch,
    Eat,

    BreastPress,
    BreastPressRub,
    CrawlLick,
    CrawlBeat,

    StandToCrawl,
    CrawlToStand,

    StandToSit,
    SitToStand,
    SitRub,
    TightenLeg,

    PickToUB,
    UBToPick,
    Thrust,
    Insert,

    Bigger,

    PutToBreast,
    PutToShoe,

    FreePick,
    FreeBreast,
    FreeShoe,
    FreeUB,

    Submit,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Name]: "巨大娘：",

            [languageKey.SpecificPersonality]: "指定性格",
            [languageKey.Strategic]: "策略",
            [languageKey.Aggressive]: "攻击",
            [languageKey.Defensive]: "防御",
            [languageKey.Playful]: "玩耍",

            [languageKey.SpecificTarget]: "指定目标",
            [languageKey.Default]: "默认",
            [languageKey.Player]: "玩家",
            [languageKey.Building]: "建筑",
            [languageKey.Soldier]: "士兵",
            [languageKey.MilltaryVehicle]: "军车",
            [languageKey.MilltaryBuilding]: "军事建筑",
            [languageKey.EliteGiantess]: "精英巨大娘",

            [languageKey.SpecificAction]: "指定动作",
            [languageKey.Rest]: "休息",
            [languageKey.Stomp]: "踩踏",
            [languageKey.LeftStomp]: "左脚踩踏",
            [languageKey.JumpStomp]: "跳踩",
            [languageKey.StompRub]: "脚碾",
            [languageKey.SprayMilk]: "喷奶",
            // [languageKey.Pickup]: "抓",
            [languageKey.Pinch]: "捏",
            [languageKey.Eat]: "吃",
            [languageKey.BreastPress]: "胸压",
            [languageKey.BreastPressRub]: "胸碾",
            [languageKey.CrawlLick]: "趴舔",
            [languageKey.CrawlBeat]: "趴拍",

            [languageKey.StandToCrawl]: "趴下",
            [languageKey.CrawlToStand]: "起身",

            [languageKey.StandToSit]: "坐",
            [languageKey.SitToStand]: "起身",
            [languageKey.SitRub]: "臀碾",
            [languageKey.TightenLeg]: "夹腿",

            [languageKey.PickToUB]: "准备UB",
            [languageKey.UBToPick]: "结束UB",
            [languageKey.Thrust]: "抽插",
            [languageKey.Insert]: "插入",

            [languageKey.Bigger]: "变大",

            [languageKey.PutToBreast]: "放入胸部",
            [languageKey.PutToShoe]: "放入鞋",

            [languageKey.FreePick]: "释放抓单位",
            [languageKey.FreeBreast]: "释放胸部单位",
            [languageKey.FreeShoe]: "释放鞋单位",
            [languageKey.FreeUB]: "释放UB",

            [languageKey.Submit]: "提交",
        },
        [language.English]: {
            [languageKey.Name]: "Giantess: ",

            [languageKey.SpecificPersonality]: "Specific Personality",
            [languageKey.Strategic]: "Strategic",
            [languageKey.Aggressive]: "Aggressive",
            [languageKey.Defensive]: "Defensive",
            [languageKey.Playful]: "Playful",

            [languageKey.SpecificTarget]: "Specific Target",
            [languageKey.Default]: "Default",
            [languageKey.Player]: "Player",
            [languageKey.Building]: "Building",
            [languageKey.Soldier]: "Soldier",
            [languageKey.MilltaryVehicle]: "MilltaryVehicle",
            [languageKey.MilltaryBuilding]: "MilltaryBuilding",
            [languageKey.EliteGiantess]: "EliteGiantess",

            [languageKey.SpecificAction]: "SpecificAction",
            [languageKey.Rest]: "Rest",
            [languageKey.Stomp]: "Stomp",
            [languageKey.LeftStomp]: "LeftStomp",
            [languageKey.JumpStomp]: "JumpStomp",
            [languageKey.StompRub]: "StompRub",
            [languageKey.SprayMilk]: "SprayMilk",
            // [languageKey.Pickup]: "Pickup",
            [languageKey.Pinch]: "Pinch",
            [languageKey.Eat]: "Eat",
            [languageKey.BreastPress]: "BreastPress",
            [languageKey.BreastPressRub]: "BreastPressRub",
            [languageKey.CrawlLick]: "CrawlLick",
            [languageKey.CrawlBeat]: "CrawlBeat",

            [languageKey.StandToCrawl]: "StandToCrawl",
            [languageKey.CrawlToStand]: "CrawlToStand",

            [languageKey.StandToSit]: "StandToSit",
            [languageKey.SitToStand]: "SitToStand",
            [languageKey.SitRub]: "SitRub",
            [languageKey.TightenLeg]: "TightenLeg",

            [languageKey.PickToUB]: "PickToUB",
            [languageKey.UBToPick]: "UBToPick",
            [languageKey.Thrust]: "Thrust",
            [languageKey.Insert]: "Insert",

            [languageKey.Bigger]: "Bigger",

            [languageKey.PutToBreast]: "PutToBreast",
            [languageKey.PutToShoe]: "PutToShoe",

            [languageKey.FreePick]: "FreePick",
            [languageKey.FreeBreast]: "FreeBreast",
            [languageKey.FreeShoe]: "FreeShoe",
            [languageKey.FreeUB]: "FreeUB",

            [languageKey.Submit]: "Submit",

        },
    }
}

let _convertPersonalityToPrior = (personality_) => {
    return personality_
}

export let getUIData = (api: api, state: state): uiData => {
    return (
        [
            {
                name: api.getLanguageDataByData(state, getTextData(), languageKey.Name),
                type: uiType.Text,
                text: {
                    getTextFunc: (api: api, state) => {
                        let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))


                        return api.NullableUtils.getExn(api.getNeedUpdateStatusName(state, usedGirl))
                    }
                },
            },
            {
                name: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificPersonality),
                type: uiType.Selector,
                selector: {
                    options: [
                        // { value: String(personalityPrior.Random), label: api.getLanguageDataByData(state, getTextData(), languageKey.Random) },
                        { value: String(personalityPrior.Strategic), label: api.getLanguageDataByData(state, getTextData(), languageKey.Strategic) },
                        { value: String(personalityPrior.Aggressive), label: api.getLanguageDataByData(state, getTextData(), languageKey.Aggressive) },
                        { value: String(personalityPrior.Defensive), label: api.getLanguageDataByData(state, getTextData(), languageKey.Defensive) },
                        { value: String(personalityPrior.Playful), label: api.getLanguageDataByData(state, getTextData(), languageKey.Playful) },
                    ],
                    // getDefaultValueFunc: (api, state) => String(getState(api, state).selectPersonalityPrior),
                    getDefaultValueFunc: (api, state) => String(_convertPersonalityToPrior(api.getPersonality(state, api.getNearestUsedGirl(state, api.getPlayerPosition(state))))),
                },
                handlerFunc: (api, _, value) => {
                    let state = api.readState()

                    // value = Number(value)

                    // if (getState(api, state).selectPersonalityPrior == value) {
                    //     return Promise.resolve()
                    // }

                    state = setState(api, state, {
                        ...getState(api, state),
                        selectPersonalityPrior: value
                    })



                    // let result
                    // switch (value) {
                    //     case personalityPrior.Random:
                    //         result = api.NumberUtils.randomSelect(
                    //             api.getAllPersonalities()
                    //         )
                    //         break
                    //     default:
                    //         result = value
                    //         break
                    // }
                    let result = value

                    let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

                    state = api.setPersonality(state, usedGirl,
                        result
                    )

                    api.writeState(state)

                    return Promise.resolve()
                }
            }
        ]
    )
        .concat(
            // api.getSceneChapter(state) == scene.Play
            //     &&
            //     (api.isEnemyGiantess(state, usedGirl)
            //         || (
            //             api.hasPickData(state, usedGirl)
            //             || api.isTriggerGirlAction(state, usedGirl,actionName.Pickup
            //             )
            //         )
            //     ) ? []
            //     :
            [{
                name: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificTarget),
                type: uiType.Selector,
                // key: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificTarget),
                selector: {
                    options: [
                        { value: String(targetPrior.None), label: api.getLanguageDataByData(state, getTextData(), languageKey.Default) },
                        { value: String(targetPrior.LittleMan), label: api.getLanguageDataByData(state, getTextData(), languageKey.Player) },
                        { value: String(targetPrior.Building), label: api.getLanguageDataByData(state, getTextData(), languageKey.Building) },
                        { value: String(targetPrior.Soldier), label: api.getLanguageDataByData(state, getTextData(), languageKey.Soldier) },
                        { value: String(targetPrior.MilltaryVehicle), label: api.getLanguageDataByData(state, getTextData(), languageKey.MilltaryVehicle) },
                        { value: String(targetPrior.MilltaryBuilding), label: api.getLanguageDataByData(state, getTextData(), languageKey.MilltaryBuilding) },
                        { value: String(targetPrior.EliteGiantess), label: api.getLanguageDataByData(state, getTextData(), languageKey.EliteGiantess) },
                    ],
                    getDefaultValueFunc: (api, state) => String(
                        api.MutableRecordUtils.getWithDefault(getState(api, state).selectTargetPriors, api.getNearestUsedGirl(state, api.getPlayerPosition(state)), targetPrior.None)
                    ),
                },
                handlerFunc: (api, _, value) => {
                    let state = api.readState()

                    let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

                    if (
                        api.getSceneChapter(state) == scene.Play
                        &&
                        (api.isEnemyGiantess(state, usedGirl)
                            || (
                                api.hasPickData(state, usedGirl)
                                || api.isTriggerGirlAction(state, usedGirl, actionName.Pickup
                                )
                            )
                        )
                    ) {
                        return Promise.resolve()
                    }


                    value = Number(value)

                    // if ( getState(api, state).selectTargetPrior == value) {
                    if (api.MutableRecordUtils.getWithDefault(getState(api, state).selectTargetPriors, usedGirl, targetPrior.None) == value) {
                        return Promise.resolve()
                    }

                    // state = setState(api, state, {
                    //     ...getState(api, state),
                    //     selectTargetPrior: value
                    // })
                    state = setState(api, state, {
                        ...getState(api, state),
                        selectTargetPriors: api.MutableRecordUtils.set(getState(api, state).selectTargetPriors, usedGirl, value)
                    })

                    state = api.clearTarget(state, usedGirl)

                    api.writeState(state)

                    return Promise.resolve()
                }
            }])
        .concat(
            [
                {
                    name: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificAction),
                    type: uiType.Selector,
                    // key: api.getLanguageDataByData(state, getTextData(), languageKey.SpecificAction),
                    selector: {
                        options: [
                            { value: String(actionPrior.None), label: api.getLanguageDataByData(state, getTextData(), languageKey.Default) },
                            { value: String(actionPrior.Rest), label: api.getLanguageDataByData(state, getTextData(), languageKey.Rest) },
                            { value: String(actionPrior.Stomp), label: api.getLanguageDataByData(state, getTextData(), languageKey.Stomp) },
                            { value: String(actionPrior.LeftStomp), label: api.getLanguageDataByData(state, getTextData(), languageKey.LeftStomp) },
                            { value: String(actionPrior.JumpStomp), label: api.getLanguageDataByData(state, getTextData(), languageKey.JumpStomp) },
                            { value: String(actionPrior.StompRub), label: api.getLanguageDataByData(state, getTextData(), languageKey.StompRub) },
                            { value: String(actionPrior.SprayMilk), label: api.getLanguageDataByData(state, getTextData(), languageKey.SprayMilk) },
                            // { value: String(actionPrior.Pickup), label: api.getLanguageDataByData(state, getTextData(), languageKey.Pickup) },
                            { value: String(actionPrior.Pinch), label: api.getLanguageDataByData(state, getTextData(), languageKey.Pinch) },
                            { value: String(actionPrior.Eat), label: api.getLanguageDataByData(state, getTextData(), languageKey.Eat) },
                            { value: String(actionPrior.BreastPress), label: api.getLanguageDataByData(state, getTextData(), languageKey.BreastPress) },
                            { value: String(actionPrior.BreastPressRub), label: api.getLanguageDataByData(state, getTextData(), languageKey.BreastPressRub) },
                            { value: String(actionPrior.CrawlLick), label: api.getLanguageDataByData(state, getTextData(), languageKey.CrawlLick) },
                            { value: String(actionPrior.CrawlBeat), label: api.getLanguageDataByData(state, getTextData(), languageKey.CrawlBeat) },

                            { value: String(actionPrior.StandToCrawl), label: api.getLanguageDataByData(state, getTextData(), languageKey.StandToCrawl) },
                            { value: String(actionPrior.CrawlToStand), label: api.getLanguageDataByData(state, getTextData(), languageKey.CrawlToStand) },

                            { value: String(actionPrior.StandToSit), label: api.getLanguageDataByData(state, getTextData(), languageKey.StandToSit) },
                            { value: String(actionPrior.SitToStand), label: api.getLanguageDataByData(state, getTextData(), languageKey.SitToStand) },
                            { value: String(actionPrior.SitRub), label: api.getLanguageDataByData(state, getTextData(), languageKey.SitRub) },
                            { value: String(actionPrior.TightenLeg), label: api.getLanguageDataByData(state, getTextData(), languageKey.TightenLeg) },

                            { value: String(actionPrior.PickToUB), label: api.getLanguageDataByData(state, getTextData(), languageKey.PickToUB) },
                            { value: String(actionPrior.UBToPick), label: api.getLanguageDataByData(state, getTextData(), languageKey.UBToPick) },
                            { value: String(actionPrior.Thrust), label: api.getLanguageDataByData(state, getTextData(), languageKey.Thrust) },
                            { value: String(actionPrior.Insert), label: api.getLanguageDataByData(state, getTextData(), languageKey.Insert) },

                            { value: String(actionPrior.Bigger), label: api.getLanguageDataByData(state, getTextData(), languageKey.Bigger) },

                            { value: String(actionPrior.PutToBreast), label: api.getLanguageDataByData(state, getTextData(), languageKey.PutToBreast) },
                            { value: String(actionPrior.PutToShoe), label: api.getLanguageDataByData(state, getTextData(), languageKey.PutToShoe) },

                            { value: String(actionPrior.FreePick), label: api.getLanguageDataByData(state, getTextData(), languageKey.FreePick) },
                            { value: String(actionPrior.FreeBreast), label: api.getLanguageDataByData(state, getTextData(), languageKey.FreeBreast) },
                            { value: String(actionPrior.FreeShoe), label: api.getLanguageDataByData(state, getTextData(), languageKey.FreeShoe) },
                            { value: String(actionPrior.FreeUB), label: api.getLanguageDataByData(state, getTextData(), languageKey.FreeUB) },
                        ],
                        getDefaultValueFunc: (api, state) => String(
                            api.MutableRecordUtils.getWithDefault(getState(api, state).selectActionPriors, api.getNearestUsedGirl(state, api.getPlayerPosition(state)), actionPrior.None)
                        ),
                    },
                    handlerFunc: (api, _, value) => {
                        let state = api.readState()

                        value = Number(value)

                        let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

                        state = setState(api, state, {
                            ...getState(api, state),
                            selectActionPriors: api.MutableRecordUtils.set(getState(api, state).selectActionPriors, usedGirl, value)
                        })

                        api.writeState(state)

                        return Promise.resolve()
                    }
                },
                {
                    name: api.getLanguageDataByData(state, getTextData(), languageKey.Submit),
                    type: uiType.Button,
                    // key: api.getLanguageDataByData(state, getTextData(), languageKey.Submit),
                    // handlerFunc: (api, [dispatchFunc, setStoreFunc], value) => {
                    handlerFunc: (api, dispatchFunc, value) => {
                        // state = api.subPropCount(state, getName(), 1)

                        // api.ui.hide(dispatchFunc([]))
                        // dispatchFunc(setStoreFunc([]))
                        // dispatchFunc([])
                        state = api.ui.hide(dispatchFunc, api.readState(), [])
                        api.writeState(state)

                        return Promise.resolve()
                    }
                } as any
            ]
        )
}